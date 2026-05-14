import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Consulta inicial",
    body:
      "Nos contactás por el formulario o WhatsApp. Te respondemos en menos de 24 hs hábiles y agendamos una primera charla.",
  },
  {
    n: "02",
    title: "Evaluación y tasación",
    body:
      "Analizamos tu situación y se tasa la propiedad en CABA o GBA. Definimos juntos monto, plazo y sistema (francés o americano).",
  },
  {
    n: "03",
    title: "Oferta firme en USD",
    body:
      "Recibís una propuesta clara y por escrito: cuota mensual, costo total, intereses y plazos. Sin letra chica.",
  },
  {
    n: "04",
    title: "Escritura y desembolso",
    body:
      "Firmamos en escribanía de tu elección o de nuestra red. El dinero se libera al cierre, en dólares.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative bg-[#0B1B33] py-20 lg:py-32 border-t border-white/5"
      data-testid="how-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14"
        >
          <div className="flex items-center gap-3 text-[#3D7A5F] mb-5">
            <span className="h-px w-12 bg-[#3D7A5F]" />
            <span className="text-xs uppercase tracking-[0.3em]">Cómo funciona</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
            Cuatro pasos. <span className="italic text-[#3D7A5F]">Cero sorpresas.</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[40px] h-px bg-white/10 hidden lg:block" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                className="relative"
              >
                <div className="relative bg-[#0B1B33] inline-flex w-20 h-20 items-center justify-center border border-[#3D7A5F]/30 mb-6">
                  <span className="font-serif-display text-[#3D7A5F] text-3xl">{s.n}</span>
                </div>
                <h3 className="font-serif-display text-xl lg:text-2xl text-[#F0E6CE] font-normal">
                  {s.title}
                </h3>
                <p className="mt-3 text-[#9CA3AF] text-sm leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
