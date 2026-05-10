import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#simulador", label: "Simulador" },
  { href: "#sistemas", label: "Sistemas" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl bg-[#080A0F]/80 border-b border-white/10"
          : "bg-transparent"
      }`}
      data-testid="main-nav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4 lg:py-5">
        <a href="#top" className="group flex flex-col leading-none" data-testid="logo-link">
          <span className="font-serif-display text-[#F3F2ED] text-xl sm:text-2xl tracking-tight">
            Hipotecas
          </span>
          <span className="font-serif-display italic text-[#CBA153] text-sm sm:text-base -mt-0.5 tracking-wide">
            San Sebastián
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#9CA3AF] hover:text-[#F3F2ED] transition-colors duration-300"
              data-testid={`nav-link-${l.href.slice(1)}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#contacto"
            className="bg-[#CBA153] text-[#080A0F] font-medium text-sm px-6 py-2.5 hover:bg-[#E1C07C] transition-all duration-300"
            data-testid="nav-cta-button"
          >
            Solicitar crédito
          </a>
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden p-2 text-[#F3F2ED]"
          onClick={() => setOpen((v) => !v)}
          data-testid="mobile-menu-toggle"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-[#080A0F] border-t border-white/10" data-testid="mobile-menu">
          <div className="px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base text-[#F3F2ED]/80"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="bg-[#CBA153] text-[#080A0F] font-medium text-sm px-6 py-3 text-center mt-2"
            >
              Solicitar crédito
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
