-- Complete Spanish FAQ coverage for five active, content-ready products.

DO $$
DECLARE
  matched_products integer;
BEGIN
  SELECT count(*)
  INTO matched_products
  FROM public.products
  WHERE slug = ANY (ARRAY[
    'acupressure-mat',
    'decathlon-grvl-af-shimano-grx-gravel-bike',
    'inflatable-family-kayak-2-3-people',
    'inflatable-kayak-1-2-people',
    'inflatable-paddle-board-sup'
  ]);

  IF matched_products <> 5 THEN
    RAISE EXCEPTION 'Expected five FAQ target products, found %', matched_products;
  END IF;

  DELETE FROM public.product_faqs
  WHERE locale = 'es'
    AND product_id IN (
      SELECT id
      FROM public.products
      WHERE slug = ANY (ARRAY[
        'acupressure-mat',
        'decathlon-grvl-af-shimano-grx-gravel-bike',
        'inflatable-family-kayak-2-3-people',
        'inflatable-kayak-1-2-people',
        'inflatable-paddle-board-sup'
      ])
    );

  INSERT INTO public.product_faqs (
    product_id,
    locale,
    question,
    answer,
    sort_order
  )
  SELECT
    product.id,
    'es',
    faq.question,
    faq.answer,
    faq.sort_order
  FROM (
    VALUES
      (
        'acupressure-mat',
        '¿Qué incluye el alquiler?',
        'Una esterilla de acupresión y una almohada cervical a juego.',
        0
      ),
      (
        'acupressure-mat',
        '¿Cómo debería empezar a utilizarla?',
        'Empieza con sesiones breves y detente si notas dolor o molestias importantes.',
        1
      ),
      (
        'acupressure-mat',
        '¿Es adecuada para todo el mundo?',
        'El proveedor la indica para adultos y recomienda que las personas embarazadas o con alguna condición médica consulten primero con un profesional sanitario.',
        2
      ),
      (
        'decathlon-grvl-af-shimano-grx-gravel-bike',
        '¿Qué tallas están disponibles?',
        'El modelo de referencia se ofrece de la XS a la 2XL. Confirmamos la talla de la unidad física de alquiler y su ajuste para el ciclista antes de la reserva.',
        0
      ),
      (
        'decathlon-grvl-af-shimano-grx-gravel-bike',
        '¿Cuál es la carga máxima?',
        'Decathlon indica una carga máxima combinada de 110 kg entre ciclista y equipaje.',
        1
      ),
      (
        'decathlon-grvl-af-shimano-grx-gravel-bike',
        '¿Puedo usarla en rutas de bicicleta de montaña?',
        'Es una bicicleta gravel para carreteras mixtas y pistas adecuadas; no es una bicicleta para descenso ni saltos. La dificultad de la ruta debe ajustarse al ciclista y a la bicicleta.',
        2
      ),
      (
        'inflatable-family-kayak-2-3-people',
        '¿Qué incluye el kayak familiar?',
        'El conjunto de referencia incluye el kayak hinchable, dos remos y una bolsa de transporte.',
        0
      ),
      (
        'inflatable-family-kayak-2-3-people',
        '¿Cuál es la carga máxima?',
        'La carga máxima combinada indicada es de 245 kg, incluidos todos los pasajeros y el equipamiento.',
        1
      ),
      (
        'inflatable-family-kayak-2-3-people',
        '¿Pueden utilizar este kayak los niños?',
        'Solo bajo la supervisión directa de un adulto competente, con ayudas a la flotación correctamente ajustadas y cuando el tiempo, el agua y el punto de entrada sean adecuados.',
        2
      ),
      (
        'inflatable-kayak-1-2-people',
        '¿Qué incluye el kayak para dos personas?',
        'El conjunto de referencia incluye el kayak hinchable, dos remos, dos ayudas a la flotación, una bomba manual y una bolsa de transporte.',
        0
      ),
      (
        'inflatable-kayak-1-2-people',
        '¿Cuál es la carga máxima?',
        'La carga máxima combinada indicada es de 195 kg, incluidos los ocupantes y el equipamiento transportado.',
        1
      ),
      (
        'inflatable-kayak-1-2-people',
        '¿Puedo utilizarlo en cualquier lugar cerca de Valencia?',
        'No. El punto de entrada, el tiempo, las condiciones del agua y las restricciones locales deben ser adecuados. Confirmamos el uso previsto antes de la entrega.',
        2
      ),
      (
        'inflatable-paddle-board-sup',
        '¿Qué incluye la tabla de paddle surf?',
        'El conjunto de referencia incluye la tabla de SUP hinchable, un remo y una bomba manual. Otros accesorios solo están incluidos cuando aparecen en tu confirmación.',
        0
      ),
      (
        'inflatable-paddle-board-sup',
        '¿Pueden utilizar la tabla dos personas?',
        'La ficha de origen contempla el uso por una o dos personas, pero la etiqueta de carga verificada de la tabla física y el peso combinado determinan si está permitido.',
        1
      ),
      (
        'inflatable-paddle-board-sup',
        '¿Puedo utilizarla en cualquier playa de Valencia?',
        'No. El viento, el estado del mar, las restricciones locales, las normas del punto de entrada y la experiencia del usuario deben ser adecuados antes de utilizarla.',
        2
      )
  ) AS faq(slug, question, answer, sort_order)
  JOIN public.products AS product
    ON product.slug = faq.slug;

  UPDATE public.products
  SET updated_at = now()
  WHERE slug = ANY (ARRAY[
    'acupressure-mat',
    'decathlon-grvl-af-shimano-grx-gravel-bike',
    'inflatable-family-kayak-2-3-people',
    'inflatable-kayak-1-2-people',
    'inflatable-paddle-board-sup'
  ]);
END
$$;
