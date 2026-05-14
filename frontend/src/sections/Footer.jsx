import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative bg-[#07142A] pt-20 lg:pt-28 overflow-hidden"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-16 h-16 bg-[#FFFFFF] p-2 shrink-0">
                <img src="/logo.jpeg" alt="Hipotecas San Sebastián" className="w-full h-full object-contain" />
              </span>
              <div className="font-serif-display text-[#FFFFFF] text-2xl leading-tight">
                Hipotecas{" "}
                <span className="italic text-[#3D7A5F]">San Sebastián</span>
              </div>
            </div>
            <p className="mt-5 text-[#9CA3AF] text-sm leading-relaxed max-w-sm">
              Créditos hipotecarios privados en dólares estadounidenses.
              Oficinas privadas en Capital Federal (CABA) — operamos en CABA y
              algunas zonas de Gran Buenos Aires. 35 años, +1.000 hipotecas.
            </p>
            <a
              href="https://instagram.com/hipotecas.sansebastian"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 text-[#FFFFFF] hover:text-[#3D7A5F] transition-colors group"
              data-testid="footer-instagram-link"
            >
              <span className="w-10 h-10 border border-[#3D7A5F]/40 group-hover:border-[#3D7A5F] flex items-center justify-center transition-colors">
                <Instagram size={18} className="text-[#3D7A5F]" />
              </span>
              <span className="text-sm tracking-wide">@hipotecas.sansebastian</span>
            </a>
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
                ["#faq", "Preguntas frecuentes"],
                ["#contacto", "Contacto"],
              ].map(([h, l]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="text-[#FFFFFF]/80 hover:text-[#3D7A5F] transition-colors"
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
                  href="https://wa.me/5491124706405?text=Hola%2C%20me%20interesa%20un%20cr%C3%A9dito%20hipotecario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFFFFF]/80 hover:text-[#3D7A5F] transition-colors"
                  data-testid="footer-whatsapp-link"
                >
                  WhatsApp: +54 9 11 2470-6405
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/hipotecas.sansebastian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFFFFF]/80 hover:text-[#3D7A5F] transition-colors"
                >
                  Instagram: @hipotecas.sansebastian
                </a>
              </li>
              <li className="text-[#9CA3AF]">Oficinas privadas en CABA · Operamos en CABA y algunas zonas de GBA</li>
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
            className="font-serif-display text-[#15263F] leading-[0.9] tracking-tight select-none"
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
