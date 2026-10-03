import Link from "next/link";
import { localeRegistry, type Locale } from "@/i18n/config";
import { getRefundsPageBodyCopy } from "@/i18n/pages/refunds";

export default function RefundsPageBody({ locale }: { locale: Locale }) {
  const t = getRefundsPageBodyCopy(locale);
  const prefix = localeRegistry[locale].prefix;


  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{t(0)}</h1>
        <p className="text-sm text-neutral-400 mb-10">{t(1)}</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div className="bg-brand/5 rounded-xl p-6 border border-brand/10">
            <h2 className="text-lg font-bold text-brand mb-2">{t(2)}</h2>
            <p className="text-neutral-600">
              {" "}{t(3)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">{t(4)}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-5 border border-green-100 text-center">
                <p className="text-2xl font-bold text-green-600 mb-1">100%</p>
                <p className="text-sm font-semibold text-green-700">{t(5)}</p>
                <p className="text-xs text-green-600 mt-1">{t(6)}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-center">
                <p className="text-2xl font-bold text-amber-600 mb-1">50%</p>
                <p className="text-sm font-semibold text-amber-700">{t(7)}</p>
                <p className="text-xs text-amber-600 mt-1">{t(8)}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-5 border border-red-100 text-center">
                <p className="text-2xl font-bold text-red-600 mb-1">0%</p>
                <p className="text-sm font-semibold text-red-700">{t(9)}</p>
                <p className="text-xs text-red-600 mt-1">{t(10)}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(11)}</h2>
            <p className="text-neutral-600">
              {" "}{t(12)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(13)}</h2>
            <p className="text-neutral-600 mb-3">{t(14)}</p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>{t(15)}</li>
              <li>{t(16)}{" "}<a href="mailto:hello@rentandroll.com" className="text-brand hover:underline">{t(17)}</a></li>
              <li>{t(18)}{" "}<Link href={`${prefix}/contact`} className="text-brand hover:underline">{t(19)}</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(20)}</h2>
            <p className="text-neutral-600">
              {" "}{t(21)}{" "}</p>
          </div>
        </div>
      </div>
    </section>
  );

}
