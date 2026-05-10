from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone

import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '').strip()
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'sansebastianhipotecas@gmail.com')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

app = FastAPI(title="Hipotecas San Sebastián API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ContactRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=4, max_length=40)
    property_value: Optional[float] = None
    loan_amount: Optional[float] = None
    term_months: Optional[int] = None
    system: Optional[Literal["frances", "americano", "ambos"]] = None
    message: Optional[str] = Field(default="", max_length=2000)


class ContactResponse(BaseModel):
    id: str
    received: bool
    email_sent: bool


class SimulationRequest(BaseModel):
    property_value: float = Field(gt=0)
    loan_amount: float = Field(gt=0)
    annual_rate: float = Field(ge=0, le=50)  # in percent
    term_months: int = Field(ge=1, le=60)
    system: Literal["frances", "americano"]


class AmortizationRow(BaseModel):
    month: int
    payment: float
    interest: float
    principal: float
    balance: float


class SimulationResponse(BaseModel):
    monthly_payment: float
    total_interest: float
    total_paid: float
    final_balloon: float
    ltv_percent: float
    ltv_valid: bool
    schedule_preview: List[AmortizationRow]


# ---------- Helpers ----------
def _round(x: float, d: int = 2) -> float:
    return round(float(x), d)


def simulate_frances(loan: float, annual_rate: float, n: int):
    r = (annual_rate / 100.0) / 12.0
    if r == 0:
        pmt = loan / n
    else:
        pmt = loan * (r * (1 + r) ** n) / ((1 + r) ** n - 1)
    schedule = []
    balance = loan
    total_interest = 0.0
    for m in range(1, n + 1):
        interest = balance * r
        principal = pmt - interest
        balance = max(0.0, balance - principal)
        total_interest += interest
        schedule.append(AmortizationRow(
            month=m,
            payment=_round(pmt),
            interest=_round(interest),
            principal=_round(principal),
            balance=_round(balance),
        ))
    return {
        "monthly_payment": _round(pmt),
        "total_interest": _round(total_interest),
        "total_paid": _round(pmt * n),
        "final_balloon": 0.0,
        "schedule": schedule,
    }


def simulate_americano(loan: float, annual_rate: float, n: int):
    r = (annual_rate / 100.0) / 12.0
    interest_payment = loan * r
    schedule = []
    balance = loan
    total_interest = 0.0
    for m in range(1, n + 1):
        if m < n:
            payment = interest_payment
            principal = 0.0
        else:
            payment = interest_payment + loan
            principal = loan
            balance = 0.0
        total_interest += interest_payment
        schedule.append(AmortizationRow(
            month=m,
            payment=_round(payment),
            interest=_round(interest_payment),
            principal=_round(principal),
            balance=_round(balance if m < n else 0.0),
        ))
    return {
        "monthly_payment": _round(interest_payment),
        "total_interest": _round(total_interest),
        "total_paid": _round(total_interest + loan),
        "final_balloon": _round(loan),
        "schedule": schedule,
    }


def _build_admin_email_html(c: ContactRequest, cid: str) -> str:
    sys_map = {"frances": "Sistema Francés", "americano": "Sistema Americano", "ambos": "Ambos sistemas"}
    rows = [
        ("Nombre", c.name),
        ("Email", c.email),
        ("Teléfono", c.phone),
        ("Valor de la propiedad (USD)", f"{c.property_value:,.0f}" if c.property_value else "—"),
        ("Monto solicitado (USD)", f"{c.loan_amount:,.0f}" if c.loan_amount else "—"),
        ("Plazo (meses)", str(c.term_months) if c.term_months else "—"),
        ("Sistema preferido", sys_map.get(c.system, "—")),
        ("Mensaje", c.message or "—"),
        ("ID de consulta", cid),
    ]
    body = "".join(
        f'<tr><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#666;font-family:Arial,sans-serif;font-size:13px;width:220px;">{k}</td>'
        f'<td style="padding:10px 14px;border-bottom:1px solid #eee;color:#111;font-family:Arial,sans-serif;font-size:14px;">{v}</td></tr>'
        for k, v in rows
    )
    return f"""
    <div style="background:#f5f5f0;padding:32px;font-family:Arial,sans-serif;">
      <table style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;">
        <tr><td style="background:#080A0F;padding:24px 28px;">
          <div style="color:#CBA153;font-family:Georgia,serif;font-size:22px;letter-spacing:1px;">Hipotecas San Sebastián</div>
          <div style="color:#9CA3AF;font-size:12px;margin-top:4px;">Nueva consulta recibida desde el sitio web</div>
        </td></tr>
        <tr><td style="padding:8px 0;"><table style="width:100%;border-collapse:collapse;">{body}</table></td></tr>
        <tr><td style="background:#fafafa;padding:16px 28px;color:#666;font-size:12px;font-family:Arial,sans-serif;">
          Recibido: {datetime.now(timezone.utc).strftime('%d/%m/%Y %H:%M UTC')}
        </td></tr>
      </table>
    </div>
    """


def _build_user_email_html(c: ContactRequest) -> str:
    return f"""
    <div style="background:#080A0F;padding:40px 20px;font-family:Arial,sans-serif;color:#F3F2ED;">
      <table style="max-width:560px;margin:0 auto;background:#121620;border:1px solid #1f2a3a;">
        <tr><td style="padding:32px 32px 8px 32px;">
          <div style="color:#CBA153;font-family:Georgia,serif;font-size:24px;letter-spacing:1px;">Hipotecas San Sebastián</div>
          <div style="color:#9CA3AF;font-size:12px;margin-top:6px;">35 años · +1.000 hipotecas · CABA &amp; GBA · USD</div>
        </td></tr>
        <tr><td style="padding:16px 32px 8px 32px;color:#F3F2ED;font-size:15px;line-height:1.6;">
          Hola {c.name},<br><br>
          Recibimos tu consulta. Un asesor se va a comunicar con vos en las próximas 24 horas hábiles para conversar sobre tu hipoteca.
        </td></tr>
        <tr><td style="padding:16px 32px 8px 32px;color:#9CA3AF;font-size:13px;line-height:1.6;">
          Mientras tanto, recordá nuestras condiciones:<br>
          · Operamos solo en <b style="color:#F3F2ED;">dólares estadounidenses</b>.<br>
          · Financiamos hasta el <b style="color:#F3F2ED;">35% del valor</b> de la propiedad.<br>
          · Plazos de hasta <b style="color:#F3F2ED;">60 cuotas</b>.<br>
          · Zona: Capital Federal y Gran Buenos Aires.
        </td></tr>
        <tr><td style="padding:24px 32px 32px 32px;border-top:1px solid #1f2a3a;color:#9CA3AF;font-size:12px;">
          Hipotecas San Sebastián · sansebastianhipotecas@gmail.com
        </td></tr>
      </table>
    </div>
    """


async def _send_resend(to_email: str, subject: str, html: str) -> bool:
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured — skipping email send to %s", to_email)
        return False
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html,
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info("Email sent to %s id=%s", to_email, result.get("id") if isinstance(result, dict) else "?")
        return True
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to_email, str(e))
        return False


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "Hipotecas San Sebastián", "status": "ok"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "email_configured": bool(RESEND_API_KEY),
        "recipient": RECIPIENT_EMAIL,
    }


@api_router.post("/simulate", response_model=SimulationResponse)
async def simulate(req: SimulationRequest):
    if req.loan_amount > req.property_value * 0.35 + 0.01:
        ltv_valid = False
    else:
        ltv_valid = True

    if req.system == "frances":
        result = simulate_frances(req.loan_amount, req.annual_rate, req.term_months)
    else:
        result = simulate_americano(req.loan_amount, req.annual_rate, req.term_months)

    return SimulationResponse(
        monthly_payment=result["monthly_payment"],
        total_interest=result["total_interest"],
        total_paid=result["total_paid"],
        final_balloon=result["final_balloon"],
        ltv_percent=_round((req.loan_amount / req.property_value) * 100, 2),
        ltv_valid=ltv_valid,
        schedule_preview=result["schedule"][:12],
    )


@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(payload: ContactRequest):
    cid = str(uuid.uuid4())
    doc = payload.model_dump()
    doc["id"] = cid
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["email_sent"] = False
    try:
        await db.contact_requests.insert_one(doc)
    except Exception as e:
        logger.error("Mongo insert failed: %s", str(e))
        raise HTTPException(status_code=500, detail="No se pudo registrar la consulta")

    admin_html = _build_admin_email_html(payload, cid)
    user_html = _build_user_email_html(payload)

    admin_ok = await _send_resend(RECIPIENT_EMAIL, f"Nueva consulta — {payload.name}", admin_html)
    user_ok = await _send_resend(payload.email, "Recibimos tu consulta — Hipotecas San Sebastián", user_html)

    if admin_ok or user_ok:
        await db.contact_requests.update_one({"id": cid}, {"$set": {"email_sent": True}})

    return ContactResponse(id=cid, received=True, email_sent=admin_ok or user_ok)


@api_router.get("/contact", response_model=List[ContactRequest])
async def list_contacts():
    docs = await db.contact_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [ContactRequest(**{k: v for k, v in d.items() if k in ContactRequest.model_fields}) for d in docs]


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
