interface FulfillmentChoice {
  title: string;
  label: string;
  description: string;
  points: string[];
}

interface FulfillmentDecisionGuideProps {
  heading: string;
  intro: string;
  choices: FulfillmentChoice[];
  changeTitle: string;
  changeBody: string;
  depositTitle: string;
  depositBody: string;
}

export default function FulfillmentDecisionGuide({
  heading,
  intro,
  choices,
  changeTitle,
  changeBody,
  depositTitle,
  depositBody,
}: FulfillmentDecisionGuideProps) {
  return (
    <section className="section bg-neutral-50" id="pickup-delivery-options">
      <div className="container-site">
        <div className="max-w-3xl mb-10">
          <h2 className="text-3xl font-bold mb-4">{heading}</h2>
          <p className="text-neutral-600 leading-relaxed">{intro}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {choices.map((choice) => (
            <article key={choice.title} className="card p-6">
              <span className="badge badge-brand mb-4">{choice.label}</span>
              <h3 className="text-xl font-bold mb-3">{choice.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed mb-5">{choice.description}</p>
              <ul className="space-y-3">
                {choice.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-neutral-700">
                    <span className="mt-0.5 text-brand" aria-hidden="true">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
            <h3 className="font-bold text-lg mb-2">{changeTitle}</h3>
            <p className="text-sm text-neutral-700 leading-relaxed">{changeBody}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="font-bold text-lg mb-2">{depositTitle}</h3>
            <p className="text-sm text-neutral-700 leading-relaxed">{depositBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
