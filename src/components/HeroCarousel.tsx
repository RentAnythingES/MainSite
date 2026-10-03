"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  { src: "/hero/valencia-1.webp", alt: "Aerial view of Valencia Old Town at golden hour" },
  { src: "/hero/valencia-2.webp", alt: "Sunset over Turia Gardens and City of Arts and Sciences" },
  { src: "/hero/valencia-3.webp", alt: "Valencia beach promenade with palm trees at golden hour" },
];

export default function HeroCarousel({ locale = "en" }: { locale?: "en" | "es" | "de" }) {
  const localizedAlt = {
    en: slides.map(slide => slide.alt),
    es: ["Vista aérea del casco antiguo de Valencia al atardecer", "Atardecer sobre el Jardín del Turia y la Ciudad de las Artes y las Ciencias", "Paseo marítimo de Valencia con palmeras al atardecer"],
    de: ["Luftaufnahme der Altstadt von Valencia im Abendlicht", "Sonnenuntergang über dem Turia-Park und der Stadt der Künste und Wissenschaften", "Valencias Strandpromenade mit Palmen im Abendlicht"],
  };
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={localizedAlt[locale][i]}
          fill
          className={`object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
          sizes="100vw"
        />
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`${locale === "de" ? "Bild anzeigen" : locale === "es" ? "Ir a la imagen" : "Go to slide"} ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
