import { customerTokenPath } from "@/i18n/customer-path";
import NewsletterUnsubscribePage from "@/components/NewsletterUnsubscribePage";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  if (params.locale === "de") {
    const query = new URLSearchParams({ locale: "de" });
    if (typeof params.token === "string") query.set("token", params.token);
    redirect(`${customerTokenPath("de", "/newsletter/unsubscribe")}?${query}`);
  }
  return <NewsletterUnsubscribePage />;
}
