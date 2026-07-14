"use client";

import { useEffect, useState } from "react";

type MigrationStatus = {
  bookingCoreReady: boolean;
  bookingOpsReady: boolean;
  financeReady: boolean;
  productContentReady: boolean;
};

type IncidentStatus = {
  available: boolean;
  unresolvedCount: number | null;
  latest: Array<{
    id: string;
    source: string;
    severity: string;
    event_type: string;
    message: string;
    created_at: string;
  }>;
};

type HealthResponse = {
  migrations: MigrationStatus;
  incidents: IncidentStatus;
  stripe: {
    configured: boolean;
    webhookSecretConfigured: boolean;
    publishableKeyConfigured: boolean;
  };
  monitoring: { available: boolean; cronSecretConfigured: boolean; latest: { status: string; created_at: string } | null };
};

const CHECKS: Array<{ key: keyof MigrationStatus; label: string; description: string }> = [
  { key: "bookingCoreReady", label: "Booking foundation", description: "Drafts and inventory holds" },
  { key: "bookingOpsReady", label: "Operations checklist", description: "Booking handover tasks" },
  { key: "financeReady", label: "Finance records", description: "Payment ledger and documents" },
  { key: "productContentReady", label: "Product review", description: "Editorial copy, FAQs and image rights" },
];

export default function AdminSystemHealth() {
  const [migrations, setMigrations] = useState<MigrationStatus | null>(null);
  const [incidents, setIncidents] = useState<IncidentStatus | null>(null);
  const [stripeReady, setStripeReady] = useState<boolean | null>(null);
  const [monitoring, setMonitoring] = useState<HealthResponse["monitoring"] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/health")
      .then(async (response) => {
        if (!response.ok) throw new Error("Health check failed");
        return response.json();
      })
      .then((data: HealthResponse) => {
        setMigrations(data.migrations);
        setIncidents(data.incidents);
        setMonitoring(data.monitoring);
        setStripeReady(
          data.stripe.configured &&
          data.stripe.webhookSecretConfigured &&
          data.stripe.publishableKeyConfigured
        );
      })
      .catch(() => setError(true));
  }, []);

  const allReady = Boolean(
    migrations &&
    CHECKS.every((check) => migrations[check.key]) &&
    incidents?.available &&
    stripeReady &&
    incidents.unresolvedCount === 0
  );

  async function resolveIncident(id: string) {
    const response = await fetch(`/api/admin/incidents/${id}`, { method: "PATCH" });
    if (!response.ok) return;
    setIncidents((current) => current ? {
      ...current,
      unresolvedCount: Math.max(0, (current.unresolvedCount || 0) - 1),
      latest: current.latest.filter((incident) => incident.id !== id),
    } : current);
  }

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mt-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">System readiness</h2>
          <p className="text-sm text-neutral-500 mt-1">Checks payment configuration and operational data support.</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          allReady ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-300"
        }`}>
          {allReady ? "All ready" : "Review needed"}
        </span>
      </div>

      {error ? (
        <p className="text-sm text-red-300">Could not run system checks. Refresh the page and try again.</p>
      ) : !migrations ? (
        <p className="text-sm text-neutral-500">Checking system readiness…</p>
      ) : (
        <>
          {incidents?.available && typeof incidents.unresolvedCount === "number" && incidents.unresolvedCount > 0 && (
            <div className="mb-4 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3">
              <p className="text-sm font-medium text-red-300">
                {incidents.unresolvedCount} unresolved payment or booking incident{incidents.unresolvedCount === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-xs text-red-300/70">Review the incident records before accepting more payments.</p>
              <div className="mt-3 space-y-2">
                {incidents.latest.map((incident) => (
                  <div key={incident.id} className="flex flex-col gap-2 rounded-md border border-red-900/70 bg-neutral-950/60 p-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-300/80">{incident.source} · {incident.event_type}</p>
                      <p className="mt-1 text-sm text-neutral-200">{incident.message}</p>
                      <p className="mt-1 text-xs text-neutral-500">{new Date(incident.created_at).toLocaleString()}</p>
                    </div>
                    <button type="button" onClick={() => resolveIncident(incident.id)} className="shrink-0 rounded-md border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">
                      Mark resolved
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <HealthCard
              label="Stripe configuration"
              description="Checkout, publishable key and webhook signing"
              ready={Boolean(stripeReady)}
              failureLabel="Check settings"
              critical
            />
            <HealthCard
              label="Incident monitoring"
              description="Persistent payment and webhook failure records"
              ready={Boolean(incidents?.available)}
              failureLabel="Migration needed"
            />
            <HealthCard
              label="Scheduled monitoring"
              description={monitoring?.latest ? `Last run ${new Date(monitoring.latest.created_at).toLocaleString()} — ${monitoring.latest.status}` : "Daily production health and alert emails"}
              ready={Boolean(monitoring?.available && monitoring.cronSecretConfigured)}
              failureLabel={monitoring?.available ? "Add CRON_SECRET" : "Migration needed"}
            />
            {CHECKS.map((check) => (
              <HealthCard
                key={check.key}
                label={check.label}
                description={check.description}
                ready={migrations[check.key]}
                failureLabel="Migration needed"
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function HealthCard({
  label,
  description,
  ready,
  failureLabel,
  critical = false,
}: {
  label: string;
  description: string;
  ready: boolean;
  failureLabel: string;
  critical?: boolean;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-neutral-200">{label}</p>
        <span className={`text-xs font-medium ${ready ? "text-emerald-400" : critical ? "text-red-300" : "text-amber-300"}`}>
          {ready ? "Ready" : failureLabel}
        </span>
      </div>
      <p className="text-xs text-neutral-500 mt-1">{description}</p>
    </div>
  );
}
