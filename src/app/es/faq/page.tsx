import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes sobre Alquileres en Valencia",
  description:
    "Respuestas sobre reservas, pagos, recogida, entrega, higiene y cambios al alquilar equipamiento con RentAnything.es en Valencia.",
  alternates: {
    canonical: "https://rentanything.es/es/faq",
    languages: {
      en: "https://rentanything.es/faq",
      es: "https://rentanything.es/es/faq",
      "x-default": "https://rentanything.es/faq",
    },
  },
};

const faqSections = [
  {
    title: "Reservas y pagos",
    items: [
      {
        q: "¿Cómo hago una reserva?",
        a: "Abre la ficha del producto, elige la fecha y hora de inicio y fin, selecciona recogida o una opción de entrega disponible y comprueba la disponibilidad. Si el artículo está disponible, introduce tus datos y continúa al pago seguro de Stripe. Enviamos los detalles por correo cuando se confirma el pago.",
      },
      {
        q: "¿Qué métodos de pago aceptáis?",
        a: "Las reservas online se pagan mediante Stripe. Los métodos disponibles aparecen de forma segura en Stripe Checkout y pueden variar según el dispositivo, navegador y configuración de la cuenta.",
      },
      {
        q: "¿Se exige una fianza?",
        a: "Nuestro proceso de pago online actual no añade una fianza automáticamente. Si en el futuro un alquiler concreto la requiere, mostraremos el importe y las condiciones de devolución antes del pago.",
      },
      {
        q: "¿Con cuánta antelación debería reservar?",
        a: "Recomendamos reservar al menos con 48 horas de antelación, especialmente durante Fallas, verano y Navidad. Algunos artículos pueden estar disponibles el mismo día; consúltanos por WhatsApp.",
      },
      {
        q: "¿Puedo modificar o cancelar mi reserva?",
        a: "Contáctanos por WhatsApp o correo lo antes posible. Los cambios dependen del inventario y de la disponibilidad operativa. La cancelación es gratuita con 48 horas o más de antelación al momento de entrega o recogida; consulta la política completa de reembolsos y cancelaciones.",
      },
    ],
  },
  {
    title: "Entrega y recogida",
    items: [
      {
        q: "¿Dónde realizáis entregas?",
        a: "El formulario de reserva muestra las zonas de Valencia disponibles actualmente para entrega online. Si tu dirección queda fuera, contáctanos y podremos valorar un presupuesto personalizado por distancia.",
      },
      {
        q: "¿Cuál es el horario de entrega?",
        a: "Los horarios disponibles dependen de las fechas, la zona de servicio y nuestra planificación operativa. Elige la hora de inicio y fin preferida en el formulario; confirmamos contigo los detalles prácticos de la entrega o recogida.",
      },
      {
        q: "¿La entrega tiene coste?",
        a: "Las tarifas de entrega y recogida dependen de la zona y del tipo de servicio. El importe exacto se calcula con la configuración activa y aparece antes de Stripe Checkout. Las distancias personalizadas se presupuestan por separado.",
      },
      {
        q: "¿Puedo recoger los artículos personalmente?",
        a: "Sí. La recogida por parte del cliente es gratuita en los puntos activos que aparecen en el formulario, actualmente en Burjassot y Paterna. Selecciona el que prefieras antes de comprobar la disponibilidad.",
      },
      {
        q: "¿Cómo funciona la devolución?",
        a: "La devolución sigue la modalidad elegida en la reserva: devuelve el artículo en el punto acordado o entrégalo en la dirección y hora de recogida si contrataste ese servicio. Los mensajes de confirmación incluyen las instrucciones correspondientes.",
      },
      {
        q: "¿Puedo cambiar la recogida por entrega después de reservar?",
        a: "Contáctanos antes de la entrega inicial. Si la reserva confirmada o pagada sigue siendo apta y el servicio está disponible, podemos enviar un presupuesto privado y temporal. Pagas únicamente el transporte añadido mediante Stripe antes de actualizar la reserva.",
      },
    ],
  },
  {
    title: "Productos e higiene",
    items: [
      {
        q: "¿Los productos son seguros y están limpios?",
        a: "Limpiamos y revisamos los artículos entre alquileres. Los productos críticos para la seguridad se inspeccionan siguiendo la información del fabricante y nuestro proceso operativo antes de cada entrega.",
      },
      {
        q: "¿Qué marcas ofrecéis?",
        a: "Nuestro catálogo incluye distintas marcas y modelos según el inventario disponible. La ficha de cada producto identifica la marca y las especificaciones verificadas cuando se conocen.",
      },
      {
        q: "¿Qué ocurre si un artículo se daña durante el alquiler?",
        a: "El desgaste normal es esperable. Si se produce un daño importante, contáctanos cuanto antes. Revisaremos el artículo y explicaremos cualquier coste documentado antes de realizar un cargo adicional.",
      },
      {
        q: "¿Puedo solicitar un producto que no aparece en la web?",
        a: "Sí. Envíanos por WhatsApp lo que necesitas, las fechas y la ubicación. Comprobaremos si podemos conseguir una alternativa adecuada sin prometer inventario hasta confirmarlo.",
      },
    ],
  },
  {
    title: "Sobre el servicio",
    items: [
      {
        q: "¿Quién gestiona RentAnything.es?",
        a: "RentAnything.es está operado por Escalera Labs S.L., una empresa registrada en España y con base en Valencia.",
      },
      {
        q: "¿Trabajáis en otras ciudades?",
        a: "Actualmente nos centramos en Valencia. Ampliaremos la cobertura solo cuando podamos mantener un servicio operativo fiable.",
      },
      {
        q: "¿Trabajáis con hoteles y gestores de alojamientos?",
        a: "Sí. Colaboramos con hoteles, apartamentos turísticos, agencias de relocation y gestores que necesitan equipamiento para huéspedes. Consulta nuestros servicios para anfitriones.",
      },
    ],
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "es-ES",
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  ),
};

export default function SpanishFAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Preguntas frecuentes</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Todo lo que necesitas saber para alquilar con nosotros en Valencia. Si no encuentras la respuesta,
            {" "}<Link href="/contact" className="text-brand font-semibold hover:underline">contacta con nosotros</Link>.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <div className="space-y-12">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">{section.title}</h2>
                <div className="space-y-3">
                  {section.items.map((faq) => (
                    <details key={faq.q} className="group bg-neutral-50 rounded-xl p-5 cursor-pointer hover:bg-neutral-100/80 transition-colors">
                      <summary className="flex items-center justify-between font-semibold text-neutral-800 list-none text-[15px]">
                        {faq.q}
                        <span className="text-neutral-400 group-open:rotate-45 transition-transform text-xl ml-4 flex-shrink-0">+</span>
                      </summary>
                      <p className="mt-4 text-neutral-600 text-sm leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold mb-3">¿Tienes otra pregunta?</h2>
          <p className="text-neutral-500 mb-6">Cuéntanos qué necesitas y las fechas de tu estancia.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-primary">Contactar</Link>
            <a href="https://wa.me/34684708013" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
