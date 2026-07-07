"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Product } from "@/data/products";

interface BookingWidgetProps {
  product: Product;
  locale?: "en" | "es";
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDisplayDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const labels = {
  en: {
    bookTitle: "Book This Item",
    startDate: "Start Date",
    endDate: "End Date",
    days: "days",
    day: "day",
    rental: "rental",
    delivery: "Delivery",
    standard: "Standard",
    express: "Express",
    free: "Free",
    nextDay: "Next day",
    sameDay: "Same day",
    total: "Total",
    checkAvailability: "Check Availability",
    checking: "Checking...",
    available: "✓ Available for your dates",
    unavailable: "✕ Not available for these dates",
    bookWhatsapp: "💬 Book via WhatsApp",
    bookDirect: "📋 Book Now",
    securePayment: "🔒 Secure payment via Stripe",
    pausedTitle: "Currently booked",
    pausedMessage:
      "We are confirming live inventory before taking online payments. Message us with your Valencia dates and we will personally check options for you.",
    pausedCta: "Contact us to check availability",
    yourDetails: "Your Details",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone / WhatsApp",
    deliveryAddress: "Delivery Address",
    deliveryNotes: "Delivery Notes (optional)",
    submit: "Proceed to Payment",
    submitting: "Redirecting to payment...",
    successTitle: "Booking Submitted!",
    successRef: "Reference",
    successMsg: "We'll confirm availability and get back to you within a few hours.",
    back: "← Back",
    tryDifferentDates: "Try different dates",
    orWhatsapp: "or contact us via WhatsApp",
  },
  es: {
    bookTitle: "Reservar Este Artículo",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Fin",
    days: "días",
    day: "día",
    rental: "alquiler",
    delivery: "Entrega",
    standard: "Estándar",
    express: "Exprés",
    free: "Gratis",
    nextDay: "Día siguiente",
    sameDay: "Mismo día",
    total: "Total",
    checkAvailability: "Comprobar Disponibilidad",
    checking: "Comprobando...",
    available: "✓ Disponible para tus fechas",
    unavailable: "✕ No disponible para estas fechas",
    bookWhatsapp: "💬 Reservar por WhatsApp",
    bookDirect: "📋 Reservar Ahora",
    securePayment: "🔒 Pago seguro con Stripe",
    pausedTitle: "Reservado actualmente",
    pausedMessage:
      "Estamos confirmando el inventario real antes de aceptar pagos online. Escríbenos con tus fechas en Valencia y revisaremos las opciones personalmente.",
    pausedCta: "Contactar para comprobar disponibilidad",
    yourDetails: "Tus Datos",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Teléfono / WhatsApp",
    deliveryAddress: "Dirección de Entrega",
    deliveryNotes: "Notas de Entrega (opcional)",
    submit: "Proceder al Pago",
    submitting: "Redirigiendo al pago...",
    successTitle: "¡Reserva Enviada!",
    successRef: "Referencia",
    successMsg: "Confirmaremos la disponibilidad y te responderemos en pocas horas.",
    back: "← Volver",
    tryDifferentDates: "Prueba otras fechas",
    orWhatsapp: "o contáctanos por WhatsApp",
  },
};

type BookingStep = "dates" | "form" | "success";

const bookingsPaused = process.env.NEXT_PUBLIC_BOOKINGS_PAUSED !== "false";

export default function BookingWidget({ product, locale = "en" }: BookingWidgetProps) {
  const t = labels[locale];
  const tomorrow = addDays(new Date(), 1);
  const [startDate, setStartDate] = useState(formatDate(tomorrow));
  const [endDate, setEndDate] = useState(formatDate(addDays(tomorrow, 3)));
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");
  const [step, setStep] = useState<BookingStep>("dates");

  // Availability
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const pricing = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = daysBetween(start, end);

    const tier = [...product.pricing]
      .sort((a, b) => b.days - a.days)
      .find((t) => days >= t.days) || product.pricing[0];

    const subtotal = tier.perDay * days;
    const deliveryFee = deliveryOption === "express" ? 15 : subtotal >= 50 ? 0 : 10;
    const total = subtotal + deliveryFee;

    return { days, perDay: tier.perDay, subtotal, deliveryFee, total };
  }, [startDate, endDate, deliveryOption, product.pricing]);

  // Reset availability when dates change
  useEffect(() => {
    setAvailabilityStatus("idle");
    setBlockedDates([]);
  }, [startDate, endDate]);

  const checkAvailability = useCallback(async () => {
    setAvailabilityStatus("checking");
    try {
      const res = await fetch(
        `/api/availability?slug=${product.slug}&start=${startDate}&end=${endDate}`
      );
      const data = await res.json();

      if (data.available) {
        setAvailabilityStatus("available");
        setBlockedDates([]);
      } else {
        setAvailabilityStatus("unavailable");
        setBlockedDates(data.blockedDates || []);
      }
    } catch {
      // If API fails (no Supabase configured), assume available
      setAvailabilityStatus("available");
    }
  }, [product.slug, startDate, endDate]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.slug, // API will resolve to UUID
          productSlug: product.slug,
          productName: product.name,
          customerName: name,
          customerEmail: email,
          customerPhone: phone || null,
          startDate,
          endDate,
          rentalDays: pricing.days,
          perDayCents: Math.round(pricing.perDay * 100),
          subtotalCents: Math.round(pricing.subtotal * 100),
          deliveryFeeCents: Math.round(pricing.deliveryFee * 100),
          totalCents: Math.round(pricing.total * 100),
          deliveryType: deliveryOption,
          deliveryAddress: address,
          deliveryCity: "valencia",
          deliveryNotes: notes || null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback to WhatsApp
        window.open(whatsappUrl, "_blank");
        setSubmitting(false);
      }
    } catch {
      // Fallback to WhatsApp
      window.open(whatsappUrl, "_blank");
      setSubmitting(false);
    }
  };

  const whatsappMessage = `Hi! I'd like to book:\n\n📦 ${product.name}\n📅 ${formatDisplayDate(new Date(startDate), locale)} → ${formatDisplayDate(new Date(endDate), locale)} (${pricing.days} ${pricing.days === 1 ? t.day : t.days})\n💰 €${pricing.total} total\n🚚 ${deliveryOption === "express" ? t.express : t.standard} ${t.delivery.toLowerCase()}\n\nPlease confirm availability!`;
  const whatsappUrl = `https://wa.me/34684708013?text=${encodeURIComponent(whatsappMessage)}`;

  if (bookingsPaused) {
    return (
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6" id="booking-widget">
        <div className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 mb-4">
          {t.pausedTitle}
        </div>
        <h3 className="font-bold text-lg mb-2">{t.bookTitle}</h3>
        <p className="text-sm text-neutral-600 mb-5">{t.pausedMessage}</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg w-full block text-center"
          id="booking-whatsapp-cta"
        >
          {t.pausedCta}
        </a>
        <p className="text-xs text-neutral-400 text-center mt-3">
          {locale === "es"
            ? "Sin pago online hasta que confirmemos disponibilidad."
            : "No online payment until availability is confirmed."}
        </p>
      </div>
    );
  }

  // Success state
  if (step === "success") {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 text-center" id="booking-widget">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-bold text-lg mb-1">{t.successTitle}</h3>
        {bookingRef && (
          <p className="text-sm text-neutral-500 mb-3">
            {t.successRef}: <span className="font-mono font-bold text-brand">{bookingRef}</span>
          </p>
        )}
        <p className="text-sm text-neutral-500 mb-4">{t.successMsg}</p>
        <button
          onClick={() => { setStep("dates"); setAvailabilityStatus("idle"); }}
          className="text-sm text-brand hover:underline"
        >
          {t.back}
        </button>
      </div>
    );
  }

  // Booking form step
  if (step === "form") {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6" id="booking-widget">
        <button onClick={() => setStep("dates")} className="text-sm text-neutral-400 hover:text-brand mb-3 block">
          {t.back}
        </button>
        <h3 className="font-bold text-lg mb-4">{t.yourDetails}</h3>

        <form onSubmit={handleSubmitBooking} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.fullName}</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              placeholder="Maria García" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.email}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              placeholder="maria@example.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.phone}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              placeholder="+34 600 000 000" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.deliveryAddress}</label>
            <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              placeholder="Calle de Colón 42, Valencia" />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.deliveryNotes}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
              placeholder="Apartment 3B, ring buzzer" />
          </div>

          {/* Price summary */}
          <div className="border-t border-border pt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">€{pricing.perDay} × {pricing.days} {pricing.days === 1 ? t.day : t.days}</span>
              <span className="font-medium">€{pricing.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{t.delivery}</span>
              <span className="font-medium">{pricing.deliveryFee === 0 ? <span className="text-green-600">{t.free}</span> : `€${pricing.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>{t.total}</span>
              <span className="text-brand">€{pricing.total}</span>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full" id="booking-submit">
            {submitting ? t.submitting : t.submit}
          </button>
        </form>

        <p className="text-xs text-neutral-400 text-center mt-3">{t.securePayment}</p>
      </div>
    );
  }

  // Date selection step (default)
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6" id="booking-widget">
      <h3 className="font-bold text-lg mb-4">{t.bookTitle}</h3>

      {/* Date Pickers */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="booking-start" className="text-xs font-medium text-neutral-500 mb-1 block">
            {t.startDate}
          </label>
          <input
            id="booking-start"
            type="date"
            value={startDate}
            min={formatDate(tomorrow)}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (new Date(e.target.value) >= new Date(endDate)) {
                setEndDate(formatDate(addDays(new Date(e.target.value), 1)));
              }
            }}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="booking-end" className="text-xs font-medium text-neutral-500 mb-1 block">
            {t.endDate}
          </label>
          <input
            id="booking-end"
            type="date"
            value={endDate}
            min={formatDate(addDays(new Date(startDate), 1))}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
      </div>

      {/* Duration display */}
      <div className="bg-brand/5 rounded-lg p-3 mb-4 text-center">
        <p className="text-sm text-brand font-semibold">
          {pricing.days} {pricing.days === 1 ? t.day : t.days} {t.rental}
        </p>
        <p className="text-xs text-neutral-500">
          {formatDisplayDate(new Date(startDate), locale)} → {formatDisplayDate(new Date(endDate), locale)}
        </p>
      </div>

      {/* Delivery Option */}
      <div className="mb-4">
        <p className="text-xs font-medium text-neutral-500 mb-2">{t.delivery}</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDeliveryOption("standard")}
            className={`p-3 rounded-lg border text-sm text-left transition-colors ${
              deliveryOption === "standard"
                ? "border-brand bg-brand/5 text-brand"
                : "border-border hover:border-neutral-300"
            }`}
            id="delivery-standard"
          >
            <p className="font-semibold">{t.standard}</p>
            <p className="text-xs text-neutral-500">
              {pricing.subtotal >= 50 ? t.free : "€10"} · {t.nextDay}
            </p>
          </button>
          <button
            type="button"
            onClick={() => setDeliveryOption("express")}
            className={`p-3 rounded-lg border text-sm text-left transition-colors ${
              deliveryOption === "express"
                ? "border-brand bg-brand/5 text-brand"
                : "border-border hover:border-neutral-300"
            }`}
            id="delivery-express"
          >
            <p className="font-semibold">{t.express}</p>
            <p className="text-xs text-neutral-500">€15 · {t.sameDay}</p>
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-border pt-4 mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">
            €{pricing.perDay} × {pricing.days} {pricing.days === 1 ? t.day : t.days}
          </span>
          <span className="font-medium">€{pricing.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">{t.delivery}</span>
          <span className="font-medium">
            {pricing.deliveryFee === 0 ? (
              <span className="text-green-600">{t.free}</span>
            ) : (
              `€${pricing.deliveryFee}`
            )}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
          <span>{t.total}</span>
          <span className="text-brand">€{pricing.total}</span>
        </div>
      </div>

      {/* Availability Status */}
      {availabilityStatus === "available" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-sm text-emerald-700 font-medium">
          {t.available}
        </div>
      )}
      {availabilityStatus === "unavailable" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700 font-medium mb-1">{t.unavailable}</p>
          {blockedDates.length > 0 && (
            <p className="text-xs text-red-500">
              {t.tryDifferentDates} {t.orWhatsapp}
            </p>
          )}
        </div>
      )}

      {/* CTAs */}
      {availabilityStatus === "idle" ? (
        <button
          onClick={checkAvailability}
          className="btn btn-primary btn-lg w-full mb-3"
          id="booking-check-availability"
        >
          {t.checkAvailability}
        </button>
      ) : availabilityStatus === "checking" ? (
        <button disabled className="btn btn-primary btn-lg w-full mb-3 opacity-60">
          {t.checking}
        </button>
      ) : availabilityStatus === "available" ? (
        <div className="space-y-2">
          <button
            onClick={() => setStep("form")}
            className="btn btn-primary btn-lg w-full"
            id="booking-direct-cta"
          >
            {t.bookDirect}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-lg w-full block text-center"
            id="booking-whatsapp-cta"
          >
            {t.bookWhatsapp}
          </a>
        </div>
      ) : (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg w-full mb-3"
          id="booking-whatsapp-cta"
        >
          {t.bookWhatsapp}
        </a>
      )}

      <p className="text-xs text-neutral-400 text-center mt-3">{t.securePayment}</p>
    </div>
  );
}
