# Discover Restaurant Source Register

> Last verified: 19 July 2026

This register supports the internal `sourceNote`, `sourceUrl`, and
`sourceCheckedAt` fields in `src/content/destinations.ts`. Restaurant names,
locations, operating status, formats, and stable menu claims should be checked
again at least every 180 days with `npm run audit:discover-sources`.

## Verification Standard

- Prefer the venue's official website.
- Use municipal, provincial, or official destination tourism sources when a
  venue has no reliable first-party site.
- Michelin may support current restaurant status and format.
- Do not use review scores, crowd-sourced rankings, or unsupported superlatives.
- Opening hours and menus remain changeable; customer copy should tell visitors
  to confirm details when a stop is important to their plans.
- Generic park or square suggestions must be described as area guidance, not as
  endorsement of a specific business.

## Sources by Guide

| Guide | Recommendations | Sources |
|---|---:|---|
| Ruzafa | 5 | [Canalla Bistro](https://www.canallabistro.com/en/home/), [Bluebell Coffee](https://bluebellcoffeeco.com/contacto/), [Copenhagen](https://restaurantecopenhagen.es/), [Nozomi Sushi Bar](https://nozomisushibar.es/en/contact/), [Dulce de Leche business record](https://www.paginasamarillas.es/f/valencia/dulce-de-leche-boutique-s-l-_225480516_000000001.html) |
| Malvarrosa Beach | 3 | [La Pepica](https://lapepica.com/menu/), [Casa Carmela](https://www.casa-carmela.com/es/), [La Más Bonita](https://www.lamasbonita.es/) |
| El Carmen | 4 | [Mercado Central](https://www.valencia.es/es/-/mercado-centr-1), [Café de las Horas](https://cafedelashoras.com/), [Visit Valencia tapas guide](https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas), [Horchatería Santa Catalina](https://www.horchateriasantacatalina.com/menu/) |
| Cabanyal | 4 | [Casa Carmela](https://www.casa-carmela.com/es/), [La Pepica](https://lapepica.com/menu/), [La Más Bonita](https://www.lamasbonita.es/), [Visit Valencia: Casa Montaña](https://www.visitvalencia.com/que-hacer-valencia/gastronomia/restaurantes-valencia/bodega-casa-montana) |
| Benimaclet | 4 | [Benimaclet Entra: Kaf Café](https://benimacletentra.org/portfolio-item/kaf-cafe/), [Bar Verbena](https://barverbena.es/), [Cadena SER: Ambra](https://cadenaser.com/comunitat-valenciana/2025/07/04/ambra-el-sabor-de-la-cocina-valenciana-mas-autentica-en-una-casa-de-pueblo-en-benimaclet-radio-valencia/), [KÜME Café](https://kumepasteleria.com/) |
| Turia Gardens | 3 | [Accessible Turia guide](https://www.visitvalencia.com/en/valencia-accesible/turia-garden), [Gulliver Park](https://www.visitvalencia.com/en/what-to-do-valencia/nature-in-valencia/parks-and-gardens-valencia/gulliver-park), [Turia Gardens](https://www.visitvalencia.com/en/what-to-do-valencia/nature-in-valencia/parks-and-gardens-valencia/turia-gardens) |
| El Ensanche | 4 | [Mercado de Colón](https://mercadocolon.es/), [Canalla Bistro](https://www.canallabistro.com/en/home/), [El Corte Inglés La Plaça](https://www.elcorteingles.es/hosteleria/nuevos-conceptos/la-plasa-valencia-colon/), [Horchatería Daniel](https://horchateria-daniel.es/) |
| Sagunto | 2 | [Arrels](https://www.restaurantarrels.com/), [Valencia provincial tourism: Sagunto](https://turisme.dival.es/en/destino/sagunto/) |
| Requena | 2 | [Requena tourism guide](https://guiasturisticasct.com/wp-content/uploads/Guia-REQUENA-2023.pdf), [Michelin: La Posada de Águeda](https://guide.michelin.com/us/en/comunidad-valenciana/requena/restaurant/la-posada-de-agueda) |
| Patacona Beach | 2 | [Casa Patacona](https://casapatacona.com/), [La Chipirona](https://www.lachipirona.com/) |
| Xàtiva | 2 | [Xàtiva gastronomy programme: Casa La Abuela](https://xativaturismo.com/wp-content/uploads/2021/10/fira-gastro-quadrat.pdf), [El Cullerot](https://elcullerot.com/) |

## Corrections Made

- Removed Casa Baldo 1915 from Ruzafa because its verified address is by Plaça
  de l'Ajuntament, not in Ruzafa.
- Reclassified Kaf Café as a literary and cultural café rather than unsupported
  specialty-coffee and brunch positioning.
- Replaced unverified Benimaclet entries La Finestra, Rincón de Diego, and
  Punjab Palace with current, source-backed venues.
- Replaced the unsupported Malvarrosa and Cabanyal venue claims with neutral,
  source-backed planning guidance.
- Replaced unverified L'Armeler with current Sagunto sources.
- Replaced unsupported Requena price and menu claims with Hotel La Villa and
  La Posada de Águeda source-backed guidance.
- Replaced La Alegría and Chiringuito El Pirata at Patacona with Casa Patacona
  and La Chipirona, both verified through current official sites.
- Removed Hostal Murta from Xàtiva because the municipality reports that it has
  been closed since 2018; replaced it with El Cullerot.
- Corrected Canalla Bistro from “Michelin-starred” to Ricard Camarena's informal
  bistro; the venue itself is not presented as Michelin-starred.
