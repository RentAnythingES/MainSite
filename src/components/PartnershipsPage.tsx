import Link from "next/link";
import PartnerInquiryForm from "@/components/PartnerInquiryForm";

type Locale = "en" | "es";

const content = {
  en: {
    pageUrl: "https://rentanything.es/partners",
    homeUrl: "https://rentanything.es",
    home: "Home",
    breadcrumb: "Partnerships",
    eyebrow: "Work with RentAnything.es",
    title: "Practical partnerships for better Valencia stays",
    intro: "We work with accommodation teams, local travel services, and product companies when the collaboration gives visitors a genuinely easier stay. Start with a focused referral arrangement or a small, measurable Valencia pilot.",
    primaryCta: "Discuss a partnership",
    secondaryCta: "See host services",
    fitTitle: "Who we can help",
    fitIntro: "The best collaborations solve a clear guest or traveller problem. We do not sell generic advertising placements.",
    fits: [
      { title: "Accommodation teams", body: "Holiday-rental hosts, aparthotels, property managers, and serviced apartments can refer guests who need baby, mobility, beach, work, or apartment equipment." },
      { title: "Travel and relocation services", body: "Concierges, relocation teams, travel planners, and local specialists can add practical equipment support to the stays they already coordinate." },
      { title: "Brands and distributors", body: "Product companies can test a narrow demo-rental pilot where travellers use relevant equipment in real Valencia stays and provide consented feedback." },
    ],
    modelsTitle: "Ways to work together",
    models: [
      { number: "01", title: "Guest referral", body: "Share a direct service link with guests. They choose their dates and deal with us directly, while you avoid buying, storing, cleaning, and maintaining occasional-use equipment." },
      { number: "02", title: "Operational support", body: "For recurring accommodation needs, we can discuss a defined equipment menu, delivery process, guest handoff, and escalation route suited to your properties." },
      { number: "03", title: "Product pilot", body: "Test two to five relevant products in one use case—such as a family beach, baby-arrival, accessibility, or remote-work setup—before considering anything broader." },
      { number: "04", title: "Useful editorial collaboration", body: "Travel publications and creators can collaborate on accurate Valencia planning content when it serves their audience and keeps commercial relationships transparent." },
    ],
    pilotTitle: "What a responsible product pilot includes",
    pilotIntro: "A pilot should answer a real commercial question, not manufacture endorsement. The exact scope is agreed before anything is published.",
    pilotPoints: [
      "One named Valencia use case and a small, agreed product set",
      "Clear responsibilities for supply, instructions, maintenance, and replacements",
      "Factual product identification and transparent commercial disclosure",
      "Reporting limited to agreed operational data, consented feedback, and tracked interest",
      "A defined review point before any extension, case study, or public performance claim",
    ],
    principlesTitle: "Our partnership principles",
    principles: [
      { title: "Useful before promotional", body: "The guest experience comes first. A partnership must make the stay easier, safer, or more comfortable." },
      { title: "Specific before ambitious", body: "We prefer one measurable Valencia pilot over a broad sponsorship promise." },
      { title: "Factual and transparent", body: "We do not imply endorsements, exclusivity, customer proof, or performance that does not exist." },
      { title: "Privacy by design", body: "Customer identity and contact information are not partner reporting data. Feedback is shared or published only with the appropriate consent." },
    ],
    processTitle: "A simple starting process",
    steps: [
      "Tell us about your guests, audience, products, or operational need.",
      "We identify one useful collaboration model and confirm whether it is a fit.",
      "For pilots, we agree the product set, responsibilities, disclosure, and reporting before launch.",
      "We review real usage before discussing expansion or a public case study.",
    ],
    relatedTitle: "Looking for guest-equipment support?",
    relatedBody: "Our host-services page explains how accommodation providers can help guests arrange equipment without holding a full inventory themselves.",
    relatedCta: "Explore host services",
    kitsCta: "View rental kits",
    formTitle: "Tell us what you have in mind",
    formIntro: "A short, specific proposal is enough. We will reply with a practical next step—or say clearly if the fit is not there yet.",
  },
  es: {
    pageUrl: "https://rentanything.es/es/colaboraciones",
    homeUrl: "https://rentanything.es/es",
    home: "Inicio",
    breadcrumb: "Colaboraciones",
    eyebrow: "Colabora con RentAnything.es",
    title: "Colaboraciones prácticas para mejores estancias en Valencia",
    intro: "Colaboramos con alojamientos, servicios locales de viaje y empresas de producto cuando la propuesta facilita de verdad la estancia del visitante. Empezamos con una recomendación concreta o un piloto pequeño y medible en Valencia.",
    primaryCta: "Proponer una colaboración",
    secondaryCta: "Ver servicios para anfitriones",
    fitTitle: "A quién podemos ayudar",
    fitIntro: "Las mejores colaboraciones resuelven un problema claro del huésped o viajero. No vendemos espacios publicitarios genéricos.",
    fits: [
      { title: "Equipos de alojamiento", body: "Anfitriones, apartahoteles, gestores de propiedades y apartamentos con servicios pueden derivar a huéspedes que necesiten equipamiento infantil, movilidad, playa, trabajo o confort." },
      { title: "Viajes y relocation", body: "Conserjerías, equipos de relocation, asesores de viaje y especialistas locales pueden añadir apoyo de equipamiento a las estancias que ya coordinan." },
      { title: "Marcas y distribuidores", body: "Las empresas de producto pueden probar un piloto de alquiler acotado, con uso real durante estancias en Valencia y comentarios compartidos con consentimiento." },
    ],
    modelsTitle: "Formas de colaborar",
    models: [
      { number: "01", title: "Recomendación a huéspedes", body: "Comparte un enlace directo con el huésped. Elige sus fechas y trata con nosotros, mientras tú evitas comprar, almacenar, limpiar y mantener equipamiento de uso ocasional." },
      { number: "02", title: "Apoyo operativo", body: "Para necesidades recurrentes, podemos definir un menú de equipamiento, proceso de entrega, comunicación con el huésped y vía de incidencias adaptados a tus propiedades." },
      { number: "03", title: "Piloto de producto", body: "Prueba de dos a cinco productos relevantes en un único caso de uso—playa familiar, llegada con bebé, accesibilidad o teletrabajo—antes de plantear algo más amplio." },
      { number: "04", title: "Colaboración editorial útil", body: "Medios y creadores de viajes pueden colaborar en contenidos precisos sobre Valencia cuando aporten valor a su audiencia y la relación comercial sea transparente." },
    ],
    pilotTitle: "Qué incluye un piloto de producto responsable",
    pilotIntro: "Un piloto debe responder una pregunta comercial real, no fabricar una recomendación. El alcance exacto se acuerda antes de publicar nada.",
    pilotPoints: [
      "Un caso de uso concreto en Valencia y un conjunto reducido de productos",
      "Responsabilidades claras sobre suministro, instrucciones, mantenimiento y sustituciones",
      "Identificación objetiva del producto y divulgación transparente de la relación comercial",
      "Informes limitados a datos operativos acordados, comentarios consentidos e interés medido",
      "Una revisión definida antes de ampliar, crear un caso de estudio o publicar resultados",
    ],
    principlesTitle: "Nuestros principios de colaboración",
    principles: [
      { title: "Utilidad antes que promoción", body: "La experiencia del huésped es lo primero. La colaboración debe hacer la estancia más fácil, segura o cómoda." },
      { title: "Concreto antes que ambicioso", body: "Preferimos un piloto medible en Valencia a una promesa amplia de patrocinio." },
      { title: "Objetivo y transparente", body: "No insinuamos recomendaciones, exclusividad, prueba social ni resultados que no existan." },
      { title: "Privacidad desde el diseño", body: "La identidad y los datos de contacto del cliente no forman parte de los informes. Los comentarios solo se comparten o publican con el consentimiento adecuado." },
    ],
    processTitle: "Un proceso sencillo para empezar",
    steps: [
      "Cuéntanos sobre tus huéspedes, audiencia, productos o necesidad operativa.",
      "Identificamos un modelo útil y confirmamos si existe encaje.",
      "Para pilotos, acordamos productos, responsabilidades, divulgación e informes antes de lanzar.",
      "Revisamos el uso real antes de hablar de ampliación o de un caso de estudio público.",
    ],
    relatedTitle: "¿Buscas equipamiento para huéspedes?",
    relatedBody: "Nuestra página para anfitriones explica cómo ayudar a los huéspedes a organizar equipamiento sin mantener un inventario completo propio.",
    relatedCta: "Ver servicios para anfitriones",
    kitsCta: "Ver kits de alquiler",
    formTitle: "Cuéntanos tu propuesta",
    formIntro: "Basta con una propuesta breve y concreta. Responderemos con un siguiente paso práctico, o diremos claramente si todavía no existe encaje.",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export default function PartnershipsPage({ locale }: { locale: Locale }) {
  const text = content[locale] as typeof content.en;
  const hostHref = locale === "es" ? "/es/valencia/servicios-anfitriones" : "/valencia/host-services";
  const kitsHref = locale === "es" ? "/es/valencia/kits" : "/valencia/kits";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: text.home, item: text.homeUrl },
              { "@type": "ListItem", position: 2, name: text.breadcrumb, item: text.pageUrl },
            ],
          }),
        }}
      />

      <main>
        <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-brand pb-16 text-white sm:pb-24">
          <div className="container-site pt-16 sm:pt-24">
            <nav className="mb-10 text-sm text-teal-100/80" aria-label="Breadcrumb">
              <Link href={locale === "es" ? "/es" : "/"} className="hover:text-white">{text.home}</Link>
              <span className="mx-2">/</span>
              <span>{text.breadcrumb}</span>
            </nav>
            <div className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">{text.eyebrow}</p>
              <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-6xl">{text.title}</h1>
              <p className="max-w-3xl text-lg leading-8 text-teal-50 sm:text-xl">{text.intro}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a href="#partner-inquiry" className="btn btn-primary btn-lg bg-white text-brand hover:bg-teal-50">{text.primaryCta}</a>
                <Link href={hostHref} className="btn btn-lg border border-white/40 text-white hover:bg-white/10">{text.secondaryCta}</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container-site py-16 sm:py-20">
          <div className="mb-10 max-w-3xl">
            <h2 className="mb-3 text-3xl font-bold sm:text-4xl">{text.fitTitle}</h2>
            <p className="text-lg leading-8 text-neutral-600">{text.fitIntro}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {text.fits.map((item) => (
              <article key={item.title} className="card p-7">
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="leading-7 text-neutral-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-neutral-100">
          <div className="container-site py-16 sm:py-20">
            <h2 className="mb-10 text-3xl font-bold sm:text-4xl">{text.modelsTitle}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {text.models.map((item) => (
                <article key={item.number} className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
                  <span className="mb-5 block font-[var(--font-outfit)] text-3xl font-bold text-brand/35">{item.number}</span>
                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="leading-7 text-neutral-600">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{text.pilotTitle}</h2>
            <p className="mb-7 text-lg leading-8 text-neutral-600">{text.pilotIntro}</p>
            <ul className="space-y-4">
              {text.pilotPoints.map((point) => (
                <li key={point} className="flex gap-3 leading-7 text-neutral-700">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-brand">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-teal-950 p-8 text-white sm:p-10">
            <h2 className="mb-6 text-2xl font-bold">{text.principlesTitle}</h2>
            <div className="space-y-6">
              {text.principles.map((item) => (
                <div key={item.title} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                  <h3 className="mb-2 font-bold text-amber-300">{item.title}</h3>
                  <p className="text-sm leading-6 text-teal-50/80">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-amber-50">
          <div className="container-site py-16">
            <h2 className="mb-8 text-3xl font-bold">{text.processTitle}</h2>
            <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {text.steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 font-bold text-white">{index + 1}</span>
                  <p className="pt-1 leading-7 text-neutral-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="container-site py-16 sm:py-20">
          <div className="rounded-3xl border border-teal-100 bg-teal-50 p-8 sm:p-10">
            <h2 className="mb-3 text-2xl font-bold">{text.relatedTitle}</h2>
            <p className="mb-6 max-w-3xl leading-7 text-neutral-600">{text.relatedBody}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={hostHref} className="btn btn-primary">{text.relatedCta}</Link>
              <Link href={kitsHref} className="btn btn-outline">{text.kitsCta}</Link>
            </div>
          </div>
        </section>

        <section id="partner-inquiry" className="bg-neutral-100 scroll-mt-24">
          <div className="container-site grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{text.formTitle}</h2>
              <p className="text-lg leading-8 text-neutral-600">{text.formIntro}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              <PartnerInquiryForm locale={locale} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
