import { motion } from "framer-motion";

const items = [
  { num: "35", suf: "años", label: "de trayectoria continua" },
  { num: "1.000+", suf: "", label: "hipotecas otorgadas" },
  { num: "35%", suf: "", label: "máximo financiado del valor" },
  { num: "60", suf: "cuotas", label: "plazo máximo" },
];

export default function Stats() {
  return (
    <section className="relative bg-[#080A0F] border-y border-white/10" data-testid="stats-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            data-testid={`stat-${i}`}
          >
            <div className="font-serif-display text-[#CBA153] text-5xl sm:text-6xl lg:text-7xl font-light leading-none tracking-tight">
              {it.num}
              {it.suf && (
                <span className="text-sm sm:text-base text-[#9CA3AF] ml-2 font-body italic">
                  {it.suf}
                </span>
              )}
            </div>
            <div className="mt-3 text-xs sm:text-sm uppercase tracking-[0.18em] text-[#9CA3AF]">
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
