import Link from "next/link";
import {
  BUSINESS_SCHEMA_ID,
  getBreadcrumbJsonLd,
  getFaqJsonLd,
} from "@/lib/jsonld";

import { localeRegistry, type Locale } from "@/i18n/config";

const copy = {
  en: {
    pageUrl: "https://rentandroll.com/valencia/host-services",
    homeUrl: "https://rentandroll.com",
    valenciaUrl: "https://rentandroll.com/valencia",
    valenciaHref: "/valencia",
    contactHref: "/contact",
    kitsHref: "/valencia/kits",
    categoryPrefix: "/rental",
    badge: "For hosts and property managers",
    title: "Guest equipment without permanent storage",
    intro:
      "Help Valencia guests arrange useful equipment for their stay without buying, storing, and maintaining every occasional request yourself.",
    primaryCta: "Discuss a host setup",
    secondaryCta: "View guest-ready kits",
    whatsappText:
      "Hi, I manage accommodation in Valencia and would like to discuss guest equipment support.",
    breadcrumbHome: "Home",
    breadcrumbValencia: "Valencia rentals",
    breadcrumbCurrent: "Host services",
    serviceName: "Guest equipment support for Valencia accommodation",
    serviceDescription:
      "Rental equipment coordination for Valencia holiday-rental hosts, property managers, aparthotels, and relocation teams.",
    sectionTitle: "A practical extension to your guest service",
    sectionIntro:
      "We focus on the equipment request. You keep control of the accommodation and guest relationship.",
    benefits: [
      {
        title: "Refer guests directly",
        text: "Share the relevant category, kit, or product page. The guest can check dates and complete the normal booking process directly with us.",
      },
      {
        title: "Handle recurring requests",
        text: "If you manage several stays, tell us which requests appear repeatedly. We can review a sensible workflow around real inventory and service areas.",
      },
      {
        title: "Keep promises accurate",
        text: "Every request remains subject to dates, inventory, and fulfillment availability. Nothing is presented to a guest as confirmed until it is actually confirmed.",
      },
    ],
    categoriesTitle: "Common guest requests",
    categoriesIntro:
      "Start with the guest need. We can then confirm a suitable individual item or a broader setup.",
    categories: [
      { name: "Baby & Toddler", slug: "baby-gear", text: "Cots, high chairs, strollers, and arrival essentials" },
      { name: "Mobility & Accessibility", slug: "mobility", text: "Wheelchairs, rollators, scooters, and daily-living support" },
      { name: "Apartment Comfort", slug: "home-living", text: "Cooling, air quality, kitchen, and long-stay upgrades" },
      { name: "Beach & Outdoor", slug: "travel-outdoors", text: "Shade, coolers, chairs, wagons, and family beach gear" },
      { name: "Remote Work", slug: "remote-work", text: "Monitors, ergonomic seating, desks, and accessories" },
    ],
    processTitle: "How to start",
    process: [
      { title: "Describe your accommodation", text: "Tell us the area, number of properties, guest profile, and the requests you receive most often." },
      { title: "Choose a simple workflow", text: "Use direct guest referrals or discuss a staff-reviewed process for recurring requests." },
      { title: "Confirm each requirement", text: "Dates, inventory, delivery or pickup, and pricing are confirmed before the request becomes a booking." },
    ],
    boundaryTitle: "What this service does not include",
    boundaryText:
      "Rent&Roll is an equipment-rental service. We do not manage listings, keys, housekeeping, maintenance, licensing, or accommodation compliance. This page does not imply an Airbnb endorsement or partnership.",
    faqTitle: "Host service questions",
    faqs: [
      { q: "Can my guest book directly?", a: "Yes. You can share a relevant Rent&Roll page and the guest can use the normal availability and booking flow. A booking is only confirmed after the checkout process succeeds." },
      { q: "Do I need to keep equipment at the property?", a: "No. The purpose of the service is to help with occasional or recurring guest requests without requiring every property to store every item permanently." },
      { q: "Can you guarantee equipment for every stay?", a: "No. Availability depends on the requested dates, inventory, and fulfillment capacity. We confirm each request before it is presented as booked." },
      { q: "Do you offer portfolio or recurring pricing?", a: "We can review recurring needs with hosts and property managers. Any workflow or pricing is agreed individually after the request pattern and operational requirements are clear." },
      { q: "Do you manage holiday-rental properties?", a: "No. We provide rental equipment support only. We do not provide property management, cleaning, key handling, listing management, or licensing services." },
    ],
    finalTitle: "Tell us what your guests ask for",
    finalText:
      "Send the property area, typical stay length, and the equipment requests you see. We will tell you honestly what can be supported now.",
    finalCta: "Message us on WhatsApp",
    emailCta: "Use the contact form",
  },
  es: {
    pageUrl: "https://rentandroll.com/es/valencia/servicios-anfitriones",
    homeUrl: "https://rentandroll.com/es",
    valenciaUrl: "https://rentandroll.com/es/valencia",
    valenciaHref: "/es/valencia",
    contactHref: "/es/contact",
    kitsHref: "/es/valencia/kits",
    categoryPrefix: "/es/rental",
    badge: "Para anfitriones y gestores",
    title: "Equipamiento para huéspedes sin almacenarlo",
    intro:
      "Ayuda a tus huéspedes en Valencia a conseguir equipamiento útil para su estancia sin tener que comprar, almacenar y mantener cada artículo ocasional.",
    primaryCta: "Consultar una solución",
    secondaryCta: "Ver kits para estancias",
    whatsappText:
      "Hola, gestiono un alojamiento en Valencia y quiero consultar opciones de equipamiento para huéspedes.",
    breadcrumbHome: "Inicio",
    breadcrumbValencia: "Alquiler en Valencia",
    breadcrumbCurrent: "Servicios para anfitriones",
    serviceName: "Equipamiento para huéspedes de alojamientos en Valencia",
    serviceDescription:
      "Coordinación de equipamiento de alquiler para anfitriones, gestores, apartahoteles y equipos de relocation en Valencia.",
    sectionTitle: "Una extensión práctica de tu atención al huésped",
    sectionIntro:
      "Nos centramos en la solicitud de equipamiento. Tú mantienes el control del alojamiento y de la relación con el huésped.",
    benefits: [
      {
        title: "Deriva al huésped directamente",
        text: "Comparte la categoría, el kit o el producto adecuado. El huésped puede consultar fechas y completar con nosotros el proceso normal de reserva.",
      },
      {
        title: "Gestiona solicitudes recurrentes",
        text: "Si gestionas varias estancias, cuéntanos qué solicitudes se repiten. Revisaremos un proceso realista según inventario y zonas de servicio.",
      },
      {
        title: "Comunica solo lo confirmado",
        text: "Cada solicitud depende de fechas, inventario y capacidad de entrega. Nada se presenta al huésped como confirmado antes de estarlo realmente.",
      },
    ],
    categoriesTitle: "Solicitudes habituales de huéspedes",
    categoriesIntro:
      "Empieza por la necesidad del huésped. Después podemos confirmar un artículo concreto o una solución más completa.",
    categories: [
      { name: "Bebés y niños pequeños", slug: "baby-gear", text: "Cunas, tronas, cochecitos y esenciales de llegada" },
      { name: "Movilidad y accesibilidad", slug: "mobility", text: "Sillas de ruedas, andadores, scooters y ayudas diarias" },
      { name: "Confort del apartamento", slug: "home-living", text: "Climatización, aire, cocina y mejoras para estancias largas" },
      { name: "Playa y exterior", slug: "travel-outdoors", text: "Sombra, neveras, sillas, carros y material familiar de playa" },
      { name: "Teletrabajo", slug: "remote-work", text: "Monitores, sillas ergonómicas, escritorios y accesorios" },
    ],
    processTitle: "Cómo empezar",
    process: [
      { title: "Describe tu alojamiento", text: "Indica la zona, número de propiedades, perfil del huésped y las solicitudes más frecuentes." },
      { title: "Elige un proceso sencillo", text: "Utiliza la derivación directa del huésped o consulta un proceso revisado para solicitudes recurrentes." },
      { title: "Confirma cada necesidad", text: "Las fechas, el inventario, la entrega o recogida y el precio se confirman antes de crear una reserva." },
    ],
    boundaryTitle: "Qué no incluye este servicio",
    boundaryText:
      "Rent&Roll es un servicio de alquiler de equipamiento. No gestionamos anuncios, llaves, limpieza, mantenimiento, licencias ni cumplimiento normativo del alojamiento. Esta página no implica colaboración ni respaldo de Airbnb.",
    faqTitle: "Preguntas de anfitriones",
    faqs: [
      { q: "¿Puede reservar directamente mi huésped?", a: "Sí. Puedes compartir una página relevante de Rent&Roll y el huésped utilizará el proceso normal de disponibilidad y reserva. La reserva solo queda confirmada cuando el pago finaliza correctamente." },
      { q: "¿Tengo que guardar el equipamiento en la propiedad?", a: "No. El objetivo es atender solicitudes ocasionales o recurrentes sin obligar a cada propiedad a almacenar permanentemente todos los artículos." },
      { q: "¿Podéis garantizar equipamiento para cada estancia?", a: "No. La disponibilidad depende de las fechas solicitadas, el inventario y la capacidad de servicio. Confirmamos cada solicitud antes de considerarla reservada." },
      { q: "¿Ofrecéis precios para carteras o solicitudes recurrentes?", a: "Podemos revisar necesidades recurrentes con anfitriones y gestores. Cualquier proceso o precio se acuerda individualmente cuando estén claros el patrón de solicitudes y los requisitos operativos." },
      { q: "¿Gestionáis apartamentos turísticos?", a: "No. Solo prestamos apoyo de alquiler de equipamiento. No ofrecemos gestión de propiedades, limpieza, llaves, anuncios ni licencias." },
    ],
    finalTitle: "Cuéntanos qué solicitan tus huéspedes",
    finalText:
      "Indica la zona, la duración habitual de las estancias y el equipamiento que suelen pedir. Te diremos con claridad qué podemos atender ahora.",
    finalCta: "Escribir por WhatsApp",
    emailCta: "Usar el formulario de contacto",
  },
  de: {
  "pageUrl": "https://rentandroll.com/de/valencia/host-services",
  "homeUrl": "https://rentandroll.com/de",
  "valenciaUrl": "https://rentandroll.com/de/valencia",
  "valenciaHref": "/de/valencia",
  "contactHref": "/de/contact",
  "kitsHref": "/de/valencia/kits",
  "categoryPrefix": "/de/rental",
  "badge": "Für Gastgeber und Unterkunftsverwaltungen",
  "title": "Ausstattung für Gäste ohne dauerhaften Lagerbedarf",
  "intro": "Hilf deinen Gästen in Valencia, nützliche Ausstattung für ihren Aufenthalt zu organisieren, ohne jeden gelegentlich benötigten Artikel selbst kaufen, lagern und warten zu müssen.",
  "primaryCta": "Ausstattung für deine Unterkunft besprechen",
  "secondaryCta": "Mietpakete für Gäste ansehen",
  "whatsappText": "Hallo, ich verwalte eine Unterkunft in Valencia und möchte die Unterstützung bei der Ausstattung für Gäste besprechen.",
  "breadcrumbHome": "Startseite",
  "breadcrumbValencia": "Mietartikel in Valencia",
  "breadcrumbCurrent": "Service für Gastgeber",
  "serviceName": "Ausstattungsservice für Gäste in Unterkünften in Valencia",
  "serviceDescription": "Organisation von Mietartikeln für Ferienwohnungsanbieter, Unterkunftsverwaltungen, Aparthotels und Relocation-Teams in Valencia.",
  "sectionTitle": "Eine praktische Ergänzung für deinen Gästeservice",
  "sectionIntro": "Wir kümmern uns um die angefragte Ausstattung. Du behältst die Verantwortung für die Unterkunft und den Kontakt zu deinen Gästen.",
  "benefits": [
    {
      "title": "Gäste direkt an uns verweisen",
      "text": "Teile die passende Kategorie-, Mietpaket- oder Produktseite. Deine Gäste können ihre Daten prüfen und die reguläre Buchung direkt bei uns abschließen."
    },
    {
      "title": "Wiederkehrende Anfragen organisieren",
      "text": "Wenn du mehrere Unterkünfte betreust, erzähl uns, welche Wünsche regelmäßig auftauchen. Gemeinsam können wir einen sinnvollen Ablauf auf Grundlage des tatsächlichen Bestands und unserer Servicegebiete prüfen."
    },
    {
      "title": "Verlässlich informieren",
      "text": "Jede Anfrage hängt von Reisedaten, Bestand und verfügbaren Übergabeoptionen ab. Gegenüber Gästen gilt nichts als bestätigt, bevor es tatsächlich bestätigt wurde."
    }
  ],
  "categoriesTitle": "Häufige Wünsche von Gästen",
  "categoriesIntro": "Ausgangspunkt ist der Bedarf deiner Gäste. Danach können wir einen passenden Einzelartikel oder eine umfassendere Ausstattung bestätigen.",
  "categories": [
    {
      "name": "Baby & Kleinkind",
      "slug": "baby-gear",
      "text": "Reisebetten, Hochstühle, Kinderwagen und Ausstattung für die Ankunft"
    },
    {
      "name": "Mobilität & Barrierefreiheit",
      "slug": "mobility",
      "text": "Rollstühle, Rollatoren, Elektromobile und Alltagshilfen"
    },
    {
      "name": "Wohnkomfort",
      "slug": "home-living",
      "text": "Kühlung, Luftqualität, Küchenausstattung und Extras für längere Aufenthalte"
    },
    {
      "name": "Strand & Outdoor",
      "slug": "travel-outdoors",
      "text": "Sonnenschutz, Kühlboxen, Stühle, Bollerwagen und Strandausstattung für Familien"
    },
    {
      "name": "Mobiles Arbeiten",
      "slug": "remote-work",
      "text": "Monitore, ergonomische Stühle, Schreibtische und Zubehör"
    }
  ],
  "processTitle": "So geht es los",
  "process": [
    {
      "title": "Beschreibe deine Unterkünfte",
      "text": "Nenne uns die Gegend, die Anzahl der Unterkünfte, das Gästeprofil und die häufigsten Wünsche."
    },
    {
      "title": "Wähle einen einfachen Ablauf",
      "text": "Verweise Gäste direkt an uns oder besprich einen vom Team geprüften Ablauf für wiederkehrende Anfragen."
    },
    {
      "title": "Bestätige jeden Bedarf",
      "text": "Reisedaten, Bestand, Lieferung oder Abholung sowie der Preis werden bestätigt, bevor aus der Anfrage eine Buchung wird."
    }
  ],
  "boundaryTitle": "Was dieser Service nicht umfasst",
  "boundaryText": "Rent&Roll vermietet Ausstattung. Wir übernehmen keine Inserate, Schlüsselübergaben, Reinigung, Instandhaltung, Genehmigungen oder die Einhaltung von Unterkunftsvorschriften. Diese Seite stellt keine Empfehlung oder Partnerschaft durch Airbnb dar.",
  "faqTitle": "Fragen zum Service für Gastgeber",
  "faqs": [
    {
      "q": "Können meine Gäste direkt buchen?",
      "a": "Ja. Du kannst eine passende Rent&Roll-Seite teilen und deine Gäste können die reguläre Verfügbarkeitsprüfung und Buchung nutzen. Eine Buchung ist erst bestätigt, wenn der Bezahlvorgang erfolgreich abgeschlossen wurde."
    },
    {
      "q": "Muss ich Ausstattung in der Unterkunft lagern?",
      "a": "Nein. Der Service hilft bei gelegentlichen oder wiederkehrenden Gästewünschen, ohne dass jede Unterkunft alle Artikel dauerhaft lagern muss."
    },
    {
      "q": "Könnt ihr Ausstattung für jeden Aufenthalt garantieren?",
      "a": "Nein. Die Verfügbarkeit hängt von den gewünschten Daten, dem Bestand und den verfügbaren Liefer- und Abholmöglichkeiten ab. Wir bestätigen jede Anfrage, bevor sie als gebucht dargestellt wird."
    },
    {
      "q": "Gibt es Preise für mehrere Unterkünfte oder regelmäßige Anfragen?",
      "a": "Wir können wiederkehrenden Bedarf mit Gastgebern und Unterkunftsverwaltungen prüfen. Abläufe und Preise werden individuell vereinbart, sobald die Art der Anfragen und die betrieblichen Anforderungen klar sind."
    },
    {
      "q": "Verwaltet ihr Ferienunterkünfte?",
      "a": "Nein. Wir unterstützen ausschließlich bei Mietartikeln. Wir übernehmen keine Unterkunftsverwaltung, Reinigung, Schlüsselübergabe, Inseratsverwaltung oder Genehmigungen."
    }
  ],
  "finalTitle": "Erzähl uns, was deine Gäste brauchen",
  "finalText": "Nenne uns die Gegend deiner Unterkunft, die übliche Aufenthaltsdauer und die häufigsten Ausstattungswünsche. Wir sagen dir ehrlich, was wir derzeit anbieten können.",
  "finalCta": "Schreib uns auf WhatsApp",
  "emailCta": "Kontaktformular nutzen"
},
} as const;

export default function HostServicesPage({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const whatsappHref = `https://wa.me/34684708013?text=${encodeURIComponent(content.whatsappText)}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: content.serviceName,
            description: content.serviceDescription,
            url: content.pageUrl,
            provider: { "@id": BUSINESS_SCHEMA_ID },
            areaServed: { "@type": "City", name: "Valencia" },
            serviceType: locale === "es" ? "Alquiler de equipamiento para huéspedes" : "Guest equipment rental support",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: content.breadcrumbHome, url: content.homeUrl },
              { name: content.breadcrumbValencia, url: content.valenciaUrl },
              { name: content.breadcrumbCurrent, url: content.pageUrl },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd([...content.faqs])) }}
      />

      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-neutral-900 py-16 md:py-24 text-white">
        <div className="container-site">
          <div className="min-w-0 max-w-4xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-teal-50">
              {content.badge}
            </span>
            <h1 className="mt-6 max-w-3xl break-words text-4xl font-extrabold tracking-tight md:text-6xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-teal-50/85">
              {content.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">
                {content.primaryCta}
              </a>
              <Link href={content.kitsHref} className="btn btn-lg border border-white/25 bg-white/10 text-white hover:bg-white/20">
                {content.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav className="border-b border-neutral-200 bg-white py-3" aria-label={{ en: "Breadcrumb", es: "Ruta de navegación", de: "Seitennavigation" }[locale]}>
        <div className="container-site flex flex-wrap items-center gap-2 text-sm text-neutral-500">
          <Link href={localeRegistry[locale].prefix || "/"} className="hover:text-brand">{content.breadcrumbHome}</Link>
          <span aria-hidden="true">/</span>
          <Link href={content.valenciaHref} className="hover:text-brand">{content.breadcrumbValencia}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-800">{content.breadcrumbCurrent}</span>
        </div>
      </nav>

      <section className="section bg-white">
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">{content.sectionTitle}</h2>
            <p className="mt-3 text-neutral-600">{content.sectionIntro}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {content.benefits.map((benefit, index) => (
              <article key={benefit.title} className="card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 font-bold text-brand">{index + 1}</span>
                <h3 className="mt-5 text-xl font-bold">{benefit.title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold">{content.categoriesTitle}</h2>
            <p className="mt-3 text-neutral-600">{content.categoriesIntro}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.categories.map((category) => (
              <Link key={category.slug} href={`${content.categoryPrefix}/${category.slug}`} className="card group p-6 hover:border-brand/30">
                <h3 className="font-bold group-hover:text-brand">{category.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{category.text}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <h2 className="text-3xl font-bold">{content.processTitle}</h2>
            <div className="mt-8 space-y-6">
              {content.process.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">{index + 1}</span>
                  <div>
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="mt-1 leading-relaxed text-neutral-600">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-7">
            <h2 className="text-xl font-bold text-amber-950">{content.boundaryTitle}</h2>
            <p className="mt-3 leading-relaxed text-amber-950/80">{content.boundaryText}</p>
          </aside>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site max-w-4xl">
          <h2 className="text-3xl font-bold">{content.faqTitle}</h2>
          <div className="mt-8 space-y-4">
            {content.faqs.map((faq) => (
              <details key={faq.q} className="card group p-5">
                <summary className="cursor-pointer list-none font-semibold">{faq.q}</summary>
                <p className="mt-3 leading-relaxed text-neutral-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand py-16 text-white">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold">{content.finalTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-teal-50/85">{content.finalText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">{content.finalCta}</a>
            <Link href={content.contactHref} className="btn btn-lg border border-white/30 bg-white/10 text-white hover:bg-white/20">{content.emailCta}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
