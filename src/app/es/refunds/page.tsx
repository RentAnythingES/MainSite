import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reembolsos y Cancelaciones",
  description:
    "Política de reembolsos y cancelaciones para alquileres en Valencia: reembolso completo con 48 horas o más de antelación.",
  alternates: {
    canonical: "https://rentanything.es/es/refunds",
    languages: {
      en: "https://rentanything.es/refunds",
      es: "https://rentanything.es/es/refunds",
      "x-default": "https://rentanything.es/refunds",
    },
  },
};

export default function SpanishRefundsPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Reembolsos y cancelaciones</h1>
        <p className="text-sm text-neutral-400 mb-10">Última actualización: julio de 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div className="bg-brand/5 rounded-xl p-6 border border-brand/10">
            <h2 className="text-lg font-bold text-brand mb-2">Nuestro compromiso</h2>
            <p className="text-neutral-600">
              Queremos que reserves con confianza. Por eso ofrecemos cancelación gratuita hasta 48 horas antes
              del momento previsto de entrega o recogida.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Política de cancelación</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-5 border border-green-100 text-center">
                <p className="text-2xl font-bold text-green-600 mb-1">100%</p>
                <p className="text-sm font-semibold text-green-700">Reembolso completo</p>
                <p className="text-xs text-green-600 mt-1">48 horas o más antes</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-center">
                <p className="text-2xl font-bold text-amber-600 mb-1">50%</p>
                <p className="text-sm font-semibold text-amber-700">Reembolso parcial</p>
                <p className="text-xs text-amber-600 mt-1">Entre 24 y 48 horas antes</p>
              </div>
              <div className="bg-red-50 rounded-xl p-5 border border-red-100 text-center">
                <p className="text-2xl font-bold text-red-600 mb-1">0%</p>
                <p className="text-sm font-semibold text-red-700">Sin reembolso</p>
                <p className="text-xs text-red-600 mt-1">Menos de 24 horas antes</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Fianzas y daños</h2>
            <p className="text-neutral-600">
              Nuestro proceso de pago online actual no añade una fianza automáticamente. Si en el futuro un
              alquiler requiere una, comunicaremos claramente el importe, el método de autorización, las
              condiciones de devolución y cualquier deducción propuesta antes del pago.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Cómo cancelar</h2>
            <p className="text-neutral-600 mb-3">Puedes solicitar la cancelación mediante:</p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>WhatsApp, normalmente la vía más rápida</li>
              <li>Correo electrónico a <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a></li>
              <li>El formulario de nuestra <Link href="/contact" className="text-brand hover:underline">página de contacto</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Plazo del reembolso</h2>
            <p className="text-neutral-600">
              Procesamos el reembolso al método de pago original. Dependiendo del banco o emisor de la tarjeta,
              puede tardar entre 5 y 10 días laborables en aparecer en el extracto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
