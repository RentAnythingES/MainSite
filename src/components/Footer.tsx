"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { seoCategoryClusters } from "@/data/seo-clusters";

export default function Footer() {
  const pathname = usePathname();
  const isSpanish = pathname.startsWith("/es");
  const prefix = isSpanish ? "/es" : "";

  const footerLinks = {
    [isSpanish ? "Información" : "Info & Help"]: [
      { name: isSpanish ? "Cómo Funciona" : "How It Works", href: "/how-it-works" },
      { name: isSpanish ? "Descubrir Valencia" : "Discover Valencia", href: "/discover" },
      { name: isSpanish ? "Sobre Nosotros" : "About Us", href: "/about" },
      { name: isSpanish ? "Preguntas Frecuentes" : "FAQ", href: "/faq" },
      {
        name: isSpanish ? "Servicios para Anfitriones" : "Host Services",
        href: isSpanish
          ? "/es/valencia/servicios-anfitriones"
          : "/valencia/host-services",
      },
      { name: "Blog", href: `${prefix}/blog` },
      { name: isSpanish ? "Contacto" : "Contact", href: "/contact" },
    ],
    [isSpanish ? "Categorías" : "Categories"]: [
      { name: "Kits", href: "/valencia/kits" },
      ...seoCategoryClusters.map((category) => ({
        name: isSpanish ? category.nameEs : category.nameEn,
        href: `${prefix}/rental/${category.slug}`,
      })),
    ],
    [isSpanish ? "Ciudades" : "Cities"]: [
      { name: "Valencia", href: `${prefix}/valencia` },
      { name: "Barcelona", href: "#", disabled: true },
      { name: "Madrid", href: "#", disabled: true },
    ],
  };

  const legalLinks = [
    { name: isSpanish ? "Privacidad" : "Privacy Policy", href: "/privacy" },
    { name: "Cookies", href: "/cookies" },
    { name: isSpanish ? "Condiciones" : "T&Cs", href: "/terms" },
    { name: isSpanish ? "Devoluciones" : "Refunds & Cancellations", href: "/refunds" },
    { name: "Hojas de Reclamaciones", href: "https://www.hojasderereclamaciones.com/", external: true },
  ];

  const tagline = isSpanish
    ? "Viaja ligero, disfruta de todo. Equipos de alquiler de primera calidad entregados en tu alojamiento en Valencia."
    : "Travel light. Feel at home. Practical rental kits and individual items delivered in Valencia.";

  const soonLabel = isSpanish ? "Pronto" : "Soon";

  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-auto" id="site-footer">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href={isSpanish ? "/es" : "/"} className="inline-block mb-4">
              <span className="text-2xl font-bold font-[var(--font-outfit)]">
                <span className="text-brand-light">Rent</span>
                <span className="text-white">Anything</span>
                <span className="text-accent">.es</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              {tagline}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/rentanything.es"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-brand flex items-center justify-center transition-colors"
                aria-label="Instagram"
                id="footer-instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/rentanything.es"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-brand flex items-center justify-center transition-colors"
                aria-label="Facebook"
                id="footer-facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/34684708013?text=Hi!%20I%27m%20interested%20in%20renting%20equipment%20in%20Valencia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-[#25D366] flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
                id="footer-whatsapp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    {"disabled" in link && link.disabled ? (
                      <span className="text-sm text-neutral-600 flex items-center gap-1.5">
                        {link.name}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-500 font-medium">
                          {soonLabel}
                        </span>
                      </span>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-400 hover:text-brand-light transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} RentAnything.es — Escalera Labs S.L.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={"external" in link ? "_blank" : undefined}
                  rel={"external" in link ? "noopener noreferrer" : undefined}
                  className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
