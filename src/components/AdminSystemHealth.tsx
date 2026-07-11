"use client";

import { useEffect, useState } from "react";

type MigrationStatus = {
  bookingCoreReady: boolean;
  bookingOpsReady: boolean;
  financeReady: boolean;
  productContentReady: boolean;
};

const CHECKS: Array<{ key: keyof MigrationStatus; label: string; description: string }> = [
  { key: "bookingCoreReady", label: "Booking foundation", description: "Drafts and inventory holds" },
  { key: "bookingOpsReady", label: "Operations checklist", description: "Booking handover tasks" },
  { key: "financeReady", label: "Finance records", description: "Payment ledger and documents" },
  { key: "productContentReady", label: "Product review", description: "Editorial copy, FAQs and image rights" },
];

export default function AdminSystemHealth() {
  const [migrations, setMigrations] = useState<MigrationStatus | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/health")
      .then(async (response) => {
        if (!response.ok) throw new Error("Health check failed");
        return response.json();
      })
      .then((data) => setMigrations(data.migrations))
      .catch(() => setError(true));
  }, []);

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mt-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">System readiness</h2>
          <p className="text-sm text-neutral-500 mt-1">Checks the database support behind operational tools.</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          migrations && CHECKS.every((check) => migrations[check.key])
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-amber-500/10 text-amber-300"
        }`}>
          {migrations && CHECKS.every((check) => migrations[check.key]) ? "All ready" : "Review needed"}
        </span>
      </div>

      {error ? (
        <p className="text-sm text-red-300">Could not run system checks. Refresh the page and try again.</p>
      ) : !migrations ? (
        <p className="text-sm text-neutral-500">Checking database readiness…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {CHECKS.map((check) => {
            const ready = migrations[check.key];
            return (
              <div key={check.key} className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-neutral-200">{check.label}</p>
                  <span className={`text-xs font-medium ${ready ? "text-emerald-400" : "text-amber-300"}`}>
                    {ready ? "Ready" : "Migration needed"}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{check.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
