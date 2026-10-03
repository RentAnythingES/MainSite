import HomePageBody from '@/components/HomePageBody';
import { germanPageMetadata, germanPublicContext } from '@/lib/german-publication';

export async function generateMetadata() {
  const context = await germanPublicContext();
  return germanPageMetadata('/', 'Mietartikel in Valencia | Rent&Roll',
    'Kinderwagen, Reisebetten, Elektromobile und weitere Mietartikel für deinen Aufenthalt in Valencia. Prüfe Verfügbarkeit, Abholung und Lieferung.', context?.isIndexable === true);
}
export default function Page() { return <HomePageBody locale="de" />; }
