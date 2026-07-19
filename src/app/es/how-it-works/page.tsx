import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo Funciona el Alquiler de Equipamiento",
  description:
    "Elige el artículo y las fechas, selecciona recogida o entrega, paga de forma segura y devuelve el equipo según la modalidad acordada.",
  alternates: {
    canonical: "https://rentanything.es/es/how-it-works",
    languages: {
      en: "https://rentanything.es/how-it-works",
      es: "https://rentanything.es/es/how-it-works",
      "x-default": "https://rentanything.es/how-it-works",
    },
  },
};

const steps = [
  {
    number: "01",
    title: "Explora",
    description:
      "Consulta el equipamiento disponible por categoría y revisa los detalles, especificaciones y precios de alquiler del producto que necesitas.",
    details: [
      "Busca por categoría, marca o necesidad",
      "Comprueba la disponibilidad para tus fechas",
      "Revisa la información y los precios del producto",
      "Pídenos orientación local si la necesitas",
    ],
    icon: "🔍",
    color: "from-teal-500 to-teal-600",
  },
  {
    number: "02",
    title: "Reserva",
    description:
      "Selecciona las fechas y horas, elige recogida o una modalidad de entrega disponible y completa el pago mediante Stripe Checkout.",
    details: [
      "Elige fecha y hora de inicio y fin",
      "Selecciona recogida, entrega o entrega con recogida",
      "Revisa el precio completo antes de pagar",
      "Recibe la confirmación por correo electrónico",
    ],
    icon: "📅",
    color: "from-amber-500 to-amber-600",
  },
  {
    number: "03",
    title: "Entrega o recogida",
    description:
      "Recoge el artículo en un punto activo o recibe el equipo en una zona de servicio disponible. Confirmamos contigo los detalles prácticos de la entrega.",
    details: [
      "Zonas y tarifas configuradas visibles en la reserva",
      "Puntos de recogida en Burjassot y Paterna",
      "Horas de inicio y fin incluidas en la reserva",
      "Estado del artículo revisado antes de la entrega",
    ],
    icon: "🚚",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "04",
    title: "Utiliza y devuelve",
    description:
      "Disfruta del artículo durante el periodo confirmado y devuélvelo en el punto acordado o entrégalo durante la recogida contratada.",
    details: [
      "Contáctanos cuanto antes si cambian tus planes",
      "Las ampliaciones dependen de la siguiente reserva",
      "La recogida está incluida solo cuando se contrata",
      "Las instrucciones llegan con los mensajes de la reserva",
    ],
    icon: "✨",
    color: "from-emerald-500 to-emerald-600",
  },
];

const faqs = [
  {
    q: "¿Con cuánta antelación debería reservar?",
    a: "Recomendamos reservar con al menos 48 horas de antelación, especialmente en temporada alta. Algunos artículos pueden estar disponibles el mismo día.",
  },
  {
    q: "¿A qué zonas realizáis entregas?",
    a: "El formulario muestra las zonas de Valencia disponibles para entrega online. Si tu dirección queda fuera, contáctanos para solicitar un presupuesto personalizado.",
  },
  {
    q: "¿Qué métodos de pago aceptáis?",
    a: "Los pagos online se procesan mediante Stripe. Los métodos disponibles para tu dispositivo y cuenta aparecen directamente en Stripe Checkout.",
  },
  {
    q: "¿Qué ocurre si necesito ampliar el alquiler?",
    a: "Escríbenos por WhatsApp o correo antes de que termine el alquiler. La ampliación depende de la siguiente reserva del artículo y solo se confirma después de comprobar la disponibilidad y cualquier importe adicional.",
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  inLanguage: "es-ES",
  name: "Cómo alquilar equipamiento en Valencia con RentAnything.es",
  description:
    "Elige el equipo y las fechas, paga de forma segura, recibe o recoge el artículo y devuélvelo mediante la modalidad acordada.",
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: step.description,
    url: `https://rentanything.es/es/how-it-works#step-${index + 1}`,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "es-ES",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function SpanishHowItWorksPage() {
  return (
    <>
      {[howToSchema, faqSchema].map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}

      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Cómo funciona</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Cuatro pasos sencillos para tener el equipamiento que necesitas durante tu estancia en Valencia.
          </p>
        </div>
      </section>

      <section className="section bg-white" id="steps">
        <div className="container-site">
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <div
                key={step.number}
                id={`step-${index + 1}`}
                className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-16`}
              >
                <div className="flex-1 w-full">
                  <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-12 md:p-16 flex items-center justify-center`}>
                    <span className="text-7xl md:text-8xl">{step.icon}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold text-brand tracking-widest uppercase">Paso {step.number}</span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{step.title}</h2>
                  <p className="text-neutral-600 leading-relaxed mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 text-xs">✓</span>
                        <span className="text-sm text-neutral-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50" id="how-it-works-faq">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">Preguntas habituales</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white rounded-xl border border-border p-6 cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-neutral-800 list-none">
                  {faq.q}
                  <span className="text-neutral-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="mt-4 text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand py-16" id="how-it-works-cta">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Encuentra lo que necesitas</h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            Consulta el catálogo de Valencia y comprueba la disponibilidad para las fechas de tu estancia.
          </p>
          <Link href="/es/valencia" className="btn btn-accent btn-lg">Ver alquileres en Valencia →</Link>
        </div>
      </section>
    </>
  );
}
