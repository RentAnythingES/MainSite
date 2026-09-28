/** Private pilot is restricted to a local database, test payments and no email key. */
export function privateGermanPreviewEnabled(): boolean {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.LOCALIZATION_PREVIEW !== "true" ||
    process.env.RESEND_API_KEY ||
    !process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")
  )
    return false;
  try {
    return ["127.0.0.1", "localhost", "[::1]"].includes(
      new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname,
    );
  } catch {
    return false;
  }
}
