
import { type Locale } from "@/i18n/config";
import { getCookiesPageBodyCopy } from "@/i18n/pages/cookies";

export default function CookiesPageBody({ locale }: { locale: Locale }) {
  const t = getCookiesPageBodyCopy(locale);


  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{t(0)}</h1>
        <p className="text-sm text-neutral-400 mb-10">{t(1)}</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">{t(2)}</h2>
            <p className="text-neutral-600">
              {" "}{t(3)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">{t(4)}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left p-3 font-semibold">{t(5)}</th>
                    <th className="text-left p-3 font-semibold">{t(6)}</th>
                    <th className="text-left p-3 font-semibold">{t(7)}</th>
                    <th className="text-left p-3 font-semibold">{t(8)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 text-neutral-600">{t(9)}</td>
                    <td className="p-3"><span className="badge badge-brand">{t(10)}</span></td>
                    <td className="p-3 text-neutral-600">{t(11)}</td>
                    <td className="p-3 text-neutral-600">{t(12)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-neutral-600">{t(13)}</td>
                    <td className="p-3"><span className="badge badge-accent">{t(14)}</span></td>
                    <td className="p-3 text-neutral-600">{t(15)}</td>
                    <td className="p-3 text-neutral-600">{t(16)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-neutral-500 mt-3">{t(17)}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(18)}</h2>
            <p className="text-neutral-600">
              {" "}{t(19)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(20)}</h2>
            <p className="text-neutral-600">
              {" "}{t(21)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(22)}</h2>
            <p className="text-neutral-600">
              {" "}{t(23)}{" "}</p>
          </div>
        </div>
      </div>
    </section>
  );

}
