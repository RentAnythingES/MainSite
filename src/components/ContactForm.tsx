"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <span className="text-5xl block mb-4">✅</span>
        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
        <p className="text-neutral-500 mb-6">
          We&apos;ll get back to you within 24 hours. Check your email for a confirmation.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="btn btn-outline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" id="contact-form" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1.5">Subject</label>
        <select
          id="subject"
          name="subject"
          className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
        >
          <option value="">Select a topic...</option>
          <option value="Booking enquiry">Booking enquiry</option>
          <option value="Product question">Product question</option>
          <option value="B2B / Partnership">B2B / Partnership</option>
          <option value="Support / Issue">Support / Issue</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all resize-none"
          placeholder="Tell us how we can help..."
        />
      </div>

      {status === "error" && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 border border-red-100">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-primary btn-lg w-full disabled:opacity-60"
        id="contact-submit"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      <p className="text-xs text-neutral-400 text-center">
        By submitting, you agree to our <Link href="/privacy" className="underline hover:text-brand">Privacy Policy</Link>.
      </p>
    </form>
  );
}
