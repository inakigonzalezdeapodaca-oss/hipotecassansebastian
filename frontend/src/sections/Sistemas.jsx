import { motion } from "framer-motion";
import { TrendingDown, Activity } from "lucide-react";

const cards = [
  {
    id: "frances",
    icon: TrendingDown,
    title: "Sistema Francés",
    subtitle: "Cuota fija mes a mes",
    body:
      "Pagás la misma cuota todos los meses. Al principio se va más a intereses y, con el tiempo, más a capital. Ideal si querés previsibilidad: sabés exactamente cuánto te toca pagar cada mes.",
    bullets: [
      "Cuota constante de principio a fin",
      "El capital se amortiza desde el primer mes",
      "Al final del plazo la deuda queda en cero",
    ],
  },
  {
    id: "americano",
    icon: Activity,
    title: "Sistema Americano",
    subtitle: "Solo intereses + capital al final",
    body:
      "Mes a mes pagás solamente los intereses (cuota baja). En la última cuota devolvés el capital prestado de una sola vez. Ideal si esperás un ingreso fuerte al final (venta, bono, otro inmueble).",
    bullets: [
      "Cuotas mensuales más bajas",
      "Capital total se cancela en la última cuota",
      "Útil cuando proyectás un ingreso futuro",
    ],
  },
];

export default function Sistemas() {
  return (
    <section
      id="sistemas"
      className="relative bg-[#0B1B33] py-20 lg:py-32 border-t border-white/5"
      data-testid="sistemas-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14"
        >
          <div className="flex items-center gap-3 text-[#CBA153] mb-5">
            <span className="h-px w-12 bg-[#CBA153]" />
            <span className="text-xs uppercase tracking-[0.3em]">Sistemas explicados simple</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
            Dos maneras de pagar.{" "}
            <span className="italic text-[#CBA153]">Vos elegís</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                className="relative bg-[#15263F] border border-white/10 p-8 lg:p-10 group hover:border-[#CBA153]/40 transition-all duration-500"
                data-testid={`sistema-card-${c.id}`}
              >
                <div className="w-12 h-12 border border-[#CBA153]/40 text-[#CBA153] flex items-center justify-center mb-6">
                  <Icon size={22} />
                </div>
                <h3 className="font-serif-display text-3xl lg:text-4xl text-[#F0E6CE] font-light">
                  {c.title}
                </h3>
                <div className="text-[#CBA153] text-sm italic mt-1">{c.subtitle}</div>
                <p className="text-[#9CA3AF] mt-6 leading-relaxed">{c.body}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[#F0E6CE]/90">
                      <span className="mt-2 h-px w-4 bg-[#CBA153]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-10 p-6 lg:p-8 border border-white/10 bg-[#07142A] flex flex-col md:flex-row md:items-center gap-4 md:justify-between"
        >
          <div className="text-[#9CA3AF] text-sm">
            ¿Querés ver la diferencia en números? Probá el simulador.
          </div>
          <a
            href="#simulador"
            className="self-start md:self-auto border border-white/20 text-[#F0E6CE] px-6 py-3 text-sm hover:border-[#CBA153] hover:text-[#CBA153] transition-all duration-300"
          >
            Ir al simulador
          </a>
        </motion.div>
      </div>
    </section>
  );
}
