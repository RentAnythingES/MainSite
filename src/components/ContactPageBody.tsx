import ContactForm from "@/components/ContactForm";
import { localeRegistry, type Locale } from "@/i18n/config";
import { getContactPageBodyCopy } from "@/i18n/pages/contact";

export default function ContactPageBody({ locale }: { locale: Locale }) {
  const t = getContactPageBodyCopy(locale);
  const prefix = localeRegistry[locale].prefix;
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `https://rentandroll.com${prefix}/contact#page`,
  url: `https://rentandroll.com${prefix}/contact`,
  name: "Contact Rent&Roll",
  inLanguage: locale,
  about: { "@id": "https://rentandroll.com/#organization" },
};

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{t(0)}</h1>
            <p className="text-lg text-neutral-600">
              {" "}{t(1)}{" "}</p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <a
              href={`https://wa.me/34684708013?text=${encodeURIComponent({ en: "Hi! I have a question about renting in Valencia", es: "¡Hola! Tengo una pregunta sobre alquilar en Valencia", de: "Hallo! Ich habe eine Frage zu Mietartikeln in Valencia" }[locale])}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-8 text-center hover:border-[#25D366]/30 group"
              id="contact-whatsapp"
            >
              <span className="text-4xl block mb-4">💬</span>
              <h2 className="font-bold text-lg mb-2 group-hover:text-[#25D366] transition-colors">{t(2)}</h2>
              <p className="text-sm text-neutral-500 mb-3">{t(3)}</p>
              <span className="text-sm font-semibold text-[#25D366]">{t(4)}</span>
            </a>

            <a href="mailto:hello@rentandroll.com" className="card p-8 text-center hover:border-brand/30 group" id="contact-email">
              <span className="text-4xl block mb-4">📧</span>
              <h2 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">{t(5)}</h2>
              <p className="text-sm text-neutral-500 mb-3">{t(6)}</p>
              <span className="text-sm font-semibold text-brand">{t(7)}</span>
            </a>

            <div className="card p-8 text-center" id="contact-location">
              <span className="text-4xl block mb-4">📍</span>
              <h2 className="font-bold text-lg mb-2">{t(8)}</h2>
              <p className="text-sm text-neutral-500 mb-3">{t(9)}</p>
              <span className="text-sm text-neutral-400">{t(10)}</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">{t(11)}</h2>
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );

}
