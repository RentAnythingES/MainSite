import Link from "next/link";

export default function ExplorerDetails({ locale = "en" }: { locale?: "en" | "es" }) {
  const es = locale === "es";
  const benefits = es ? [
    ["Un solo plan", "Bici, remolque y sombra coordinados en una sola solicitud, con un presupuesto completo antes de pagar."],
    ["Ajustado a vuestra familia", "Comprobamos talla de bici, adecuación del remolque, cascos, candado y espacio para los extras."],
    ["Entrega coordinada", "Indica tu alojamiento. Confirmamos contigo la entrega y la recogida para las fechas elegidas."]
  ] : [
    ["One plan, less organising", "Bike, trailer and shade in one request, with a complete quote before you pay."],
    ["A setup that fits your family", "We check bike size, trailer suitability, helmets, lock and carrying space for your extras."],
    ["Delivery arranged together", "Tell us where you are staying. We confirm delivery and collection around your rental dates."]
  ];
  return <section className="section bg-white" aria-labelledby="explorer-plan">
    <div className="container-site">
      <div className="max-w-2xl mb-8">
        <p className="text-sm font-semibold text-brand mb-2">{es ? "Vuestro día, a vuestro ritmo" : "Your day, at your pace"}</p>
        <h2 id="explorer-plan" className="text-3xl font-bold">{es ? "Del Turia a una pausa junto al mar" : "From the Turia to a seaside break"}</h2>
        <p className="mt-4 text-neutral-600 leading-relaxed">{es ? "Empezad por los jardines, parad cuando los peques lo necesiten y buscad un rato de playa. Os ayudamos a preparar el material; vosotros elegís el ritmo." : "Start with the gardens, stop when little legs need a break and leave time for the beach. We help organise the equipment; you choose the pace."}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">{benefits.map(([title, body]) => <div key={title} className="card p-6 bg-neutral-50"><h3 className="text-lg font-bold mb-2">{title}</h3><p className="text-neutral-600 text-sm leading-relaxed">{body}</p></div>)}</div>
      <div className="mt-8 rounded-2xl border border-brand/20 bg-brand/5 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div className="max-w-2xl"><h3 className="text-xl font-bold">{es ? "Precio completo según tus fechas" : "A complete price for your dates"}</h3><p className="mt-2 text-neutral-600 leading-relaxed">{es ? "El presupuesto detalla el equipo, los extras, la entrega y la recogida. Confirmamos disponibilidad y ajuste antes del pago. Sin cobro al enviar la solicitud." : "Your quote covers the equipment, chosen extras, delivery and collection. We confirm supply and fit before payment. There is no charge to send a request."}</p></div>
        <a href="#configure-kit" className="btn btn-primary shrink-0">{es ? "Solicitar mis fechas" : "Request my dates"}</a>
      </div>
      <p className="mt-5 text-sm text-neutral-500">{es ? "¿Solo necesitas material para la playa?" : "Just need the beach equipment?"} <Link className="text-brand underline underline-offset-4" href={(es ? "/es" : "") + "/valencia/kits/family-beach-kit"}>{es ? "Ver el kit de playa familiar" : "See the Family Beach Kit"}</Link></p>
    </div>
  </section>;
}
