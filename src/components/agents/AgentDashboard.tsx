"use client";
import { useState } from "react";
import { Workspace, Panel, inputClass } from "./shared";
import { dateInZone, datesOverlap, isOpenStatus } from "@/lib/agent-workspace";
import { getStops, stopTime } from "./operations";

export default function AgentDashboard({ data, openOrder, navigate }: { data: Workspace; openOrder: (id: string) => void; navigate: (tab: string) => void }) {
  const today = dateInZone(new Date(), data.territories[0]?.markets.timezone);
  const [from, setFrom] = useState(today.slice(0, 7) + "-01"), [to, setTo] = useState(today);
  const offers = data.orders.filter(o => o.status === "offered" && isOpenStatus(o.bookings.status));
  const unread = data.messages.filter(m => m.direction === "customer" && !m.read_at);
  const stops = getStops(data), todayStops = stops.filter(s => s.date === dateInZone(new Date(), s.market?.timezone));
  const unscheduled = stops.filter(s => !s.scheduled);
  const period = data.orders.filter(o => datesOverlap(o.bookings.start_date, o.bookings.end_date, from, to));
  return <div className="space-y-6">
    <section className="agent-hero rounded-2xl bg-teal-900 p-6 text-white sm:p-8"><p className="text-teal-200 text-sm">Your local operations</p><h2 className="text-3xl font-bold mt-2">Hello, {data.agent.full_name.split(" ")[0]}.</h2><p className="mt-3 text-teal-100">Your next deliveries, customer replies and new assignments, together in one place.</p></section>
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">{[
      { label: "Awaiting acceptance", count: offers.length, tab: "Orders" },
      { label: "Unread replies", count: unread.length, tab: "Messages" },
      { label: "Today's stops", count: todayStops.length, tab: "Calendar" },
      { label: "Times to confirm", count: unscheduled.length, tab: "Manifest" },
    ].map(card => <button key={card.label} onClick={() => navigate(card.tab)} className="rounded-2xl border border-neutral-200 bg-white p-5 text-left hover:border-teal-500 transition-colors"><span className="text-3xl font-bold text-teal-800">{card.count}</span><span className="block mt-2 text-sm text-neutral-600">{card.label} <span aria-hidden>→</span></span></button>)}</div>
    <div className="grid gap-6 xl:grid-cols-2"><Panel title="Today's deliveries & collections">{todayStops.length ? todayStops.map(s => <button key={s.order.booking_id + s.kind} onClick={() => openOrder(s.order.booking_id)} className="w-full border-t border-neutral-200 py-3 text-left flex justify-between gap-4"><span><b className="capitalize">{s.kind}</b> · {s.order.bookings.booking_ref}<span className="block text-sm text-neutral-500">{s.order.bookings.products?.name} · {s.market?.name}</span></span><span className="text-sm text-teal-700">{stopTime(s)}</span></button>) : <p className="text-neutral-500 py-5">No stops due today. Your next accepted orders will appear in the calendar.</p>}<p className="text-xs text-neutral-500">Today is calculated in each city&apos;s time zone. Stops without an agreed time use the rental date.</p></Panel>
      <Panel title="Needs your attention">{offers.map(o => <button key={o.booking_id} className="block w-full text-left border-t border-neutral-200 py-3" onClick={() => openOrder(o.booking_id)}><b className="text-teal-800">Review assignment · {o.bookings.booking_ref}</b><span className="block text-sm text-neutral-500">{o.bookings.products?.name} · {o.bookings.start_date} → {o.bookings.end_date}</span></button>)}{unread.length > 0 && <button className="block text-teal-700 underline" onClick={() => navigate("Messages")}>Read {unread.length} customer {unread.length === 1 ? "reply" : "replies"}</button>}{data.messages.some(m => m.status === "failed" || m.status === "queued") && <button className="block text-amber-800 underline" onClick={() => navigate("Messages")}>Follow up on unsent customer emails</button>}{!offers.length && !unread.length && <p className="text-neutral-500 py-5">No pending offers or unread customer replies.</p>}</Panel></div>
    <Panel title="Order overview"><div className="flex flex-wrap gap-3"><label className="text-sm">Rental period from<input className={inputClass} type="date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)} /></label><label className="text-sm">To<input className={inputClass} type="date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)} /></label></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[["Assigned", period.length], ["Accepted", period.filter(o => o.status === "accepted").length], ["Completed", period.filter(o => o.status === "accepted" && o.bookings.status === "completed").length], ["Declined", period.filter(o => o.status === "declined").length]].map(([label, count]) => <div key={label} className="bg-neutral-50 rounded-lg p-4"><b className="text-2xl">{count}</b><p className="text-sm text-neutral-600">{label}</p></div>)}</div><p className="text-xs text-neutral-500">Assigned rentals overlapping the selected period, from your recent 300 orders.</p></Panel>
  </div>;
}
