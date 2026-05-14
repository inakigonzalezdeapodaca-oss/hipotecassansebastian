import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-end overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1770629835248-5da510436ec4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxjbGFzc2ljJTIwYXJjaGl0ZWN0dXJlJTIwYnVlbm9zJTIwYWlyZXN8ZW58MHx8fHwxNzc4NDU0NzM2fDA&ixlib=rb-4.1.0&q=85"
          alt="Arquitectura clásica de Buenos Aires"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B33] via-[#0B1B33]/70 to-[#0B1B33]/40" />
        <div className="absolute inset-0 bg-[#0B1B33]/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 lg:pb-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease, delay: 0.1 }}
          className="flex items-center gap-3 text-[#3D7A5F] mb-6"
        >
          <span className="h-px w-12 bg-[#3D7A5F]" />
          <span className="text-xs uppercase tracking-[0.3em] font-medium">
            Créditos hipotecarios privados · USD
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
          className="font-serif-display text-4xl sm:text-5xl lg:text-7xl font-light leading-[1.05] tracking-tight max-w-4xl text-[#F0E6CE]"
        >
          La hipoteca en{" "}
          <span className="italic text-[#3D7A5F]">dólares</span> que
          construye patrimonio,
          <br className="hidden sm:block" />
          con la seriedad de tres décadas.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.4 }}
          className="mt-8 max-w-2xl text-base sm:text-lg text-[#9CA3AF] leading-relaxed"
        >
          Contamos con <span className="text-[#F0E6CE]">oficinas privadas en Capital Federal</span>.
          Financiamos hasta el <span className="text-[#F0E6CE]">35% del valor</span> de tu
          propiedad en CABA y en algunas zonas de Gran Buenos Aires.
          Plazos de <span className="text-[#F0E6CE]">24 a 60 cuotas</span>,
          sistema francés o americano. <span className="text-[#3D7A5F]">Sin comisiones ni gastos extra.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.55 }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a
            href="#simulador"
            className="group inline-flex items-center gap-3 bg-[#3D7A5F] text-[#0B1B33] font-medium px-8 py-4 hover:bg-[#4F9577] transition-all duration-300"
            data-testid="hero-cta-simulador"
          >
            Simular mi crédito
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contacto"
            className="inline-flex items-center gap-3 border border-white/20 text-[#F0E6CE] px-8 py-4 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            data-testid="hero-cta-contacto"
          >
            Hablar con un asesor
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.8 }}
          className="mt-12 flex items-center gap-2 text-[#9CA3AF] text-xs uppercase tracking-[0.25em]"
        >
          <MapPin size={14} className="text-[#3D7A5F]" />
          <span>Capital Federal (CABA) &amp; algunas zonas de Gran Buenos Aires</span>
        </motion.div>
      </div>
    </section>
  );
}
