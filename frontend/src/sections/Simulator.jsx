import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, Check } from "lucide-react";

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
  const [propertyValue, setPropertyValue] = useState(200000);
  const [loanAmount, setLoanAmount] = useState(60000);
  const [annualRate, setAnnualRate] = useState(10);
  const [termMonths, setTermMonths] = useState(36);
  const [system, setSystem] = useState("frances");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const maxLoan = Math.round(propertyValue * 0.35);
  const ltv = useMemo(
    () => (propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0),
    [loanAmount, propertyValue]
  );
  const ltvValid = ltv <= 35.01;

  // Clamp loan to max
  useEffect(() => {
    if (loanAmount > maxLoan) setLoanAmount(maxLoan);
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
    const t = setTimeout(() => {
      if (ltvValid) calc();
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [propertyValue, loanAmount, annualRate, termMonths, system]);

  return (
    <section
      id="simulador"
      className="relative bg-[#080A0F] py-20 lg:py-32"
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
          <div className="flex items-center gap-3 text-[#CBA153] mb-5">
            <span className="h-px w-12 bg-[#CBA153]" />
            <span className="text-xs uppercase tracking-[0.3em]">Simulador</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
            Calculá tu cuota en{" "}
            <span className="italic text-[#CBA153]">dólares</span>
          </h2>
          <p className="mt-5 text-[#9CA3AF] text-base lg:text-lg max-w-2xl">
            Movés los controles y ves al instante cuánto pagás por mes,
            cuánto vas a pagar en total y cómo se compone cada cuota.
          </p>
        </motion.div>

        <div className="backdrop-blur-2xl bg-[#080A0F]/70 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
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
                          ? "border-[#CBA153] bg-[#CBA153]/5"
                          : "border-white/15 hover:border-white/30"
                      }`}
                    >
                      <div className="font-serif-display text-xl text-[#F3F2ED]">
                        {opt.label}
                      </div>
                      <div className="text-xs text-[#9CA3AF] mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property value */}
              <Field
                label="Valor de la propiedad (USD)"
                value={fmt(propertyValue)}
                testid="property-value-display"
              >
                <Slider
                  value={[propertyValue]}
                  onValueChange={(v) => setPropertyValue(v[0])}
                  min={50000}
                  max={1500000}
                  step={5000}
                  data-testid="property-value-slider"
                />
                <RangeLabels left="USD 50.000" right="USD 1.500.000" />
              </Field>

              {/* Loan amount */}
              <Field
                label={`Monto solicitado (máx. ${fmt(maxLoan)} — 35% LTV)`}
                value={fmt(loanAmount)}
                testid="loan-amount-display"
              >
                <Slider
                  value={[loanAmount]}
                  onValueChange={(v) => setLoanAmount(v[0])}
                  min={10000}
                  max={Math.max(10000, maxLoan)}
                  step={1000}
                  data-testid="loan-amount-slider"
                />
                <RangeLabels left="USD 10.000" right={fmt(maxLoan)} />
              </Field>

              {/* Rate */}
              <Field
                label="Tasa anual (USD)"
                value={`${annualRate.toFixed(1)}%`}
                testid="rate-display"
              >
                <Slider
                  value={[annualRate]}
                  onValueChange={(v) => setAnnualRate(v[0])}
                  min={6}
                  max={15}
                  step={0.25}
                  data-testid="rate-slider"
                />
                <RangeLabels left="6%" right="15%" />
              </Field>

              {/* Term */}
              <Field
                label="Plazo"
                value={`${termMonths} cuotas`}
                testid="term-display"
              >
                <Slider
                  value={[termMonths]}
                  onValueChange={(v) => setTermMonths(v[0])}
                  min={6}
                  max={60}
                  step={1}
                  data-testid="term-slider"
                />
                <RangeLabels left="6 cuotas" right="60 cuotas" />
              </Field>
            </div>
          </div>

          {/* RESULTS */}
          <div className="lg:col-span-5 bg-[#05070A] p-6 sm:p-10 lg:p-12 flex flex-col">
            <div className="flex items-center gap-3 text-[#CBA153] mb-6">
              <span className="h-px w-8 bg-[#CBA153]" />
              <span className="text-xs uppercase tracking-[0.3em]">Resultado</span>
            </div>

            <div className="mb-4">
              <div className="text-xs uppercase tracking-[0.25em] text-[#9CA3AF]">
                {system === "frances" ? "Cuota mensual fija" : "Cuota mensual (intereses)"}
              </div>
              <div
                className="font-serif-display text-[#CBA153] text-5xl lg:text-6xl font-light leading-none mt-3 tracking-tight"
                data-testid="result-monthly-payment"
              >
                {loading ? "…" : fmt(result?.monthly_payment)}
              </div>
            </div>

            {system === "americano" && (
              <div className="mt-2 p-4 border border-[#CBA153]/30 bg-[#CBA153]/5">
                <div className="text-xs uppercase tracking-[0.2em] text-[#CBA153]">
                  Cuota final (capital)
                </div>
                <div className="font-serif-display text-2xl text-[#F3F2ED] mt-1">
                  {fmt(result?.final_balloon)}
                </div>
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Metric label="LTV" value={`${ltv.toFixed(1)}%`} valid={ltvValid} />
              <Metric label="Total a pagar" value={fmt(result?.total_paid)} />
              <Metric label="Intereses totales" value={fmt(result?.total_interest)} />
              <Metric label="Plazo" value={`${termMonths} meses`} />
            </div>

            {!ltvValid && (
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

            {ltvValid && (
              <div className="mt-6 flex items-center gap-2 text-emerald-400/90 text-sm">
                <Check size={16} />
                <span>Dentro del límite del 35% LTV</span>
              </div>
            )}

            <a
              href="#contacto"
              className="mt-auto pt-10 inline-flex items-center justify-center gap-2 bg-[#CBA153] text-[#080A0F] font-medium px-6 py-4 hover:bg-[#E1C07C] transition-all duration-300"
              data-testid="simulator-cta"
            >
              Solicitar este crédito
            </a>
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
          className="font-serif-display text-[#F3F2ED] text-lg"
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
          valid ? "text-[#F3F2ED]" : "text-red-400"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
