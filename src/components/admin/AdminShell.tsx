"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Products", href: "/admin/products", icon: "📦" },
  { name: "Inventory", href: "/admin/inventory", icon: "#" },
  { name: "Availability", href: "/admin/availability", icon: "📅" },
  { name: "Fulfillment", href: "/admin/fulfillment", icon: "F" },
  { name: "Bookings", href: "/admin/bookings", icon: "📋" },
  { name: "Reviews", href: "/admin/reviews", icon: "★" },
  { name: "Invoicing", href: "/admin/invoicing", icon: "🧾" },
];

export default function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [schemaWarning, setSchemaWarning] = useState(false);

  useEffect(() => {
    fetch("/api/admin/health")
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => {
        const migrations = data?.migrations as Record<string, boolean> | undefined;
        setSchemaWarning(Boolean(migrations && Object.values(migrations).some((ready) => !ready)));
      })
      .catch(() => setSchemaWarning(true));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-5 border-b border-neutral-800">
          <Link href="/admin" className="text-lg font-bold font-[var(--font-outfit)]">
            <span className="text-teal-400">Rent</span>
            <span className="text-white">Anything</span>
            <span className="text-amber-400">.es</span>
          </Link>
          <p className="text-xs text-neutral-500 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-500/10 text-teal-400"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-base">🚪</span>
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors mt-1"
          >
            <span className="text-base">🌐</span>
            View Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl">
          {schemaWarning && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              <span>Some backend features are unavailable because the production database is missing required schema.</span>
              <Link href="/admin" className="font-semibold text-amber-200 underline underline-offset-2 hover:text-white">Review system readiness</Link>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
