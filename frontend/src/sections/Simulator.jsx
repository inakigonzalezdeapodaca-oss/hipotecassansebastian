import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, Check, Download } from "lucide-react";
import jsPDF from "jspdf";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmt2 = (n) =>
  new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n || 0);

export default function Simulator() {
  const [propertyValue, setPropertyValue] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [propertyValueText, setPropertyValueText] = useState("");
  const [loanAmountText, setLoanAmountText] = useState("");
  const annualRate = 18; // tasa fija anual en USD
  const [termMonths, setTermMonths] = useState(36);
  const [system, setSystem] = useState("frances");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const maxLoan = Math.round(propertyValue * 0.35);
  const ltv = useMemo(
    () => (propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0),
    [loanAmount, propertyValue]
  );
  const hasInputs = propertyValue > 0 && loanAmount > 0;
  const ltvValid = hasInputs && ltv <= 35.01;

  // Clamp loan to max when property changes (only if property has been set)
  useEffect(() => {
    if (propertyValue > 0 && loanAmount > maxLoan) {
      setLoanAmount(maxLoan);
      setLoanAmountText(String(maxLoan));
    }
  }, [maxLoan]); // eslint-disable-line

  const calc = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/simulate`, {
        property_value: propertyValue,
        loan_amount: loanAmount,
        annual_rate: annualRate,
        term_months: termMonths,
        system,
      });
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-calc on first mount & whenever inputs change (debounced quickly)
  useEffect(() => {
    if (!hasInputs) {
      setResult(null);
      return;
    }
    const t = setTimeout(() => {
      if (ltvValid) calc();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [propertyValue, loanAmount, annualRate, termMonths, system]);

  const loadLogoDataUrl = async () => {
    try {
      const res = await fetch("/logo.jpeg");
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("logo load failed", e);
      return null;
    }
  };

  const downloadPdf = async () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const M = 48;
    const today = new Date().toLocaleDateString("es-AR");
    const sysLabel = system === "frances" ? "Sistema Francés (cuota fija)" : "Sistema Americano (solo intereses + capital al final)";

    // Header band
    doc.setFillColor(11, 27, 51);
    doc.rect(0, 0, W, 110, "F");

    // Logo (white tile on dark band, like the website)
    const logoDataUrl = await loadLogoDataUrl();
    if (logoDataUrl) {
      doc.setFillColor(243, 242, 237);
      doc.rect(M, 22, 64, 64, "F");
      doc.addImage(logoDataUrl, "JPEG", M + 4, 26, 56, 56);
    }

    const textX = logoDataUrl ? M + 80 : M;
    doc.setTextColor(61, 122, 95);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Hipotecas San Sebastián", textX, 50);
    doc.setTextColor(243, 242, 237);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Simulación de crédito hipotecario · USD", textX, 70);
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(9);
    doc.text(`Emitido: ${today}`, textX, 86);

    let y = 150;
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Resumen de la simulación", M, y);
    y += 6;
    doc.setDrawColor(61, 122, 95);
    doc.setLineWidth(1);
    doc.line(M, y, M + 60, y);
    y += 24;

    const lines = [
      ["Sistema", sysLabel],
      ["Valor de la propiedad", fmt(propertyValue)],
      ["Monto solicitado", fmt(loanAmount)],
      ["Relación solicitado / valor", `${result.ltv_percent.toFixed(2)}% (máximo 35%)`],
      ["Tasa mensual fija (USD)", `${(annualRate / 12).toFixed(2)}%`],
      ["Plazo", `${termMonths} cuotas`],
      ["Cuota mensual", fmt(result.monthly_payment)],
      ["Intereses totales", fmt(result.total_interest)],
      ["Comisiones y gastos extra", "Sin cargo (USD 0)"],
    ];
    if (system === "americano") {
      lines.push(["Cuota final (capital)", fmt(result.final_balloon)]);
    }

    doc.setFontSize(10.5);
    lines.forEach(([k, v]) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 90);
      doc.text(k, M, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text(String(v), W - M, y, { align: "right" });
      doc.setDrawColor(230, 230, 230);
      doc.line(M, y + 6, W - M, y + 6);
      y += 22;
    });

    // Schedule
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text("Primeras 12 cuotas", M, y);
    y += 6;
    doc.setDrawColor(61, 122, 95);
    doc.line(M, y, M + 60, y);
    y += 18;

    const headers = ["#", "Cuota", "Interés", "Capital", "Saldo"];
    const colX = [M, M + 50, M + 160, M + 270, M + 380];
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 120);
    headers.forEach((h, i) => doc.text(h, colX[i], y));
    y += 4;
    doc.setDrawColor(220, 220, 220);
    doc.line(M, y + 2, W - M, y + 2);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    (result.schedule_preview || []).forEach((r) => {
      doc.text(String(r.month), colX[0], y);
      doc.text(fmt(r.payment), colX[1], y);
      doc.text(fmt(r.interest), colX[2], y);
      doc.text(fmt(r.principal), colX[3], y);
      doc.text(fmt(r.balance), colX[4], y);
      y += 16;
    });

    // Footer
    y = doc.internal.pageSize.getHeight() - 80;
    doc.setDrawColor(230, 230, 230);
    doc.line(M, y, W - M, y);
    y += 16;
    doc.setFontSize(8.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Cálculo orientativo. La aprobación final depende de tasación, antecedentes y condiciones acordadas con el asesor.",
      M,
      y,
      { maxWidth: W - 2 * M }
    );
    y += 22;
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "bold");
    doc.text("Contacto:", M, y);
    doc.setFont("helvetica", "normal");
    doc.text("WhatsApp +54 9 11 2470-6405 · Instagram @hipotecas.sansebastian · CABA y algunas zonas de GBA", M + 50, y, { maxWidth: W - M - 50 });

    doc.save(`simulacion-hipoteca-san-sebastian-${Date.now()}.pdf`);
  };

  return (
    <section
      id="simulador"
      className="relative bg-[#0B1B33] py-20 lg:py-32"
      data-testid="simulator-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-3 text-[#3D7A5F] mb-5">
            <span className="h-px w-12 bg-[#3D7A5F]" />
            <span className="text-xs uppercase tracking-[0.3em]">Simulador</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
            Calculá tu cuota en{" "}
            <span className="italic text-[#3D7A5F]">dólares</span>
          </h2>
          <p className="mt-5 text-[#9CA3AF] text-base lg:text-lg max-w-2xl">
            Movés los controles y ves al instante cuánto pagás por mes,
            cuánto vas a pagar en total y cómo se compone cada cuota.
            <span className="block mt-2 text-[#3D7A5F]">Sin comisiones ni gastos extra.</span>
          </p>
        </motion.div>

        <div className="backdrop-blur-2xl bg-[#0B1B33]/70 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* INPUTS */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="space-y-10">
              {/* System toggle */}
              <div>
                <label className="block text-xs uppercase tracking-[0.25em] text-[#9CA3AF] mb-3">
                  Sistema
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "frances", label: "Francés", desc: "Cuota fija" },
                    { id: "americano", label: "Americano", desc: "Solo intereses" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSystem(opt.id)}
                      data-testid={`system-toggle-${opt.id}`}
                      className={`text-left p-4 border transition-all duration-300 ${
                        system === opt.id
                          ? "border-[#3D7A5F] bg-[#3D7A5F]/5"
                          : "border-white/15 hover:border-white/30"
                      }`}
                    >
                      <div className="font-serif-display text-xl text-[#FFFFFF]">
                        {opt.label}
                      </div>
                      <div className="text-xs text-[#9CA3AF] mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property value */}
              <div data-testid="property-value-field">
                <label className="block text-xs uppercase tracking-[0.22em] text-[#9CA3AF] mb-3">
                  Valor de la propiedad (USD)
                </label>
                <div className="flex items-baseline gap-3 border-b border-white/15 focus-within:border-[#3D7A5F] transition-colors">
                  <span className="font-serif-display text-[#3D7A5F] text-2xl">US$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={propertyValueText}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      setPropertyValueText(raw);
                      const n = parseInt(raw || "0", 10);
                      setPropertyValue(isNaN(n) ? 0 : n);
                    }}
                    placeholder="Ej. 200.000"
                    className="bg-transparent flex-1 font-serif-display text-[#FFFFFF] text-2xl py-3 outline-none placeholder:text-white/20"
                    data-testid="property-value-input"
                  />
                </div>
                <div className="text-[11px] text-[#9CA3AF]/70 mt-2">
                  Mínimo USD 1.000 · Ingresá el valor real de tasación.
                </div>
              </div>

              {/* Loan amount */}
              <div data-testid="loan-amount-field">
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-xs uppercase tracking-[0.22em] text-[#9CA3AF]">
                    Monto solicitado (USD)
                  </label>
                  <span className="text-[11px] text-[#9CA3AF]">
                    Máx. {fmt(maxLoan)} <span className="text-[#3D7A5F]">— 35% LTV</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-3 border-b border-white/15 focus-within:border-[#3D7A5F] transition-colors">
                  <span className="font-serif-display text-[#3D7A5F] text-2xl">US$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={loanAmountText}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      setLoanAmountText(raw);
                      const n = parseInt(raw || "0", 10);
                      setLoanAmount(isNaN(n) ? 0 : n);
                    }}
                    placeholder="Ej. 60.000"
                    className="bg-transparent flex-1 font-serif-display text-[#FFFFFF] text-2xl py-3 outline-none placeholder:text-white/20"
                    data-testid="loan-amount-input"
                  />
                </div>
                <div className="text-[11px] text-[#9CA3AF]/70 mt-2">
                  Mínimo USD 1.000 · No puede superar el 35% del valor de la propiedad.
                </div>
              </div>

              {/* Rate (fija mensual) */}
              <div data-testid="rate-fixed">
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-xs uppercase tracking-[0.22em] text-[#9CA3AF]">
                    Tasa mensual fija (USD)
                  </label>
                  <span className="font-serif-display text-[#3D7A5F] text-lg">
                    1,50%
                  </span>
                </div>
                <div className="text-[11px] text-[#9CA3AF]/70 border-l-2 border-[#3D7A5F]/40 pl-3 leading-relaxed">
                  Tasa institucional fija en dólares. No varía durante todo el plazo del crédito.
                </div>
              </div>

              {/* Term */}
              <div data-testid="term-field">
                <div className="flex items-baseline justify-between mb-3">
                  <label className="text-xs uppercase tracking-[0.22em] text-[#9CA3AF]">
                    Plazo
                  </label>
                  <span className="font-serif-display text-[#FFFFFF] text-lg" data-testid="term-display">
                    {termMonths} cuotas
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[24, 36, 48, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTermMonths(m)}
                      data-testid={`term-option-${m}`}
                      className={`py-3 border text-center transition-all duration-300 ${
                        termMonths === m
                          ? "border-[#3D7A5F] bg-[#3D7A5F]/10 text-[#3D7A5F]"
                          : "border-white/15 text-[#FFFFFF]/80 hover:border-white/30"
                      }`}
                    >
                      <div className="font-serif-display text-xl leading-none">{m}</div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-[#9CA3AF] mt-1">
                        cuotas
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div className="lg:col-span-5 bg-[#07142A] p-6 sm:p-10 lg:p-12 flex flex-col">
            <div className="flex items-center gap-3 text-[#3D7A5F] mb-6">
              <span className="h-px w-8 bg-[#3D7A5F]" />
              <span className="text-xs uppercase tracking-[0.3em]">Resultado</span>
            </div>

            <div className="mb-4">
              <div className="text-xs uppercase tracking-[0.25em] text-[#9CA3AF]">
                {system === "frances" ? "Cuota mensual fija" : "Cuota mensual (intereses)"}
              </div>
              <div
                className="font-serif-display text-[#3D7A5F] text-5xl lg:text-6xl font-light leading-none mt-3 tracking-tight"
                data-testid="result-monthly-payment"
              >
                {!hasInputs ? "US$ 0" : loading ? "…" : fmt(result?.monthly_payment)}
              </div>
              <div className="text-[11px] text-[#9CA3AF]/80 mt-3 italic">
                {hasInputs
                  ? ""
                  : "Ingresá el valor de la propiedad y el monto que querés solicitar."}
              </div>
            </div>

            {hasInputs && system === "americano" && (
              <div className="mt-2 p-4 border border-[#3D7A5F]/30 bg-[#3D7A5F]/5">
                <div className="text-xs uppercase tracking-[0.2em] text-[#3D7A5F]">
                  Cuota final (capital)
                </div>
                <div className="font-serif-display text-2xl text-[#FFFFFF] mt-1">
                  {fmt(result?.final_balloon)}
                </div>
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Metric label="Solicitado" value={hasInputs ? `${ltv.toFixed(1)}%` : "—"} valid={ltvValid || !hasInputs} />
              <Metric label="Intereses totales" value={hasInputs ? fmt(result?.total_interest) : "—"} />
              <Metric label="Plazo" value={`${termMonths} meses`} />
              <Metric label="Tasa mensual" value="1,50%" />
            </div>

            {hasInputs && !ltvValid && (
              <div
                className="mt-6 flex items-start gap-3 p-4 border border-red-500/40 bg-red-500/5 text-red-300 text-sm"
                data-testid="ltv-warning"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div>
                  El monto excede el 35% del valor de la propiedad.
                  Reducí el monto solicitado para continuar.
                </div>
              </div>
            )}

            {hasInputs && ltvValid && (
              <div className="mt-6 flex items-center gap-2 text-emerald-400/90 text-sm">
                <Check size={16} />
                <span>Dentro del límite del 35% del valor de la propiedad</span>
              </div>
            )}

            <div
              className="mt-5 p-5 border-2 border-[#3D7A5F] bg-gradient-to-br from-[#3D7A5F]/15 to-[#3D7A5F]/5 shadow-[0_0_24px_rgba(203,161,83,0.15)]"
              data-testid="no-fees-note"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#3D7A5F] text-[#0B1B33] flex items-center justify-center shrink-0">
                  <Check size={20} strokeWidth={3} />
                </div>
                <div>
                  <div className="font-serif-display text-[#3D7A5F] text-xl leading-tight">
                    Sin comisiones. Sin gastos extra.
                  </div>
                  <div className="text-[12px] text-[#FFFFFF]/85 leading-relaxed mt-1.5">
                    La cuota que ves es <span className="text-[#FFFFFF] font-medium">todo lo que pagás</span>.
                    Cero cargos de administración, originación, mantenimiento ni costos ocultos.
                  </div>
                </div>
              </div>
            </div>

            <a
              href="#contacto"
              className="mt-auto pt-10 inline-flex items-center justify-center gap-2 bg-[#3D7A5F] text-[#0B1B33] font-medium px-6 py-4 hover:bg-[#4F9577] transition-all duration-300"
              data-testid="simulator-cta"
            >
              Solicitar este crédito
            </a>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!result || !ltvValid}
              className="mt-3 inline-flex items-center justify-center gap-2 border border-white/20 text-[#FFFFFF] px-6 py-3 text-sm hover:border-[#3D7A5F] hover:text-[#3D7A5F] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              data-testid="simulator-download-pdf"
            >
              <Download size={15} />
              Descargar simulación en PDF
            </button>
            <div className="text-[11px] text-[#9CA3AF] mt-3 leading-relaxed">
              * Cálculo orientativo. La aprobación final depende de tasación, antecedentes
              y condiciones acordadas con el asesor.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, children, testid }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <label className="text-xs uppercase tracking-[0.22em] text-[#9CA3AF]">
          {label}
        </label>
        <span
          className="font-serif-display text-[#FFFFFF] text-lg"
          data-testid={testid}
        >
          {value}
        </span>
      </div>
      {children}
    </div>
  );
}

function RangeLabels({ left, right }) {
  return (
    <div className="flex justify-between mt-2 text-[11px] text-[#9CA3AF]/70">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function Metric({ label, value, valid = true }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF]">{label}</div>
      <div
        className={`font-serif-display text-xl mt-1 ${
          valid ? "text-[#FFFFFF]" : "text-red-400"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
