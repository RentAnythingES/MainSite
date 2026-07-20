import Link from "next/link";
import { getFaqJsonLd } from "@/lib/jsonld";

interface HubChoice {
  title: string;
  description: string;
  href?: string;
}

interface HubPathway {
  title: string;
  description: string;
  href: string;
  label: string;
}

interface HubFaq {
  question: string;
  answer: string;
}

interface DiscoverHubEditorialProps {
  introTitle: string;
  intro: string[];
  choiceTitle: string;
  choices: HubChoice[];
  planningTitle: string;
  planningPoints: string[];
  pathways?: HubPathway[];
  faqs: HubFaq[];
  guideLabel?: string;
  faqTitle?: string;
}

export default function DiscoverHubEditorial({
  introTitle,
  intro,
  choiceTitle,
  choices,
  planningTitle,
  planningPoints,
  pathways = [],
  faqs,
  guideLabel = "See the guide →",
  faqTitle = "Planning questions",
}: DiscoverHubEditorialProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd(faqs.map((faq) => ({ q: faq.question, a: faq.answer })))),
        }}
      />

      <section className="section bg-white">
        <div className="container-site grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-4">{introTitle}</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              {intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <aside className="card p-6 bg-teal-50/40">
            <h2 className="text-xl font-bold mb-4">{planningTitle}</h2>
            <ul className="space-y-3 text-sm text-neutral-600">
              {planningPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="text-brand font-bold">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-8">{choiceTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {choices.map((choice) => {
              const content = (
                <>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-brand transition-colors">{choice.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{choice.description}</p>
                  {choice.href && <span className="text-sm font-semibold text-brand mt-4 inline-block">{guideLabel}</span>}
                </>
              );

              return choice.href ? (
                <Link key={choice.title} href={choice.href} className="card p-6 hover:shadow-md transition-shadow group">
                  {content}
                </Link>
              ) : (
                <div key={choice.title} className="card p-6 group">{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {pathways.length > 0 && (
        <section className="section bg-teal-50/50">
          <div className="container-site grid md:grid-cols-2 gap-6">
            {pathways.map((pathway) => (
              <div key={pathway.href} className="card p-7 bg-white">
                <h2 className="text-2xl font-bold mb-3">{pathway.title}</h2>
                <p className="text-neutral-600 mb-5">{pathway.description}</p>
                <Link href={pathway.href} className="btn btn-outline">{pathway.label}</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">{faqTitle}</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="card p-6">
                <h3 className="font-bold mb-2">{faq.question}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
