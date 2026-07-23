"use client";

import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/data/products";
import { trackBookingEvent } from "@/lib/analytics";
import {
  type ActiveCheckout,
  clearActiveCheckout,
  readActiveCheckout,
  saveActiveCheckout,
} from "@/lib/active-checkout";

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
    quantity: "Quantity",
    unit: "unit",
    units: "units",
    quantityDiscount: "Quantity discount",
    availableUnits: "available for these dates",
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
    temporarilyHeld: "Another customer is currently completing checkout for this item.",
    temporarilyHeldHelp:
      "This hold may be released shortly. Try again in a few minutes, or message us and we’ll help.",
    activeCheckout: "Your checkout is still active for these dates.",
    resumeCheckout: "Resume secure payment",
    cancelCheckout: "Release these dates",
    cancellingCheckout: "Releasing dates…",
    checkoutUnavailable: "Payment could not be started.",
    checkoutUnavailableHelp:
      "Your selected dates may still be available. Please contact us via WhatsApp and we will finish the booking manually.",
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
    quantity: "Cantidad",
    unit: "unidad",
    units: "unidades",
    quantityDiscount: "Descuento por cantidad",
    availableUnits: "disponibles para estas fechas",
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
    temporarilyHeld: "Otro cliente está completando el pago de este artículo.",
    temporarilyHeldHelp:
      "La reserva temporal puede liberarse pronto. Inténtalo de nuevo en unos minutos o escríbenos y te ayudaremos.",
    activeCheckout: "Tu pago sigue activo para estas fechas.",
    resumeCheckout: "Continuar con el pago seguro",
    cancelCheckout: "Liberar estas fechas",
    cancellingCheckout: "Liberando fechas…",
    checkoutUnavailable: "No se pudo iniciar el pago.",
    checkoutUnavailableHelp:
      "Es posible que tus fechas sigan disponibles. Contáctanos por WhatsApp y terminaremos la reserva manualmente.",
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

const CHECKOUT_REQUEST_TIMEOUT_MS = 20_000;

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), CHECKOUT_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

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
  customer_instructions?: string | null;
  lead_time_hours?: number | null;
  delivery_window?: string | null;
  collection_window?: string | null;
}

interface PickupLocationOption {
  id: string;
  slug: string;
  name: string;
  address: string;
  pickup_instructions?: string | null;
  customer_instructions?: string | null;
  lead_time_hours?: number | null;
}

interface ServerQuote {
  quantity: number;
  rentalDays: number;
  perDayCents: number;
  unitRentalSubtotalCents: number;
  quantityDiscountBps: number;
  quantityDiscountCents: number;
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
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>("delivery_and_collection");
  const [step, setStep] = useState<BookingStep>("dates");

  // Availability
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [bookingError, setBookingError] = useState<"none" | "availability" | "checkout">("none");
  const [availabilityReason, setAvailabilityReason] = useState("");
  const [serviceZones, setServiceZones] = useState<ServiceZoneOption[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupLocationOption[]>([]);
  const [serverQuote, setServerQuote] = useState<ServerQuote | null>(null);
  const [deliveryZoneId, setDeliveryZoneId] = useState("");
  const [collectionZoneId, setCollectionZoneId] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [maxAvailableQuantity, setMaxAvailableQuantity] = useState(product.stockAvailable || product.stockTotal || 20);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [invoiceRequested, setInvoiceRequested] = useState(false);
  const [billingCompanyName, setBillingCompanyName] = useState("");
  const [billingTaxId, setBillingTaxId] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeCheckout, setActiveCheckout] = useState<ActiveCheckout | null>(null);
  const [cancellingCheckout, setCancellingCheckout] = useState(false);
  const [bookingRef] = useState("");
  const selectedPickupLocation = pickupLocations.find((location) => location.id === pickupLocationId);
  const selectedDeliveryZone = serviceZones.find((zone) => zone.id === deliveryZoneId);
  const selectedCollectionZone = serviceZones.find((zone) => zone.id === collectionZoneId);

  const pricing = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = daysBetween(start, end);

    const tier = [...product.pricing]
      .sort((a, b) => b.days - a.days)
      .find((t) => days >= t.days) || product.pricing[0];

    const subtotal = tier.perDay * days * quantity;
    const deliveryFee = fulfillmentMode === "customer_pickup" ? 0 : deliveryOption === "express" ? 15 : subtotal >= 50 ? 0 : 10;
    const total = subtotal + deliveryFee;

    return { days, perDay: tier.perDay, subtotal, subtotalBeforeDiscount: subtotal, deliveryFee, total, quantityDiscount: 0 };
  }, [startDate, endDate, deliveryOption, fulfillmentMode, product.pricing, quantity]);

  const displayPricing = useMemo(() => {
    if (!serverQuote) {
      return pricing;
    }

    return {
      days: serverQuote.rentalDays,
      perDay: serverQuote.perDayCents / 100,
      subtotal: serverQuote.rentalSubtotalCents / 100,
      subtotalBeforeDiscount: (serverQuote.unitRentalSubtotalCents * serverQuote.quantity) / 100,
      deliveryFee: (serverQuote.deliveryFeeCents + serverQuote.collectionFeeCents) / 100,
      total: serverQuote.totalCents / 100,
      quantityDiscount: serverQuote.quantityDiscountCents / 100,
    };
  }, [pricing, serverQuote]);

  const activeCheckoutMatchesSelection = Boolean(
    activeCheckout &&
    activeCheckout.productSlug === product.slug &&
    activeCheckout.quantity === quantity &&
    new Date(activeCheckout.startAt).getTime() === new Date(combineDateTime(startDate, startTime)).getTime() &&
    new Date(activeCheckout.endAt).getTime() === new Date(combineDateTime(endDate, endTime)).getTime()
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setActiveCheckout(readActiveCheckout(product.slug));
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [product.slug]);

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
    const timeoutId = window.setTimeout(() => {
      setAvailabilityStatus("idle");
      setBookingError("none");
      setAvailabilityReason("");
      setServerQuote(null);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [startDate, startTime, endDate, endTime, quantity, fulfillmentMode, deliveryZoneId, collectionZoneId, pickupLocationId]);

  const checkAvailability = async () => {
    setAvailabilityStatus("checking");
    trackBookingEvent("availability_check_started", {
      productSlug: product.slug,
      fulfillmentMode,
      startDate,
      endDate,
      quantity,
    });

    try {
      const params = new URLSearchParams({
        slug: product.slug,
        start: startDate,
        end: endDate,
        startAt: combineDateTime(startDate, startTime),
        endAt: combineDateTime(endDate, endTime),
        mode: fulfillmentMode,
        quantity: String(quantity),
      });

      if (deliveryZoneId) params.set("deliveryZoneId", deliveryZoneId);
      if (collectionZoneId) params.set("collectionZoneId", collectionZoneId);
      if (pickupLocationId) params.set("pickupLocationId", pickupLocationId);
      if (activeCheckoutMatchesSelection && activeCheckout) {
        params.set("draftId", activeCheckout.draftId);
      }

      const res = await fetch(`/api/availability?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setAvailabilityReason(data.availabilityReason || "");

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
      if (Number.isInteger(data.maxAvailableQuantity)) {
        setMaxAvailableQuantity(Math.max(0, data.maxAvailableQuantity));
      }

      if (data.available) {
        setAvailabilityStatus("available");
        setBookingError("none");
        trackBookingEvent("availability_check_available", {
          productSlug: product.slug,
          fulfillmentMode,
          totalCents: data.quote?.totalCents,
          quantity,
        });
      } else {
        setAvailabilityStatus("unavailable");
        setBookingError("availability");
        trackBookingEvent("availability_check_unavailable", {
          productSlug: product.slug,
          fulfillmentMode,
          blockedDates: data.blockedDates?.length || 0,
        });
      }
    } catch {
      setAvailabilityStatus("unavailable");
      setBookingError("availability");
      trackBookingEvent("availability_check_failed_open", {
        productSlug: product.slug,
        fulfillmentMode,
      });
    }
  };

  const releaseCheckout = async (draftId: string) => {
    const response = await fetch(`/api/booking-drafts/${encodeURIComponent(draftId)}/cancel`, {
      method: "POST",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Could not release checkout");
    clearActiveCheckout(draftId);
    setActiveCheckout((current) => current?.draftId === draftId ? null : current);
  };

  const handleCancelActiveCheckout = async () => {
    if (!activeCheckout) return;
    setCancellingCheckout(true);
    try {
      await releaseCheckout(activeCheckout.draftId);
      setAvailabilityStatus("idle");
      setAvailabilityReason("");
      setBookingError("none");
    } catch {
      setBookingError("checkout");
    } finally {
      setCancellingCheckout(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    let attemptedDraftId: string | null = null;

    try {
      if (activeCheckout && activeCheckoutMatchesSelection) {
        window.location.assign(activeCheckout.checkoutUrl);
        return;
      }

      if (activeCheckout) {
        await releaseCheckout(activeCheckout.draftId);
      }

      attemptedDraftId = window.crypto.randomUUID();
      const selectedDeliveryZoneId = deliveryZoneId || serviceZones[0]?.id || null;
      const selectedCollectionZoneId = collectionZoneId || serviceZones[0]?.id || null;
      const selectedPickupLocationId = pickupLocationId || pickupLocations[0]?.id || null;
      const draftRes = await fetchWithTimeout("/api/booking-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: attemptedDraftId,
          productSlug: product.slug,
          quantity,
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
          billingName: name,
          billingCompanyName: invoiceRequested ? billingCompanyName || null : null,
          billingTaxId: invoiceRequested ? billingTaxId || null : null,
          billingAddress: invoiceRequested ? { address: billingAddress } : null,
          invoiceRequested,
        }),
      });

      const draftData = await draftRes.json();

      if (!draftRes.ok || !draftData.draftId) {
        await releaseCheckout(attemptedDraftId).catch(() => {});
        const isAvailabilityConflict = draftRes.status === 409;
        setAvailabilityStatus(isAvailabilityConflict ? "unavailable" : "available");
        setBookingError(isAvailabilityConflict ? "availability" : "checkout");
        setSubmitting(false);
        trackBookingEvent("booking_draft_failed", {
          productSlug: product.slug,
          quantity,
          fulfillmentMode,
          status: draftRes.status,
        });
        return;
      }

      trackBookingEvent("booking_draft_created", {
        productSlug: product.slug,
        fulfillmentMode,
        totalCents: draftData.quote?.totalCents,
      });

      const res = await fetchWithTimeout("/api/checkout", {
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
          locale,
        }),
      });

      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        const checkoutState: ActiveCheckout = {
          draftId: draftData.draftId,
          checkoutUrl: data.checkoutUrl,
          productSlug: product.slug,
          startAt: draftData.startAt,
          endAt: draftData.endAt,
          quantity,
          expiresAt: data.expiresAt || draftData.expiresAt,
        };
        saveActiveCheckout(checkoutState);
        setActiveCheckout(checkoutState);
        // Redirect to Stripe Checkout
        trackBookingEvent("checkout_redirect_started", {
          productSlug: product.slug,
          fulfillmentMode,
          sessionId: data.sessionId,
        });
        window.location.assign(data.checkoutUrl);
      } else {
        await releaseCheckout(draftData.draftId).catch(() => {});
        setBookingError("checkout");
        trackBookingEvent("checkout_redirect_failed_whatsapp", {
          productSlug: product.slug,
          fulfillmentMode,
          reason: data.error || "checkout_failed",
        });
        setSubmitting(false);
      }
    } catch {
      if (attemptedDraftId) {
        await releaseCheckout(attemptedDraftId).catch(() => {});
      }
      setBookingError("checkout");
      trackBookingEvent("checkout_exception_whatsapp", {
        productSlug: product.slug,
        fulfillmentMode,
      });
      setSubmitting(false);
    }
  };

  const whatsappMessage = `Hi! I'd like to book:\n\n📦 ${quantity} × ${product.name}\n📅 ${formatDisplayDate(new Date(startDate), locale)} ${startTime} → ${formatDisplayDate(new Date(endDate), locale)} ${endTime} (${displayPricing.days} ${displayPricing.days === 1 ? t.day : t.days})\n💰 €${displayPricing.total.toFixed(2)} total\n🚚 ${deliveryOption === "express" ? t.express : t.standard} ${t.delivery.toLowerCase()}\n\nPlease confirm availability!`;
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
              <span className="text-neutral-500">€{displayPricing.perDay} × {displayPricing.days} {displayPricing.days === 1 ? t.day : t.days} × {quantity}</span>
              <span className="font-medium">€{displayPricing.subtotalBeforeDiscount.toFixed(2)}</span>
            </div>
            {displayPricing.quantityDiscount > 0 && (
              <div className="flex justify-between text-sm text-emerald-700">
                <span>{t.quantityDiscount}</span>
                <span>−€{displayPricing.quantityDiscount.toFixed(2)}</span>
              </div>
            )}
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

      {activeCheckout && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-teal-900 font-semibold mb-2">{t.activeCheckout}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={() => window.location.assign(activeCheckout.checkoutUrl)}
            >
              {t.resumeCheckout}
            </button>
            <button
              type="button"
              className="btn btn-outline flex-1"
              disabled={cancellingCheckout}
              onClick={handleCancelActiveCheckout}
            >
              {cancellingCheckout ? t.cancellingCheckout : t.cancelCheckout}
            </button>
          </div>
        </div>
      )}

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

      <div className="mb-4">
        <label htmlFor="booking-quantity" className="text-xs font-medium text-neutral-500 mb-1 block">
          {t.quantity}
        </label>
        <select
          id="booking-quantity"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
        >
          {Array.from({ length: Math.max(1, product.stockTotal || maxAvailableQuantity || 20) }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>{value} {value === 1 ? t.unit : t.units}</option>
          ))}
        </select>
        {availabilityStatus !== "idle" && (
          <p className="mt-1 text-xs text-neutral-500">
            {maxAvailableQuantity} {t.units} {t.availableUnits}
          </p>
        )}
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
          {(selectedPickupLocation?.customer_instructions || selectedPickupLocation?.pickup_instructions) && (
            <p className="text-xs text-neutral-500 mt-1">
              {selectedPickupLocation?.customer_instructions || selectedPickupLocation?.pickup_instructions}
            </p>
          )}
          {selectedPickupLocation?.lead_time_hours ? (
            <p className="text-[11px] text-neutral-400 mt-1">
              Typical confirmation lead time: {selectedPickupLocation.lead_time_hours}h.
            </p>
          ) : null}
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
            {(selectedDeliveryZone?.customer_instructions || selectedDeliveryZone?.delivery_window) && (
              <p className="text-xs text-neutral-500 mt-1">
                {selectedDeliveryZone.customer_instructions || `Delivery window: ${selectedDeliveryZone.delivery_window}`}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-neutral-50 p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <input type="checkbox" checked={invoiceRequested} onChange={(e) => setInvoiceRequested(e.target.checked)} />
              I need a full invoice for my business
            </label>
            {invoiceRequested && <div className="mt-3 space-y-3">
              <input type="text" required value={billingCompanyName} onChange={(e) => setBillingCompanyName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm" placeholder="Company legal name" />
              <input type="text" required value={billingTaxId} onChange={(e) => setBillingTaxId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm" placeholder="NIF / VAT ID" />
              <input type="text" required value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm" placeholder="Billing address" />
            </div>}
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
              {selectedCollectionZone?.collection_window && (
                <p className="text-xs text-neutral-500 mt-1">
                  Collection window: {selectedCollectionZone.collection_window}
                </p>
              )}
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
            €{displayPricing.perDay} × {displayPricing.days} {displayPricing.days === 1 ? t.day : t.days} × {quantity}
          </span>
          <span className="font-medium">€{displayPricing.subtotalBeforeDiscount.toFixed(2)}</span>
        </div>
        {displayPricing.quantityDiscount > 0 && (
          <div className="flex justify-between text-sm text-emerald-700">
            <span>{t.quantityDiscount}</span>
            <span>−€{displayPricing.quantityDiscount.toFixed(2)}</span>
          </div>
        )}
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
          <p className="text-sm text-amber-800 font-semibold mb-1">
            {availabilityReason === "checkout_hold" ? t.temporarilyHeld : t.unavailable}
          </p>
          <p className="text-xs text-amber-700">
            {availabilityReason === "checkout_hold" ? t.temporarilyHeldHelp : t.unavailableHelp}
          </p>
        </div>
      )}
      {bookingError === "checkout" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800 font-semibold mb-1">{t.checkoutUnavailable}</p>
          <p className="text-xs text-amber-700">{t.checkoutUnavailableHelp}</p>
        </div>
      )}

      {/* CTAs */}
      {bookingError === "checkout" ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBookingEvent("whatsapp_clicked_checkout_failed", {
            productSlug: product.slug,
            fulfillmentMode,
          })}
          className="btn btn-primary btn-lg w-full mb-3"
          id="booking-whatsapp-cta"
        >
          {t.bookWhatsapp}
        </a>
      ) : availabilityStatus === "idle" ? (
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
            onClick={() => {
              trackBookingEvent("booking_form_opened", {
                productSlug: product.slug,
                fulfillmentMode,
              });
              setStep("form");
            }}
            className="btn btn-primary btn-lg w-full"
            id="booking-direct-cta"
          >
            {t.bookDirect}
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookingEvent("whatsapp_clicked_available", {
              productSlug: product.slug,
              fulfillmentMode,
            })}
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
          onClick={() => trackBookingEvent("whatsapp_clicked_unavailable", {
            productSlug: product.slug,
            fulfillmentMode,
          })}
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
