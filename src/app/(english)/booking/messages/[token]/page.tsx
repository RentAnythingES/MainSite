import type { Metadata } from "next";
import CustomerConversation from "@/components/agents/CustomerConversation";
import { customerConversationAccess } from "@/lib/customer-conversation-access";
import { germanCustomerAccess } from "@/lib/german-customer-access";
import { customerTokenPath } from "@/i18n/customer-path";
import { redirect } from "next/navigation";
export const metadata: Metadata = { title: "Private conversation | Rentandroll", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const access = await customerConversationAccess(token).catch(() => null);
  if (access?.locale === "de" && germanCustomerAccess()) redirect(customerTokenPath("de", `/booking/messages/${token}`));
  return <CustomerConversation token={token} locale={access?.locale ?? "en"} />;
}
