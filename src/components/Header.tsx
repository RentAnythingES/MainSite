"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "Baby & Children", href: "/rental/baby-gear", emoji: "👶" },
  { name: "Mobility Aid", href: "/rental/mobility", emoji: "♿" },
  { name: "Remote Work", href: "/rental/remote-work", emoji: "💻" },
  { name: "Home & Living", href: "/rental/home-living", emoji: "🏠" },
  { name: "Travel & Outdoors", href: "/rental/travel-outdoors", emoji: "🏖️" },
  { name: "Pregnancy", href: "/rental/pregnancy", emoji: "🤰" },
];

const navLinks = [
  { name: "Valencia", href: "/valencia" },
  { name: "Discover", href: "/discover" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Blog", href: "/blog" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="container-site">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" id="header-logo">
            <span className="text-2xl font-bold font-[var(--font-outfit)]">
              <span className="text-brand">Rent</span>
              <span className="text-foreground">Anything</span>
              <span className="text-accent">.es</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav">
            {/* Browse Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBrowseOpen(true)}
              onMouseLeave={() => setBrowseOpen(false)}
            >
              <button
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-brand rounded-lg hover:bg-surface-muted transition-all duration-200"
                id="browse-button"
              >
                Browse ▾
              </button>
              {browseOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-border p-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-brand rounded-lg hover:bg-surface-muted transition-all duration-200"
                id={`nav-${link.href.slice(1)}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side: Language + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/es"
              className="px-2.5 py-1.5 text-xs font-semibold text-neutral-500 hover:text-brand border border-border rounded-md hover:border-brand transition-all"
              id="lang-switch"
            >
              ES 🇪🇸
            </Link>
            <Link
              href="/valencia"
              className="btn btn-primary btn-sm"
              id="header-cta"
            >
              Rent Now
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
                Categories
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
              <Link href="/es" className="px-3 py-2 text-sm font-medium text-neutral-500 border border-border rounded-md">
                ES 🇪🇸
              </Link>
              <Link href="/valencia" className="btn btn-primary btn-sm flex-1 text-center">
                Rent Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
