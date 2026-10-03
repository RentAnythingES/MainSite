import Link from "next/link";
import { localeRegistry, type Locale } from "@/i18n/config";
import { getTermsPageBodyCopy } from "@/i18n/pages/terms";

export default function TermsPageBody({ locale }: { locale: Locale }) {
  const t = getTermsPageBodyCopy(locale);
  const prefix = localeRegistry[locale].prefix;


  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{t(0)}</h1>
        <p className="text-sm text-neutral-400 mb-10">{t(1)}</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">{t(2)}</h2>
            <p className="text-neutral-600">
              {" "}{t(3)}{" "}<strong>{t(4)}</strong> {" "}{t(5)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(6)}</h2>
            <p className="text-neutral-600">
              {" "}{t(7)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(8)}</h2>
            <p className="text-neutral-600">
              {" "}{t(9)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(10)}</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>{t(11)}</strong> {" "}{t(12)}</li>
              <li><strong>{t(13)}</strong> {" "}{t(14)}</li>
              <li><strong>{t(15)}</strong> {" "}{t(16)}</li>
            </ul>
            <p className="text-neutral-600 mt-2">{t(17)}{" "}<Link href={`${prefix}/refunds`} className="text-brand hover:underline">{t(18)}</Link>.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(19)}</h2>
            <p className="text-neutral-600">
              {" "}{t(20)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(21)}</h2>
            <p className="text-neutral-600">
              {" "}{t(22)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(23)}</h2>
            <p className="text-neutral-600">
              {" "}{t(24)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(25)}</h2>
            <p className="text-neutral-600">
              {" "}{t(26)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(27)}</h2>
            <p className="text-neutral-600">
              {" "}{t(28)}{" "}<a href="mailto:hello@rentandroll.com" className="text-brand hover:underline">{t(29)}</a>{t(30)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(31)}</h2>
            <p className="text-neutral-600">
              {" "}{t(32)}{" "}</p>
          </div>

          <div className="bg-neutral-50 rounded-xl p-6 border border-border">
            <p className="text-sm text-neutral-500">
              {" "}{t(33)}{" "}<Link href={`${prefix}/contact`} className="text-brand hover:underline">{t(34)}</Link> {" "}{t(35)}{" "}<a href="mailto:hello@rentandroll.com" className="text-brand hover:underline">{t(36)}</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

}
