import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer
      className="relative bg-[#05070A] pt-20 lg:pt-28 overflow-hidden"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16">
          <div className="md:col-span-5">
            <div className="font-serif-display text-[#F3F2ED] text-2xl">
              Hipotecas{" "}
              <span className="italic text-[#CBA153]">San Sebastián</span>
            </div>
            <p className="mt-4 text-[#9CA3AF] text-sm leading-relaxed max-w-sm">
              Créditos hipotecarios privados en dólares estadounidenses.
              Capital Federal y Gran Buenos Aires. 35 años, +1.000 hipotecas.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9CA3AF] mb-4">
              Navegación
            </div>
            <ul className="space-y-2 text-sm">
              {[
                ["#simulador", "Simulador"],
                ["#sistemas", "Sistemas"],
                ["#nosotros", "Nosotros"],
                ["#como-funciona", "Cómo funciona"],
                ["#faq", "Preguntas frecuentes"],
                ["#contacto", "Contacto"],
              ].map(([h, l]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="text-[#F3F2ED]/80 hover:text-[#CBA153] transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9CA3AF] mb-4">
              Contacto
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:sansebastianhipotecas@gmail.com"
                  className="text-[#F3F2ED]/80 hover:text-[#CBA153] transition-colors"
                >
                  sansebastianhipotecas@gmail.com
                </a>
              </li>
              <li className="text-[#9CA3AF]">Capital Federal &amp; Gran Buenos Aires</li>
              <li className="text-[#9CA3AF]">Operaciones en USD · Lun a Vie 10-18 hs</li>
            </ul>
          </div>
        </div>

        {/* Massive wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-white/10 pt-10 pb-6"
        >
          <div
            className="font-serif-display text-[#121620] leading-[0.9] tracking-tight select-none"
            style={{ fontSize: "clamp(48px, 12vw, 200px)" }}
          >
            San Sebastián
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-10 text-xs text-[#9CA3AF]">
          <div>© {new Date().getFullYear()} Hipotecas San Sebastián. Todos los derechos reservados.</div>
          <div className="uppercase tracking-[0.2em]">
            Hecho con criterio · Buenos Aires
          </div>
        </div>
      </div>
    </footer>
  );
}
