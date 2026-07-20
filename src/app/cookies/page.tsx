import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | RentAnything.es",
  description: "Which browser storage and third-party cookies RentAnything.es uses, when Google Analytics loads, and how to change your consent choice.",
  alternates: {
    canonical: "https://rentanything.es/cookies",
    languages: {
      en: "https://rentanything.es/cookies",
      es: "https://rentanything.es/es/cookies",
      "x-default": "https://rentanything.es/cookies",
    },
  },
};

export default function CookiesPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Cookie Policy</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: 20 July 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Cookies and browser storage</h2>
            <p className="text-neutral-600">
              Cookies are small files that websites and service providers may store in your browser. RentAnything.es also uses local storage to remember your analytics choice. Local storage is not a cookie, but we explain it here because it serves a similar preference-storage function.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">2. Technologies used on the public site</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Technology</th>
                    <th className="text-left p-3 font-semibold">Category</th>
                    <th className="text-left p-3 font-semibold">Purpose</th>
                    <th className="text-left p-3 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 text-neutral-600">rentanything_analytics_consent</td>
                    <td className="p-3"><span className="badge badge-brand">Preference</span></td>
                    <td className="p-3 text-neutral-600">Stores your allow or reject choice in local storage</td>
                    <td className="p-3 text-neutral-600">Until cleared or changed</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-neutral-600">Google Analytics identifiers, including _ga</td>
                    <td className="p-3"><span className="badge badge-accent">Analytics</span></td>
                    <td className="p-3 text-neutral-600">Measures site and booking-step usage only after you allow analytics</td>
                    <td className="p-3 text-neutral-600">According to Google&apos;s configured lifetime, up to 2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-neutral-500 mt-3">Public browsing does not use the admin authentication cookies reserved for authorised staff.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Analytics consent</h2>
            <p className="text-neutral-600">
              Google Analytics is optional and does not load unless you select “Allow analytics.” The website, availability check and checkout remain usable when analytics is rejected. Use “Cookie settings” in the footer to change your choice at any time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Stripe and other third parties</h2>
            <p className="text-neutral-600">
              When you proceed to Stripe Checkout, Stripe may use cookies or similar technologies for secure payment processing and fraud prevention under its own policies. External services opened from our links may also apply their own storage choices.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Browser controls</h2>
            <p className="text-neutral-600">
              You can also delete cookies and local storage through your browser settings. Blocking all browser storage may affect preferences or third-party checkout features.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
