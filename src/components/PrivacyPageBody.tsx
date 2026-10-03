import Link from "next/link";
import { localeRegistry, type Locale } from "@/i18n/config";
import { getPrivacyPageBodyCopy } from "@/i18n/pages/privacy";

export default function PrivacyPageBody({ locale }: { locale: Locale }) {
  const t = getPrivacyPageBodyCopy(locale);
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
            <p className="text-neutral-600 mt-2">
              {" "}{t(6)}{" "}<a href="mailto:hello@rentandroll.com" className="text-brand hover:underline">{t(7)}</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(8)}</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>{t(9)}</li>
              <li>{t(10)}</li>
              <li>{t(11)}</li>
              <li>{t(12)}</li>
              <li>{t(13)}</li>
              <li>{t(14)}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(15)}</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>{t(16)}</strong> {" "}{t(17)}</li>
              <li><strong>{t(18)}</strong> {" "}{t(19)}</li>
              <li><strong>{t(20)}</strong> {" "}{t(21)}</li>
              <li><strong>{t(22)}</strong> {" "}{t(23)}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(24)}</h2>
            <p className="text-neutral-600">
              {" "}{t(25)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(26)}</h2>
            <p className="text-neutral-600">
              {" "}{t(27)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(28)}</h2>
            <p className="text-neutral-600">{t(29)}</p>
            <p className="text-neutral-600 mt-2">
              {" "}{t(30)}{" "}<a href="mailto:hello@rentandroll.com" className="text-brand hover:underline">{t(31)}</a>{t(32)}{" "}<a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{t(33)}</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(34)}</h2>
            <p className="text-neutral-600">
              {" "}{t(35)}{" "}<Link href={`${prefix}/cookies`} className="text-brand hover:underline">{t(36)}</Link> {" "}{t(37)}{" "}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">{t(38)}</h2>
            <p className="text-neutral-600">
              {" "}{t(39)}{" "}</p>
          </div>
        </div>
      </div>
    </section>
  );

}
