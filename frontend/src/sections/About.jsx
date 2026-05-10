import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="nosotros"
      className="relative bg-[#080A0F] py-20 lg:py-32 border-t border-white/5"
      data-testid="about-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12"
        >
          <div className="flex items-center gap-3 text-[#CBA153] mb-5">
            <span className="h-px w-12 bg-[#CBA153]" />
            <span className="text-xs uppercase tracking-[0.3em]">Nosotros</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
            Tres décadas hipotecando.{" "}
            <span className="italic text-[#CBA153]">Mil familias después.</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
          {/* 35 años — big */}
          <div className="md:col-span-5 bg-[#121620] border border-white/10 p-8 lg:p-10 flex flex-col justify-between min-h-[280px]">
            <div className="text-xs uppercase tracking-[0.25em] text-[#9CA3AF]">
              Desde 1990
            </div>
            <div>
              <div className="font-serif-display text-[#CBA153] text-[120px] sm:text-[160px] lg:text-[180px] font-light leading-[0.85] tracking-tight">
                35
              </div>
              <div className="font-serif-display italic text-[#F3F2ED] text-2xl mt-2">
                años de oficio
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="md:col-span-7 relative overflow-hidden border border-white/10 min-h-[280px]">
            <img
              src="https://images.unsplash.com/photo-1763729805496-b5dbf7f00c79?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxzaWduaW5nJTIwY29udHJhY3QlMjBwZW4lMjBkb2N1bWVudHxlbnwwfHx8fDE3Nzg0NTQ3Mzd8MA&ixlib=rb-4.1.0&q=85"
              alt="Firma de contrato hipotecario"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F]/90 via-[#080A0F]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="font-serif-display italic text-[#CBA153] text-lg mb-1">
                Escribanos seleccionados. Procesos transparentes.
              </div>
              <div className="text-[#F3F2ED] text-sm max-w-md">
                Cada operación se firma en escritura pública con respaldo legal completo.
              </div>
            </div>
          </div>

          {/* 1000+ */}
          <div className="md:col-span-4 bg-[#05070A] border border-[#CBA153]/30 p-8 lg:p-10 flex flex-col justify-between min-h-[220px]">
            <div className="text-xs uppercase tracking-[0.25em] text-[#CBA153]">
              Trayectoria
            </div>
            <div>
              <div className="font-serif-display text-[#F3F2ED] text-[80px] sm:text-[110px] font-light leading-[0.85] tracking-tight">
                1.000<span className="text-[#CBA153]">+</span>
              </div>
              <div className="text-[#9CA3AF] text-sm mt-3 uppercase tracking-[0.2em]">
                Hipotecas otorgadas
              </div>
            </div>
          </div>

          {/* Text block */}
          <div className="md:col-span-8 bg-[#121620] border border-white/10 p-8 lg:p-10">
            <h3 className="font-serif-display text-2xl lg:text-3xl text-[#F3F2ED] font-light mb-4">
              Conocemos cada calle de Buenos Aires.
            </h3>
            <p className="text-[#9CA3AF] leading-relaxed">
              Operamos exclusivamente en Capital Federal y Gran Buenos Aires.
              Trabajamos solo en dólares estadounidenses y financiamos hasta el 35% del valor
              de tu propiedad. Cada hipoteca se evalúa con criterio profesional, sin
              algoritmos opacos, y se firma con escribano público.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {[
                ["USD", "Solo dólares"],
                ["CABA + GBA", "Zona de cobertura"],
                ["35% LTV", "Financiación máx."],
                ["60 cuotas", "Plazo máx."],
              ].map(([h, d]) => (
                <div key={h} className="border-t border-white/10 pt-3">
                  <div className="font-serif-display text-[#CBA153] text-lg">{h}</div>
                  <div className="text-[#9CA3AF] mt-1 uppercase tracking-[0.15em] text-[10px]">
                    {d}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
