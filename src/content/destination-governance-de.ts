import { getDestinationGovernance, type DestinationGovernance } from "@/content/destinations";
import { getGermanDestinationBySlug } from "@/content/destinations-de";
const labels: Record<string,string> = {
  "Ruzafa neighbourhood guide": "Reiseführer zum Viertel Ruzafa",
  "Valencia beaches overview": "Überblick über Valencias Strände",
  "Official Fallas guide": "Offizieller Fallas-Reiseführer",
  "Semana Santa Marinera 2026": "Semana Santa Marinera 2026",
  "Inclusive Semana Santa Marinera information": "Informationen zur inklusiven Semana Santa Marinera",
  "Semana Santa Marinera festival overview": "Überblick über das Fest Semana Santa Marinera",
  "Feria de Julio Valencia 2026": "Feria de Julio Valencia 2026",
  "Corpus Christi in Valencia": "Fronleichnam in Valencia",
  "Corpus Christi Museum — House of the Rocks": "Fronleichnamsmuseum – Casa de las Rocas",
  "Christmas traditions in Valencia": "Weihnachtstraditionen in Valencia",
  "Municipal nativity scenes": "Städtische Weihnachtskrippen",
  "Valencia nativity-scene route": "Weihnachtskrippenroute durch Valencia",
  "Valencia areas and Albufera overview": "Überblick über Valencia und die Albufera",
  "City of Arts and Sciences visitor guide": "Besucherinformationen zur Stadt der Künste und Wissenschaften",
  "Oceanogràfic visit planning": "Besuchsplanung für das Oceanogràfic",
  "Oceanogràfic visitor FAQ": "Häufige Besucherfragen zum Oceanogràfic",
  "Oceanogràfic accessibility commitment": "Barrierefreiheit im Oceanogràfic",
  "Central Market visitor guide": "Besucherinformationen zum Zentralmarkt",
  "La Lonja de la Seda visitor guide": "Besucherinformationen zur La Lonja de la Seda",
  "Central Market tourism protocol": "Regeln für touristische Besuche im Zentralmarkt",
  "BIOPARC visit planning": "Besuchsplanung für den BIOPARC",
  "BIOPARC visitor FAQ": "Häufige Besucherfragen zum BIOPARC",
  "How to reach BIOPARC": "Anreise zum BIOPARC",
  "Municipal historic-centre route": "Städtische Route durch die historische Innenstadt",
  "Valencia historic city centre": "Valencias historische Innenstadt",
  "El Carmen neighbourhood guide": "Reiseführer zum Viertel El Carmen",
  "El Cabanyal visitor guide": "Besucherinformationen zu El Cabanyal",
  "Valencia neighbourhoods overview": "Überblick über Valencias Stadtviertel",
  "Turia Gardens visitor guide": "Besucherinformationen zu den Turia-Gärten",
  "Turia Gardens accessibility guide": "Barrierefreiheit in den Turia-Gärten",
  "Sagunto official tourism portal": "Offizielles Tourismusportal von Sagunto",
  "Requena municipal tourism portal": "Städtisches Tourismusportal von Requena",
  "El Saler municipal beach guide": "Städtische Strandinformationen zu El Saler",
  "Valencia assisted bathing programme": "Angebot für unterstütztes Baden in Valencia",
  "Pinedo beach service charter": "Leistungsübersicht für den Strand Pinedo",
  "Accessible beaches in Valencia": "Barrierefreie Strände in Valencia",
  "Xàtiva official tourism portal": "Offizielles Tourismusportal von Xàtiva",
  "Buñol Castle": "Burg von Buñol",
  "Natural and active tourism in Buñol": "Natur- und Aktivtourismus in Buñol",
  "Buñol destination overview": "Überblick über das Reiseziel Buñol",
  "Cullera Castle visitor guide": "Besucherinformationen zur Burg von Cullera",
  "Cullera beaches": "Strände von Cullera",
  "Getting to and around Cullera": "Anreise und Fortbewegung in Cullera"
};
/** Original source attribution and review dates are preserved; only visible labels are translated. */
export function getGermanDestinationGovernance(slug: string): DestinationGovernance | undefined {
  if (!getGermanDestinationBySlug(slug)) return undefined;
  const source = getDestinationGovernance(slug);
  if (!source) return undefined;
  return {...source, sources: source.sources.map(item => { if (!labels[item.label]) throw new Error("German source label is missing"); return {...item,label:labels[item.label]}; })};
}
