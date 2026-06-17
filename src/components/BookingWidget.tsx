"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/data/products";

interface BookingWidgetProps {
  product: Product;
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

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function BookingWidget({ product }: BookingWidgetProps) {
  const tomorrow = addDays(new Date(), 1);
  const [startDate, setStartDate] = useState(formatDate(tomorrow));
  const [endDate, setEndDate] = useState(formatDate(addDays(tomorrow, 3)));
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "express">("standard");

  const pricing = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = daysBetween(start, end);

    // Find applicable tier (highest tier where days >= tier.days)
    const tier = [...product.pricing]
      .sort((a, b) => b.days - a.days)
      .find((t) => days >= t.days) || product.pricing[0];

    const subtotal = tier.perDay * days;
    const deliveryFee = deliveryOption === "express" ? 15 : subtotal >= 50 ? 0 : 10;
    const total = subtotal + deliveryFee;

    return { days, perDay: tier.perDay, subtotal, deliveryFee, total };
  }, [startDate, endDate, deliveryOption, product.pricing]);

  const whatsappMessage = `Hi! I'd like to book:\n\n📦 ${product.name}\n📅 ${formatDisplayDate(new Date(startDate))} → ${formatDisplayDate(new Date(endDate))} (${pricing.days} days)\n💰 €${pricing.total} total\n🚚 ${deliveryOption === "express" ? "Express" : "Standard"} delivery\n\nPlease confirm availability!`;

  const whatsappUrl = `https://wa.me/34600000000?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6" id="booking-widget">
      <h3 className="font-bold text-lg mb-4">Book This Item</h3>

      {/* Date Pickers */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label htmlFor="booking-start" className="text-xs font-medium text-neutral-500 mb-1 block">
            Start Date
          </label>
          <input
            id="booking-start"
            type="date"
            value={startDate}
            min={formatDate(tomorrow)}
            onChange={(e) => {
              setStartDate(e.target.value);
              // Auto-adjust end date if it's before start
              if (new Date(e.target.value) >= new Date(endDate)) {
                setEndDate(formatDate(addDays(new Date(e.target.value), 1)));
              }
            }}
            className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="booking-end" className="text-xs font-medium text-neutral-500 mb-1 block">
            End Date
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
          {pricing.days} {pricing.days === 1 ? "day" : "days"} rental
        </p>
        <p className="text-xs text-neutral-500">
          {formatDisplayDate(new Date(startDate))} → {formatDisplayDate(new Date(endDate))}
        </p>
      </div>

      {/* Delivery Option */}
      <div className="mb-4">
        <p className="text-xs font-medium text-neutral-500 mb-2">Delivery</p>
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
            <p className="font-semibold">Standard</p>
            <p className="text-xs text-neutral-500">
              {pricing.subtotal >= 50 ? "Free" : "€10"} · Next day
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
            <p className="font-semibold">Express</p>
            <p className="text-xs text-neutral-500">€15 · Same day</p>
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-border pt-4 mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">
            €{pricing.perDay} × {pricing.days} {pricing.days === 1 ? "day" : "days"}
          </span>
          <span className="font-medium">€{pricing.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Delivery</span>
          <span className="font-medium">
            {pricing.deliveryFee === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `€${pricing.deliveryFee}`
            )}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
          <span>Total</span>
          <span className="text-brand">€{pricing.total}</span>
        </div>
      </div>

      {/* CTA */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary btn-lg w-full mb-3"
        id="booking-whatsapp-cta"
      >
        💬 Book via WhatsApp
      </a>
      <p className="text-xs text-neutral-400 text-center">
        No payment needed yet — we&apos;ll confirm availability first
      </p>
    </div>
  );
}
