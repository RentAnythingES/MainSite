# Discover Image Rights Register

> Last updated: 2026-07-19

This register records the source and reuse terms for Discover hero photography.
The matching structured data lives in `src/content/destinations.ts`, where the
public guide renders attribution directly beneath the hero copy.

## Verified Images

| Guide | Local asset | Creator | Source | License | Modifications |
|---|---|---|---|---|---|
| Ruzafa | `/discover/ruzafa.webp` | Joanbanjo | [Carrer de Russafa, València](https://commons.wikimedia.org/wiki/File:Carrer_de_Russafa,_Val%C3%A8ncia.jpg) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Cropped and resized to 1920×1080 WebP |
| El Carmen | `/discover/el-carmen-hero.webp` | Joanbanjo | [Carrer de Baix (València)](https://commons.wikimedia.org/wiki/File:Carrer_de_Baix_(Val%C3%A8ncia).JPG) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Cropped and resized to 1920×1080 WebP |
| Cabanyal | `/discover/cabanyal-hero.webp` | Joanbanjo | [Carrer de la Reina, Cabanyal](https://commons.wikimedia.org/wiki/File:Carrer_de_la_Reina,_Cabanyal,_Pa%C3%ADs_Valenci%C3%A0.JPG) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Cropped and resized to 1920×1080 WebP |
| Benimaclet | `/discover/benimaclet-hero.webp` | Joanbanjo | [Plaça de Benimaclet](https://commons.wikimedia.org/wiki/File:Pla%C3%A7a_de_Benimaclet.JPG) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | Cropped and resized to 1920×1080 WebP |

## Pending Verification

The following existing assets remain published but have no documented source or
license. They are explicitly marked `unverified` and must be replaced before
the image-rights roadmap item can be closed:

- Malvarrosa Beach
- Las Fallas
- Albufera
- City of Arts and Sciences
- Turia Gardens
- El Ensanche
- Sagunto
- Requena
- Patacona
- Xàtiva

Run `npm run audit:discover-images` after any Discover image change. The audit
fails on missing files, absent provenance, invalid URLs, or incomplete licensed
records and reports the remaining unverified queue.
