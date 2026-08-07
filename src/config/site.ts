const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://rentandroll.com";

export const SITE_URL = configuredSiteUrl.replace(/\/$/, "");
export const LEGACY_SITE_URL = "https://rentanything.es";
export const EXPECTED_PRODUCTION_SITE_URL = "https://rentandroll.com";

if (
  process.env.VERCEL_ENV === "production" &&
  SITE_URL !== EXPECTED_PRODUCTION_SITE_URL
) {
  throw new Error(
    `Production NEXT_PUBLIC_SITE_URL must be ${EXPECTED_PRODUCTION_SITE_URL}; received ${SITE_URL}.`,
  );
}

export const SITE_IDENTITY = {
  brandName: "Rent&Roll",
  descriptiveName: "Rent and Roll",
  formerName: "RentAnything.es",
  domain: "rentandroll.com",
  tagline: "Travel light. Rent what you need.",
  taglineEs: "Viaja ligero. Alquila lo que necesitas.",
  legalName: "Escalera Labs S.L.",
  taxId: "ESB22961221",
  telephone: "+34684708013",
  contactEmail: process.env.CONTACT_EMAIL || "hello@rentandroll.com",
  privacyEmail: process.env.PRIVACY_EMAIL || "privacy@rentandroll.com",
  headerLogoPath: "/brand/rentnroll-header.png",
  logoPath: "/brand/rentnroll-logo.svg",
  wordmarkPath: "/brand/rentnroll-wordmark.svg",
  lightWordmarkPath: "/brand/rentnroll-wordmark-light.svg",
  iconPath: "/brand/rentnroll-icon.svg",
  appIconPath: "/brand/rentnroll-app-icon.png",
  socialImagePath: "/brand/rentnroll-og.png",
} as const;

export const BUSINESS_SCHEMA_ID = `${SITE_URL}/#business`;
export const WEBSITE_SCHEMA_ID = `${SITE_URL}/#website`;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
