"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { seoCategoryClusters } from "@/data/seo-clusters";

const localizedRoutePairs = [
  {
    en: "/valencia/host-services",
    es: "/es/valencia/servicios-anfitriones",
  },
  {
    en: "/partners",
    es: "/es/colaboraciones",
  },
] as const;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const pathname = usePathname();
  const isSpanish = pathname.startsWith("/es");
  const prefix = isSpanish ? "/es" : "";
  const explicitLocalePair = localizedRoutePairs.find(
    (pair) => pair.en === pathname || pair.es === pathname,
  );
  const hasSpanishEquivalent =
    Boolean(explicitLocalePair) ||
    pathname === "/" ||
    pathname === "/valencia" ||
    pathname === "/blog" ||
    pathname === "/blog/best-beaches-valencia-families" ||
    pathname === "/blog/valencia-summer-survival-guide" ||
    pathname === "/blog/valencia-with-kids-complete-guide" ||
    pathname === "/blog/wheelchair-accessibility-valencia" ||
    pathname === "/blog/digital-nomad-guide-valencia" ||
    pathname === "/blog/best-day-trips-from-valencia" ||
    pathname === "/faq" ||
    pathname === "/how-it-works" ||
    pathname === "/refunds" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/cookies" ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/rental/");

  const switchLocaleHref = explicitLocalePair
    ? isSpanish
      ? explicitLocalePair.en
      : explicitLocalePair.es
    : isSpanish
      ? pathname.replace(/^\/es/, "") || "/"
      : hasSpanishEquivalent
        ? `/es${pathname === "/" ? "" : pathname}`
        : "/es";
  const switchLocaleLabel = isSpanish ? "EN 🇬🇧" : "ES 🇪🇸";

  const categories = seoCategoryClusters.map((category) => ({
    name: isSpanish ? category.nameEs : category.nameEn,
    href: `${prefix}/rental/${category.slug}`,
    emoji: category.emoji,
  }));

  const navLinks = [
    { name: "Kits", href: "/valencia/kits" },
    { name: "Valencia", href: `${prefix}/valencia` },
    { name: isSpanish ? "Descubrir" : "Discover", href: isSpanish ? "/discover" : "/discover" },
    { name: isSpanish ? "Cómo Funciona" : "How It Works", href: `${prefix}/how-it-works` },
    { name: isSpanish ? "Sobre Nosotros" : "About", href: `${prefix}/about` },
    { name: isSpanish ? "Preguntas" : "FAQ", href: `${prefix}/faq` },
    { name: "Blog", href: `${prefix}/blog` },
  ];

  const ctaLabel = isSpanish ? "Reservar" : "Rent Now";
  const ctaHref = `${prefix}/valencia`;
  const categoriesLabel = isSpanish ? "Categorías" : "Categories";
  const browseLabel = isSpanish ? "Explorar ▾" : "Browse ▾";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="container-site">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href={isSpanish ? "/es" : "/"} className="flex items-end gap-2.5 group" id="header-logo">
            <Image
              src="/brand/rentanything-icon.png"
              alt="RentAnything.es"
              width={36}
              height={36}
              priority
              className="h-8 w-8 md:h-9 md:w-9 object-contain"
            />
            <span className="text-[1.55rem] md:text-2xl leading-none font-bold font-[var(--font-outfit)] tracking-tight">
              <span className="text-brand">Rent</span>
              <span className="text-foreground">Anything</span>
              <span className="text-accent">.es</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav">
            <div
              className="relative"
              onMouseEnter={() => setBrowseOpen(true)}
              onMouseLeave={() => setBrowseOpen(false)}
            >
              <button
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-brand rounded-lg hover:bg-surface-muted transition-all duration-200"
                id="browse-button"
              >
                {browseLabel}
              </button>
              {browseOpen && (
                <div className="absolute top-full left-0 z-50 w-64 pt-1">
                  <div className="bg-white rounded-xl shadow-xl border border-border p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-muted transition-colors text-sm font-medium text-neutral-700 hover:text-brand"
                        id={`browse-${cat.href.split("/").pop()}`}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-brand rounded-lg hover:bg-surface-muted transition-all duration-200"
                id={`nav-${link.href.slice(1).replace(/\//g, "-") || "home"}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side: Language + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={switchLocaleHref}
              className="px-2.5 py-1.5 text-xs font-semibold text-neutral-500 hover:text-brand border border-border rounded-md hover:border-brand transition-all"
              id="lang-switch"
            >
              {switchLocaleLabel}
            </Link>
            <Link
              href={ctaHref}
              className="btn btn-primary btn-sm"
              id="header-cta"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-surface-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <svg
              className="w-6 h-6 text-neutral-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border py-4 animate-in slide-in-from-top-2 duration-200" id="mobile-nav">
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:text-brand hover:bg-surface-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-border pt-4 mb-4">
              <p className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                {categoriesLabel}
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:text-brand hover:bg-surface-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3 px-3">
              <Link href={switchLocaleHref} className="px-3 py-2 text-sm font-medium text-neutral-500 border border-border rounded-md">
                {switchLocaleLabel}
              </Link>
              <Link href={ctaHref} className="btn btn-primary btn-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>
                {ctaLabel}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
