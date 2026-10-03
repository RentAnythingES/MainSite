import Image from "next/image";
import Link from "next/link";
import BundleCard from "@/components/BundleCard";
import type { RentalBundle } from "@/data/bundles";
import { localeRegistry, type Locale } from "@/i18n/config";

const copy = {
  en: { alt: "Valencia beach and city stay essentials", badge: "Valencia kits & bundles", title: "Travel light.", accent: "Feel at home.", intro: "Start with the situation that fits your stay. Each kit groups the bulky, useful things people usually wish they had brought, then lets us tailor the final setup around your dates and accommodation.", browse: "Browse Kits ↓", custom: "Request something custom", choose: "Choose by stay type", heading: "Rental kits for real Valencia situations", description: "Kits are the bridge between local planning guides and individual products. They are not rigid packages: they are starting points for a practical setup we can adapt as inventory grows.", view: "View kit →", steps: [["Start with a kit", "Pick the closest scenario: baby arrival, beach day, apartment comfort, remote work, or accessibility support."], ["Adjust the setup", "Add or remove items based on ages, accommodation, delivery area, and what we actually have available."], ["Confirm availability", "Until online kit checkout is fully configured, we can confirm the best option directly and avoid overpromising stock."]] },
  es: { alt: "Equipamiento para una estancia cómoda en Valencia", badge: "Kits y paquetes en Valencia", title: "Viaja ligero.", accent: "Siéntete como en casa.", intro: "Empieza por la situación que más se parece a tu estancia. Cada kit reúne artículos útiles y voluminosos y nos permite adaptar la combinación final a tus fechas, alojamiento y necesidades.", browse: "Ver kits ↓", custom: "Solicitar algo personalizado", choose: "Elige según tu estancia", heading: "Kits para situaciones reales en Valencia", description: "Los kits conectan nuestras guías locales con productos concretos. No son paquetes rígidos: son puntos de partida que adaptamos según el inventario y lo que realmente necesitas.", view: "Ver kit →", steps: [["Empieza con un kit", "Elige el escenario más parecido: bebé, playa, apartamento, teletrabajo o accesibilidad."], ["Ajusta la combinación", "Añade o quita artículos según edades, alojamiento, zona de servicio e inventario."], ["Confirma disponibilidad", "Comprobamos la mejor opción y el precio final antes de aceptar ningún pago."]] },
  de: { alt: "Strand und Stadt für deinen Aufenthalt in Valencia", badge: "Mietpakete in Valencia", title: "Mit leichtem Gepäck reisen.", accent: "Dich wie zu Hause fühlen.", intro: "Beginne mit dem Paket, das zu deinem Aufenthalt passt. Jedes Paket bündelt praktische, sperrige Artikel. Gemeinsam stimmen wir die endgültige Auswahl auf deine Termine und Unterkunft ab.", browse: "Pakete entdecken ↓", custom: "Individuelle Zusammenstellung anfragen", choose: "Nach deinem Aufenthalt auswählen", heading: "Mietpakete für deinen Alltag in Valencia", description: "Die Pakete helfen dir, passende einzelne Mietartikel zusammenzustellen. Wir passen die Auswahl an deinen Bedarf und den verfügbaren Bestand an.", view: "Paket ansehen →", steps: [["Mit einem Paket beginnen", "Wähle den passenden Ausgangspunkt: Ankunft mit Baby, Strandtag, Apartment, Arbeiten unterwegs oder Mobilität."], ["Die Auswahl anpassen", "Ergänze oder entferne Artikel nach Alter, Unterkunft, Liefergebiet und verfügbarem Bestand."], ["Verfügbarkeit bestätigen", "Wir prüfen die passenden Möglichkeiten und bestätigen den Gesamtpreis vor einer Zahlung."]] },
};

export default function BundleHub({ bundles, locale, prefix = localeRegistry[locale].prefix }: { bundles: RentalBundle[]; locale: Locale; prefix?: string }) {
  const text = copy[locale];
  return <>
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/hero/valencia-3.webp" alt={text.alt} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/50" /><div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="container-site relative z-10 py-16 md:py-24"><div className="max-w-3xl">
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-md">{text.badge}</span>
        <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{text.title}{" "}<span className="text-amber-400">{text.accent}</span></h1>
        <p className="mt-6 text-lg text-white/90 leading-relaxed max-w-2xl" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{text.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3"><a href="#kits" className="btn btn-primary btn-lg">{text.browse}</a><Link href={`${prefix}/contact`} className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">{text.custom}</Link></div>
      </div></div>
    </section>
    <section className="section bg-white" id="kits"><div className="container-site">
      <div className="max-w-2xl mb-10"><span className="badge badge-brand mb-3">{text.choose}</span><h2 className="text-3xl font-bold mb-3">{text.heading}</h2><p className="text-neutral-600 leading-relaxed">{text.description}</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{bundles.map(bundle => <BundleCard key={bundle.slug} bundle={bundle} id={`kit-${bundle.slug}`} basePath={`${prefix}/valencia/kits`} ctaLabel={text.view} />)}</div>
    </div></section>
    <section className="section bg-neutral-50"><div className="container-site"><div className="grid md:grid-cols-3 gap-6">{text.steps.map(([title, body], index) => <div className="card p-6 bg-white" key={title}><span className="text-3xl">{index + 1}</span><h3 className="mt-3 font-bold text-lg">{title}</h3><p className="mt-2 text-sm text-neutral-500">{body}</p></div>)}</div></div></section>
  </>;
}
