import Link from "next/link";

const copy = {
  en: {
    heading: "Compare mobility options before choosing the kit",
    intro: "Review the current wheelchair and scooter ranges, then tell us which practical constraints matter for your stay.",
    links: [
      {
        href: "/rental/mobility/wheelchairs",
        title: "Compare wheelchair rentals",
        description: "Choose between companion-pushed and electric options using fit, access, transport and charging details.",
      },
      {
        href: "/rental/mobility/mobility-scooters",
        title: "Compare mobility scooter rentals",
        description: "Compare foldable, standard and XL options for storage, vehicle transport and planned Valencia routes.",
      },
    ],
  },
  es: {
    heading: "Compara las opciones de movilidad antes de elegir el kit",
    intro: "Revisa las sillas y scooters disponibles y cuéntanos qué limitaciones prácticas importan durante la estancia.",
    links: [
      {
        href: "/es/rental/mobility/wheelchairs",
        title: "Comparar alquileres de sillas de ruedas",
        description: "Elige entre opciones con acompañante y eléctricas según el ajuste, los accesos, el transporte y la carga.",
      },
      {
        href: "/es/rental/mobility/mobility-scooters",
        title: "Comparar alquileres de scooters de movilidad",
        description: "Compara opciones plegables, estándar y XL según el almacenamiento, el transporte y las rutas previstas.",
      },
    ],
  },
} as const;

export default function MobilityFamilyLinks({ locale = "en" }: { locale?: "en" | "es" }) {
  const content = copy[locale];

  return (
    <section className="section bg-white">
      <div className="container-site">
        <h2 className="text-3xl font-bold">{content.heading}</h2>
        <p className="mt-3 max-w-3xl text-neutral-600">{content.intro}</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {content.links.map((link) => (
            <Link key={link.href} href={link.href} className="card bg-white p-6 transition-shadow hover:shadow-md group">
              <h3 className="text-lg font-bold transition-colors group-hover:text-brand">{link.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{link.description}</p>
              <span className="mt-4 inline-block text-sm font-bold text-brand">{locale === "es" ? "Comparar opciones →" : "Compare options →"}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
