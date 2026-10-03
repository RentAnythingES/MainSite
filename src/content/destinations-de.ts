import { getPublishedDestinations, type Destination } from "@/content/destinations";
import page0 from "@/content/destinations-de/albufera.json";
import page1 from "@/content/destinations-de/benimaclet.json";
import page2 from "@/content/destinations-de/bioparc-valencia.json";
import page3 from "@/content/destinations-de/bunol-day-trip.json";
import page4 from "@/content/destinations-de/cabanyal.json";
import page5 from "@/content/destinations-de/central-market-la-lonja.json";
import page6 from "@/content/destinations-de/christmas-valencia.json";
import page7 from "@/content/destinations-de/city-of-arts-and-sciences.json";
import page8 from "@/content/destinations-de/corpus-christi-valencia.json";
import page9 from "@/content/destinations-de/cullera-day-trip.json";
import page10 from "@/content/destinations-de/el-carmen.json";
import page11 from "@/content/destinations-de/el-ensanche.json";
import page12 from "@/content/destinations-de/el-saler-beach.json";
import page13 from "@/content/destinations-de/fallas.json";
import page14 from "@/content/destinations-de/gran-fira-valencia.json";
import page15 from "@/content/destinations-de/malvarrosa-beach.json";
import page16 from "@/content/destinations-de/oceanografic-valencia.json";
import page17 from "@/content/destinations-de/patacona-beach.json";
import page18 from "@/content/destinations-de/pinedo-beach.json";
import page19 from "@/content/destinations-de/requena.json";
import page20 from "@/content/destinations-de/ruzafa.json";
import page21 from "@/content/destinations-de/sagunto.json";
import page22 from "@/content/destinations-de/semana-santa-marinera-valencia.json";
import page23 from "@/content/destinations-de/turia-gardens.json";
import page24 from "@/content/destinations-de/valencia-historic-centre.json";
import page25 from "@/content/destinations-de/xativa.json";

/** Complete translations only; original section structure and assets are verified before registration. */
export const germanDestinations: Destination[] = [page0 as Destination, page1 as Destination, page2 as Destination, page3 as Destination, page4 as Destination, page5 as Destination, page6 as Destination, page7 as Destination, page8 as Destination, page9 as Destination, page10 as Destination, page11 as Destination, page12 as Destination, page13 as Destination, page14 as Destination, page15 as Destination, page16 as Destination, page17 as Destination, page18 as Destination, page19 as Destination, page20 as Destination, page21 as Destination, page22 as Destination, page23 as Destination, page24 as Destination, page25 as Destination];
export function getPublishedGermanDestinations(): Destination[] { return getPublishedDestinations().flatMap(original => { const translated = germanDestinations.find(page => page.slug === original.slug); return translated ? [translated] : []; }); }
export function getGermanDestinationBySlug(slug: string): Destination | undefined { return getPublishedGermanDestinations().find(page=>page.slug===slug); }
