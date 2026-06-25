import { createAdminClient } from "@/lib/supabase-admin";

async function getStats() {
  try {
    const supabase = createAdminClient();

    const [productsRes, bookingsRes, activeBookingsRes] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("id", { count: "exact", head: true }).in("status", ["pending", "confirmed", "paid", "active"]),
    ]);

    return {
      totalProducts: productsRes.count || 0,
      totalBookings: bookingsRes.count || 0,
      activeBookings: activeBookingsRes.count || 0,
    };
  } catch {
    return { totalProducts: 0, totalBookings: 0, activeBookings: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Active Products", value: stats.totalProducts, icon: "📦", color: "teal" },
    { label: "Total Bookings", value: stats.totalBookings, icon: "📋", color: "amber" },
    { label: "Active Bookings", value: stats.activeBookings, icon: "🔥", color: "rose" },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">RentAnything.es — Admin Overview</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
    </>
  );
}
