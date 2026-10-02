import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import NewsletterSignup from "@/components/NewsletterSignup";
import InformationPage from "@/components/InformationPage";
import { germanInformation } from "@/content/german-information";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";

type Props = { params: Promise<{ page: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!privateGermanPreviewEnabled()) return { robots: { index: false, follow: false } };
  const { page } = await params;
  const title = page === "contact" ? "Kontakt" : page === "newsletter" ? "Neuigkeiten aus Valencia" : Object.hasOwn(germanInformation, page) ? germanInformation[page].title : "Private Vorschau";
  return { title, robots: { index: false, follow: false } };
}
export default async function Page({ params }: Props) {
  if (!privateGermanPreviewEnabled()) notFound();
  const { page } = await params;
  if (page === "contact") return <section className="section bg-white">
    <div className="container-site max-w-3xl">
      <h1 className="text-4xl font-bold mb-5">Kontakt zu Rent&Roll</h1>
      <p className="mb-6 text-neutral-600">Frag uns zu einem Mietartikel, deiner Buchung, einer individuellen Anfrage oder einer Partnerschaft in Valencia.</p>
      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        <a className="card p-5" href="https://wa.me/34684708013">Über WhatsApp schreiben</a>
        <a className="card p-5" href="mailto:hello@rentandroll.com">hello@rentandroll.com</a>
      </div>
      <ContactForm locale="de" />
    </div>
  </section>;
  if (page === "newsletter") return <section className="section bg-white">
    <div className="container-site max-w-3xl">
      <h1 className="text-4xl font-bold mb-5">Neuigkeiten aus Valencia</h1>
      <p className="mb-8 text-neutral-600">Tipps für deinen Aufenthalt, neue Mietartikel und gelegentliche Angebote.</p>
      <NewsletterSignup source="private-german-preview" locale="de" />
    </div>
  </section>;
  if (!Object.hasOwn(germanInformation, page)) notFound();
  return <InformationPage content={germanInformation[page]} locale="de" />;
}
