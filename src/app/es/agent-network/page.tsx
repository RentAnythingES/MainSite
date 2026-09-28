import type { Metadata } from "next";
import NetworkPage from "@/components/agents/NetworkPage";
export const metadata: Metadata = { title: "Únete a la red de agentes de Rentandroll", description: "Solicita ser agente local de Rentandroll. Gestiona alquileres, atención al cliente, entregas y recogidas de equipos en tu ciudad.", alternates: { canonical: "https://rentandroll.com/es/agent-network", languages: { en: "https://rentandroll.com/agent-network", es: "https://rentandroll.com/es/agent-network" } } };
export default function Page() { return <NetworkPage es />; }
