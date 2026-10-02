/** Keep the customer-visible name captured when the booking was made. */
export function bookingProductName(snapshot: unknown, fallback: string): string {
  if (snapshot && typeof snapshot === "object" && "displayName" in snapshot
    && typeof snapshot.displayName === "string" && snapshot.displayName.trim()) return snapshot.displayName;
  return fallback;
}
