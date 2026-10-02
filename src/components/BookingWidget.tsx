"use client";

import { labels, policyMessages, bookingText } from "@/i18n/booking";
import { localeRegistry, type Locale } from "@/i18n/config";
import { useState, useMemo, useEffect, useRef } from "react";
import type { Product } from "@/data/products";
import { trackBookingEvent } from "@/lib/analytics";
import { CUSTOMER_FULFILLMENT_WINDOWS, formatCustomerFulfillmentWindow } from "@/lib/fulfillment-windows";
import GooglePlacesAddressInput from "@/components/GooglePlacesAddressInput";
import { requestBrowserNotificationPermission } from "@/lib/push-notifications";
import { getRentalWindow } from "@/lib/rental-dates";
import {
  type ActiveCheckout,
  clearActiveCheckout,
  readActiveCheckout,
  saveActiveCheckout,
} from "@/lib/active-checkout";

interface BookingWidgetProps {
  product: Product;
  locale?: Locale;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDisplayDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(localeRegistry[locale].format, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function combineDateTime(date: string, time: string): string {
  const combined = new Date(`${date}T${time}:00`);
  return Number.isNaN(combined.getTime()) ? "" : combined.toISOString();
}

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
type DeliveryOption = "standard" | "express";
type PolicyDecision = "standard_checkout" | "express_checkout" | "manual_confirmation" | "invalid";

interface FulfillmentPolicyResponse {
  decision: PolicyDecision;
  deliveryType: DeliveryOption | null;
  reason: string;
  leadTimeMinutes: number | null;
  fees: {
    baseFeeCents: number;
    expressSurchargeCents: number;
    totalFeeCents: number;
  };
  requested: {
    startAt: string;
    endAt: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    timeZone: "Europe/Madrid";
  } | null;
}

interface ServiceZoneOption {
  id: string;
  slug: string;
  name: string;
  delivery_fee_cents: number;
  collection_fee_cents: number;
  roundtrip_fee_cents: number;
  express_surcharge_cents: number;
  minimum_order_cents: number;
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
  couponCode?: string;
  couponDiscountCents?: number;
  quantity: number;
  rentalDays: number;
  perDayCents: number;
  unitRentalSubtotalCents: number;
  quantityDiscountBps: number;
  quantityDiscountCents: number;
  rentalSubtotalCents: number;
  deliveryFeeCents: number;
  collectionFeeCents: number;
  fulfillmentBaseFeeCents: number;
  expressSurchargeCents: number;
  extraServicesFeeCents: number;
  totalCents: number;
}

interface ExtraServiceOption {
  serviceType: "assembly" | "disassembly";
  feeCents: number;
}

function calculateFulfillmentFeeCents(
  fulfillmentMode: FulfillmentMode,
  deliveryOption: DeliveryOption,
  deliveryZone?: ServiceZoneOption,
  collectionZone?: ServiceZoneOption,
): number {
  let feeCents = 0;

  if (fulfillmentMode === "delivery_only") {
    feeCents = deliveryZone?.delivery_fee_cents || 0;
  } else if (fulfillmentMode === "delivery_and_collection") {
    feeCents =
      deliveryZone?.id === collectionZone?.id &&
      (deliveryZone?.roundtrip_fee_cents || 0) > 0
        ? deliveryZone?.roundtrip_fee_cents || 0
        : (deliveryZone?.delivery_fee_cents || 0) +
          (collectionZone?.collection_fee_cents || 0);
  }

  if (fulfillmentMode !== "customer_pickup" && deliveryOption === "express") {
    feeCents += deliveryZone?.express_surcharge_cents || 0;
  }

  return feeCents;
}

export default function BookingWidget({ product, locale = "en" }: BookingWidgetProps) {
  const t = labels[locale];
  const money = (amount: number) => new Intl.NumberFormat(localeRegistry[locale].format, { style: "currency", currency: "EUR" }).format(amount);
  const needsSupplyConfirmation = product.stockTotal === 0;
  const requestLabel = bookingText(locale, "Request for these dates", "Solicitar para estas fechas");
  const supplyHelp = bookingText(locale, "This item is offered on request. We will confirm the equipment and your dates before arranging payment.", "Este artículo está disponible bajo petición. Confirmaremos el equipo y las fechas antes de organizar el pago.");
  const [minimumStartDate, setMinimumStartDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("standard");
  const [fulfillmentPolicy, setFulfillmentPolicy] = useState<FulfillmentPolicyResponse | null>(null);
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>("delivery_and_collection");
  const [step, setStep] = useState<BookingStep>("dates");

  // Availability
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "checking" | "available" | "manual" | "unavailable">("idle");
  const [bookingError, setBookingError] = useState<"none" | "availability" | "checkout">("none");
  const [availabilityReason, setAvailabilityReason] = useState("");
  const [serviceZones, setServiceZones] = useState<ServiceZoneOption[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupLocationOption[]>([]);
  const [serverQuote, setServerQuote] = useState<ServerQuote | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const quoteRequest = useRef(0);
  const [deliveryZoneId, setDeliveryZoneId] = useState("");
  const [collectionZoneId, setCollectionZoneId] = useState("");
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [maxAvailableQuantity, setMaxAvailableQuantity] = useState(product.stockAvailable || product.stockTotal || 20);
  const [extraServiceOptions, setExtraServiceOptions] = useState<ExtraServiceOption[]>([]);
  const [selectedExtraServices, setSelectedExtraServices] = useState<string[]>([]);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);

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
  const [calendarLink] = useState<string | null>(null);
  const [mapsLink] = useState<string | null>(null);
  const [cancellingCheckout, setCancellingCheckout] = useState(false);
  const [bookingRef] = useState("");
  const selectedPickupLocation = pickupLocations.find((location) => location.id === pickupLocationId);
  const selectedDeliveryZone = serviceZones.find((zone) => zone.id === deliveryZoneId);
  const selectedCollectionZone = serviceZones.find((zone) => zone.id === collectionZoneId);
  const rentalWindow = useMemo(() => getRentalWindow(startDate, endDate), [startDate, endDate]);

  const pricing = useMemo(() => {
    const days = rentalWindow?.days ?? 0;

    const tier = [...product.pricing]
      .sort((a, b) => b.days - a.days)
      .find((t) => days >= t.days) || product.pricing[0];

    const subtotal = tier.perDay * days * quantity;
    const deliveryFeeCents = calculateFulfillmentFeeCents(
      fulfillmentMode,
      deliveryOption,
      selectedDeliveryZone,
      selectedCollectionZone,
    );
    const deliveryFee = deliveryFeeCents / 100;
    const fulfillmentBaseFee = calculateFulfillmentFeeCents(
      fulfillmentMode,
      "standard",
      selectedDeliveryZone,
      selectedCollectionZone,
    ) / 100;
    const expressSurcharge = Math.max(0, deliveryFee - fulfillmentBaseFee);
    const extraServicesFee = extraServiceOptions
      .filter((service) => selectedExtraServices.includes(service.serviceType))
      .reduce((sum, service) => sum + service.feeCents, 0) / 100;
    const total = subtotal + deliveryFee + extraServicesFee;

    return { days, perDay: tier.perDay, subtotal, subtotalBeforeDiscount: subtotal, deliveryFee, fulfillmentBaseFee, expressSurcharge, extraServicesFee, total, quantityDiscount: 0 };
  }, [rentalWindow, deliveryOption, fulfillmentMode, product.pricing, quantity, selectedDeliveryZone, selectedCollectionZone, extraServiceOptions, selectedExtraServices]);

  // A missing delivery quote is not a confirmed zero-priced service.
  const fulfillmentPricePending = fulfillmentMode !== "customer_pickup" && !serverQuote;

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
      fulfillmentBaseFee: serverQuote.fulfillmentBaseFeeCents / 100,
      expressSurcharge: serverQuote.expressSurchargeCents / 100,
      extraServicesFee: serverQuote.extraServicesFeeCents / 100,
      total: serverQuote.totalCents / 100,
      quantityDiscount: serverQuote.quantityDiscountCents / 100,
    };
  }, [pricing, serverQuote]);

  const activeCheckoutMatchesSelection = Boolean(
    activeCheckout &&
    activeCheckout.productSlug === product.slug &&
    (activeCheckout.locale || "en") === locale &&
    (activeCheckout.couponCode || "") === couponCode.trim().toUpperCase() &&
    activeCheckout.quantity === quantity &&
    activeCheckout.fulfillmentMode === fulfillmentMode &&
    activeCheckout.deliveryType === deliveryOption &&
    activeCheckout.pickupLocationId === (fulfillmentMode === "customer_pickup" ? pickupLocationId || null : null) &&
    activeCheckout.deliveryZoneId === (fulfillmentMode !== "customer_pickup" ? deliveryZoneId || null : null) &&
    activeCheckout.collectionZoneId === (fulfillmentMode === "delivery_and_collection" ? collectionZoneId || null : null) &&
    new Date(activeCheckout.startAt).getTime() === new Date(combineDateTime(startDate, startTime)).getTime() &&
    new Date(activeCheckout.endAt).getTime() === new Date(combineDateTime(endDate, endTime)).getTime()
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const today = new Date();
      const tomorrow = addDays(today, 1);
      const initialStartDate = formatDate(tomorrow);
      const initialEndDate = formatDate(addDays(tomorrow, 3));

      setMinimumStartDate(formatDate(today));
      setStartDate((current) => current || initialStartDate);
      setEndDate((current) => current || initialEndDate);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setActiveCheckout(readActiveCheckout(product.slug));
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [product.slug]);

  useEffect(() => {
    let active = true;

    async function loadExtraServices() {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(product.slug)}/extra-services`);
        const data = await res.json();
        if (active && Array.isArray(data.extraServices)) {
          setExtraServiceOptions(data.extraServices);
        }
      } catch {
        // Extra services are optional; leave the list empty on failure.
      }
    }

    loadExtraServices();
    return () => {
      active = false;
    };
  }, [product.slug]);

  useEffect(() => {
    void requestBrowserNotificationPermission();
  }, []);

  useEffect(() => {
    let active = true;

    async function loadBookingOptions() {
      try {
        const res = await fetch(`/api/booking-options?locale=${locale}`);
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
  }, [collectionZoneId, deliveryZoneId, pickupLocationId, locale]);

  // Reset availability when dates change
  useEffect(() => {
    quoteRequest.current += 1;
    const timeoutId = window.setTimeout(() => {
      setAvailabilityStatus("idle");
      setBookingError("none");
      setAvailabilityReason("");
      setServerQuote(null);
      setFulfillmentPolicy(null);
      setDeliveryOption("standard");
      setRequiresConfirmation(false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
    }, [startDate, startTime, endDate, endTime, quantity, fulfillmentMode, deliveryZoneId, collectionZoneId, pickupLocationId, selectedExtraServices, couponCode]);

  const checkAvailability = async () => {
    const requestId = ++quoteRequest.current;
    setCouponError("");
    if (!rentalWindow) {
      setAvailabilityReason(t.datesRequired);
      return;
    }

    if (needsSupplyConfirmation) {
      setAvailabilityStatus("manual");
      setAvailabilityReason(supplyHelp);
      return;
    }
    setAvailabilityStatus("checking");
    trackBookingEvent("availability_check_started", {
      productSlug: product.slug,
      fulfillmentMode,
      startDate,
      endDate,
      quantity,
    });

    try {
      if (activeCheckout && (activeCheckout.couponCode || "") !== couponCode.trim().toUpperCase()) {
        await releaseCheckout(activeCheckout.draftId);
      }
      const params = new URLSearchParams({
        locale,
        slug: product.slug,
        start: startDate,
        end: endDate,
        startTime,
        endTime,
        mode: fulfillmentMode,
        quantity: String(quantity),
      });

      if (deliveryZoneId) params.set("deliveryZoneId", deliveryZoneId);
      if (collectionZoneId) params.set("collectionZoneId", collectionZoneId);
      if (pickupLocationId) params.set("pickupLocationId", pickupLocationId);
      if (couponCode.trim()) params.set("couponCode", couponCode.trim().toUpperCase());
      if (selectedExtraServices.length > 0) params.set("extraServices", selectedExtraServices.join(","));
      if (activeCheckoutMatchesSelection && activeCheckout) {
        params.set("draftId", activeCheckout.draftId);
      }

      const res = await fetch(`/api/availability?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (requestId !== quoteRequest.current) return;
      if (!res.ok && data.errorCode === "coupon_invalid") {
        setCouponError(bookingText(locale, "Could not apply this coupon. Check the code or remove it to continue.", "No se ha podido aplicar el código. Comprueba que sea válido para este producto o elimínalo para continuar."));
        setServerQuote(null);
        setAvailabilityStatus("idle");
        setBookingError("none");
        return;
      }
      const policy = data.policy as FulfillmentPolicyResponse | null;
      setFulfillmentPolicy(policy || null);
      setRequiresConfirmation(Boolean(data.requiresConfirmation));
      if (policy?.deliveryType) setDeliveryOption(policy.deliveryType);
      const localizedPolicyMessage = policy
        ? policyMessages[locale][policy.reason as keyof typeof policyMessages.en] || t.manualHelp
        : "";
      setAvailabilityReason(localizedPolicyMessage || (locale === "de" ? t.manualHelp : data.error || data.availabilityReason || ""));

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
      } else if (policy?.decision === "manual_confirmation") {
        setAvailabilityStatus("manual");
        setBookingError("none");
        trackBookingEvent("fulfillment_manual_confirmation", {
          productSlug: product.slug,
          fulfillmentMode,
          reason: policy.reason,
          leadTimeMinutes: policy.leadTimeMinutes,
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
      if (requestId !== quoteRequest.current) return;
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
    if (availabilityStatus !== "available") return;
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
          locale,
          productSlug: product.slug,
          quantity,
          customerName: name,
          customerEmail: email,
          customerPhone: phone || null,
          startDate,
          startTime,
          endDate,
          endTime,
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
          extraServices: selectedExtraServices,
          couponCode: couponCode.trim().toUpperCase(),
        }),
      });

      const draftData = await draftRes.json();

      if (!draftRes.ok || !draftData.draftId) {
        await releaseCheckout(attemptedDraftId).catch(() => {});
        if (draftData.errorCode === "coupon_invalid") {
          setCouponError(bookingText(locale, "Could not apply this coupon. Check the code or remove it to continue.", "No se ha podido aplicar el código. Revísalo o elimínalo para continuar."));
          setServerQuote(null);
          setAvailabilityStatus("idle");
          setBookingError("none");
          setSubmitting(false);
          return;
        }
        const draftPolicy = draftData.policy as FulfillmentPolicyResponse | null;
        if (draftPolicy) {
          setFulfillmentPolicy(draftPolicy);
          if (draftPolicy.deliveryType) setDeliveryOption(draftPolicy.deliveryType);
        }
        if (draftPolicy?.decision === "manual_confirmation") {
          setStep("dates");
          setAvailabilityStatus("manual");
          setAvailabilityReason(
            policyMessages[locale][draftPolicy.reason as keyof typeof policyMessages.en] || t.manualHelp,
          );
          setBookingError("none");
          setSubmitting(false);
          return;
        }
        const isAvailabilityConflict = draftRes.status === 409;
        setAvailabilityStatus(isAvailabilityConflict ? "unavailable" : "available");
        setBookingError(isAvailabilityConflict ? "availability" : "checkout");
        setSubmitting(false);
        trackBookingEvent("booking_draft_failed", {
          productSlug: product.slug,
          quantity,
          fulfillmentMode,
          deliveryType: deliveryOption,
          status: draftRes.status,
        });
        return;
      }

      const draftPolicy = draftData.policy as FulfillmentPolicyResponse | null;
      const resolvedDeliveryType = draftPolicy?.deliveryType || "standard";
      if (draftPolicy) setFulfillmentPolicy(draftPolicy);
      setDeliveryOption(resolvedDeliveryType);
      setRequiresConfirmation(Boolean(draftData.requiresConfirmation));

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
          deliveryType: resolvedDeliveryType,
          deliveryAddress: address,
          deliveryCity: "valencia",
          deliveryNotes: notes || null,
          locale,
        }),
      });

      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        const checkoutState: ActiveCheckout = {
          locale,
          couponCode: couponCode.trim().toUpperCase(),
          draftId: draftData.draftId,
          checkoutUrl: data.checkoutUrl,
          productSlug: product.slug,
          startAt: draftData.startAt,
          endAt: draftData.endAt,
          quantity,
          fulfillmentMode,
          deliveryType: deliveryOption,
          pickupLocationId: fulfillmentMode === "customer_pickup" ? selectedPickupLocationId : null,
          deliveryZoneId: fulfillmentMode !== "customer_pickup" ? selectedDeliveryZoneId : null,
          collectionZoneId: fulfillmentMode === "delivery_and_collection" ? selectedCollectionZoneId : null,
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
        const checkoutPolicy = data.policy as FulfillmentPolicyResponse | null;
        if (checkoutPolicy?.decision === "manual_confirmation") {
          setStep("dates");
          setFulfillmentPolicy(checkoutPolicy);
          setAvailabilityStatus("manual");
          setAvailabilityReason(
            policyMessages[locale][checkoutPolicy.reason as keyof typeof policyMessages.en] || t.manualHelp,
          );
          setBookingError("none");
        } else {
          setBookingError("checkout");
        }
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

  const whatsappService = fulfillmentMode === "customer_pickup" ? t.customerPickup : fulfillmentPolicy?.decision === "manual_confirmation"
    ? bookingText(locale, "Delivery timing needs confirmation")
    : `${deliveryOption === "express" ? t.express : t.standard} · ${fulfillmentMode === "delivery_and_collection" ? t.deliveryCollection : t.delivery}`;
  const whatsappDates = rentalWindow
    ? `${formatDisplayDate(rentalWindow.start, locale)} ${formatCustomerFulfillmentWindow(startTime, locale)} → ${formatDisplayDate(rentalWindow.end, locale)} ${formatCustomerFulfillmentWindow(endTime, locale)} (${displayPricing.days} ${displayPricing.days === 1 ? t.day : t.days})`
    : t.datesRequired;
  const whatsappMessage = `${bookingText(locale, "Hi! I'd like to book:")}\n\n📦 ${quantity} × ${product.name}\n📅 ${whatsappDates}\n🚚 ${whatsappService}\n\n${bookingText(locale, "Please confirm availability and price.")}`;
  const whatsappUrl = `https://wa.me/34684708013?text=${encodeURIComponent(whatsappMessage)}`;

  // Success state
  const couponField = !needsSupplyConfirmation && (
    <div className="mb-4 space-y-2">
      <label className="block text-xs font-medium text-neutral-500">
        {bookingText(locale, "Coupon code", "Código de descuento")}
        <input value={couponCode} maxLength={40} disabled={submitting || availabilityStatus === "checking"}
          onChange={(event) => { quoteRequest.current += 1; setCouponCode(event.target.value.toUpperCase()); setCouponError(""); setServerQuote(null); setAvailabilityStatus("idle"); }}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm" autoCapitalize="characters" autoComplete="off" />
      </label>
      <button type="button" disabled={submitting || availabilityStatus === "checking" || !rentalWindow}
        onClick={() => void checkAvailability()} className="text-sm font-semibold text-teal-700 disabled:opacity-50">
        {availabilityStatus === "checking" ? (bookingText(locale, "Checking…", "Comprobando…")) : (bookingText(locale, "Apply / update price", "Actualizar precio"))}
      </button>
      {couponCode && <button type="button" disabled={submitting || availabilityStatus === "checking"}
        onClick={() => { quoteRequest.current += 1; setCouponCode(""); setCouponError(""); setServerQuote(null); setAvailabilityStatus("idle"); }}
        className="ml-4 text-sm text-neutral-600 disabled:opacity-50">{bookingText(locale, "Remove code", "Quitar código")}</button>}
      <p className="text-xs text-neutral-500">{bookingText(locale, "Discounts apply to rental charges. Delivery and extra services keep their usual price.", "El descuento se aplica al alquiler, no a la entrega ni a los servicios adicionales.")}</p>
      {couponError && <p role="alert" className="text-sm text-red-700">{couponError}</p>}
      {serverQuote?.couponCode && <p role="status" className="text-sm text-teal-700">{bookingText(locale, "Code applied:", "Código aplicado:")} {serverQuote.couponCode}</p>}
    </div>
  );
  const couponDiscountLine = (serverQuote?.couponDiscountCents || 0) > 0 && (
    <div className="flex justify-between text-sm text-emerald-700"><span>{bookingText(locale, "Coupon discount", "Descuento")} ({serverQuote?.couponCode})</span><span>−{money((serverQuote?.couponDiscountCents || 0) / 100)}</span></div>
  );

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
        {calendarLink && mapsLink && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <a href={calendarLink} target="_blank" rel="noreferrer" className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
              Add to Google Calendar
            </a>
            <a href={mapsLink} target="_blank" rel="noreferrer" className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
              Open in Google Maps
            </a>
          </div>
        )}
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
            <GooglePlacesAddressInput
              locale={locale}
              unavailableMessage={locale === "de" ? "Adressvorschläge sind gerade nicht verfügbar. Du kannst die Adresse selbst eingeben." : undefined}
              value={address}
              onChange={setAddress}
              placeholder={bookingText(locale, "Start typing an address or place")}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              required
            />
          </div>
          )}
          {fulfillmentMode === "delivery_and_collection" && (
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.collectionAddress}</label>
              <GooglePlacesAddressInput
                locale={locale}
                unavailableMessage={locale === "de" ? "Adressvorschläge sind gerade nicht verfügbar. Du kannst die Adresse selbst eingeben." : undefined}
                value={collectionAddress}
                onChange={setCollectionAddress}
                placeholder={address || bookingText(locale, "Start typing a collection address")}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">{t.deliveryNotes}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
              placeholder={bookingText(locale, "Apartment 3B, ring buzzer")} />
          </div>

          {/* Price summary */}
          {couponField}
          <div className="border-t border-border pt-3 space-y-1.5">
            {couponDiscountLine}
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{money(displayPricing.perDay)} × {displayPricing.days} {displayPricing.days === 1 ? t.day : t.days} × {quantity}</span>
              <span className="font-medium">{money(displayPricing.subtotalBeforeDiscount)}</span>
            </div>
            {displayPricing.quantityDiscount > 0 && (
              <div className="flex justify-between text-sm text-emerald-700">
                <span>{t.quantityDiscount}</span>
                <span>−{money(displayPricing.quantityDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">{fulfillmentMode === "customer_pickup" ? t.customerPickup : t.delivery}</span>
              <span className="font-medium">{fulfillmentPricePending ? t.fulfillmentPending : displayPricing.fulfillmentBaseFee === 0 ? <span className="text-green-600">{t.free}</span> : money(displayPricing.fulfillmentBaseFee)}</span>
            </div>
            {displayPricing.expressSurcharge > 0 && (
              <div className="flex justify-between text-sm text-amber-700">
                <span>{t.expressSurcharge}</span>
                <span className="font-medium">{money(displayPricing.expressSurcharge)}</span>
              </div>
            )}
            {displayPricing.extraServicesFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">{t.extraServicesTitle}</span>
                <span className="font-medium">{money(displayPricing.extraServicesFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>{fulfillmentPricePending ? t.subtotalLabel : t.total}</span>
              <span className="text-brand">{money(displayPricing.total)}</span>
            </div>
          </div>

          {requiresConfirmation && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-900 font-semibold mb-1">{t.shortNoticeTitle}</p>
              <p className="text-xs text-amber-800">{t.shortNoticeMessage}</p>
            </div>
          )}

          <button type="submit" disabled={submitting || availabilityStatus !== "available"} className="btn btn-primary btn-lg w-full" id="booking-submit">
            {submitting ? t.submitting : t.submit}
          </button>
        </form>

        <p className="text-xs text-neutral-400 text-center mt-3">{needsSupplyConfirmation ? (bookingText(locale, "Confirmation before payment", "Confirmación antes del pago")) : t.securePayment}</p>
      </div>
    );
  }

  // Date selection step (default)
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6" id="booking-widget">
      <h3 className="font-bold text-lg mb-4">{needsSupplyConfirmation ? (bookingText(locale, "Request this item", "Solicitar este artículo")) : t.bookTitle}</h3>
      {needsSupplyConfirmation && <p className="text-sm text-neutral-600 mb-4">{supplyHelp}</p>}

      {activeCheckout && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-teal-900 font-semibold mb-2">{t.activeCheckout}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              className="btn btn-primary flex-1"
              disabled={!activeCheckoutMatchesSelection}
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
            min={minimumStartDate}
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
            min={startDate ? formatDate(addDays(new Date(startDate), 1)) : minimumStartDate}
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
          <select
            id="booking-start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          >
            {CUSTOMER_FULFILLMENT_WINDOWS.map((window) => (
              <option key={window.value} value={window.value}>
                {formatCustomerFulfillmentWindow(window.value, locale)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="booking-end-time" className="text-xs font-medium text-neutral-500 mb-1 block">
            {t.endTime}
          </label>
          <select
            id="booking-end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          >
            {CUSTOMER_FULFILLMENT_WINDOWS.map((window) => (
              <option key={window.value} value={window.value}>
                {formatCustomerFulfillmentWindow(window.value, locale)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-neutral-500 -mt-2 mb-4">
        {t.hoursHint}
      </p>

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
        {!needsSupplyConfirmation && availabilityStatus !== "idle" && (
          <p className="mt-1 text-xs text-neutral-500">
            {maxAvailableQuantity} {t.units} {t.availableUnits}
          </p>
        )}
      </div>

      {/* Duration display */}
      <div className="bg-brand/5 rounded-lg p-3 mb-4 text-center">
        {rentalWindow ? (
          <>
            <p className="text-sm text-brand font-semibold">
              {displayPricing.days} {displayPricing.days === 1 ? t.day : t.days} {t.rental}
            </p>
            <p className="text-xs text-neutral-500">
              {formatDisplayDate(rentalWindow.start, locale)} → {formatDisplayDate(rentalWindow.end, locale)}
            </p>
          </>
        ) : (
          <p className="text-sm text-brand font-semibold" aria-live="polite">{t.datesLoading}</p>
        )}
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

      {extraServiceOptions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-neutral-500 mb-2">{t.extraServicesTitle}</p>
          <div className="space-y-2">
            {extraServiceOptions.map((service) => {
              const label = service.serviceType === "assembly" ? t.assemblyLabel : t.disassemblyLabel;
              const checked = selectedExtraServices.includes(service.serviceType);
              return (
                <label
                  key={service.serviceType}
                  className="flex items-center justify-between gap-2 w-full p-3 rounded-lg border border-border text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedExtraServices((current) =>
                          checked
                            ? current.filter((type) => type !== service.serviceType)
                            : [...current, service.serviceType],
                        )
                      }
                    />
                    {label}
                  </span>
                  <span className="font-semibold text-neutral-600">{money(service.feeCents / 100)}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

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
              {bookingText(locale, "Typical confirmation lead time:", "Plazo habitual de confirmación:")} {selectedPickupLocation.lead_time_hours}h.
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
                {selectedDeliveryZone.customer_instructions || `${t.startTime}: ${selectedDeliveryZone.delivery_window}`}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-neutral-50 p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <input type="checkbox" checked={invoiceRequested} onChange={(e) => setInvoiceRequested(e.target.checked)} />
              {bookingText(locale, "I need a full invoice for my business")}
            </label>
            {invoiceRequested && <div className="mt-3 space-y-3">
              <input type="text" required value={billingCompanyName} onChange={(e) => setBillingCompanyName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm" placeholder={bookingText(locale, "Company legal name")} />
              <input type="text" required value={billingTaxId} onChange={(e) => setBillingTaxId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm" placeholder={bookingText(locale, "NIF / VAT ID")} />
              <input type="text" required value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border text-sm" placeholder={bookingText(locale, "Billing address")} />
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
                  {t.endTime}: {selectedCollectionZone.collection_window}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {fulfillmentMode !== "customer_pickup" && (
        <div className="mb-4" aria-live="polite" aria-atomic="true">
          <p className="text-xs font-medium text-neutral-500 mb-2">{t.derivedService}</p>
          {fulfillmentPolicy?.decision === "standard_checkout" || fulfillmentPolicy?.decision === "express_checkout" ? (
            <div className="rounded-xl border border-brand/30 bg-brand/5 p-3">
              <p className="text-sm font-semibold text-brand">
                {fulfillmentPolicy.deliveryType === "express" ? t.expressDerived : t.standardDerived}
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                {formatDisplayDate(new Date(`${startDate}T12:00:00`), locale)} {formatCustomerFulfillmentWindow(startTime, locale)} · {t.valenciaTime}
              </p>
              {fulfillmentPolicy.fees.expressSurchargeCents > 0 && (
                <p className="mt-1 text-xs font-medium text-amber-700">
                  {t.expressSurcharge}: {money(fulfillmentPolicy.fees.expressSurchargeCents / 100)}
                </p>
              )}
            </div>
          ) : fulfillmentPolicy?.decision === "manual_confirmation" ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-semibold text-amber-900">{t.manualTitle}</p>
              <p className="mt-1 text-xs text-amber-800">{availabilityReason || t.manualHelp}</p>
              <p className="mt-2 text-xs font-medium text-amber-900">{t.manualPrice}</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-neutral-50 p-3 text-xs text-neutral-600">
              {locale === "de" ? "Wir prüfen deinen Termin und zeigen dir Standardlieferung, Expresslieferung oder die persönliche Bestätigung über WhatsApp an." : locale === "es"
                ? "Comprobaremos el horario y asignaremos automáticamente entrega estándar, exprés o confirmación por WhatsApp."
                : "We’ll check the timing and automatically assign Standard, Express, or WhatsApp confirmation."}
            </div>
          )}
        </div>
      )}

      {/* Price Breakdown */}
      {couponField}
      {availabilityStatus !== "manual" && rentalWindow && (
      <div className="border-t border-border pt-4 mb-4 space-y-2">
        {couponDiscountLine}
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">
            {money(displayPricing.perDay)} × {displayPricing.days} {displayPricing.days === 1 ? t.day : t.days} × {quantity}
          </span>
          <span className="font-medium">{money(displayPricing.subtotalBeforeDiscount)}</span>
        </div>
        {displayPricing.quantityDiscount > 0 && (
          <div className="flex justify-between text-sm text-emerald-700">
            <span>{t.quantityDiscount}</span>
            <span>−{money(displayPricing.quantityDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">
            {fulfillmentMode === "customer_pickup" ? t.customerPickup : fulfillmentMode === "delivery_and_collection" ? t.deliveryCollection : t.delivery}
          </span>
          <span className="font-medium">
            {fulfillmentPricePending ? t.fulfillmentPending : displayPricing.fulfillmentBaseFee === 0 ? (
              <span className="text-green-600">{t.free}</span>
            ) : (
              money(displayPricing.fulfillmentBaseFee)
            )}
          </span>
        </div>
        {displayPricing.expressSurcharge > 0 && (
          <div className="flex justify-between text-sm text-amber-700">
            <span>{t.expressSurcharge}</span>
            <span className="font-medium">{money(displayPricing.expressSurcharge)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
          <span>{fulfillmentPricePending ? t.subtotalLabel : t.total}</span>
          <span className="text-brand">{money(displayPricing.total)}</span>
        </div>
      </div>
      )}

      {/* Availability Status */}
      {availabilityStatus === "available" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-sm text-emerald-700 font-medium">
          {t.available}
        </div>
      )}
      {availabilityStatus === "available" && requiresConfirmation && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-900 font-semibold mb-1">{t.shortNoticeTitle}</p>
          <p className="text-xs text-amber-800">{t.shortNoticeMessage}</p>
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
      {availabilityStatus === "manual" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-900 font-semibold mb-1">{t.manualTitle}</p>
          <p className="text-xs text-amber-800">{availabilityReason || t.manualHelp}</p>
        </div>
      )}
      {bookingError === "checkout" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800 font-semibold mb-1">{t.checkoutUnavailable}</p>
          <p className="text-xs text-amber-700">{t.checkoutUnavailableHelp}</p>
        </div>
      )}

      {/* CTAs */}
      {needsSupplyConfirmation && rentalWindow ? (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg w-full mb-3 block text-center" id="booking-whatsapp-cta">
          {requestLabel}
        </a>
      ) : bookingError === "checkout" ? (
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
          disabled={!rentalWindow}
          className="btn btn-primary btn-lg w-full mb-3 disabled:cursor-not-allowed disabled:opacity-60"
          id="booking-check-availability"
        >
          {needsSupplyConfirmation ? requestLabel : t.checkAvailability}
        </button>
      ) : availabilityStatus === "checking" ? (
        <button disabled className="btn btn-primary btn-lg w-full mb-3 opacity-60">
          {t.checking}
        </button>
      ) : availabilityStatus === "manual" ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBookingEvent("whatsapp_clicked_urgent_request", {
            productSlug: product.slug,
            fulfillmentMode,
            reason: fulfillmentPolicy?.reason || "manual_confirmation",
            leadTimeMinutes: fulfillmentPolicy?.leadTimeMinutes,
          })}
          className="btn btn-primary btn-lg w-full mb-3 block text-center"
          id="booking-whatsapp-cta"
        >
          {t.bookWhatsapp}
        </a>
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

      <p className="text-xs text-neutral-400 text-center mt-3">{needsSupplyConfirmation ? (bookingText(locale, "Confirmation before payment", "Confirmación antes del pago")) : t.securePayment}</p>
    </div>
  );
}
