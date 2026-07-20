import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | RentAnything.es",
  description: "Qué almacenamiento y cookies de terceros utiliza RentAnything.es, cuándo se carga Google Analytics y cómo cambiar tu consentimiento.",
  alternates: {
    canonical: "https://rentanything.es/es/cookies",
    languages: {
      en: "https://rentanything.es/cookies",
      es: "https://rentanything.es/es/cookies",
      "x-default": "https://rentanything.es/cookies",
    },
  },
};

export default function SpanishCookiesPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Política de Cookies</h1>
        <p className="text-sm text-neutral-400 mb-10">Última actualización: 20 de julio de 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Cookies y almacenamiento del navegador</h2>
            <p className="text-neutral-600">Las cookies son pequeños archivos que una web o sus proveedores pueden guardar en el navegador. RentAnything.es también utiliza almacenamiento local para recordar tu decisión sobre analítica. No es una cookie, pero lo explicamos aquí porque cumple una función similar de preferencia.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">2. Tecnologías utilizadas en la web pública</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Tecnología</th>
                    <th className="text-left p-3 font-semibold">Categoría</th>
                    <th className="text-left p-3 font-semibold">Finalidad</th>
                    <th className="text-left p-3 font-semibold">Duración</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 text-neutral-600">rentanything_analytics_consent</td>
                    <td className="p-3"><span className="badge badge-brand">Preferencia</span></td>
                    <td className="p-3 text-neutral-600">Guarda en almacenamiento local si permites o rechazas la analítica</td>
                    <td className="p-3 text-neutral-600">Hasta que la cambies o borres</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-neutral-600">Identificadores de Google Analytics, incluido _ga</td>
                    <td className="p-3"><span className="badge badge-accent">Analítica</span></td>
                    <td className="p-3 text-neutral-600">Mide el uso de la web y los pasos de reserva solo después de tu autorización</td>
                    <td className="p-3 text-neutral-600">Según la configuración de Google, hasta 2 años</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-neutral-500 mt-3">La navegación pública no utiliza las cookies de autenticación del panel reservadas al personal autorizado.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Consentimiento de analítica</h2>
            <p className="text-neutral-600">Google Analytics es opcional y no se carga salvo que selecciones «Permitir analítica». La web, la comprobación de disponibilidad y el checkout funcionan si la rechazas. Utiliza «Configurar cookies» en el pie de página para cambiar tu decisión.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Stripe y otros terceros</h2>
            <p className="text-neutral-600">Al continuar a Stripe Checkout, Stripe puede utilizar cookies o tecnologías similares para procesar el pago de forma segura y prevenir el fraude conforme a sus propias políticas. Los servicios externos abiertos desde nuestros enlaces también pueden aplicar sus propias opciones.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Controles del navegador</h2>
            <p className="text-neutral-600">También puedes borrar cookies y almacenamiento local desde la configuración del navegador. Bloquear todo el almacenamiento puede afectar a las preferencias o a funciones del checkout de terceros.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
