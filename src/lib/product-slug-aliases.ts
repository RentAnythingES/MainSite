const productSlugReplacements: Readonly<Record<string, string>> = {
  "27-inch-monitor-hdmi-cable": "32-inch-monitor-hdmi-cable",
};

export function canonicalProductSlug(slug: string): string {
  return productSlugReplacements[slug] || slug;
}

export function productSlugLookupCandidates(slug: string): string[] {
  const canonicalSlug = canonicalProductSlug(slug);
  const legacySlugs = Object.entries(productSlugReplacements)
    .filter(([, replacement]) => replacement === canonicalSlug)
    .map(([legacySlug]) => legacySlug);

  return [...new Set([canonicalSlug, ...legacySlugs])];
}
