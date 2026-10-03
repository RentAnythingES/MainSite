import Link from "next/link";
import FulfillmentDecisionGuide from "@/components/FulfillmentDecisionGuide";
import { localeRegistry, type Locale } from "@/i18n/config";
import { getHowItWorksPageBodyCopy } from "@/i18n/pages/how-it-works";

export default function HowItWorksPageBody({ locale }: { locale: Locale }) {
  const t = getHowItWorksPageBodyCopy(locale);
  const prefix = localeRegistry[locale].prefix;
const steps = [
  {
    number: "01",
    title: t(0),
    description:
      t(1),
    details: [
      t(2),
      t(3),
      t(4),
      t(5),
    ],
    icon: "🔍",
    color: "from-teal-500 to-teal-600",
  },
  {
    number: "02",
    title: t(6),
    description:
      t(7),
    details: [
      t(8),
      t(9),
      t(10),
      t(11),
    ],
    icon: "📅",
    color: "from-amber-500 to-amber-600",
  },
  {
    number: "03",
    title: t(12),
    description:
      t(13),
    details: [
      t(14),
      t(15),
      t(16),
      t(17),
    ],
    icon: "🚚",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "04",
    title: t(18),
    description:
      t(19),
    details: [
      t(20),
      t(21),
      t(22),
      t(23),
    ],
    icon: "✨",
    color: "from-emerald-500 to-emerald-600",
  },
];
const fulfillmentChoices = [
  {
    title: t(24),
    label: t(25),
    description: t(26),
    points: [t(27), t(28), t(29)],
  },
  {
    title: t(30),
    label: t(31),
    description: t(32),
    points: [t(33), t(34), t(35)],
  },
  {
    title: t(36),
    label: t(37),
    description: t(38),
    points: [t(39), t(40), t(41)],
  },
];
const faqs = [
  {
    q: t(42),
    a: t(43),
  },
  {
    q: t(44),
    a: t(45),
  },
  {
    q: t(46),
    a: t(47),
  },
  {
    q: t(48),
    a: t(49),
  },
  {
    q: t(50),
    a: t(51),
  },
  {
    q: t(52),
    a: t(53),
  },
];
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to rent equipment in Valencia with Rent&Roll",
  description: t(54),
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: step.description,
    url: `https://rentandroll.com${prefix}/how-it-works#step-${index + 1}`,
  })),
};
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

  return (
    <>
      {[howToSchema, faqSchema].map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {" "}{t(55)}{" "}</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {" "}{t(56)}{" "}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="section bg-white" id="steps">
        <div className="container-site">
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, i) => (
              <div
                key={step.number}
                id={`step-${i + 1}`}
                className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-16`}
              >
                {/* Visual */}
                <div className="flex-1 w-full">
                  <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-12 md:p-16 flex items-center justify-center`}>
                    <span className="text-7xl md:text-8xl">{step.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <span className="text-sm font-bold text-brand tracking-widest uppercase">
                    {" "}{t(57)}{" "}{step.number}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                    {step.title}
                  </h2>
                  <p className="text-neutral-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 text-xs">
                          ✓
                        </span>
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

      <FulfillmentDecisionGuide
        heading={t(58)}
        intro={t(59)}
        choices={fulfillmentChoices}
        changeTitle={t(60)}
        changeBody={t(61)}
        depositTitle={t(62)}
        depositBody={t(63)}
      />

      {/* Quick FAQ */}
      <section className="section bg-neutral-50" id="how-it-works-faq">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            {" "}{t(64)}{" "}</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white rounded-xl border border-border p-6 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-neutral-800 list-none">
                  {faq.q}
                  <span className="text-neutral-400 group-open:rotate-45 transition-transform text-xl">
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
      </section>

      {/* CTA */}
      <section className="bg-brand py-16" id="how-it-works-cta">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {" "}{t(65)}{" "}</h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            {" "}{t(66)}{" "}</p>
          <Link href={`${prefix}/valencia`} className="btn btn-accent btn-lg">
            {" "}{t(67)}{" "}</Link>
        </div>
      </section>
    </>
  );

}
