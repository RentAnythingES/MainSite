"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type MapView = "city" | "region";

export interface DestinationMapItem {
  slug: string;
  name: string;
  type: string;
  tagline: string;
  distance?: string;
  transport?: string;
}

interface MapPosition {
  view: MapView;
  x: number;
  y: number;
}

const mapPositions: Record<string, MapPosition> = {
  benimaclet: { view: "city", x: 44, y: 18 },
  "patacona-beach": { view: "city", x: 82, y: 16 },
  "malvarrosa-beach": { view: "city", x: 80, y: 31 },
  cabanyal: { view: "city", x: 75, y: 44 },
  "el-carmen": { view: "city", x: 35, y: 42 },
  "turia-gardens": { view: "city", x: 54, y: 46 },
  "el-ensanche": { view: "city", x: 46, y: 56 },
  ruzafa: { view: "city", x: 51, y: 68 },
  "city-of-arts-and-sciences": { view: "city", x: 66, y: 61 },
  requena: { view: "region", x: 16, y: 41 },
  sagunto: { view: "region", x: 69, y: 18 },
  albufera: { view: "region", x: 69, y: 65 },
  xativa: { view: "region", x: 52, y: 84 },
};

const typeLabels: Record<string, string> = {
  neighbourhood: "Neighbourhood",
  beach: "Beach",
  attraction: "Attraction",
  "day-trip": "Day trip",
};

export default function DestinationMap({ destinations }: { destinations: DestinationMapItem[] }) {
  const mappedDestinations = useMemo(
    () => destinations.filter((destination) => mapPositions[destination.slug]),
    [destinations],
  );
  const [view, setView] = useState<MapView>("city");
  const visibleDestinations = mappedDestinations.filter(
    (destination) => mapPositions[destination.slug].view === view,
  );
  const [selectedSlug, setSelectedSlug] = useState(visibleDestinations[0]?.slug || "");

  const selected =
    visibleDestinations.find((destination) => destination.slug === selectedSlug) ||
    visibleDestinations[0];

  const changeView = (nextView: MapView) => {
    setView(nextView);
    const firstDestination = mappedDestinations.find(
      (destination) => mapPositions[destination.slug].view === nextView,
    );
    setSelectedSlug(firstDestination?.slug || "");
  };

  if (!selected) return null;

  return (
    <section className="section bg-white" aria-labelledby="destination-map-heading">
      <div className="container-site">
        <div className="max-w-3xl mb-8">
          <span className="badge badge-brand mb-3">Plan your stay</span>
          <h2 id="destination-map-heading" className="text-3xl font-bold mb-3">
            See where each guide takes you
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Compare city areas and day trips before opening the full guide. This is a
            schematic orientation map, not a navigation map—always check the current route
            before travelling.
          </p>
        </div>

        <div className="flex gap-2 mb-5" role="group" aria-label="Map area">
          <button
            type="button"
            onClick={() => changeView("city")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              view === "city"
                ? "bg-brand text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
            aria-pressed={view === "city"}
          >
            Valencia city
          </button>
          <button
            type="button"
            onClick={() => changeView("region")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              view === "region"
                ? "bg-brand text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
            aria-pressed={view === "region"}
          >
            Day trips
          </button>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)] gap-6 items-stretch">
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-neutral-200 bg-[#f4efe4] shadow-sm">
            <div
              className="absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(14,124,115,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(14,124,115,0.12) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />
            <div className="absolute right-0 top-0 h-full w-[16%] bg-gradient-to-l from-sky-300 to-sky-100 border-l border-sky-300/70" />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700/70">
              Mediterranean
            </span>

            {view === "city" ? (
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
                <path
                  d="M3 58 C18 52, 25 48, 37 50 S57 59, 73 51 S88 38, 98 42"
                  fill="none"
                  stroke="#30A596"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            ) : (
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
                <path
                  d="M82 0 C77 18, 84 31, 78 48 S83 72, 75 100"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  opacity="0.45"
                />
                <circle cx="67" cy="50" r="5" fill="#0E7C73" opacity="0.15" />
              </svg>
            )}

            <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-neutral-600 shadow-sm backdrop-blur-sm">
              ↑ North
            </div>
            {view === "region" && (
              <div className="absolute rounded-full border-2 border-brand/30 bg-white/80 px-3 py-1 text-xs font-bold text-brand" style={{ left: "61%", top: "46%" }}>
                Valencia
              </div>
            )}

            {visibleDestinations.map((destination, index) => {
              const position = mapPositions[destination.slug];
              const isSelected = destination.slug === selected.slug;
              return (
                <button
                  key={destination.slug}
                  type="button"
                  onClick={() => setSelectedSlug(destination.slug)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-extrabold shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-brand/25 ${
                    isSelected
                      ? "z-20 scale-125 border-white bg-amber-500 text-neutral-950"
                      : "z-10 border-white bg-brand text-white hover:scale-110"
                  }`}
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  aria-label={`Show ${destination.name}`}
                  aria-pressed={isSelected}
                  title={destination.name}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="card p-6 md:p-7 flex flex-col" aria-live="polite">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-brand text-xs">
                {typeLabels[selected.type] || selected.type}
              </span>
              {selected.distance && (
                <span className="text-xs text-neutral-500">📍 {selected.distance}</span>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-3">{selected.name}</h3>
            <p className="text-neutral-600 leading-relaxed mb-5">{selected.tagline}</p>
            {selected.transport && (
              <div className="rounded-xl bg-teal-50 p-4 mb-6">
                <span className="block text-xs font-bold uppercase tracking-wide text-brand mb-1">
                  Getting there
                </span>
                <p className="text-sm text-neutral-700 leading-relaxed">{selected.transport}</p>
              </div>
            )}
            <Link href={`/discover/${selected.slug}`} className="btn btn-primary mt-auto w-full">
              Open {selected.name} guide
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          {visibleDestinations.map((destination, index) => (
            <button
              key={destination.slug}
              type="button"
              onClick={() => setSelectedSlug(destination.slug)}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
                destination.slug === selected.slug
                  ? "border-brand bg-teal-50 text-brand"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-brand/40"
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="font-semibold leading-tight">{destination.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
