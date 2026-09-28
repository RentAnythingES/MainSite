import type { Metadata } from "next";
import NetworkPage from "@/components/agents/NetworkPage";
export const metadata: Metadata = { title: "Join the Rentandroll Agent Network", description: "Apply to become a local Rentandroll agent. Manage equipment rentals, customer support, deliveries and collections in your city.", alternates: { canonical: "https://rentandroll.com/agent-network", languages: { en: "https://rentandroll.com/agent-network", es: "https://rentandroll.com/es/agent-network" } } };
export default function Page() { return <NetworkPage />; }
