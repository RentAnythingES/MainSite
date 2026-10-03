import Link from "next/link";
import { localeRegistry, type Locale } from "@/i18n/config";
import { getFaqPageBodyCopy } from "@/i18n/pages/faq";

export default function FaqPageBody({ locale }: { locale: Locale }) {
  const t = getFaqPageBodyCopy(locale);
  const prefix = localeRegistry[locale].prefix;
const faqSections = [
  {
    title: t(0),
    items: [
      {
        q: t(1),
        a: t(2),
      },
      {
        q: t(3),
        a: t(4),
      },
      {
        q: t(5),
        a: t(6),
      },
      {
        q: t(7),
        a: t(8),
      },
      {
        q: t(9),
        a: t(10),
      },
    ],
  },
  {
    title: t(11),
    items: [
      {
        q: t(12),
        a: t(13),
      },
      {
        q: t(14),
        a: t(15),
      },
      {
        q: t(16),
        a: t(17),
      },
      {
        q: t(18),
        a: t(19),
      },
      {
        q: t(20),
        a: t(21),
      },
      {
        q: t(22),
        a: t(23),
      },
    ],
  },
  {
    title: t(24),
    items: [
      {
        q: t(25),
        a: t(26),
      },
      {
        q: t(27),
        a: t(28),
      },
      {
        q: t(29),
        a: t(30),
      },
      {
        q: t(31),
        a: t(32),
      },
    ],
  },
  {
    title: t(33),
    items: [
      {
        q: t(34),
        a: t(35),
      },
      {
        q: t(36),
        a: t(37),
      },
      {
        q: t(38),
        a: t(39),
      },
    ],
  },
];
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  ),
};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {" "}{t(40)}{" "}</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {" "}{t(41)}{" "}<Link href={`${prefix}/contact`} className="text-brand font-semibold hover:underline">{t(42)}</Link>.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <div className="space-y-12">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.items.map((faq) => (
                    <details
                      key={faq.q}
                      className="group bg-neutral-50 rounded-xl p-5 cursor-pointer hover:bg-neutral-100/80 transition-colors"
                    >
                      <summary className="flex items-center justify-between font-semibold text-neutral-800 list-none text-[15px]">
                        {faq.q}
                        <span className="text-neutral-400 group-open:rotate-45 transition-transform text-xl ml-4 flex-shrink-0">
                          +
                        </span>
                      </summary>
                      <p className="mt-4 text-neutral-600 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50 py-16">
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold mb-3">{t(43)}</h2>
          <p className="text-neutral-500 mb-6">{t(44)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`${prefix}/contact`} className="btn btn-primary">{t(45)}</Link>
            <a
              href="https://wa.me/34684708013"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              {" "}{t(46)}{" "}</a>
          </div>
        </div>
      </section>
    </>
  );

}
