import Link from "next/link";
import { localeRegistry, type Locale } from "@/i18n/config";
import { getAboutPageBodyCopy } from "@/i18n/pages/about";

export default function AboutPageBody({ locale }: { locale: Locale }) {
  const t = getAboutPageBodyCopy(locale);
  const prefix = localeRegistry[locale].prefix;
const values = [
  {
    icon: "♻️",
    title: t(0),
    description: t(1),
  },
  {
    icon: "🔎",
    title: t(2),
    description: t(3),
  },
  {
    icon: "🧼",
    title: t(4),
    description: t(5),
  },
  {
    icon: "💬",
    title: t(6),
    description: t(7),
  },
];
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `https://rentandroll.com${prefix}/about#page`,
      url: `https://rentandroll.com${prefix}/about`,
      name: "About Rent&Roll",
      inLanguage: locale,
      about: { "@id": "https://rentandroll.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://rentandroll.com/#organization",
      name: "Rent&Roll",
      legalName: "Escalera Labs S.L.",
      url: "https://rentandroll.com",
      email: "hello@rentandroll.com",
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl">
            <span className="badge badge-brand mb-4">{t(8)}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {" "}{t(9)}{" "}<span className="text-brand">{t(10)}</span>
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {" "}{t(11)}{" "}</p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t(12)}</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  {" "}{t(13)}{" "}</p>
                <p>
                  {" "}{t(14)}{" "}</p>
                <p>
                  {" "}{t(15)}{" "}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand/5 to-accent/5 rounded-2xl p-12 flex items-center justify-center aspect-square md:aspect-auto md:h-full">
              <div className="text-center">
                <span className="text-6xl block mb-4">📍</span>
                <p className="text-2xl font-bold text-brand">{t(16)}</p>
                <p className="text-neutral-500 text-sm mt-1">{t(17)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold text-center mb-12">{t(18)}</h2>
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
          <h2 className="text-3xl font-bold mb-6">{t(19)}</h2>
          <div className="bg-neutral-50 rounded-xl border border-border p-8">
            <p className="text-neutral-700 font-semibold mb-1">{t(20)}</p>
            <p className="text-sm text-neutral-500 mb-4">{t(21)}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-600">
              <span>{t(22)}</span>
              <span>{t(23)}</span>
              <span>{t(24)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t(25)}</h2>
          <p className="text-teal-100 mb-8">{t(26)}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`${prefix}/contact`} className="btn btn-accent btn-lg">{t(27)}</Link>
            <Link href={`${prefix}/faq`} className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">{t(28)}</Link>
          </div>
        </div>
      </section>
    </>
  );

}
