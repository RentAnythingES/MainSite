import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import ProductCard from "@/components/ProductCard";
import { getBreadcrumbJsonLd, getCategoryCollectionJsonLd } from "@/lib/jsonld";

interface CategoryContent {
  title: string;
  description: string;
  editorialHeading: string;
  editorialParagraphs: string[];
  featuredHeading?: string;
  featuredDescription?: string;
  featuredPathways?: Array<{
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }>;
}

const categoryMetaES: Record<string, CategoryContent> = {
  "baby-gear": {
    title: "Alquiler de Artículos de Bebé y Niños en Valencia",
    description: "Alquila cochecitos, cunas de viaje, sillas de coche, tronas y más en Valencia. Marcas de primera calidad entregadas en tu alojamiento.",
    editorialHeading: "¿Por qué alquilar artículos de bebé en Valencia?",
    editorialParagraphs: [
      "Viajar con un bebé o un niño pequeño significa hacer maletas con estrategia. Cochecitos, sillas de coche y cunas de viaje son voluminosos, pesados y caros de facturar como equipaje — además del riesgo de daños durante el transporte.",
      "Alquilar localmente resuelve todo esto. Entregamos equipos de bebé de primera calidad directamente en tu hotel, Airbnb o apartamento vacacional antes de que llegues. Todo está limpio e inspeccionado entre alquileres. Cuando termines, recogemos todo en tu puerta. Sin colas, sin cintas de equipaje, sin estrés.",
      "Valencia es una de las ciudades más familiares de Europa — calles llanas para cochecitos, playas suaves para los más pequeños y una cultura que acoge a los niños en todas partes. El equipo adecuado lo hace aún mejor.",
    ],
  },
  "kids-family": {
    title: "Alquiler de Equipamiento Infantil y Familiar en Valencia",
    description: "Alquila bicicletas de equilibrio, juguetes y equipamiento familiar práctico en Valencia, con opciones flexibles de recogida y entrega.",
    editorialHeading: "Equipamiento útil para estancias familiares en Valencia",
    editorialParagraphs: [
      "Las vacaciones en familia son más sencillas cuando los niños disponen de equipamiento adecuado sin tener que transportar cada artículo voluminoso por el aeropuerto. Alquilar en Valencia permite viajar con menos equipaje y elegir lo que realmente encaja con la estancia.",
      "Esta colección reúne equipamiento práctico para niños pequeños, niños mayores y actividades familiares. Cada ficha de producto explica las medidas, la orientación de edad, los elementos incluidos y las condiciones de alquiler para que puedas comprobar si es adecuado antes de reservar.",
      "Tanto si te alojas cerca de los Jardines del Turia como en la playa o en un apartamento de Valencia, podemos ayudarte a coordinar la recogida o la entrega según tus fechas y alojamiento.",
    ],
  },
  "mobility": {
    title: "Alquiler de Sillas de Ruedas y Scooters de Movilidad en Valencia",
    description: "Alquila sillas de ruedas, scooters de movilidad, andadores y ayudas diarias en Valencia. Entrega en tu hotel o Airbnb.",
    editorialHeading: "Explorar Valencia con equipos de movilidad",
    editorialParagraphs: [
      "Valencia es una de las ciudades más accesibles de España. El terreno llano, el metro totalmente accesible y los amplios paseos marítimos la hacen ideal para usuarios de silla de ruedas y visitantes con movilidad reducida.",
      "Alquilar equipos de movilidad localmente significa que evitas el riesgo de daños en tu propia silla de ruedas o scooter durante el vuelo. Entregamos directamente en tu alojamiento — ya sea un hotel en el centro histórico, un apartamento en la playa de la Malvarrosa o un Airbnb en Ruzafa.",
      "Nuestros scooters de movilidad ligeros son especialmente populares entre los visitantes que quieren independencia para recorrer los 9 km de los Jardines del Turia, la Ciudad de las Artes y las Ciencias, y las playas accesibles con sus servicios de baño asistido.",
    ],
  },
  "remote-work": {
    title: "Alquiler de Equipos de Teletrabajo en Valencia",
    description: "Alquila monitores, escritorios de pie, sillas ergonómicas y equipos tecnológicos en Valencia. Ideal para nómadas digitales.",
    editorialHeading: "Monta tu espacio de trabajo perfecto en Valencia",
    editorialParagraphs: [
      "Valencia se ha convertido en uno de los destinos favoritos de los nómadas digitales en Europa — 300 días de sol, fibra óptica de más de 240 Mbps y un coste de vida muy por debajo de Barcelona o Lisboa. El único problema: la mayoría de los apartamentos de alquiler vienen con un escritorio pequeño y una silla inestable.",
      "Nuestros equipos de teletrabajo llenan ese vacío. Un monitor de 27 pulgadas, una silla ergonómica o un escritorio de pie transforman cualquier alquiler vacacional en un espacio de trabajo realmente productivo. Lo entregamos todo en tu apartamento y lo recogemos cuando te vayas.",
      "A diferencia de un coworking (120-160 €/mes más desplazamiento), tener tu propio equipo significa trabajar a tu ritmo — en la terraza por la mañana, en el escritorio por la tarde y en la playa a las 6.",
    ],
  },
  "home-living": {
    title: "Alquiler de Equipamiento para Apartamentos en Valencia",
    description: "Alquila aire acondicionado portátil, purificadores y equipamiento de confort en Valencia, con entrega y recogida para estancias cortas o largas.",
    editorialHeading: "Adapta tu apartamento de Valencia a tu estancia",
    editorialParagraphs: [
      "Los apartamentos turísticos y alojamientos temporales no siempre incluyen todo lo necesario para una estancia cómoda. El alquiler de refrigeración portátil, equipos para la calidad del aire y otros complementos permite resolver una necesidad concreta sin comprar, guardar o desechar un aparato voluminoso al terminar el viaje.",
      "Durante el verano, un aire acondicionado portátil puede mejorar el confort de un dormitorio o salón cuando el alojamiento tiene una refrigeración limitada. Estos equipos necesitan una salida adecuada por ventana o puerta de balcón, por lo que cada ficha explica la superficie recomendada, la evacuación del aire, el ruido y el montaje antes de confirmar la disponibilidad.",
      "Los purificadores pueden ayudar a huéspedes sensibles al polvo, el polen o la calidad del aire interior. Elige un producto o empieza con el Kit de Apartamento de Verano para preparar una combinación adaptada. Las opciones de entrega y recogida aparecen durante la reserva y confirmamos los detalles de instalación con el alojamiento.",
    ],
    featuredHeading: "Prepara una estancia más cómoda en Valencia",
    featuredDescription: "Empieza con un kit estacional o consulta nuestra guía práctica para elegir la refrigeración y el equipamiento adecuados para tu alojamiento.",
    featuredPathways: [
      {
        eyebrow: "Kit de apartamento",
        title: "Configura un kit de apartamento de verano",
        description: "Combina refrigeración y equipos para la calidad del aire según tu alojamiento y tus fechas.",
        href: "/valencia/kits/summer-apartment-survival-kit",
      },
      {
        eyebrow: "Guía práctica",
        title: "Prepárate para el verano en Valencia",
        description: "Consulta horarios locales, estrategias para refrescar el apartamento y consejos para los días de más calor.",
        href: "/blog/valencia-summer-survival-guide",
      },
    ],
  },
  "travel-outdoors": {
    title: "Alquiler de Equipamiento de Playa en Valencia",
    description: "Alquila sombrillas, refugios y sombra familiar en Valencia, con opciones de recogida o entrega para Malvarrosa, Patacona y alojamientos cercanos.",
    editorialHeading: "Alquila material para tus días de playa en Valencia",
    editorialParagraphs: [
      "Las sombrillas y los refugios de playa son difíciles de transportar en avión y pocos apartamentos vacacionales los incluyen. Alquilar equipamiento de playa en Valencia permite disponer de sombra sin comprar artículos voluminosos para una estancia corta.",
      "Elige el producto que encaje con tu grupo y tus planes, desde una sombrilla tradicional hasta un refugio familiar compacto. Cada ficha recoge las medidas, el peso, las piezas incluidas, las instrucciones de montaje y las limitaciones importantes de viento o cuidado antes de comprobar la disponibilidad.",
      "Las opciones de recogida y entrega facilitan el uso del material si te alojas cerca de Malvarrosa, Patacona, Cabanyal o el centro. Las familias que necesiten algo más que sombra también pueden empezar con el Kit de Playa Familiar y solicitar la combinación adecuada para sus fechas.",
    ],
    featuredHeading: "Planifica tus días de playa en Valencia",
    featuredDescription: "Combina el equipamiento con un kit familiar o una guía práctica de la playa más cercana a tu alojamiento.",
    featuredPathways: [
      {
        eyebrow: "Kit de playa",
        title: "Prepara un kit de playa familiar",
        description: "Combina sombra con complementos prácticos para los días de playa durante tu estancia en Valencia.",
        href: "/valencia/kits/family-beach-kit",
      },
      {
        eyebrow: "Guía local",
        title: "Planifica un día en la Malvarrosa",
        description: "Conoce el paseo, los servicios familiares y qué llevar a la playa urbana más conocida de Valencia.",
        href: "/discover/malvarrosa-beach",
      },
      {
        eyebrow: "Guía local",
        title: "Descubre la playa de la Patacona",
        description: "Organiza un día de playa algo más tranquilo al norte de la Malvarrosa y elige el equipamiento adecuado.",
        href: "/discover/patacona-beach",
      },
    ],
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return Object.keys(categoryMetaES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMetaES[category];
  if (!meta) return { title: "Categoría No Encontrada" };
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://rentanything.es/es/rental/${category}`,
      languages: {
        en: `https://rentanything.es/rental/${category}`,
        es: `https://rentanything.es/es/rental/${category}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://rentanything.es/es/rental/${category}`,
      locale: "es_ES",
      images: [{ url: `/categories/${category}.png`, alt: meta.title }],
    },
  };
}

export default async function CategoryPageES({ params }: Props) {
  const { category } = await params;
  const meta = categoryMetaES[category];
  if (!meta) notFound();

  const categoryProducts = await getProductsByCategoryFromDB(category, "es");

  const subcategories = Array.from(
    new Map(categoryProducts.map((p) => [p.subcategorySlug, { name: p.subcategory, slug: p.subcategorySlug }])).values()
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getCategoryCollectionJsonLd({
              name: meta.title,
              description: meta.description,
              url: `https://rentanything.es/es/rental/${category}`,
              locale: "es",
              products: categoryProducts,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Inicio", url: "https://rentanything.es/es" },
              { name: "Valencia", url: "https://rentanything.es/es/valencia" },
              { name: meta.title, url: `https://rentanything.es/es/rental/${category}` },
            ])
          ),
        }}
      />
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/es" className="hover:text-brand transition-colors">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/es/valencia" className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{meta.title.split(" en Valencia")[0]}</li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-12 md:py-16">
        <div className="container-site">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{meta.title}</h1>
          <p className="text-neutral-600 max-w-2xl">{meta.description}</p>
        </div>
      </section>

      {subcategories.length > 1 && (
        <section className="bg-white border-b border-border py-4">
          <div className="container-site">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-sm text-neutral-500 flex-shrink-0">Filtrar:</span>
              <span className="px-3 py-1.5 rounded-full bg-brand text-white text-sm font-medium cursor-pointer">
                Todos ({categoryProducts.length})
              </span>
              {subcategories.map((sub) => (
                <span key={sub.slug} className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 cursor-pointer transition-colors flex-shrink-0">
                  {sub.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-white">
        <div className="container-site">
          <p className="text-sm text-neutral-500 mb-6">{categoryProducts.length} productos disponibles en Valencia</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} id={`cat-product-${product.slug}`} basePath="/es/product" />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">{meta.editorialHeading}</h2>
            {meta.editorialParagraphs.map((p, i) => (
              <p key={i} className="text-neutral-600 leading-relaxed mb-4">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {meta.featuredPathways && meta.featuredPathways.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold mb-3">{meta.featuredHeading}</h2>
              <p className="text-neutral-600">
                {meta.featuredDescription}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {meta.featuredPathways.map((pathway) => (
                <Link
                  key={pathway.href}
                  href={pathway.href}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand mb-3">{pathway.eyebrow}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">
                    {pathway.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {pathway.description}
                  </p>
                  <span className="text-sm font-semibold text-brand">Explorar →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-neutral-50 py-12">
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold mb-3">¿No encuentras lo que buscas?</h2>
          <p className="text-neutral-500 mb-6">Estamos añadiendo nuevos productos constantemente. ¡Escríbenos!</p>
          <a href="https://wa.me/34684708013" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            💬 Escríbenos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
