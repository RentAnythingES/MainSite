import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";

interface CategoryContent {
  title: string;
  description: string;
  editorialHeading: string;
  editorialParagraphs: string[];
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
    title: "Alquiler de Equipos de Hogar y Confort en Valencia",
    description: "Alquila purificadores de aire, aires acondicionados portátiles, electrodomésticos y más en Valencia.",
    editorialHeading: "Haz tu alojamiento en Valencia más confortable",
    editorialParagraphs: [
      "No todos los alquileres vacacionales vienen con todo lo que necesitas. Los veranos en Valencia pueden ser intensos — las temperaturas superan regularmente los 35-40 °C en julio y agosto — y muchos pisos carecen de aire acondicionado o tienen uno insuficiente.",
      "Un aire acondicionado portátil (los valencianos los llaman pingüinos) puede transformar tu estancia veraniega. Un purificador de aire ayuda durante los días de calima, cuando el polvo del Sáhara reduce la calidad del aire. No son lujos — son elementos esenciales de confort que marcan la diferencia entre sobrevivir tus vacaciones y disfrutarlas.",
      "Entregamos y recogemos todo, así que no necesitas comprar equipos que solo usarás una vez y dejarás atrás.",
    ],
  },
  "travel-outdoors": {
    title: "Alquiler de Equipamiento de Playa y Aire Libre en Valencia",
    description: "Alquila sombrillas, equipamiento de playa y artículos de exterior en Valencia. Listo para la playa de la Malvarrosa.",
    editorialHeading: "Preparado para la playa sin equipaje extra",
    editorialParagraphs: [
      "Las playas urbanas de Valencia — la Malvarrosa, la Patacona, el Cabanyal — son de las mejores del Mediterráneo. Amplias extensiones de arena, aguas cálidas y poco profundas, y un paseo marítimo lleno de restaurantes y bares.",
      "El alquiler de hamaca y sombrilla en los chiringuitos cuesta unos 9-10 € cada uno, pero las zonas se llenan rápido en temporada alta y estás limitado a sus secciones. Tener tu propio equipo de playa significa que puedes instalarte donde quieras, llegar cuando te convenga y tener protección UV adecuada para toda la familia.",
      "Entregamos el equipamiento de playa en tu alojamiento para que esté esperándote cuando llegues. Sin buscar tiendas, sin cargar sombrillas por las calles.",
    ],
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

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
  };
}

export default async function CategoryPageES({ params }: Props) {
  const { category } = await params;
  const meta = categoryMetaES[category];
  if (!meta) notFound();

  const categoryProducts = getProductsByCategory(category);

  const subcategories = Array.from(
    new Map(categoryProducts.map((p) => [p.subcategorySlug, { name: p.subcategory, slug: p.subcategorySlug }])).values()
  );

  return (
    <>
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

      <section className="bg-neutral-50 py-12">
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold mb-3">¿No encuentras lo que buscas?</h2>
          <p className="text-neutral-500 mb-6">Estamos añadiendo nuevos productos constantemente. ¡Escríbenos!</p>
          <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            💬 Escríbenos por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
