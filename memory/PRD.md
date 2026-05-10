# Hipotecas San Sebastián — PRD

## Problem statement (original, Spanish)
> "Quiero una página web sobre créditos hipotecarios privados en Argentina (solo Capital Federal y Gran Buenos Aires), solo en dólares estadounidenses y financiamos hasta el 35% del precio final de la propiedad, ofrecemos sistema francés y americano que me gustaría q lo expliques también de forma simple. Trabajos hace 35 años y hicimos más de 1000 hipotecas, damos hasta 60 cuotas."

## Brand & decisions
- Brand: **Hipotecas San Sebastián**
- Style: Elegante y serio — dark luxury theme (Archetype 5: Jewel & Luxury)
- Typography: Playfair Display (headings) + Outfit (body)
- Palette: bg #080A0F, surface #121620, primary gold #CBA153, text #F3F2ED
- Currency: USD only · Zone: CABA + GBA · Max LTV: 35% · Max term: 60 cuotas
- Contact email: **sansebastianhipotecas@gmail.com** (delivered via Resend)
- Auth: none required (marketing site)

## Architecture
- Backend: FastAPI + MongoDB (motor) + Resend SDK (graceful fallback when key absent)
- Frontend: React + Tailwind + Shadcn UI + Framer Motion + Sonner toasts
- Routing: single page `/` (Landing) with section anchors

## Backend endpoints (all under `/api`)
- `GET /api/health` — returns email_configured + recipient
- `POST /api/simulate` — computes francés or americano, returns monthly_payment, total_interest, total_paid, final_balloon, ltv_percent, ltv_valid, schedule_preview (12 rows)
- `POST /api/contact` — persists to `contact_requests` collection and sends email via Resend (to recipient + acknowledgement to user). Returns `{id, received, email_sent}`. Graceful if RESEND_API_KEY not set
- `GET /api/contact` — list submissions

## Frontend sections
- Nav (sticky glass)
- Hero (full-screen with classic BA architecture image)
- Stats (35 años · 1.000+ · 35% · 60)
- Simulator (interactive sliders, francés/americano toggle, live results)
- Sistemas (side-by-side cards explaining francés vs americano simply)
- About (Bento grid with big serif numbers + signing image)
- HowItWorks (4-step process)
- FAQ (Shadcn accordion, 8 Q&A)
- Contact (form with name/email/phone/property_value/loan_amount/term/system/message + email link + WhatsApp link)
- Footer (massive wordmark, navigation, contact)

## Implemented (Dec 2025)
- ✅ Backend: simulate (francés + americano), contact (Mongo + Resend graceful), health, listing — 14/14 tests passed
- ✅ Frontend: all 9 sections, responsive, animated
- ✅ Email templates (admin notification + user acknowledgement) ready

## Backlog (prioritized)
### P0 — required for production
- [ ] User adds **RESEND_API_KEY** in `/app/backend/.env` (get at resend.com → API Keys) and verifies domain to send from a custom sender (e.g. no-reply@hipotecassansebastian.com.ar); restart backend
- [ ] Replace WhatsApp placeholder number `5491100000000` in `Contact.jsx` and `Footer.jsx` with real WhatsApp business line

### P1 — quick wins
- [ ] Admin dashboard route `/admin` to list contact_requests
- [ ] Real corporate domain + DNS + Resend domain verification
- [ ] Add Google Analytics or similar tracking
- [ ] Localized testimonials / "Casos reales" section with photos

### P2 — nice-to-have
- [ ] Multi-currency display (USD ↔ ARS reference)
- [ ] Downloadable PDF of the simulation
- [ ] Blog / Notas section for SEO
- [ ] reCAPTCHA on contact form
