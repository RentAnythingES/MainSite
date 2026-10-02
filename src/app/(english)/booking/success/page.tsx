import { customerTokenPath } from "@/i18n/customer-path";
import BookingSuccessPage from "@/components/BookingSuccessPage";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  if (params.locale === "de") {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") query.set(key, value);
      else if (Array.isArray(value)) value.forEach(item => query.append(key, item));
    }
    redirect(`${customerTokenPath("de", "/booking/success")}?${query}`);
  }
  return <BookingSuccessPage />;
}
