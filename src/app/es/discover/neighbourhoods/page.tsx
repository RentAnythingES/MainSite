import Link from "next/link";
import type { Metadata } from "next";
import { getSpanishDestinationsByHub } from "@/content/destinations-es";
import { getBreadcrumbJsonLd, getHubCollectionJsonLd } from "@/lib/jsonld";
import DiscoverHubEditorial from "@/components/DiscoverHubEditorial";

const url = "https://rentanything.es/es/discover/neighbourhoods";
const description = "Compara barrios de Valencia para alojarte: ambiente, ruido, transporte, playa, vida diaria, accesibilidad y servicios para elegir una base práctica.";

export const metadata: Metadata = {
  title: "Barrios de Valencia: dónde alojarse",
  description,
  alternates: {
    canonical: url,
    languages: { en: "https://rentanything.es/discover/neighbourhoods", es: url, "x-default": "https://rentanything.es/discover/neighbourhoods" },
  },
};

const editorial = {
  introTitle: "Cómo elegir dónde alojarse en Valencia",
  intro: [
    "El barrio cambia el ritmo de toda la estancia. Una base histórica reduce desplazamientos turísticos, una zona marítima facilita los días de playa y un distrito residencial puede ofrecer noches más tranquilas y servicios cotidianos.",
    "Compara transporte, ruido nocturno, supermercados, ascensor, temperatura del apartamento y frecuencia con la que cruzarás la ciudad. La zona más popular no siempre es la más práctica para tu grupo.",
  ],
  choiceTitle: "Elige barrio según tu tipo de viaje",
  choices: [
    { title: "Ruzafa", description: "Restaurantes, tiendas independientes y vida nocturna cerca del centro.", href: "/es/discover/ruzafa" },
    { title: "El Carmen", description: "Calles históricas y monumentos centrales, con edificios antiguos y actividad nocturna.", href: "/es/discover/el-carmen" },
    { title: "Cabanyal", description: "Carácter marítimo, arquitectura popular y acceso sencillo a las playas urbanas.", href: "/es/discover/cabanyal" },
    { title: "Benimaclet", description: "Ambiente residencial y estudiantil con servicios locales y conexión de tranvía.", href: "/es/discover/benimaclet" },
    { title: "El Ensanche", description: "Compras, arquitectura elegante y posición central entre Ciutat Vella y Ruzafa.", href: "/es/discover/el-ensanche" },
  ],
  planningTitle: "Comprueba antes de reservar",
  planningPoints: [
    "Calcula el trayecto real hasta metro, tranvía o autobús útil.",
    "Revisa ruido nocturno si viajas con niños o necesitas madrugar.",
    "Confirma ascensor, escalones y anchura de acceso en edificios antiguos.",
    "Comprueba climatización, espacio de trabajo y almacenamiento del apartamento.",
  ],
  pathways: [
    { title: "Planifica toda la estancia", description: "Conecta el barrio con categorías, entrega y necesidades prácticas para tu estancia en Valencia.", href: "/es/valencia", label: "Ver alquileres en Valencia" },
    { title: "Necesidades que no caben en la maleta", description: "Consulta kits para familias, teletrabajo, verano y accesibilidad.", href: "/valencia/kits", label: "Ver kits de Valencia" },
  ],
  faqs: [
    { question: "¿Cuál es el mejor barrio para una primera visita?", answer: "El Carmen reduce desplazamientos a monumentos, mientras Ruzafa ofrece restauración y ambiente cerca del centro. La mejor elección depende del descanso, playa, espacio y transporte que necesites." },
    { question: "¿Qué barrio es mejor para la playa?", answer: "Cabanyal es la base urbana más clara para acceder al litoral. Las zonas concretas de playa se comparan en la sección de Playas porque su intención principal es el día junto al mar." },
    { question: "¿Se puede explorar Valencia sin alojarse en el centro?", answer: "Sí. Metro, tranvía, autobús y bicicleta conectan muchas zonas, pero conviene calcular el trayecto desde la dirección exacta y no solo desde el nombre del barrio." },
    { question: "¿Qué zonas funcionan para una estancia larga?", answer: "Benimaclet y partes de Cabanyal ofrecen un ritmo más residencial; Ruzafa y El Ensanche mantienen más servicios centrales. El estado del apartamento importa tanto como la zona." },
  ],
};

export default function SpanishNeighbourhoodsHub() {
  const guides = getSpanishDestinationsByHub("neighbourhoods");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getHubCollectionJsonLd({ name: "Barrios de Valencia", description, url, locale: "es", items: guides.map((guide) => ({ name: guide.name, url: `https://rentanything.es/es/discover/${guide.slug}` })) })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbJsonLd([{ name: "Inicio", url: "https://rentanything.es/es" }, { name: "Descubre Valencia", url: "https://rentanything.es/es/discover" }, { name: "Barrios", url }])) }} />
      <nav className="bg-neutral-50 border-b border-border py-3"><div className="container-site text-sm text-neutral-500"><Link href="/es" className="hover:text-brand">Inicio</Link> / <Link href="/es/discover" className="hover:text-brand">Descubre Valencia</Link> / <span className="font-medium text-neutral-800">Barrios</span></div></nav>
      <header className="bg-gradient-to-br from-teal-50/40 to-amber-50/20 py-14 md:py-20">
        <div className="container-site"><span className="text-5xl block mb-4">🏘️</span><h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Barrios de Valencia</h1><p className="text-lg text-neutral-600 max-w-2xl">Compara cinco zonas con personalidades distintas para encontrar una base que encaje con tu estancia.</p></div>
      </header>
      <section className="section bg-white"><div className="container-site"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{guides.map((guide) => <Link key={guide.slug} href={`/es/discover/${guide.slug}`} className="card p-6 hover:shadow-md transition-shadow group"><h2 className="font-bold text-lg mb-1 group-hover:text-brand">{guide.name}</h2><p className="text-sm text-neutral-500 mb-3">{guide.tagline}</p><span className="text-sm font-semibold text-brand">Leer la guía →</span></Link>)}</div></div></section>
      <DiscoverHubEditorial {...editorial} guideLabel="Ver la guía →" faqTitle="Preguntas para elegir barrio" />
    </>
  );
}
