import { createAdminClient } from "@/lib/supabase-admin";
import AdminSystemHealth from "@/components/AdminSystemHealth";
import AdminDashboardAnalytics from "@/components/admin/AdminDashboardAnalytics";

async function getStats() {
  try {
    const supabase = createAdminClient();

    const [productsRes, bookingsRes, activeBookingsRes, revenueRes] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("bookings").select("total_cents").in("status", ["paid", "active", "delivering", "returning", "completed"]),
    ]);

    const paidRevenue = (revenueRes.data || []).reduce((sum: number, row: { total_cents?: number | null }) => sum + (row.total_cents || 0), 0);

    return {
      totalProducts: productsRes.count || 0,
      totalBookings: bookingsRes.count || 0,
      activeBookings: activeBookingsRes.count || 0,
      paidRevenue,
    };
  } catch {
    return { totalProducts: 0, totalBookings: 0, activeBookings: 0, paidRevenue: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Active Products", value: stats.totalProducts, icon: "📦", color: "teal" },
    { label: "Total Bookings", value: stats.totalBookings, icon: "📋", color: "amber" },
    { label: "Active Bookings", value: stats.activeBookings, icon: "🔥", color: "rose" },
    { label: "Paid Revenue", value: `€${(stats.paidRevenue / 100).toFixed(0)}`, icon: "💶", color: "emerald" },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">RentAnything.es — Admin Overview</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Business performance</h2>
            <p className="text-sm text-neutral-500">Filter by time period and category to review bookings, revenue, and growth opportunities.</p>
          </div>
          <div className="rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Live data</div>
        </div>
        <AdminDashboardAnalytics />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <a
            href="/admin/products"
            className="flex items-center gap-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <span className="text-xl">📦</span>
            <div>
              <p className="text-sm font-medium text-white">Manage Products</p>
              <p className="text-xs text-neutral-500">Edit prices, stock, descriptions</p>
            </div>
          </a>
          <a
            href="/admin/availability"
            className="flex items-center gap-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <span className="text-xl">📅</span>
            <div>
              <p className="text-sm font-medium text-white">Availability</p>
              <p className="text-xs text-neutral-500">Block dates, view calendar</p>
            </div>
          </a>
          <a
            href="/admin/bookings"
            className="flex items-center gap-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <span className="text-xl">📋</span>
            <div>
              <p className="text-sm font-medium text-white">View Bookings</p>
              <p className="text-xs text-neutral-500">Review and manage orders</p>
            </div>
          </a>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            <span className="text-xl">🌐</span>
            <div>
              <p className="text-sm font-medium text-white">View Live Site</p>
              <p className="text-xs text-neutral-500">rentanything.es</p>
            </div>
          </a>
        </div>
      </div>

      <AdminSystemHealth />
    </>
  );
}
