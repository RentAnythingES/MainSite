"use client";

import { useEffect, useMemo, useState } from "react";

interface SubcategoryBreakdownItem {
  name: string;
  bookings: number;
  revenue: number;
}

interface AnalyticsPoint {
  label: string;
  bookings: number;
  revenue: number;
  subcategories: SubcategoryBreakdownItem[];
}

interface CategoryBreakdownItem {
  name: string;
  bookings: number;
  revenue: number;
  products: number;
}

interface ProductBreakdownItem {
  name: string;
  bookings: number;
  revenue: number;
}

interface Insight {
  title: string;
  detail: string;
}

interface AnalyticsResponse {
  period: string;
  totals: {
    bookings: number;
    paidRevenue: number;
    averageBookingValue: number;
    completedBookings: number;
  };
  series: AnalyticsPoint[];
  categoryBreakdown: CategoryBreakdownItem[];
  productBreakdown: ProductBreakdownItem[];
  insights: Insight[];
}

function formatMoney(cents: number) {
  return `€${(cents / 100).toFixed(0)}`;
}

export default function AdminDashboardAnalytics() {
  const [period, setPeriod] = useState("90d");
  const [category, setCategory] = useState("all");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`/api/admin/dashboard/analytics?period=${period}&category=${category}`)
      .then((response) => response.json())
      .then((payload) => {
        if (!ignore) setData(payload);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [period, category]);

  useEffect(() => {
    setSelectedPoint(null);
    setHoveredPoint(null);
  }, [period, category]);

  const maxRevenue = useMemo(() => {
    if (!data?.series?.length) return 1;
    return Math.max(...data.series.map((point) => point.revenue), 1);
  }, [data]);

  const activeLabel = hoveredPoint || selectedPoint;
  const activePointData = data?.series.find((point) => point.label === activeLabel) || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
        <div className="text-sm font-semibold text-white">Slicers</div>
        <select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white">
          <option value="all">All categories</option>
          <option value="mobility">Mobility</option>
          <option value="kids-family">Kids & family</option>
          <option value="baby-gear">Baby gear</option>
          <option value="beach">Beach</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 text-sm text-neutral-500">Loading performance insights…</div>
      ) : !data ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-300">Could not load analytics right now.</div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Bookings</p>
              <p className="mt-2 text-2xl font-semibold text-white">{data.totals.bookings}</p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Paid revenue</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">{formatMoney(data.totals.paidRevenue)}</p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Average booking</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatMoney(data.totals.averageBookingValue)}</p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">Completed or active</p>
              <p className="mt-2 text-2xl font-semibold text-teal-300">{data.totals.completedBookings}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Interactive revenue and booking bars</p>
              <p className="text-xs text-neutral-500">Oldest to newest, left to right · hover or click a bar to inspect the period</p>
            </div>
            <div className="flex items-end gap-2 overflow-x-auto">
              {data.series.map((point) => {
                const active = selectedPoint === point.label || hoveredPoint === point.label;
                const bookingsHeight = Math.max(16, (point.bookings / Math.max(1, Math.max(...data.series.map((item) => item.bookings)))) * 100);
                const revenueHeight = Math.max(16, (point.revenue / maxRevenue) * 100);
                return (
                  <button
                    key={point.label}
                    type="button"
                    onClick={() => setSelectedPoint(selectedPoint === point.label ? null : point.label)}
                    onMouseEnter={() => setHoveredPoint(point.label)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onFocus={() => setHoveredPoint(point.label)}
                    onBlur={() => setHoveredPoint(null)}
                    className={`relative flex min-w-[82px] flex-1 flex-col items-center gap-2 rounded-xl border p-2 text-left transition-colors ${active ? "border-sky-500/50 bg-sky-500/10" : "border-transparent bg-neutral-900/60 hover:border-neutral-700"}`}
                  >
                    <div className="flex h-40 w-full items-end gap-1 rounded-xl border border-neutral-800 bg-neutral-900/70 p-2">
                      <div className="relative flex h-full flex-1 flex-col justify-end">
                        <div className="mb-1 text-center text-[10px] font-semibold text-sky-300">{point.bookings}</div>
                        <div className="rounded-t-lg bg-sky-600" style={{ height: `${bookingsHeight}%` }} />
                      </div>
                      <div className="relative flex h-full flex-1 flex-col justify-end">
                        <div className="mb-1 text-center text-[10px] font-semibold text-slate-200">{formatMoney(point.revenue)}</div>
                        <div className="rounded-t-lg bg-slate-800" style={{ height: `${revenueHeight}%` }} />
                      </div>
                    </div>
                    <div className="text-center text-[11px] text-neutral-500">
                      <div className="font-semibold text-neutral-300">{point.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sky-600" /> bookings</span>
              <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-800" /> revenue</span>
            </div>
            {activePointData ? (
              <div className="mt-4 rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{activePointData.label}</p>
                  {selectedPoint === activeLabel && (
                    <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300">Pinned · click bar again to close</span>
                  )}
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-2">
                    <p className="text-[11px] uppercase tracking-wide text-neutral-500">Total bookings</p>
                    <p className="mt-1 text-lg font-semibold text-sky-300">{activePointData.bookings}</p>
                  </div>
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-2">
                    <p className="text-[11px] uppercase tracking-wide text-neutral-500">Total revenue</p>
                    <p className="mt-1 text-lg font-semibold text-white">{formatMoney(activePointData.revenue)}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-neutral-500">By subcategory</p>
                  {activePointData.subcategories.length ? (
                    <div className="overflow-hidden rounded-lg border border-neutral-800">
                      <div className="grid grid-cols-[1fr_auto_auto] gap-2 bg-neutral-900/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                        <span>Subcategory</span>
                        <span className="text-right">Bookings</span>
                        <span className="text-right">Revenue</span>
                      </div>
                      <div className="divide-y divide-neutral-800">
                        {activePointData.subcategories.map((item) => (
                          <div key={item.name} className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 py-1.5 text-xs">
                            <span className="truncate text-neutral-200">{item.name}</span>
                            <span className="text-right text-sky-300">{item.bookings}</span>
                            <span className="text-right font-medium text-white">{formatMoney(item.revenue)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-600">No subcategory data for this period.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-neutral-800 p-3 text-center text-xs text-neutral-600">Hover or click a bar to see its subcategory breakdown here</div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
              <p className="mb-3 text-sm font-semibold text-white">Best-performing categories</p>
              <div className="space-y-2">
                {data.categoryBreakdown.map((item) => (
                  <div key={item.name} className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{item.name}</span>
                      <span className="text-sm font-semibold text-emerald-300">{formatMoney(item.revenue)}</span>
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">{item.bookings} bookings · {item.products} products in focus</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
              <p className="mb-3 text-sm font-semibold text-white">Helpful insights</p>
              <div className="space-y-2">
                {data.insights.map((insight) => (
                  <div key={insight.title} className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-2">
                    <p className="text-sm font-semibold text-white">{insight.title}</p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">{insight.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
