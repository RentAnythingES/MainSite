"use client";

import Link from "next/link";
import ProductEditorialNotes from "@/components/ProductEditorialNotes";
import { isLocale } from "@/i18n/config";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  blankTranslation,
  translationMissingFields,
  translationTextFields,
  type TranslationContent,
  type TranslationEntry,
  type TranslationTextField,
} from "@/lib/translation-workflow";

type Workspace = {
  product: {
    name: string;
    slug: string;
    description: string;
    features: string[];
    specs: Record<string, string>;
    translation_source_revision: number;
    product_localizations: Array<
      Partial<TranslationContent> & { locale: string }
    >;
    product_faqs: Array<{ locale: string; question: string; answer: string }>;
    product_images: Array<{ is_primary: boolean; alt_text: string }>;
  };
  entry: TranslationEntry | null;
  languages: Array<{ code: string; name: string; is_public: boolean }>;
  readiness: {
    missing: string[];
    current: boolean;
    reviewed: boolean;
    publishable: boolean;
  };
  canPublish: boolean;
  events: Array<{
    action: string;
    revision: number;
    source_revision: number;
    actor_id: string | null;
    created_at: string;
  }>;
};
const fieldLabels: Record<TranslationTextField, string> = {
  name: "Product display name",
  short_description: "Short description",
  detail_description: "Product details",
  includes_text: "Included items",
  constraints_text: "Restrictions and suitability",
  delivery_setup_note: "Delivery and setup",
  care_note: "Care and safety",
  seo_title: "Search title (up to 60 characters)",
  seo_description: "Search description (130–155 characters)",
  image_alt_text: "Primary image description",
};
const inputClass =
  "w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500";

export default function TranslationPage() {
  const { id } = useParams<{ id: string }>();
  const [locale, setLocale] = useState("de");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [content, setContent] = useState<TranslationContent>(blankTranslation);
  const [specText, setSpecText] = useState("");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [languageReviewed, setLanguageReviewed] = useState(false);
  const [factsReviewed, setFactsReviewed] = useState(false);
  const requestId = useRef(0);
  const load = useCallback(async () => {
    const current = ++requestId.current;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/products/${id}/translations?locale=${encodeURIComponent(locale)}`,
        { cache: "no-store", signal: AbortSignal.timeout(15000) },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (current !== requestId.current) return;
      const next: TranslationContent =
        data.entry?.translation_content || blankTranslation();
      setWorkspace(data);
      setContent(next);
      setSpecText(
        Object.entries(next.specs)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
      );
      setDirty(false);
      setLanguageReviewed(false);
      setFactsReviewed(false);
    } catch (reason) {
      if (current === requestId.current)
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not load translation",
        );
    } finally {
      if (current === requestId.current) setBusy(false);
    }
  }, [id, locale]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => { void load(); });
    return () => {
      cancelAnimationFrame(frame);
      requestId.current += 1;
    };
  }, [load]);
  const edit = (patch: Partial<TranslationContent>) => {
    setContent((value) => ({ ...value, ...patch }));
    setDirty(true);
    setNotice("");
    setLanguageReviewed(false);
    setFactsReviewed(false);
  };
  const act = async (action: string) => {
    if (!workspace) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const specs: Record<string, string> = {};
      for (const line of specText.split("\n").filter((value) => value.trim())) {
        const split = line.indexOf(":");
        if (split < 1)
          throw new Error("Use one specification per line: label: value");
        const label = line.slice(0, split).trim();
        if (Object.hasOwn(specs, label))
          throw new Error("Specification labels must be unique");
        specs[label] = line.slice(split + 1).trim();
      }
      const response = await fetch(`/api/admin/products/${id}/translations`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          action,
          expectedRevision: workspace.entry?.translation_revision || 0,
          expectedSourceRevision: workspace.product.translation_source_revision,
          content: { ...content, specs },
          languageReviewed,
          factsReviewed,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await load();
      setNotice(
        action === "save"
          ? "Draft saved. Review is a separate step."
          : `Translation ${action === "review" ? "reviewed" : action === "publish" ? "published" : "withdrawn from publication"}.`,
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not save translation. Reload the saved version before retrying.",
      );
    } finally {
      setBusy(false);
    }
  };
  const source = workspace?.product.product_localizations.find(
    (row) => row.locale === "en",
  );
  const sourceValue = (field: TranslationTextField) =>
    field === "name"
      ? workspace?.product.name
      : field === "image_alt_text"
        ? workspace?.product.product_images.find((row) => row.is_primary)
            ?.alt_text
        : source?.[field] ||
          (field === "short_description" ? workspace?.product.description : "");
  const missing = translationMissingFields(content);
  return (
    <div className="max-w-6xl space-y-6">
      <header>
        <Link
          href={`/admin/products/${id}/content`}
          className="text-sm text-teal-400"
        >
          ← Source content
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">
          Translations and review
        </h1>
        <p className="mt-2 text-neutral-400">
          {workspace?.product.name} · {workspace?.product.slug}
        </p>
      </header>
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200"
        >
          {error} Your text is kept on this page.
        </div>
      )}
      {notice && (
        <p role="status" className="text-emerald-300">
          {notice}
        </p>
      )}
      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
        <label className="block text-sm text-neutral-300">
          Target language
          <select
            aria-label="Target language"
            value={locale}
            disabled={busy || dirty}
            onChange={(event) => {
              setWorkspace(null);
              setNotice("");
              setLocale(event.target.value);
            }}
            className={`${inputClass} mt-2 max-w-xs`}
          >
            {(
              workspace?.languages || [
                { code: "de", name: "Deutsch", is_public: false },
              ]
            ).map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
                {language.is_public ? "" : " · private"}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-neutral-400">
          State:{" "}
          <strong className="text-white">
            {workspace?.entry?.publication_status || "No draft"}
          </strong>{" "}
          · Source revision{" "}
          {workspace?.product.translation_source_revision || "—"} · Translation
          revision {workspace?.entry?.translation_revision || 0}
        </p>
        {!workspace?.canPublish && (
          <p className="text-sm text-amber-300">
            This language is private. You can prepare and review copy;
            publication stays disabled.
          </p>
        )}
        {workspace?.entry && !workspace.readiness.current && (
          <p className="text-sm text-amber-300">
            The source has changed. Compare every field with the current source,
            update the draft, then review again.
          </p>
        )}
        {workspace?.entry?.reviewed_at && (
          <p className="text-sm text-neutral-400">
            Reviewed {new Date(workspace.entry.reviewed_at).toLocaleString()} by{" "}
            {workspace.entry.reviewed_by}
          </p>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => void load()}
          className="text-sm text-teal-400 underline disabled:opacity-50"
        >
          Reload saved version{dirty ? " (discard these unsaved edits)" : ""}
        </button>
      </section>
      {workspace && (
        <fieldset disabled={busy} className="space-y-6 disabled:opacity-70">
          <legend className="sr-only">Translation content</legend>
          <p className="text-sm text-neutral-400">
            Keep brands, model numbers and factual values accurate. Empty source
            fields need a product decision; do not invent details. Saving a
            published translation returns it to draft.
          </p>
          {translationTextFields.map((field) => (
            <section
              key={field}
              className="grid gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5 md:grid-cols-2"
            >
              <div>
                <h2 className="text-sm font-semibold text-neutral-300">
                  English source · {fieldLabels[field]}
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-400">
                  {sourceValue(field) || "No source text recorded"}
                </p>
              </div>
              <label className="text-sm text-neutral-300">
                {fieldLabels[field]}
                <textarea
                  lang={locale}
                  value={content[field]}
                  onChange={(event) => edit({ [field]: event.target.value })}
                  rows={field === "detail_description" ? 6 : 3}
                  className={`${inputClass} mt-2`}
                />
                <span className="text-xs text-neutral-500">
                  {content[field].length} characters
                </span>
              </label>
            </section>
          ))}
          <section className="grid gap-5 rounded-xl border border-neutral-800 bg-neutral-900 p-5 md:grid-cols-2">
            <div>
              <h2 className="font-semibold text-white">
                Source features and specifications
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-neutral-400">
                {workspace.product.features?.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
              <dl className="mt-4 text-sm text-neutral-400">
                {Object.entries(workspace.product.specs || {}).map(
                  ([key, value]) => (
                    <div key={key}>
                      <dt className="font-semibold">{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ),
                )}
              </dl>
            </div>
            <div className="space-y-4">
              <label className="block text-sm text-neutral-300">
                Features (one per line)
                <textarea
                  lang={locale}
                  rows={5}
                  value={content.features.join("\n")}
                  onChange={(event) =>
                    edit({ features: event.target.value.split("\n") })
                  }
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className="block text-sm text-neutral-300">
                Specifications (one label: value per line)
                <textarea
                  lang={locale}
                  rows={6}
                  value={specText}
                  onChange={(event) => {
                    setSpecText(event.target.value);
                    edit({});
                  }}
                  className={`${inputClass} mt-2`}
                />
              </label>
            </div>
          </section>
          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-4">
            <h2 className="font-semibold text-white">FAQs</h2>
            <details className="text-sm text-neutral-400">
              <summary className="cursor-pointer">Show English FAQs</summary>
              {workspace.product.product_faqs
                .filter((row) => row.locale === "en")
                .map((faq, index) => (
                  <div className="my-3" key={index}>
                    <strong>{faq.question}</strong>
                    <p>{faq.answer}</p>
                  </div>
                ))}
            </details>
            {content.faqs.map((faq, index) => (
              <div
                key={index}
                className="space-y-2 border-t border-neutral-800 pt-4"
              >
                <label className="block text-sm text-neutral-300">
                  Question {index + 1}
                  <input
                    lang={locale}
                    className={`${inputClass} mt-1`}
                    value={faq.question}
                    onChange={(event) =>
                      edit({
                        faqs: content.faqs.map((value, i) =>
                          i === index
                            ? { ...value, question: event.target.value }
                            : value,
                        ),
                      })
                    }
                  />
                </label>
                <label className="block text-sm text-neutral-300">
                  Answer {index + 1}
                  <textarea
                    lang={locale}
                    className={`${inputClass} mt-1`}
                    rows={3}
                    value={faq.answer}
                    onChange={(event) =>
                      edit({
                        faqs: content.faqs.map((value, i) =>
                          i === index
                            ? { ...value, answer: event.target.value }
                            : value,
                        ),
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  className="text-sm text-neutral-400 underline"
                  onClick={() =>
                    edit({ faqs: content.faqs.filter((_, i) => i !== index) })
                  }
                >
                  Remove FAQ {index + 1}
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-teal-400"
              disabled={content.faqs.length >= 40}
              onClick={() =>
                edit({ faqs: [...content.faqs, { question: "", answer: "" }] })
              }
            >
              Add FAQ
            </button>
          </section>
          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-4">
            <h2 className="font-semibold text-white">Save and review</h2>
            {missing.length > 0 && (
              <p className="text-sm text-amber-300">
                Review checklist:{" "}
                {missing
                  .map(
                    (field) =>
                      fieldLabels[field as TranslationTextField] ||
                      field.replaceAll("_", " "),
                  )
                  .join("; ")}
              </p>
            )}
            <label className="flex gap-3 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={languageReviewed}
                onChange={(event) => setLanguageReviewed(event.target.checked)}
                disabled={dirty}
              />
              I reviewed the saved wording for natural language and the agreed
              tone.
            </label>
            <label className="flex gap-3 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={factsReviewed}
                onChange={(event) => setFactsReviewed(event.target.checked)}
                disabled={dirty}
              />
              I checked product facts, restrictions, safety guidance and
              specifications against the source.
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void act("save")}
                className="btn btn-primary"
              >
                Save draft
              </button>
              <button
                type="button"
                disabled={
                  dirty ||
                  !workspace.readiness.current ||
                  missing.length > 0 ||
                  !languageReviewed ||
                  !factsReviewed
                }
                onClick={() => void act("review")}
                className="rounded-lg bg-neutral-700 px-4 py-2 text-white disabled:opacity-40"
              >
                Mark reviewed
              </button>
              <button
                type="button"
                disabled={
                  dirty ||
                  !workspace.canPublish ||
                  !workspace.readiness.publishable
                }
                onClick={() => void act("publish")}
                className="rounded-lg bg-teal-700 px-4 py-2 text-white disabled:opacity-40"
              >
                Publish reviewed copy
              </button>
              {workspace.entry?.publication_status === "published" && (
                <button
                  type="button"
                  disabled={dirty}
                  onClick={() => void act("unpublish")}
                  className="text-sm text-amber-300"
                >
                  Withdraw publication
                </button>
              )}
            </div>
          </section>
        </fieldset>
      )}
      {workspace?.entry?.translation_content && isLocale(locale) && (
        <details className="rounded-xl border border-neutral-700 p-5">
          <summary className="cursor-pointer font-semibold text-white">
            Saved page copy preview
          </summary>
          <article
            lang={locale}
            className="mt-5 rounded-xl bg-white p-6 text-neutral-800"
          >
            <h2 className="text-2xl font-bold">
              {workspace.entry.translation_content.name}
            </h2>
            <p className="my-4">
              {workspace.entry.translation_content.short_description}
            </p>
            <p className="my-4 whitespace-pre-line">
              {workspace.entry.translation_content.detail_description}
            </p>
            <ProductEditorialNotes
              locale={locale}
              product={{
                includesText: workspace.entry.translation_content.includes_text,
                constraintsText:
                  workspace.entry.translation_content.constraints_text,
                deliverySetupNote:
                  workspace.entry.translation_content.delivery_setup_note,
                careNote: workspace.entry.translation_content.care_note,
              }}
            />
            <ul className="my-4 list-inside list-disc">
              {workspace.entry.translation_content.features.map(
                (value, index) => (
                  <li key={index}>{value}</li>
                ),
              )}
            </ul>
            <dl className="my-4">
              {Object.entries(workspace.entry.translation_content.specs).map(
                ([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 border-b py-2"
                  >
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ),
              )}
            </dl>
            {workspace.entry.translation_content.faqs.map((faq, index) => (
              <div key={index} className="my-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </article>
        </details>
      )}
      {!!workspace?.events.length && (
        <section>
          <h2 className="font-semibold text-white">Recent history</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-400">
            {workspace.events.map((event, index) => (
              <li key={index}>
                {new Date(event.created_at).toLocaleString()} · {event.action} ·
                translation {event.revision}, source {event.source_revision} ·{" "}
                {event.actor_id || "Source update"}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
