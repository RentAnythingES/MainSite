-- Complete Spanish editorial and SEO coverage for the active PUKY WUTSCH listing.

DO $$
DECLARE
  target_product_id uuid;
BEGIN
  SELECT id
  INTO target_product_id
  FROM public.products
  WHERE slug = 'toddler-bike-lila';

  IF target_product_id IS NULL THEN
    RAISE EXCEPTION 'Product toddler-bike-lila was not found';
  END IF;

  INSERT INTO public.product_localizations (
    product_id,
    locale,
    short_description,
    detail_description,
    includes_text,
    constraints_text,
    delivery_setup_note,
    care_note,
    seo_title,
    seo_description,
    updated_at
  )
  VALUES (
    target_product_id,
    'es',
    'Correpasillos infantil PUKY WUTSCH para niños que ya caminan con seguridad. Adecuado para una altura de 80–95 cm y una longitud de entrepierna de 26–36 cm, con una carga máxima de 20 kg.',
    'El PUKY WUTSCH es un correpasillos infantil sin pedales pensado para los primeros desplazamientos de niños que ya caminan con seguridad. Su eje delantero oscilante ayuda al pequeño a practicar el equilibrio y la coordinación mientras se mueve sobre una superficie lisa y nivelada. El asiento ergonómico, los puños de seguridad y el límite de giro aportan estabilidad durante el uso. Sus ruedas silenciosas permiten utilizarlo dentro de un apartamento o alojamiento sin generar demasiado ruido. Es adecuado desde aproximadamente 18 meses y hasta los 3 años, para una altura de 80–95 cm y una longitud de entrepierna de 26–36 cm. La carga máxima es de 20 kg. Se entrega limpio y desinfectado para que tu hijo pueda disfrutarlo durante vuestra estancia en Valencia.',
    'Correpasillos infantil PUKY WUTSCH.',
    'Uso bajo supervisión adulta y únicamente en interiores, sobre superficies lisas y niveladas. No debe utilizarse en la vía pública. Edad orientativa: de 18 meses a 3 años. Altura: 80–95 cm. Entrepierna: 26–36 cm. Carga máxima: 20 kg.',
    'Se entrega limpio y desinfectado mediante la opción de entrega o recogida seleccionada en la reserva.',
    'Uso en interiores. Revisamos y limpiamos el correpasillos entre alquileres.',
    'Alquiler de Bicicleta Infantil en Valencia | PUKY',
    'Alquila una bicicleta infantil PUKY WUTSCH en Valencia para niños de 80–95 cm. Entrega o recogida, limpia y revisada para tu estancia.',
    now()
  )
  ON CONFLICT (product_id, locale) DO UPDATE
  SET
    short_description = EXCLUDED.short_description,
    detail_description = EXCLUDED.detail_description,
    includes_text = EXCLUDED.includes_text,
    constraints_text = EXCLUDED.constraints_text,
    delivery_setup_note = EXCLUDED.delivery_setup_note,
    care_note = EXCLUDED.care_note,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    updated_at = now();

  DELETE FROM public.product_faqs
  WHERE product_id = target_product_id
    AND locale = 'es';

  INSERT INTO public.product_faqs (
    product_id,
    locale,
    question,
    answer,
    sort_order
  )
  VALUES
    (
      target_product_id,
      'es',
      '¿Para qué edad y talla es adecuado el PUKY WUTSCH?',
      'Está pensado para niños que ya caminan con seguridad, aproximadamente desde los 18 meses y hasta los 3 años. La talla recomendada es de 80–95 cm de altura y 26–36 cm de entrepierna, con una carga máxima de 20 kg.',
      0
    ),
    (
      target_product_id,
      'es',
      '¿Dónde puede utilizarse el correpasillos?',
      'Este modelo debe utilizarse bajo supervisión adulta en interiores y sobre superficies lisas y niveladas. No está indicado para circular por la vía pública.',
      1
    ),
    (
      target_product_id,
      'es',
      '¿Cómo se entrega el correpasillos?',
      'Lo revisamos, limpiamos y desinfectamos entre alquileres. Puedes seleccionar las opciones de entrega o recogida disponibles para tus fechas durante la reserva.',
      2
    );

  UPDATE public.products
  SET updated_at = now()
  WHERE id = target_product_id;
END
$$;
