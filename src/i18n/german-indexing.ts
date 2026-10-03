/** Only the explicitly identified production deployment may advertise German URLs. */
export function germanIndexingAllowed() { return process.env.VERCEL_ENV === 'production'; }
