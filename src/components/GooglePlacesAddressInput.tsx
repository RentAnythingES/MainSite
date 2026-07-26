"use client";

import { useEffect, useId, useRef, useState } from "react";

interface GooglePlacesAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  autoComplete?: string;
}

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: Record<string, unknown>) => {
            addListener: (eventName: string, handler: () => void) => void;
            getPlace: () => { formatted_address?: string };
          };
          AutocompleteService: unknown;
        };
        event: {
          clearInstanceListeners: (instance: unknown) => void;
        };
      };
    };
  }
}

export default function GooglePlacesAddressInput({
  value,
  onChange,
  placeholder,
  className,
  label,
  required = false,
  autoComplete = "street-address",
}: GooglePlacesAddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setLoaded(true);
      return;
    }

    if (window.google?.maps?.places) {
      setLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-maps-places-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => setLoaded(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-places-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=en`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError("Google Maps suggestions are unavailable right now.");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded || !inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: ["formatted_address"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });

    return () => {
      // Leave cleanup to the browser runtime; this avoids strict typing issues with the Google Maps API types.
    };
  }, [loaded, onChange]);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-neutral-400" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={className}
      />
      {error && <p className="mt-2 text-xs text-amber-400">{error}</p>}
    </div>
  );
}
