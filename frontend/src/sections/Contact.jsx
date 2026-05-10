import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Send, Mail, MessageCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const initial = {
  name: "",
  email: "",
  phone: "",
  property_value: "",
  loan_amount: "",
  term_months: "",
  system: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Por favor completá nombre, email y teléfono.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        property_value: form.property_value ? Number(form.property_value) : null,
        loan_amount: form.loan_amount ? Number(form.loan_amount) : null,
        term_months: form.term_months ? Number(form.term_months) : null,
        system: form.system || null,
        message: form.message,
      };
      const { data } = await axios.post(`${API}/contact`, payload);
      if (data?.received) {
        toast.success("¡Recibimos tu consulta! Te contactamos dentro de las 24 hs hábiles.");
        setForm(initial);
      } else {
        toast.error("No pudimos registrar tu consulta. Probá de nuevo.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Hubo un problema al enviar. Probá de nuevo o escribinos por email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contacto"
      className="relative bg-[#080A0F] py-20 lg:py-32 border-t border-white/5"
      data-testid="contact-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="flex items-center gap-3 text-[#CBA153] mb-5">
            <span className="h-px w-12 bg-[#CBA153]" />
            <span className="text-xs uppercase tracking-[0.3em]">Solicitar crédito</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
            Conversemos sobre{" "}
            <span className="italic text-[#CBA153]">tu próximo paso</span>.
          </h2>
          <p className="mt-6 text-[#9CA3AF] leading-relaxed">
            Dejanos tus datos y te contactamos en menos de 24 horas hábiles.
            Sin compromiso, sin formularios eternos. Si preferís, también podés
            escribirnos directamente.
          </p>

          <div className="mt-10 space-y-4">
            <a
              href="mailto:sansebastianhipotecas@gmail.com"
              className="flex items-center gap-4 p-4 border border-white/10 hover:border-[#CBA153]/40 hover:bg-white/5 transition-all duration-300 group"
              data-testid="email-link"
            >
              <div className="w-10 h-10 border border-[#CBA153]/40 text-[#CBA153] flex items-center justify-center">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Email</div>
                <div className="text-[#F3F2ED] text-sm group-hover:text-[#CBA153] transition-colors">
                  sansebastianhipotecas@gmail.com
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/5491100000000?text=Hola%2C%20me%20interesa%20un%20cr%C3%A9dito%20hipotecario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 border border-white/10 hover:border-[#CBA153]/40 hover:bg-white/5 transition-all duration-300 group"
              data-testid="whatsapp-link"
            >
              <div className="w-10 h-10 border border-[#CBA153]/40 text-[#CBA153] flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">WhatsApp</div>
                <div className="text-[#F3F2ED] text-sm group-hover:text-[#CBA153] transition-colors">
                  Hablar con un asesor
                </div>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          onSubmit={submit}
          className="lg:col-span-7 bg-[#121620] border border-white/10 p-6 sm:p-8 lg:p-10 space-y-7"
          data-testid="contact-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <Field label="Nombre y apellido" required>
              <input
                type="text"
                value={form.name}
                onChange={onChange("name")}
                className="inp"
                placeholder="Juan Pérez"
                required
                data-testid="field-name"
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                value={form.email}
                onChange={onChange("email")}
                className="inp"
                placeholder="vos@email.com"
                required
                data-testid="field-email"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <Field label="Teléfono" required>
              <input
                type="tel"
                value={form.phone}
                onChange={onChange("phone")}
                className="inp"
                placeholder="+54 9 11 …"
                required
                data-testid="field-phone"
              />
            </Field>
            <Field label="Sistema preferido">
              <select
                value={form.system}
                onChange={onChange("system")}
                className="inp"
                data-testid="field-system"
              >
                <option value="">A definir</option>
                <option value="frances">Sistema Francés</option>
                <option value="americano">Sistema Americano</option>
                <option value="ambos">Quiero comparar ambos</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            <Field label="Valor propiedad (USD)">
              <input
                type="number"
                min="0"
                value={form.property_value}
                onChange={onChange("property_value")}
                className="inp"
                placeholder="200000"
                data-testid="field-property-value"
              />
            </Field>
            <Field label="Monto solicitado (USD)">
              <input
                type="number"
                min="0"
                value={form.loan_amount}
                onChange={onChange("loan_amount")}
                className="inp"
                placeholder="60000"
                data-testid="field-loan-amount"
              />
            </Field>
            <Field label="Plazo (meses)">
              <input
                type="number"
                min="1"
                max="60"
                value={form.term_months}
                onChange={onChange("term_months")}
                className="inp"
                placeholder="36"
                data-testid="field-term"
              />
            </Field>
          </div>

          <Field label="Mensaje (opcional)">
            <textarea
              rows={4}
              value={form.message}
              onChange={onChange("message")}
              className="inp resize-none"
              placeholder="Contanos brevemente tu situación o cualquier consulta…"
              data-testid="field-message"
            />
          </Field>

          <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-[11px] text-[#9CA3AF]">
              Tus datos son confidenciales. Solo los usamos para responderte.
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-3 bg-[#CBA153] text-[#080A0F] font-medium px-8 py-3.5 hover:bg-[#E1C07C] transition-all duration-300 disabled:opacity-60"
              data-testid="contact-submit-button"
            >
              {loading ? "Enviando…" : "Enviar consulta"}
              <Send size={16} />
            </button>
          </div>
        </motion.form>
      </div>

      <style>{`
        .inp {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          color: #F3F2ED;
          padding: 12px 0;
          font-size: 15px;
          outline: none;
          transition: border-color 0.3s ease;
          font-family: 'Outfit', sans-serif;
        }
        .inp::placeholder { color: rgba(255,255,255,0.25); }
        .inp:focus { border-bottom-color: #CBA153; }
        select.inp { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23CBA153' stroke-width='1.4' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 4px center; padding-right: 22px; }
        select.inp option { background:#121620; color:#F3F2ED; }
      `}</style>
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#9CA3AF] mb-1">
        {label} {required && <span className="text-[#CBA153]">*</span>}
      </div>
      {children}
    </label>
  );
}
