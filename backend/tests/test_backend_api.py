"""Backend API tests for Hipotecas San Sebastián.
Covers: /api/health, /api/simulate (frances/americano + validations), /api/contact (POST/GET)."""
import os
import math
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://amazing-swanson-6.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_health_ok(self, client):
        r = client.get(f"{API}/health", timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "ok"
        assert isinstance(data["email_configured"], bool)
        # RESEND_API_KEY empty by default => email_configured must be False
        assert data["email_configured"] is False
        assert data["recipient"] == "sansebastianhipotecas@gmail.com"


# ---------- Simulate ----------
class TestSimulate:
    def test_frances_basic(self, client):
        payload = {"property_value": 200000, "loan_amount": 60000, "annual_rate": 10,
                   "term_months": 36, "system": "frances"}
        r = client.post(f"{API}/simulate", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        # PMT = 60000 * (r(1+r)^n)/((1+r)^n - 1) where r=10/100/12
        r_m = 0.10 / 12
        n = 36
        expected_pmt = 60000 * (r_m * (1 + r_m) ** n) / ((1 + r_m) ** n - 1)
        assert math.isclose(d["monthly_payment"], round(expected_pmt, 2), abs_tol=0.1)
        assert d["final_balloon"] == 0.0
        assert d["ltv_percent"] == 30.0
        assert d["ltv_valid"] is True
        # total_paid ≈ pmt * n
        assert math.isclose(d["total_paid"], round(expected_pmt * n, 2), abs_tol=0.5)
        # total_interest ≈ total_paid - loan
        assert math.isclose(d["total_interest"], d["total_paid"] - 60000, abs_tol=0.5)
        # schedule_preview max 12 rows, balance decreasing
        assert len(d["schedule_preview"]) == 12
        balances = [row["balance"] for row in d["schedule_preview"]]
        for i in range(1, len(balances)):
            assert balances[i] < balances[i - 1]

    def test_frances_final_balance_zero(self, client):
        # short term to verify last row in preview reaches ~0
        payload = {"property_value": 100000, "loan_amount": 30000, "annual_rate": 12,
                   "term_months": 6, "system": "frances"}
        r = client.post(f"{API}/simulate", json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert len(d["schedule_preview"]) == 6
        assert abs(d["schedule_preview"][-1]["balance"]) < 1.0  # approaches 0

    def test_americano_interest_only(self, client):
        payload = {"property_value": 200000, "loan_amount": 60000, "annual_rate": 12,
                   "term_months": 24, "system": "americano"}
        r = client.post(f"{API}/simulate", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        expected_monthly = round(60000 * (12 / 100) / 12, 2)  # 600.0
        assert d["monthly_payment"] == expected_monthly
        assert d["final_balloon"] == 60000.0
        # total_interest = monthly * n
        assert math.isclose(d["total_interest"], expected_monthly * 24, abs_tol=0.5)
        # total_paid = total_interest + loan
        assert math.isclose(d["total_paid"], d["total_interest"] + 60000, abs_tol=0.5)
        # last preview row payment includes balloon
        last = d["schedule_preview"][-1]
        # preview only shows first 12 of 24, so last shown is month 12, not the balloon month
        assert len(d["schedule_preview"]) == 12

    def test_americano_balloon_in_preview_when_short_term(self, client):
        payload = {"property_value": 100000, "loan_amount": 30000, "annual_rate": 8,
                   "term_months": 6, "system": "americano"}
        r = client.post(f"{API}/simulate", json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        last_row = d["schedule_preview"][-1]
        # month 6 should include balloon
        assert last_row["month"] == 6
        assert last_row["principal"] == 30000.0
        assert last_row["balance"] == 0.0

    def test_ltv_invalid_but_returns_numbers(self, client):
        payload = {"property_value": 100000, "loan_amount": 50000, "annual_rate": 10,
                   "term_months": 24, "system": "frances"}
        r = client.post(f"{API}/simulate", json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["ltv_valid"] is False
        assert d["ltv_percent"] == 50.0
        assert d["monthly_payment"] > 0

    def test_zero_rate_frances(self, client):
        payload = {"property_value": 100000, "loan_amount": 30000, "annual_rate": 0,
                   "term_months": 30, "system": "frances"}
        r = client.post(f"{API}/simulate", json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["monthly_payment"] == 1000.0  # 30000/30
        assert d["total_interest"] == 0.0
        assert d["final_balloon"] == 0.0

    def test_zero_rate_americano(self, client):
        payload = {"property_value": 100000, "loan_amount": 30000, "annual_rate": 0,
                   "term_months": 12, "system": "americano"}
        r = client.post(f"{API}/simulate", json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["monthly_payment"] == 0.0
        assert d["final_balloon"] == 30000.0
        assert d["total_interest"] == 0.0
        assert d["total_paid"] == 30000.0

    def test_term_too_long_returns_422(self, client):
        payload = {"property_value": 200000, "loan_amount": 60000, "annual_rate": 10,
                   "term_months": 61, "system": "frances"}
        r = client.post(f"{API}/simulate", json=payload, timeout=15)
        assert r.status_code == 422

    def test_negative_loan_amount_returns_422(self, client):
        payload = {"property_value": 200000, "loan_amount": -1000, "annual_rate": 10,
                   "term_months": 24, "system": "frances"}
        r = client.post(f"{API}/simulate", json=payload, timeout=15)
        assert r.status_code == 422


# ---------- Contact ----------
class TestContact:
    def test_contact_full_payload(self, client):
        payload = {
            "name": "TEST_Juan Pérez",
            "email": "TEST_juan@example.com",
            "phone": "+5491134567890",
            "property_value": 250000,
            "loan_amount": 80000,
            "term_months": 48,
            "system": "frances",
            "message": "TEST_Quisiera más información sobre tasas."
        }
        r = client.post(f"{API}/contact", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["received"] is True
        assert isinstance(d["id"], str) and len(d["id"]) > 10
        # RESEND_API_KEY empty by default => email_sent should be False
        assert d["email_sent"] is False

    def test_contact_minimum_required(self, client):
        payload = {
            "name": "TEST_Min Required",
            "email": "TEST_min@example.com",
            "phone": "+5491100000000"
        }
        r = client.post(f"{API}/contact", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["received"] is True
        assert "id" in d

    def test_contact_invalid_email_returns_422(self, client):
        payload = {
            "name": "TEST_Bad Email",
            "email": "not-an-email",
            "phone": "+5491100000000"
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_contact_persists_and_list_excludes_id(self, client):
        # Create a uniquely identifiable contact
        unique_name = f"TEST_Persist_{os.urandom(4).hex()}"
        payload = {
            "name": unique_name,
            "email": "TEST_persist@example.com",
            "phone": "+5491155555555",
            "property_value": 300000,
            "loan_amount": 90000,
            "term_months": 36,
            "system": "americano",
            "message": "TEST_persistence check"
        }
        cr = client.post(f"{API}/contact", json=payload, timeout=20)
        assert cr.status_code == 200, cr.text

        lr = client.get(f"{API}/contact", timeout=20)
        assert lr.status_code == 200, lr.text
        items = lr.json()
        assert isinstance(items, list)
        # No _id field
        for it in items:
            assert "_id" not in it
        # Find our record by unique name
        found = [it for it in items if it.get("name") == unique_name]
        assert len(found) >= 1
        rec = found[0]
        assert rec["email"] == "TEST_persist@example.com"
        assert rec["system"] == "americano"
        assert rec["loan_amount"] == 90000
