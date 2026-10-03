import Link from "next/link";
import { localeRegistry, type Locale } from "@/i18n/config";
const copy={
  en:{title:"Page not found",description:"The page you're looking for doesn't exist or has been moved. Let's get you back on track.",home:"Back to Home",browse:"Browse Rentals"},
  es:{title:"Página no encontrada",description:"La página que buscas no existe o se ha trasladado. Te ayudamos a volver a encontrar lo que necesitas.",home:"Volver al inicio",browse:"Ver artículos de alquiler"},
  de:{title:"Seite nicht gefunden",description:"Die gesuchte Seite existiert nicht oder wurde verschoben. Hier findest du wieder, was du brauchst.",home:"Zur Startseite",browse:"Mietartikel ansehen"}
};
export default function NotFoundPageBody({locale}:{locale:Locale}) {
 const text=copy[locale],prefix=localeRegistry[locale].prefix;
 return <section className="section bg-gradient-to-br from-neutral-50 to-teal-50/20 flex-1 flex items-center">
  <div className="container-site text-center py-20"><span className="text-7xl block mb-6">🔍</span>
   <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">404</h1>
   <p className="text-xl text-neutral-600 mb-2">{text.title}</p>
   <p className="text-neutral-500 mb-10 max-w-md mx-auto">{text.description}</p>
   <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
    <Link href={prefix || "/"} className="btn btn-primary btn-lg">{text.home}</Link>
    <Link href={prefix+"/valencia"} className="btn btn-outline btn-lg">{text.browse}</Link>
   </div>
  </div>
 </section>;
}
