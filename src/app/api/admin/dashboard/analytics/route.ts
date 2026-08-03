import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";

function formatMoney(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfPeriod(period: string) {
  const now = new Date();
  const end = startOfDay(now);
  const start = new Date(end);

  switch (period) {
    case "7d":
      start.setDate(end.getDate() - 6);
      break;
    case "30d":
      start.setDate(end.getDate() - 29);
      break;
    case "90d":
      start.setDate(end.getDate() - 89);
      break;
    case "1y":
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(end.getDate() - 89);
  }

  return { start, end };
}

function bucketLabel(date: Date, period: string) {
  if (period === "7d" || period === "30d") {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
  if (period === "90d") {
    return `${date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
  }
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function bucketSortKey(date: Date, period: string) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  if (period === "7d" || period === "30d" || period === "90d") {
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return `${year}-${month}`;
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "90d";
  const category = searchParams.get("category") || "all";
  const supabase = createAdminClient();

  const { start, end } = startOfPeriod(period);
  const startIso = start.toISOString();
  const endIso = end.toISOString();

  let query = supabase
    .from("bookings")
    .select(`
      id,
      booking_ref,
      status,
      total_cents,
      created_at,
      paid_at,
      product:products(id, name, subcategory, category:categories(id, name, slug))
    `)
    .gte("created_at", startIso)
    .lte("created_at", new Date().toISOString())
    .order("created_at", { ascending: true });

  if (category !== "all") {
    query = query.eq("product.category.slug", category);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data || []) as Array<{
    id: string;
    booking_ref: string;
    status: string;
    total_cents: number;
    created_at: string;
    paid_at: string | null;
    product?: {
      name?: string | null;
      subcategory?: string | null;
      category?: { name?: string | null; slug?: string | null } | null;
    } | null;
  }>;

  const filteredRows = rows.filter((row) => {
    const createdAt = new Date(row.created_at);
    return createdAt >= start && createdAt <= end;
  });

  const paidRows = filteredRows.filter((row) => Boolean(row.paid_at) || ["paid", "active", "delivering", "returning", "completed"].includes(row.status));

  const totalBookings = filteredRows.length;
  const paidRevenue = paidRows.reduce((sum, row) => sum + (row.total_cents || 0), 0);
  const averageBookingValue = totalBookings > 0 ? paidRevenue / totalBookings : 0;
  const completedBookings = filteredRows.filter((row) => ["completed", "active", "paid", "returning", "delivering"].includes(row.status)).length;

  const categoryMap = new Map<string, { name: string; revenue: number; bookings: number; products: Set<string> }>();
  const productMap = new Map<string, { name: string; revenue: number; bookings: number }>();
  const seriesMap = new Map<string, { label: string; bookings: number; revenue: number; subcategories: Map<string, { bookings: number; revenue: number }> }>();

  filteredRows.forEach((row) => {
    const createdAt = new Date(row.created_at);
    const sortKey = bucketSortKey(createdAt, period);
    const currentSeries = seriesMap.get(sortKey) || { label: bucketLabel(createdAt, period), bookings: 0, revenue: 0, subcategories: new Map<string, { bookings: number; revenue: number }>() };
    currentSeries.bookings += 1;
    currentSeries.revenue += row.total_cents || 0;
    const subcategoryName = row.product?.subcategory || row.product?.category?.name || "Uncategorized";
    const subcategoryEntry = currentSeries.subcategories.get(subcategoryName) || { bookings: 0, revenue: 0 };
    subcategoryEntry.bookings += 1;
    subcategoryEntry.revenue += row.total_cents || 0;
    currentSeries.subcategories.set(subcategoryName, subcategoryEntry);
    seriesMap.set(sortKey, currentSeries);

    const categoryName = row.product?.category?.name || "Uncategorized";
    const categoryKey = row.product?.category?.slug || categoryName;
    const categoryEntry = categoryMap.get(categoryKey) || { name: categoryName, revenue: 0, bookings: 0, products: new Set<string>() };
    categoryEntry.revenue += row.total_cents || 0;
    categoryEntry.bookings += 1;
    if (row.product?.name) categoryEntry.products.add(row.product.name);
    categoryMap.set(categoryKey, categoryEntry);

    const productName = row.product?.name || "Unknown";
    const productEntry = productMap.get(productName) || { name: productName, revenue: 0, bookings: 0 };
    productEntry.revenue += row.total_cents || 0;
    productEntry.bookings += 1;
    productMap.set(productName, productEntry);
  });

  const series = Array.from(seriesMap.entries())
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([, value]) => ({
      label: value.label,
      bookings: value.bookings,
      revenue: value.revenue,
      subcategories: Array.from(value.subcategories.entries())
        .map(([name, stat]) => ({ name, bookings: stat.bookings, revenue: stat.revenue }))
        .sort((left, right) => right.revenue - left.revenue),
    }));

  const categoryBreakdown = Array.from(categoryMap.values())
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, 6)
    .map((item) => ({
      name: item.name,
      bookings: item.bookings,
      revenue: item.revenue,
      products: item.products.size,
    }));

  const productBreakdown = Array.from(productMap.values())
    .sort((left, right) => right.revenue - left.revenue)
    .slice(0, 6)
    .map((item) => ({ name: item.name, bookings: item.bookings, revenue: item.revenue }));

  const insights: Array<{ title: string; detail: string }> = [];
  if (categoryBreakdown[0]) {
    insights.push({
      title: `${categoryBreakdown[0].name} is leading`,
      detail: `${categoryBreakdown[0].bookings} bookings and ${formatMoney(categoryBreakdown[0].revenue)} revenue make it the strongest segment. Protect stock and bundle it with slower movers.`,
    });
  }

  if (productBreakdown[0]) {
    insights.push({
      title: `${productBreakdown[0].name} deserves more attention`,
      detail: `This product drove ${formatMoney(productBreakdown[0].revenue)} across ${productBreakdown[0].bookings} bookings. Consider premium add-ons or keeping extra inventory available.`,
    });
  }

  if (averageBookingValue > 0) {
    insights.push({
      title: "Average booking value is healthy",
      detail: `Your average booking is ${formatMoney(Math.round(averageBookingValue))}. Use bundles and longer rentals to push value higher without adding too much operational friction.`,
    });
  }

  return NextResponse.json({
    period,
    range: {
      start: start.toISOString(),
      end: new Date().toISOString(),
    },
    totals: {
      bookings: totalBookings,
      paidRevenue,
      averageBookingValue,
      completedBookings,
    },
    series,
    categoryBreakdown,
    productBreakdown,
    insights,
  });
}
