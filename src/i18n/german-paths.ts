import { getDestinationsByHub, getPublishedDestinations } from "@/content/destinations";
import { getPublishedGermanDestinations } from "@/content/destinations-de";
import { getPublishedGermanPosts } from "@/content/blog-de";
/** Complete commercial route inventory; publication requires owner and database gates. */
export const germanCommercialPaths = [
  "/",
  "/valencia",
  "/valencia/host-services",
  "/partners",
  "/agent-network",
  "/contact",
  "/about",
  "/faq",
  "/privacy",
  "/cookies",
  "/terms",
  "/refunds",
  "/how-it-works",
  "/rental/baby-gear",
  "/rental/kids-family",
  "/rental/mobility",
  "/rental/remote-work",
  "/rental/home-living",
  "/rental/travel-outdoors",
  "/rental/fitness-wellness",
  "/rental/events-celebrations",
  "/rental/mobility/mobility-scooters",
  "/rental/baby-gear/strollers",
  "/rental/baby-gear/car-seats",
  "/rental/baby-gear/travel-cots-cribs",
  "/rental/mobility/wheelchairs",
  "/valencia/kits",
  "/valencia/kits/turia-beach-explorer",
  "/valencia/kits/family-beach-kit",
  "/valencia/kits/baby-arrival-kit",
  "/valencia/kits/toddler-city-kit",
  "/valencia/kits/remote-work-apartment-kit",
  "/valencia/kits/summer-apartment-survival-kit",
  "/valencia/kits/accessible-valencia-kit",
  "/valencia/kits/grandparents-visiting-kit",
  "/valencia/kits/long-stay-kitchen-upgrade-kit"
] as const;
/** A hub is available only when every original guide has its full translation. */
export function germanEditorialPaths() {
  const guides = getPublishedGermanDestinations();
  const completeHubs = (["neighbourhoods", "attractions", "events", "beaches", "day-trips"] as const).filter(hub => {
    const originals = getDestinationsByHub(hub);
    return originals.length > 0 && originals.every(original => guides.some(guide => guide.slug === original.slug));
  });
  const originals = getPublishedDestinations();
  const indexComplete = originals.length > 0 && originals.every(original => guides.some(guide => guide.slug === original.slug));
  return ["/blog", ...(indexComplete ? ["/discover"] : []), ...completeHubs.map(hub=>"/discover/"+hub), ...getPublishedGermanPosts().map(post=>"/blog/"+post.slug), ...guides.map(dest=>"/discover/"+dest.slug)];
}
export function germanRouteCandidate(path: string) { return (germanCommercialPaths as readonly string[]).includes(path) || germanEditorialPaths().includes(path) || /^\/product\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path); }
