import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | RentAnything.es",
  description: "Cómo Escalera Labs S.L. recoge, utiliza, conserva y protege los datos personales de consultas, reservas y analítica de RentAnything.es.",
  alternates: {
    canonical: "https://rentanything.es/es/privacy",
    languages: {
      en: "https://rentanything.es/privacy",
      es: "https://rentanything.es/es/privacy",
      "x-default": "https://rentanything.es/privacy",
    },
  },
};

export default function SpanishPrivacyPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Política de Privacidad</h1>
        <p className="text-sm text-neutral-400 mb-10">Última actualización: 20 de julio de 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Responsable del tratamiento</h2>
            <p className="text-neutral-600">
              RentAnything.es está gestionado por <strong>Escalera Labs S.L.</strong> (CIF ESB22961221), Calle Obispo Muñoz 73, 46100 Burjassot, Valencia, España. Escalera Labs S.L. es responsable de los datos personales recogidos mediante este servicio.
            </p>
            <p className="text-neutral-600 mt-2">Consultas sobre privacidad: <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a></p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. Datos que recogemos</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>Datos de contacto como nombre, correo electrónico y teléfono.</li>
              <li>Datos de la reserva, fechas, productos e instrucciones de entrega o recogida.</li>
              <li>Direcciones de entrega y recogida cuando sean necesarias para el servicio elegido.</li>
              <li>Referencias y estado de la transacción facilitados por Stripe; no almacenamos los datos completos de la tarjeta.</li>
              <li>Mensajes, solicitudes de soporte y consentimientos de marketing o publicación de reseñas.</li>
              <li>Datos de uso de la web cuando autorizas Google Analytics.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Finalidades y bases jurídicas</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>Contrato y medidas precontractuales:</strong> comprobar disponibilidad, cobrar, prestar el alquiler, gestionar cambios, reembolsos y documentos.</li>
              <li><strong>Obligaciones legales:</strong> contabilidad, facturación, obligaciones fiscales y atención de solicitudes legítimas.</li>
              <li><strong>Interés legítimo:</strong> prevenir abusos, proteger el servicio, resolver incidencias y mejorar el soporte operativo.</li>
              <li><strong>Consentimiento:</strong> analítica opcional, correos comerciales y publicación de comentarios. Puedes retirar el consentimiento en cualquier momento.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Proveedores y destinatarios</h2>
            <p className="text-neutral-600">
              No vendemos datos personales. Utilizamos proveedores cuando son necesarios para operar RentAnything.es: Stripe para pagos, Supabase para datos y almacenamiento, Vercel para alojamiento, Resend para correo transaccional y Google Analytics únicamente después de recibir consentimiento. Los datos de entrega podrán compartirse con un proveedor autorizado cuando sea necesario para completar la reserva.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Conservación</h2>
            <p className="text-neutral-600">
              Conservamos reservas, pagos y facturas durante los plazos exigidos por la normativa fiscal, contable y mercantil. Las consultas y registros operativos se guardan solo mientras sean razonablemente necesarios para prestar soporte, acreditar lo ocurrido, proteger reclamaciones y cumplir obligaciones. Conservamos los registros de consentimiento mientras sean necesarios para demostrar tu elección.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Tus derechos</h2>
            <p className="text-neutral-600">Cuando corresponda, puedes solicitar acceso, rectificación, supresión, limitación, oposición y portabilidad, así como retirar tu consentimiento sin afectar al tratamiento legítimo realizado anteriormente.</p>
            <p className="text-neutral-600 mt-2">
              Envía tu solicitud a <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a>. También puedes presentar una reclamación ante la <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Agencia Española de Protección de Datos (AEPD)</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Cookies y analítica</h2>
            <p className="text-neutral-600">
              Google Analytics no se carga hasta que autorizas la analítica opcional. Tu elección se guarda en el navegador. Consulta nuestra <Link href="/es/cookies" className="text-brand hover:underline">Política de Cookies</Link> para conocer las tecnologías y controles actuales.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">8. Cambios en esta política</h2>
            <p className="text-neutral-600">Podremos actualizar esta política cuando cambien el servicio, los proveedores o los requisitos legales. La versión y fecha más recientes estarán siempre disponibles en esta página.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
