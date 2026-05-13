import { motion } from "framer-motion";
import { MessageCircle, Instagram, ArrowRight } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5491124706405?text=Hola%2C%20me%20interesa%20un%20cr%C3%A9dito%20hipotecario";

export default function Contact() {
  return (
    <section
      id="contacto"
      className="relative bg-[#080A0F] py-20 lg:py-32 border-t border-white/5"
      data-testid="contact-section"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 text-[#CBA153] mb-5">
            <span className="h-px w-12 bg-[#CBA153]" />
            <span className="text-xs uppercase tracking-[0.3em]">Contactanos</span>
            <span className="h-px w-12 bg-[#CBA153]" />
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
            Conversemos sobre{" "}
            <span className="italic text-[#CBA153]">tu próximo paso</span>.
          </h2>
          <p className="mt-6 text-[#9CA3AF] text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            Envianos un mensaje directo por WhatsApp y nuestros asesores te
            van a responder a la brevedad.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-14 flex flex-col items-center"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 bg-[#CBA153] text-[#080A0F] font-medium text-base sm:text-lg px-10 sm:px-14 py-5 hover:bg-[#E1C07C] transition-all duration-300 shadow-[0_0_32px_rgba(203,161,83,0.2)]"
            data-testid="whatsapp-cta-main"
          >
            <MessageCircle size={22} strokeWidth={2} />
            <span>Enviar mensaje por WhatsApp</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <div className="mt-4 text-[#9CA3AF] text-sm" data-testid="whatsapp-number">
            +54 9 11 2470-6405
          </div>

          <div className="mt-12 flex items-center gap-3 text-[#9CA3AF] text-xs uppercase tracking-[0.25em]">
            <span className="h-px w-10 bg-white/20" />
            <span>o seguinos en</span>
            <span className="h-px w-10 bg-white/20" />
          </div>

          <a
            href="https://instagram.com/hipotecas.sansebastian"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-3 text-[#F3F2ED] hover:text-[#CBA153] transition-colors group"
            data-testid="contact-instagram-link"
          >
            <span className="w-10 h-10 border border-[#CBA153]/40 group-hover:border-[#CBA153] flex items-center justify-center transition-colors">
              <Instagram size={18} className="text-[#CBA153]" />
            </span>
            <span className="text-base tracking-wide">@hipotecas.sansebastian</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
