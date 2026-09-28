"use client";
import Link from "next/link";
import { useState } from "react";
import { api, buttonClass, Field, formValues } from "./shared";
export default function AgentLogin() {
  const [error, setError] = useState(""), [busy, setBusy] = useState(false);
  return <div className="container-site max-w-lg py-16"><h1 className="text-3xl font-bold">Agent login</h1><p className="mt-3 mb-6 text-neutral-600">Sign in to your Rentandroll partner workspace.</p><form className="space-y-5" onSubmit={async e => { const values = formValues(e); setBusy(true); setError(""); try { await api("/api/agent/session", values); window.location.assign("/agent"); } catch (e) { setError((e as Error).message); setBusy(false); } }}><Field label="Email" name="email" type="email" /><Field label="Password" name="password" type="password" />{error && <p role="alert" className="text-red-700">{error}</p>}<button className={buttonClass} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form><p className="mt-6 text-sm">Need a password reset? <Link href="/contact" className="text-teal-700 underline">Contact Rentandroll</Link>.</p><Link href="/agent-network" className="mt-4 block text-teal-700 underline">Apply to join the agent network</Link></div>;
}
