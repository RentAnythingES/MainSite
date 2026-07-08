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

function combineDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

const labels = {
  en: {
    bookTitle: "Book This Item",
    startDate: "Start Date",
    startTime: "Start Time",
    endDate: "End Date",
    endTime: "End Time",
    days: "days",
    day: "day",
    rental: "rental",
    delivery: "Delivery",
    deliveryZone: "Delivery Area",
    collectionZone: "Collection Area",
    pickupLocation: "Pickup Location",
    fulfillment: "Collection",
    customerPickup: "Pick up from us",
    deliveryOnly: "Delivery only",
    deliveryCollection: "Delivery and collection",
    standard: "Standard",
    express: "Express",
    free: "Free",
    nextDay: "Next day",
    sameDay: "Same day",
    total: "Total",
    checkAvailability: "Check Availability",
    checking: "Checking...",
    available: "✓ Available for your dates",
    unavailable: "This item is currently fully booked for that time frame.",
    unavailableHelp:
      "Contact us directly via WhatsApp and we can see if we can find alternative inventory.",
    bookWhatsapp: "💬 Contact us on WhatsApp",
    bookDirect: "📋 Book Now",
    securePayment: "🔒 Secure payment via Stripe",
    yourDetails: "Your Details",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone / WhatsApp",
    deliveryAddress: "Delivery Address",
    collectionAddress: "Collection Address",
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
    startTime: "Hora de Inicio",
    endDate: "Fecha de Fin",
    endTime: "Hora de Fin",
    days: "días",
    day: "día",
    rental: "alquiler",
    delivery: "Entrega",
    deliveryZone: "Zona de entrega",
    collectionZone: "Zona de recogida",
    pickupLocation: "Punto de recogida",
    fulfillment: "Recogida",
    customerPickup: "Recoger con nosotros",
    deliveryOnly: "Solo entrega",
    deliveryCollection: "Entrega y recogida",
    standard: "Estándar",
    express: "Exprés",
    free: "Gratis",
    nextDay: "Día siguiente",
    sameDay: "Mismo día",
    total: "Total",
    checkAvailability: "Comprobar Disponibilidad",
    checking: "Comprobando...",
    available: "✓ Disponible para tus fechas",
    unavailable: "Este artículo está completamente reservado para esas fechas.",
    unavailableHelp:
      "Contáctanos directamente por WhatsApp y veremos si podemos encontrar inventario alternativo.",
    bookWhatsapp: "💬 Contactar por WhatsApp",
    bookDirect: "📋 Reservar Ahora",
    securePayment: "🔒 Pago seguro con Stripe",
    yourDetails: "Tus Datos",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Teléfono / WhatsApp",
    deliveryAddress: "Dirección de Entrega",
    collectionAddress: "Dirección de Recogida",
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
type FulfillmentMode = "customer_pickup" | "delivery_only" | "delivery_and_collection";

interface ServiceZoneOption {
  id: string;
  slug: string;
  name: string;
  delivery_fee_cents: number;
  collection_fee_cents: number;
  roundtrip_fee_cents: number;
  description?: string | null;
}

interface PickupLocationOption {
  id: string;
  slug: string;
  name: string;
  address: string;
  pickup_instructions?: string | null;
}

interface ServerQuote {
  rentalDays: number;
  perDayCents: number;
  rentalSubtotalCents: number;
  deliveryFeeCents: number;
  collectionFeeCents: number;
  totalCents: number;
}

export default function BookingWidget({ product, locale = "en" }: BookingWidgetProps) {
  const t = labels[locale];
  const tomorrow = addDays(new Date(), 1);
  const [startDate, setStartDate] = useState(formatDate(tomorrow));
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState(formatDate(addDays(tomorrow, 3)));
  const [endTime, setEndTime] = useState("09:00");
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>("delivery_and_collection");
  const [step, setStep] = useState<BookingStep>("dates");

  // Availability
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [serviceZones, setServiceZones] = useState<ServiceZoneOption[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupLocationOption[]>([]);
  const [serverQuote, setServerQuote] = useState<ServerQuote | null>(null);
  const [deliveryZoneId, setDeliveryZoneId] = useState("");
  const [collectionZoneId, setCollectionZoneId] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
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
    const deliveryFee = fulfillmentMode === "customer_pickup" ? 0 : deliveryOption === "express" ? 15 : subtotal >= 50 ? 0 : 10;
    const total = subtotal + deliveryFee;

    return { days, perDay: tier.perDay, subtotal, deliveryFee, total };
  }, [startDate, endDate, deliveryOption, fulfillmentMode, product.pricing]);

  const displayPricing = useMemo(() => {
    if (!serverQuote) {
      return pricing;
    }

    return {
      days: serverQuote.rentalDays,
      perDay: serverQuote.perDayCents / 100,
      subtotal: serverQuote.rentalSubtotalCents / 100,
      deliveryFee: (serverQuote.deliveryFeeCents + serverQuote.collectionFeeCents) / 100,
      total: serverQuote.totalCents / 100,
    };
  }, [pricing, serverQuote]);

  useEffect(() => {
    let active = true;

    async function loadBookingOptions() {
      try {
        const res = await fetch("/api/booking-options");
        const data = await res.json();

        if (!active) return;

        if (Array.isArray(data.serviceZones)) {
          setServiceZones(data.serviceZones);
          if (!deliveryZoneId && data.serviceZones[0]?.id) setDeliveryZoneId(data.serviceZones[0].id);
          if (!collectionZoneId && data.serviceZones[0]?.id) setCollectionZoneId(data.serviceZones[0].id);
        }

        if (Array.isArray(data.pickupLocations)) {
          setPickupLocations(data.pickupLocations);
          if (!pickupLocationId && data.pickupLocations[0]?.id) setPickupLocationId(data.pickupLocations[0].id);
        }
      } catch {
        // The availability call can still return these options if this request fails.
      }
    }

    loadBookingOptions();

    return () => {
      active = false;
    };
  }, [collectionZoneId, deliveryZoneId, pickupLocationId]);

  // Reset availability when dates change
  useEffect(() => {
    setAvailabilityStatus("idle");
    setBlockedDates([]);
    setServerQuote(null);
  }, [startDate, startTime, endDate, endTime, fulfillmentMode, deliveryZoneId, collectionZoneId, pickupLocationId]);

  const checkAvailability = useCallback(async () => {
    setAvailabilityStatus("checking");
    try {
      const params = new URLSearchParams({
        slug: product.slug,
        start: startDate,
        end: endDate,
        startAt: combineDateTime(startDate, startTime),
        endAt: combineDateTime(endDate, endTime),
        mode: fulfillmentMode,
      });

      if (deliveryZoneId) params.set("deliveryZoneId", deliveryZoneId);
      if (collectionZoneId) params.set("collectionZoneId", collectionZoneId);
      if (pickupLocationId) params.set("pickupLocationId", pickupLocationId);

      const res = await fetch(`/api/availability?${params.toString()}`);
      const data = await res.json();

      if (Array.isArray(data.serviceZones)) {
        setServiceZones(data.serviceZones);
        if (!deliveryZoneId && data.serviceZones[0]?.id) setDeliveryZoneId(data.serviceZones[0].id);
        if (!collectionZoneId && data.serviceZones[0]?.id) setCollectionZoneId(data.serviceZones[0].id);
      }

      if (Array.isArray(data.pickupLocations)) {
        setPickupLocations(data.pickupLocations);
        if (!pickupLocationId && data.pickupLocations[0]?.id) setPickupLocationId(data.pickupLocations[0].id);
      }

      if (data.quote) {
        setServerQuote(data.quote);
      }

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
  }, [product.slug, startDate, startTime, endDate, endTime, fulfillmentMode, deliveryZoneId, collectionZoneId, pickupLocationId]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const selectedDeliveryZoneId = deliveryZoneId || serviceZones[0]?.id || null;
      const selectedCollectionZoneId = collectionZoneId || serviceZones[0]?.id || null;
      const selectedPickupLocationId = pickupLocationId || pickupLocations[0]?.id || null;
      const draftRes = await fetch("/api/booking-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          customerName: name,
          customerEmail: email,
          customerPhone: phone || null,
          startAt: combineDateTime(startDate, startTime),
          endAt: combineDateTime(endDate, endTime),
          fulfillmentMode,
          pickupLocationId: fulfillmentMode === "customer_pickup" ? selectedPickupLocationId : null,
          deliveryZoneId: fulfillmentMode !== "customer_pickup" ? selectedDeliveryZoneId : null,
          collectionZoneId: fulfillmentMode === "delivery_and_collection" ? selectedCollectionZoneId : null,
          deliveryAddress: fulfillmentMode !== "customer_pickup" ? address : null,
          collectionAddress: fulfillmentMode === "delivery_and_collection" ? collectionAddress || address : null,
          deliveryNotes: notes || null,
          collectionNotes: null,
        }),
      });

      const draftData = await draftRes.json();

      if (!draftRes.ok || !draftData.draftId) {
        setAvailabilityStatus("unavailable");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: draftData.draftId,
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

  const whatsappMessage = `Hi! I'd like to book:\n\n📦 ${product.name}\n📅 ${formatDisplayDate(new Date(startDate), locale)} ${startTime} → ${formatDisplayDate(new Date(endDate), locale)} ${endTime} (${displayPricing.days} ${displayPricing.days === 1 ? t.day : t.days})\n💰 €${displayPricing.total} total\n🚚 ${deliveryOption === "express" ? t.express : t.standard} ${t.delivery.toLowerCase()}\n\nPlease confirm availability!`;
  const whatsappUrl = `https://wa.me/34684708013?text=${encodeURIComponent(whatsappMessage)}`;

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
          {fulfillmentMode !== "customer_pickup" && (
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.deliveryAddress}</label>
            <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              placeholder="Calle de Colón 42, Valencia" />
          </div>
          )}
          {fulfillmentMode === "delivery_and_collection" && (
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.collectionAddress}</label>
              <input type="text" value={collectionAddress} onChange={(e) => setCollectionAddress(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                placeholder={address || "Same as delivery address"} />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.deliveryNotes}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
              placeholder="Apartment 3B, ring buzzer" />
          </div>

          {/* Price summary */}
          <div className="border-t border-border pt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">€{displayPricing.perDay} × {displayPricing.days} {displayPricing.days === 1 ? t.day : t.days}</span>
              <span className="font-medium">€{displayPricing.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{t.delivery}</span>
              <span className="font-medium">{displayPricing.deliveryFee === 0 ? <span className="text-green-600">{t.free}</span> : `€${displayPricing.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>{t.total}</span>
              <span className="text-brand">€{displayPricing.total}</span>
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

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="booking-start-time" className="text-xs font-medium text-neutral-500 mb-1 block">
            {t.startTime}
          </label>
          <input
            id="booking-start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="booking-end-time" className="text-xs font-medium text-neutral-500 mb-1 block">
            {t.endTime}
          </label>
          <input
            id="booking-end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
      </div>

      {/* Duration display */}
      <div className="bg-brand/5 rounded-lg p-3 mb-4 text-center">
        <p className="text-sm text-brand font-semibold">
          {displayPricing.days} {displayPricing.days === 1 ? t.day : t.days} {t.rental}
        </p>
        <p className="text-xs text-neutral-500">
          {formatDisplayDate(new Date(startDate), locale)} → {formatDisplayDate(new Date(endDate), locale)}
        </p>
      </div>

      {/* Fulfillment Option */}
      <div className="mb-4">
        <p className="text-xs font-medium text-neutral-500 mb-2">{t.fulfillment}</p>
        <div className="space-y-2">
          {[
            ["customer_pickup", t.customerPickup],
            ["delivery_only", t.deliveryOnly],
            ["delivery_and_collection", t.deliveryCollection],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFulfillmentMode(value as FulfillmentMode)}
              className={`w-full p-3 rounded-lg border text-sm text-left transition-colors ${
                fulfillmentMode === value
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border hover:border-neutral-300"
              }`}
            >
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {fulfillmentMode === "customer_pickup" && pickupLocations.length > 0 && (
        <div className="mb-4">
          <label htmlFor="pickup-location" className="text-xs font-medium text-neutral-500 mb-1 block">
            {t.pickupLocation}
          </label>
          <select
            id="pickup-location"
            value={pickupLocationId}
            onChange={(e) => setPickupLocationId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          >
            {pickupLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {pickupLocations.find((location) => location.id === pickupLocationId)?.pickup_instructions && (
            <p className="text-xs text-neutral-500 mt-1">
              {pickupLocations.find((location) => location.id === pickupLocationId)?.pickup_instructions}
            </p>
          )}
        </div>
      )}

      {fulfillmentMode !== "customer_pickup" && serviceZones.length > 0 && (
        <div className="mb-4 space-y-3">
          <div>
            <label htmlFor="delivery-zone" className="text-xs font-medium text-neutral-500 mb-1 block">
              {t.deliveryZone}
            </label>
            <select
              id="delivery-zone"
              value={deliveryZoneId}
              onChange={(e) => setDeliveryZoneId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            >
              {serviceZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          {fulfillmentMode === "delivery_and_collection" && (
            <div>
              <label htmlFor="collection-zone" className="text-xs font-medium text-neutral-500 mb-1 block">
                {t.collectionZone}
              </label>
              <select
                id="collection-zone"
                value={collectionZoneId}
                onChange={(e) => setCollectionZoneId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              >
                {serviceZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Delivery Option */}
      {fulfillmentMode !== "customer_pickup" && (
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
              {displayPricing.deliveryFee === 0 ? t.free : `€${displayPricing.deliveryFee}`} · {t.nextDay}
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
      )}

      {/* Price Breakdown */}
      <div className="border-t border-border pt-4 mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">
            €{displayPricing.perDay} × {displayPricing.days} {displayPricing.days === 1 ? t.day : t.days}
          </span>
          <span className="font-medium">€{displayPricing.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">{t.delivery}</span>
          <span className="font-medium">
            {displayPricing.deliveryFee === 0 ? (
              <span className="text-green-600">{t.free}</span>
            ) : (
              `€${displayPricing.deliveryFee}`
            )}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
          <span>{t.total}</span>
          <span className="text-brand">€{displayPricing.total}</span>
        </div>
      </div>

      {/* Availability Status */}
      {availabilityStatus === "available" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-sm text-emerald-700 font-medium">
          {t.available}
        </div>
      )}
      {availabilityStatus === "unavailable" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800 font-semibold mb-1">{t.unavailable}</p>
          <p className="text-xs text-amber-700">{t.unavailableHelp}</p>
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
