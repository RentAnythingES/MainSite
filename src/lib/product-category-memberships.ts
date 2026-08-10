export function isCategoryMembershipMigrationMissing(error: unknown) {
  const code = (error as { code?: string } | null)?.code;
  return code === "42P01" || code === "PGRST202" || code === "PGRST205";
}

export function normalizeSecondaryCategoryIds(value: unknown, primaryCategoryId: string) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((id) => typeof id !== "string" || !id.trim())) {
    throw new Error("Secondary categories must be an array of category IDs");
  }

  const ids = value.map((id) => id.trim());
  if (new Set(ids).size !== ids.length) {
    throw new Error("Secondary categories must be unique");
  }
  if (ids.includes(primaryCategoryId)) {
    throw new Error("The primary category cannot also be selected as a secondary category");
  }
  return ids;
}
