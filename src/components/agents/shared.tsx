"use client";
import type { FormEvent, ReactNode } from "react";

export const inputClass = "w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-neutral-900";
export const buttonClass = "rounded-lg bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800 disabled:opacity-50";
export function Field({ label, name, value, type = "text", required = true, maxLength = 200 }: { label: string; name: string; value?: string; type?: string; required?: boolean; maxLength?: number }) {
  return <label className="block space-y-1 text-sm font-medium">{label}<input className={inputClass} name={name} defaultValue={value} type={type} required={required} maxLength={maxLength} /></label>;
}
export function Area({ label, name, value, required = false }: { label: string; name: string; value?: string; required?: boolean }) {
  return <label className="block space-y-1 text-sm font-medium">{label}<textarea className={inputClass} name={name} defaultValue={value} required={required} maxLength={3000} rows={3} /></label>;
}
export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-sm space-y-4"><h2 className="text-xl font-semibold">{title}</h2>{children}</section>;
}
export function formValues(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  return Object.fromEntries(new FormData(event.currentTarget));
}
export async function api(path: string, body?: unknown, method?: string) {
  const response = await fetch(path, { method: method || (body ? "POST" : "GET"), headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed. Please try again.");
  return data;
}
export type Market = { id: string; name: string; country_code: string; timezone: string; is_booking_enabled?: boolean };
export type Agent = { id: string; email: string; full_name: string; phone: string; contact_email: string; address: string; business_name: string; area_of_operations: string; languages: string; availability_notes: string; is_active: boolean; must_change_password: boolean; profile_completed_at: string | null; agent_territories?: { market_id: string }[] };
export type Application = { id: string; full_name: string; email: string; phone: string; country_code: string; city: string; business_name: string; area_of_operations: string; experience: string; equipment: string; status: string; admin_notes: string; created_at: string };
export type Booking = { id: string; booking_ref: string; market_id: string; start_date: string; end_date: string; status: string; quantity: number; products: { name: string } | null; customer_name?: string; customer_email?: string; customer_phone?: string; fulfillment_mode?: string; delivery_address?: string; delivery_notes?: string; collection_address?: string; collection_notes?: string; requires_confirmation?: boolean; confirmation_status?: string };
export type Assignment = { booking_id: string; agent_id: string; status: string; decline_reason: string; delivery_driver_id: string | null; collection_driver_id: string | null; delivery_scheduled_at: string | null; collection_scheduled_at: string | null; bookings: Booking };
export type Message = { id: string; booking_id: string; agent_id: string; direction: string; body: string; status: string; created_at: string };
export type OrderEvent = { id: string; booking_id: string; agent_id: string; action: string; note: string; created_at: string };
export type Driver = { id: string; name: string; phone: string; vehicle: string; is_active: boolean };
