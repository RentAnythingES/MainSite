import type { InformationPageContent } from "@/content/german-information";
import type { Locale } from "@/i18n/config";

export default function InformationPage({ content, locale }: { content: InformationPageContent; locale: Locale }) {
  return <section className="section bg-white" lang={locale}>
    <div className="container-site max-w-3xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">{content.title}</h1>
      {content.sourceDate && <p className="text-sm text-neutral-500 mb-6">Stand der Quellfassung: {content.sourceDate}</p>}
      {content.intro && <p className="text-lg text-neutral-600 mb-8">{content.intro}</p>}
      <div className="space-y-8">
        {content.sections.map(section => <section key={section.title}>
          <h2 className="text-xl font-bold mb-3">{section.title}</h2>
          {section.paragraphs?.map((text, index) => <p className="text-neutral-600 leading-relaxed mb-3" key={index}>{text}</p>)}
          {section.bullets && <ul className="list-disc pl-5 space-y-2 text-neutral-600">{section.bullets.map((text, index) => <li key={index}>{text}</li>)}</ul>}
        </section>)}
      </div>
      {content.reviewNotes?.length ? <aside className="card p-5 mt-10">
        <h2 className="font-bold mb-3">Offene Punkte für die Freigabe</h2>
        <ul className="list-disc pl-5 space-y-2">{content.reviewNotes.map((note, index) => <li key={index}>{note}</li>)}</ul>
      </aside> : null}
    </div>
  </section>;
}
