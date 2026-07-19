import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contactar con RentAnything.es en Valencia",
  description:
    "Contacta con RentAnything.es sobre alquileres en Valencia, reservas, solicitudes especiales o colaboraciones por WhatsApp, correo o formulario.",
  alternates: {
    canonical: "https://rentanything.es/es/contact",
    languages: {
      en: "https://rentanything.es/contact",
      es: "https://rentanything.es/es/contact",
      "x-default": "https://rentanything.es/contact",
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://rentanything.es/es/contact#page",
  url: "https://rentanything.es/es/contact",
  name: "Contactar con RentAnything.es",
  inLanguage: "es",
  about: { "@id": "https://rentanything.es/#organization" },
};

export default function SpanishContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contacta con RentAnything.es</h1>
            <p className="text-lg text-neutral-600">
              Pregúntanos sobre un artículo, una reserva, una solicitud especial o una colaboración local en Valencia.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <a
              href="https://wa.me/34684708013?text=Hola%2C%20tengo%20una%20consulta%20sobre%20un%20alquiler%20en%20Valencia"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-8 text-center hover:border-[#25D366]/30 group"
              id="contact-whatsapp"
            >
              <span className="text-4xl block mb-4">💬</span>
              <h2 className="font-bold text-lg mb-2 group-hover:text-[#25D366] transition-colors">WhatsApp</h2>
              <p className="text-sm text-neutral-500 mb-3">Ayuda directa con fechas, productos y reservas activas</p>
              <span className="text-sm font-semibold text-[#25D366]">Abrir WhatsApp →</span>
            </a>

            <a href="mailto:hello@rentanything.es" className="card p-8 text-center hover:border-brand/30 group" id="contact-email">
              <span className="text-4xl block mb-4">📧</span>
              <h2 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">Correo electrónico</h2>
              <p className="text-sm text-neutral-500 mb-3">Para solicitudes detalladas y colaboraciones</p>
              <span className="text-sm font-semibold text-brand">hello@rentanything.es</span>
            </a>

            <div className="card p-8 text-center" id="contact-location">
              <span className="text-4xl block mb-4">📍</span>
              <h2 className="font-bold text-lg mb-2">Valencia, España</h2>
              <p className="text-sm text-neutral-500 mb-3">Escalera Labs S.L.</p>
              <span className="text-sm text-neutral-400">Las opciones de recogida disponibles aparecen al reservar</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Envíanos un mensaje</h2>
            <ContactForm locale="es" />
          </div>
        </div>
      </section>
    </>
  );
}
