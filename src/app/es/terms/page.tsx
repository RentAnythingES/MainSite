import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Condiciones de Alquiler | RentAnything.es",
  description: "Condiciones para reservas de equipamiento en Valencia: pago, entrega o recogida, cancelación, ampliaciones, cuidado y responsabilidades.",
  alternates: {
    canonical: "https://rentanything.es/es/terms",
    languages: {
      en: "https://rentanything.es/terms",
      es: "https://rentanything.es/es/terms",
      "x-default": "https://rentanything.es/terms",
    },
  },
};

export default function SpanishTermsPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Condiciones de Alquiler</h1>
        <p className="text-sm text-neutral-400 mb-10">Última actualización: 20 de julio de 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Operador y ámbito</h2>
            <p className="text-neutral-600">RentAnything.es está gestionado por <strong>Escalera Labs S.L.</strong> (CIF ESB22961221), Calle Obispo Muñoz 73, 46100 Burjassot, Valencia, España. Estas condiciones se aplican al alquiler de equipamiento y a los servicios relacionados contratados mediante RentAnything.es.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. Disponibilidad y confirmación</h2>
            <p className="text-neutral-600">Comprobamos la disponibilidad del producto y del periodo seleccionado antes del pago. La reserva queda confirmada cuando el pago se completa y emitimos la confirmación. Si una incidencia operativa impide prestar el servicio, contactaremos contigo y ofreceremos una alternativa adecuada o el reembolso del importe afectado.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Precios, IVA y pago</h2>
            <p className="text-neutral-600">Los precios mostrados a consumidores incluyen el IVA aplicable salvo que se indique expresamente lo contrario. Antes del pago, el checkout muestra el precio del alquiler, los servicios de entrega o recogida seleccionados y el total. Stripe procesa el pago de forma segura. Nuestro checkout actual no añade automáticamente una fianza. Si una futura reserva la requiere, el importe y las condiciones deberán mostrarse antes del pago.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Cancelaciones y reembolsos</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>48 horas o más antes del servicio:</strong> reembolso completo.</li>
              <li><strong>Entre 24 y 48 horas:</strong> reembolso del 50 %.</li>
              <li><strong>Menos de 24 horas:</strong> sin reembolso, salvo cuando una norma imperativa disponga otra cosa.</li>
            </ul>
            <p className="text-neutral-600 mt-2">La política operativa completa, incluidas las devoluciones anticipadas y el procedimiento de cancelación, está en nuestra <Link href="/es/refunds" className="text-brand hover:underline">Política de Reembolsos y Cancelaciones</Link>.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Recogida, entrega y devolución</h2>
            <p className="text-neutral-600">El formulario muestra los puntos de recogida, zonas de servicio, horarios y tarifas disponibles en ese momento. Debes facilitar datos de contacto y dirección correctos y estar disponible en las horas acordadas. Una entrega personalizada no queda confirmada hasta que la aprobemos y se abone cualquier importe adicional.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Periodo, cambios y retrasos</h2>
            <p className="text-neutral-600">Conserva el equipo únicamente durante el periodo confirmado. Las ampliaciones y cambios de entrega dependen de la disponibilidad operativa y del inventario y pueden requerir un pago adicional. Contacta con nosotros antes de la hora de devolución. Un retraso no autorizado podrá generar el cobro del periodo adicional y de cualquier perjuicio documentado sobre una reserva posterior.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Cuidado, pérdida y daños</h2>
            <p className="text-neutral-600">Utiliza el equipo para su finalidad prevista, sigue las instrucciones del fabricante facilitadas o enlazadas y mantenlo razonablemente protegido. El desgaste normal es esperable. Podrás responder por costes documentados de reparación o sustitución causados por pérdida, robo, uso indebido o daños superiores al desgaste normal. Explicaremos las pruebas y el importe antes de solicitar el pago.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">8. Seguridad y responsabilidad</h2>
            <p className="text-neutral-600">Comprueba que el producto es adecuado para la persona y uso previstos, incluidos los límites de talla, peso, edad o instalación. Deja de utilizarlo y contacta con nosotros si detectas daños o un riesgo. Estas condiciones no excluyen ni limitan responsabilidades cuando la ley lo prohíba.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">9. Derechos y reclamaciones</h2>
            <p className="text-neutral-600">Estas condiciones no afectan a los derechos imperativos de las personas consumidoras conforme a la normativa española o europea. Para presentar una reclamación, escribe a <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a>. Las hojas oficiales de reclamaciones están disponibles mediante las autoridades de consumo competentes.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">10. Legislación aplicable</h2>
            <p className="text-neutral-600">Estas condiciones se rigen por la legislación española, sin perjuicio de las normas imperativas sobre jurisdicción de consumidores.</p>
          </div>

          <div className="bg-neutral-50 rounded-xl p-6 border border-border">
            <p className="text-sm text-neutral-500">¿Tienes alguna pregunta? <Link href="/es/contact" className="text-brand hover:underline">Contacta con nosotros</Link> o escribe a <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
