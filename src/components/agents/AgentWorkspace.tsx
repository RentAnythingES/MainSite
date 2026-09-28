"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AgentProfile from "./AgentProfile";
import AgentOrder from "./AgentOrder";
import AgentDashboard from "./AgentDashboard";
import AgentCalendar from "./AgentCalendar";
import AgentInbox from "./AgentInbox";
import { AgentDrivers, AgentManifest, AgentSupport } from "./AgentOperations";
import { Workspace, api, inputClass, Panel } from "./shared";
import { datesOverlap, isOpenStatus } from "@/lib/agent-workspace";

const sections = ["Dashboard", "Orders", "Calendar", "Messages", "Manifest", "Drivers", "Activity", "Profile", "Support"];
export default function AgentWorkspace({ initialData }: { initialData?: Workspace }) {
  const [data, setData] = useState<Workspace | null>(initialData || null);
  const [error, setError] = useState(""), [notice, setNotice] = useState(""), [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("Dashboard"), [filter, setFilter] = useState("open"), [search, setSearch] = useState("");
  const [city, setCity] = useState(""), [from, setFrom] = useState(""), [to, setTo] = useState(""), [sort, setSort] = useState("soonest");
  const [selectedId, setSelectedId] = useState(""), [updatedAt, setUpdatedAt] = useState("");
  async function load() {
    const response = await fetch("/api/agent/workspace", { cache: "no-store" });
    if (response.status === 401) { window.location.replace("/agent/login"); return; }
    const result = await response.json(); if (!response.ok) throw new Error(result.error);
    setData(result); setUpdatedAt(new Date().toLocaleTimeString());
  }
  useEffect(() => {
    if (initialData) return;
    let disposed = false, fetching = false;
    async function refresh() {
      if (fetching || document.visibilityState === "hidden") return;
      fetching = true;
      try {
        const response = await fetch("/api/agent/workspace", { cache: "no-store" });
        if (disposed) return;
        if (response.status === 401) { window.location.replace("/agent/login"); return; }
        const result = await response.json(); if (!response.ok) throw new Error(result.error);
        if (!disposed) { setData(result); setUpdatedAt(new Date().toLocaleTimeString()); }
      } catch (e) { if (!disposed) setError((e as Error).message); }
      finally { fetching = false; }
    }
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60000);
    document.addEventListener("visibilitychange", refresh);
    return () => { disposed = true; window.clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, [initialData]);
  async function send(path: string, body: Record<string, unknown>, method = "POST") {
    setBusy(true); setError(""); setNotice(""); let success = false;
    try { const result = await api(path, body, method); if (body.action !== "read_messages") setNotice(result.warning || "Saved successfully."); success = true; }
    catch (e) { setError((e as Error).message); }
    try { await load(); } catch (e) { setError((e as Error).message); }
    setBusy(false); return success;
  }
  const save = (body: Record<string, unknown>) => send("/api/agent/workspace", body);
  const act = (body: Record<string, unknown>) => send("/api/agent/orders", body);
  const openOrder = (id: string) => { setSelectedId(id); setTab("Orders"); };
  const navigate = (next: string) => { setTab(next); setSelectedId(""); };
  const ready = data && !data.agent.must_change_password && !!data.agent.profile_completed_at;
  const unread = data?.messages.filter(m => m.direction === "customer" && !m.read_at).length || 0;
  const offers = data?.orders.filter(o => o.status === "offered" && isOpenStatus(o.bookings.status)).length || 0;
  const selected = data?.orders.find(o => o.booking_id === selectedId);
  const orders = data?.orders.filter(o =>
    (filter === "all" || (filter === "open" ? isOpenStatus(o.bookings.status) && o.status !== "declined" : ["offered", "accepted", "declined"].includes(filter) ? o.status === filter : o.bookings.status === filter)) &&
    (!city || city === o.bookings.market_id) && datesOverlap(o.bookings.start_date, o.bookings.end_date, from, to) &&
    `${o.bookings.booking_ref} ${o.bookings.products?.name || ""} ${o.bookings.customer_name || ""}`.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => sort === "latest" ? b.bookings.start_date.localeCompare(a.bookings.start_date) : a.bookings.start_date.localeCompare(b.bookings.start_date)) || [];
  return <div className="agent-workspace min-h-screen bg-neutral-50 lg:grid lg:grid-cols-[230px_minmax(0,1fr)]">
    <aside className="bg-white border-neutral-200 border-b lg:border-r lg:border-b-0 p-4 lg:p-6 print:hidden">
      <div className="lg:sticky lg:top-6"><Link href="/" className="font-bold text-2xl text-teal-800">Rentandroll</Link><p className="text-xs uppercase tracking-widest text-neutral-400 mt-1 mb-6">Partner workspace</p>
      <nav aria-label="Agent workspace sections" className="flex overflow-x-auto gap-2 lg:flex-col lg:overflow-visible">{sections.map(section => <button disabled={!ready && section !== "Profile" && section !== "Support"} key={section} onClick={() => navigate(section)} aria-current={(ready ? tab : "Profile") === section ? "page" : undefined} className={`whitespace-nowrap flex justify-between items-center gap-3 rounded-xl px-4 py-3 text-sm text-left disabled:opacity-40 ${(ready ? tab : "Profile") === section ? "bg-teal-50 text-teal-800 font-semibold" : "text-neutral-600 hover:bg-neutral-50"}`}>{section}{((section === "Messages" && unread > 0) || (section === "Orders" && offers > 0)) && <span className="rounded-full bg-teal-700 text-white px-2 text-xs">{section === "Messages" ? unread : offers}</span>}</button>)}</nav>
      <div className="hidden lg:block mt-8 pt-5 border-t border-neutral-200"><p className="font-medium text-sm">{data?.agent.full_name}</p><p className="text-xs text-neutral-500 mt-2">{data?.territories.map(t => `${t.markets.name}, ${t.markets.country_code}`).join(" · ")}</p><Link href="/" className="inline-block mt-4 text-sm text-teal-700 underline">Visit website</Link></div></div>
    </aside>
    <section className="min-w-0 p-4 sm:p-6 xl:p-9 space-y-6 max-w-[1500px] w-full mx-auto">
      <header className="flex flex-wrap justify-between gap-4 print:hidden"><div><h1 className="text-3xl font-bold">{ready ? tab : "Welcome to your workspace"}</h1><p className="text-sm text-neutral-500 mt-2">{updatedAt ? `Updated ${updatedAt} · Refreshes every minute` : "Your assigned cities, customers and operations"}</p></div><div className="flex items-center gap-4 text-sm"><button disabled={busy} className="rounded-lg border border-neutral-200 bg-white px-4 py-2" onClick={() => void load().catch(e => setError(e.message))}>Refresh</button><button className="underline text-neutral-600" onClick={async () => { try { await api("/api/agent/session", undefined, "DELETE"); window.location.replace("/agent/login"); } catch (e) { setError((e as Error).message); } }}>Sign out</button></div></header>
      {error && <p role="alert" className="rounded-xl bg-red-50 text-red-800 p-4">{error}</p>}{notice && <p role="status" className="text-teal-700 print:hidden">{notice}</p>}
      {!data ? <Panel title="Loading your workspace"><p>Your assigned orders and city coverage are being loaded.</p></Panel> : <>
        {!ready && <p className="rounded-xl bg-amber-50 text-amber-900 p-4">Replace your temporary password and complete your profile to unlock orders and customer information.</p>}
        {(!ready || tab === "Profile") && <AgentProfile agent={data.agent} busy={busy} save={save} changePassword={body => send("/api/agent/session", body, "PATCH")} />}
        {ready && tab === "Dashboard" && <AgentDashboard data={data} openOrder={openOrder} navigate={navigate} />}
        {ready && tab === "Calendar" && <AgentCalendar data={data} busy={busy} save={save} openOrder={openOrder} />}
        {ready && tab === "Messages" && <AgentInbox data={data} busy={busy} send={act} markRead={ids => save({ action: "read_messages", ids })} openOrder={openOrder} />}
        {ready && tab === "Manifest" && <AgentManifest data={data} openOrder={openOrder} />}
        {ready && tab === "Drivers" && <AgentDrivers data={data} busy={busy} save={save} />}
        {tab === "Support" && <AgentSupport />}
        {ready && tab === "Orders" && (selected ? <><button className="text-sm text-teal-700 underline" onClick={() => setSelectedId("")}>← Back to orders</button><AgentOrder key={selected.booking_id} order={selected} market={data.territories.find(t => t.market_id === selected.bookings.market_id)?.markets} drivers={data.drivers} messages={data.messages.filter(m => m.booking_id === selected.booking_id)} events={data.events.filter(e => e.booking_id === selected.booking_id)} busy={busy} act={act} /></> : <>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><label className="sm:col-span-2 text-sm">Search orders<input className={inputClass} value={search} onChange={e => setSearch(e.target.value)} placeholder="Reference, product or customer" /></label><label className="text-sm">City<select className={inputClass} value={city} onChange={e => setCity(e.target.value)}><option value="">All cities</option>{data.territories.map(t => <option key={t.market_id} value={t.market_id}>{t.markets.name}</option>)}</select></label><label className="text-sm">Sort<select className={inputClass} value={sort} onChange={e => setSort(e.target.value)}><option value="soonest">Rental start: earliest first</option><option value="latest">Rental start: latest first</option></select></label><label className="text-sm">Rental period from<input className={inputClass} type="date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)} /></label><label className="text-sm">To<input className={inputClass} type="date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)} /></label></div><div className="flex flex-wrap gap-2" aria-label="Order status filters">{[["open", "Open"], ["offered", "New offers"], ["accepted", "Accepted"], ["delivering", "Delivering"], ["active", "With customer"], ["returning", "Collecting"], ["completed", "Completed"], ["declined", "Declined"], ["all", "All"]].map(([value, label]) => <button key={value} aria-pressed={filter === value} className={`rounded-full border px-3 py-1.5 text-sm ${filter === value ? "bg-teal-800 text-white border-teal-800" : "text-neutral-600"}`} onClick={() => setFilter(value)}>{label}</button>)}</div></div>
          <p className="text-xs text-neutral-500">{orders.length} matching orders · Recent 300 assignments</p><div className="grid gap-4 xl:grid-cols-2">{orders.map(o => <button key={o.booking_id} className="rounded-2xl border border-neutral-200 bg-white p-5 text-left hover:border-teal-500" onClick={() => openOrder(o.booking_id)}><div className="flex justify-between gap-3"><b>{o.bookings.booking_ref}</b><span className={`text-xs px-2 py-1 rounded-full ${o.status === "offered" ? "bg-amber-100 text-amber-900" : "bg-teal-50 text-teal-800"}`}>{o.status === "accepted" ? o.bookings.status : o.status}</span></div><h2 className="text-lg font-semibold mt-4">{o.bookings.products?.name || "Rental"}</h2><p className="text-sm text-neutral-600 mt-2">{o.bookings.quantity} item(s) · {o.bookings.start_date} → {o.bookings.end_date}</p><p className="text-sm text-neutral-500 mt-2">{data.territories.find(t => t.market_id === o.bookings.market_id)?.markets.name} · {o.bookings.customer_name || "Customer details after acceptance"}</p><span className="block text-sm text-teal-700 mt-4">Open order →</span></button>)}</div>{!orders.length && <Panel title="No matching orders"><p>New assignments appear here when the admin assigns orders in your cities.</p></Panel>}
        </>)}
        {ready && tab === "Activity" && <Panel title="Recent order activity">{data.events.length ? data.events.map(e => <button key={e.id} onClick={() => openOrder(e.booking_id)} className="block w-full text-left border-t border-neutral-200 py-3"><b>{data.orders.find(o => o.booking_id === e.booking_id)?.bookings.booking_ref} · {e.action.replaceAll("_", " ")}</b><p className="text-sm text-neutral-600 whitespace-pre-wrap">{e.note}</p><time className="text-xs text-neutral-500">{new Date(e.created_at).toLocaleString()}</time></button>) : <p className="text-neutral-500">Accepted-order updates and internal notes will appear here.</p>}</Panel>}
      </>}
    </section>
    <style>{`.agent-workspace h1 { font-size: 1.875rem; line-height: 1.2; } .agent-workspace h2 { font-size: 1.2rem; line-height: 1.4; } .agent-workspace .agent-hero h2 { font-size: 2rem; } @media print { body * { visibility: hidden; } .agent-print-manifest, .agent-print-manifest * { visibility: visible; } .agent-print-manifest { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
  </div>;
}
