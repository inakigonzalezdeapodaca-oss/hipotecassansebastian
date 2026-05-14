import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿En qué moneda otorgan los créditos?",
    a: "Operamos exclusivamente en dólares estadounidenses (USD). Tanto el monto desembolsado como las cuotas mensuales se pactan y se cancelan en USD.",
  },
  {
    q: "¿Hasta qué porcentaje del valor de la propiedad financian?",
    a: "Financiamos hasta el 35% del valor de tasación de la propiedad.",
  },
  {
    q: "¿En qué zonas operan?",
    a: "Trabajamos únicamente en Capital Federal (CABA) y en algunas zonas de Gran Buenos Aires. Esto nos permite conocer cada barrio, tasar con precisión y acompañar la operación de cerca.",
  },
  {
    q: "¿Cuál es el plazo del crédito?",
    a: "Otorgamos plazos de 24 a 60 cuotas (de 2 a 5 años). En el simulador podés elegir entre 24, 36, 48 o 60 cuotas.",
  },
  {
    q: "¿Qué requisitos necesito?",
    a: "Mostrar capacidad de pago, que la propiedad sea apta para constituir un crédito hipotecario y, finalmente, el inversor es quien decide la aprobación de la operación.",
  },
  {
    q: "¿La operación se hace por escritura pública?",
    a: "Sí. Toda hipoteca se formaliza en escritura pública ante escribano.",
  },
  {
    q: "¿Hay comisiones o gastos extra?",
    a: "No. La cuota mensual que ves en el simulador es exactamente lo que pagás. Sin cargos de administración, originación, mantenimiento ni costos ocultos.",
  },
  {
    q: "¿Puedo cancelar el crédito antes de tiempo?",
    a: "Sí. Se puede pre-cancelar total o parcialmente. Las condiciones específicas se acuerdan al momento de la firma para que estén claras desde el primer día.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative bg-[#0B1B33] py-20 lg:py-32 border-t border-white/5"
      data-testid="faq-section"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12"
        >
          <div className="flex items-center gap-3 text-[#3D7A5F] mb-5">
            <span className="h-px w-12 bg-[#3D7A5F]" />
            <span className="text-xs uppercase tracking-[0.3em]">Preguntas frecuentes</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
            Lo que <span className="italic text-[#3D7A5F]">siempre</span> te preguntás.
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-white/10 last:border-b-0"
              data-testid={`faq-item-${i}`}
            >
              <AccordionTrigger className="text-left text-[#F0E6CE] hover:text-[#3D7A5F] font-serif-display text-lg sm:text-xl py-6 hover:no-underline transition-colors">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#9CA3AF] text-base leading-relaxed pb-6 pr-8">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
