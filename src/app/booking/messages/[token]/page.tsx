import type { Metadata } from "next";
import CustomerConversation from "@/components/agents/CustomerConversation";
export const metadata: Metadata = { title: "Private conversation | Rentandroll", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Page({ params }: { params: Promise<{ token: string }> }) { return <CustomerConversation token={(await params).token} />; }
