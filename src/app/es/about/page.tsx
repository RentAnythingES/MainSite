import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre RentAnything.es | Alquiler en Valencia",
  description:
    "Conoce por qué RentAnything.es ayuda a viajar más ligero con alquiler de equipamiento, recogida local y opciones de entrega en Valencia.",
  alternates: {
    canonical: "https://rentanything.es/es/about",
    languages: {
      en: "https://rentanything.es/about",
      es: "https://rentanything.es/es/about",
      "x-default": "https://rentanything.es/about",
    },
  },
};

const values = [
  {
    icon: "♻️",
    title: "Reutilización responsable",
    description: "El alquiler permite que más visitantes utilicen equipamiento práctico sin tener que comprarlo para un solo viaje.",
  },
  {
    icon: "🔎",
    title: "Información clara",
    description: "Identificamos marcas, modelos y especificaciones verificadas para ayudarte a elegir el equipo adecuado.",
  },
  {
    icon: "🧼",
    title: "Limpieza y revisión",
    description: "Limpiamos y comprobamos los artículos entre alquileres como parte de nuestro proceso operativo.",
  },
  {
    icon: "💬",
    title: "Atención humana",
    description: "Habla directamente con nosotros para elegir un artículo, organizar la entrega o modificar una reserva.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://rentanything.es/es/about#page",
      url: "https://rentanything.es/es/about",
      name: "Sobre RentAnything.es",
      inLanguage: "es",
      about: { "@id": "https://rentanything.es/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://rentanything.es/#organization",
      name: "RentAnything.es",
      legalName: "Escalera Labs S.L.",
      url: "https://rentanything.es",
      email: "hello@rentanything.es",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Burjassot",
        addressRegion: "Valencia",
        postalCode: "46100",
        addressCountry: "ES",
      },
    },
  ],
};

export default function SpanishAboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl">
            <span className="badge badge-brand mb-4">Sobre nosotros</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Viaja ligero. <span className="text-brand">Siéntete como en casa.</span>
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              RentAnything.es ayuda a quienes visitan Valencia a evitar cargar, comprar y guardar equipamiento voluminoso. Elige lo que necesitas y selecciona una opción disponible de recogida o entrega.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Por qué creamos RentAnything.es</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  Las familias, quienes teletrabajan y las personas con necesidades de accesibilidad suelen necesitar determinados artículos solo durante una parte de su estancia. Traerlos de casa supone más equipaje y comprarlos genera gasto y residuos.
                </p>
                <p>
                  Estamos construyendo un catálogo de alquiler centrado en Valencia donde comparar productos reales, comprobar la disponibilidad para unas fechas y elegir entre las modalidades de entrega o recogida activas.
                </p>
                <p>
                  Nuestro objetivo es sencillo: facilitar el acceso temporal a equipamiento práctico con información clara, opciones cómodas y atención de personas que conocen el servicio local.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand/5 to-accent/5 rounded-2xl p-12 flex items-center justify-center aspect-square md:aspect-auto md:h-full">
              <div className="text-center">
                <span className="text-6xl block mb-4">📍</span>
                <p className="text-2xl font-bold text-brand">Valencia, España</p>
                <p className="text-neutral-500 text-sm mt-1">Nuestra primera zona de servicio</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold text-center mb-12">Cómo planteamos el servicio</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all">
                <span className="text-4xl block mb-4">{value.icon}</span>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-6">Datos de la empresa</h2>
          <div className="bg-neutral-50 rounded-xl border border-border p-8">
            <p className="text-neutral-700 font-semibold mb-1">Escalera Labs S.L.</p>
            <p className="text-sm text-neutral-500 mb-4">CIF ESB22961221 · Sociedad registrada en España</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-600">
              <span>📍 Burjassot, Valencia</span>
              <span>📧 hello@rentanything.es</span>
              <span>💬 Atención por WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Cómo podemos ayudarte?</h2>
          <p className="text-teal-100 mb-8">Pregúntanos sobre un producto, una reserva o una colaboración.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/es/contact" className="btn btn-accent btn-lg">Contactar</Link>
            <Link href="/es/faq" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">Ver preguntas frecuentes</Link>
          </div>
        </div>
      </section>
    </>
  );
}
