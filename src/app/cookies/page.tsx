import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How RentAnything.es uses cookies. Essential and analytics cookies explained.",
};

export default function CookiesPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Cookie Policy</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">What Are Cookies?</h2>
            <p className="text-neutral-600">
              Cookies are small text files stored on your device when you visit a website.
              They help us provide a better experience by remembering your preferences
              and understanding how you use our site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Cookie</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Purpose</th>
                    <th className="text-left p-3 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 text-neutral-600">Session</td>
                    <td className="p-3"><span className="badge badge-brand">Essential</span></td>
                    <td className="p-3 text-neutral-600">Maintains your session while browsing</td>
                    <td className="p-3 text-neutral-600">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-neutral-600">Language</td>
                    <td className="p-3"><span className="badge badge-brand">Essential</span></td>
                    <td className="p-3 text-neutral-600">Remembers your language preference (EN/ES)</td>
                    <td className="p-3 text-neutral-600">1 year</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-neutral-600">Analytics</td>
                    <td className="p-3"><span className="badge badge-accent">Analytics</span></td>
                    <td className="p-3 text-neutral-600">Anonymous usage statistics to improve our site</td>
                    <td className="p-3 text-neutral-600">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Managing Cookies</h2>
            <p className="text-neutral-600">
              You can control cookies through your browser settings. Disabling essential cookies
              may affect site functionality. Analytics cookies can be disabled without impact on
              your browsing experience.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Third-Party Cookies</h2>
            <p className="text-neutral-600">
              Our payment processor (Stripe) may set cookies for fraud prevention and security.
              These are governed by Stripe&apos;s own privacy policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
