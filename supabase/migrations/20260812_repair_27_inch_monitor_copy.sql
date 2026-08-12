-- Align the remaining 27-inch monitor copy with its stored size and connections.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.products
     set description = 'A 27-inch 4K IPS monitor with HDMI, DisplayPort, built-in speakers and an adjustable stand for a temporary workspace in Valencia.',
         updated_at = now()
   where slug = 'monitor-27';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one 27-inch monitor, updated %', affected_rows; end if;

  with copy(locale, short_description, detail_description, includes_text, constraints_text, delivery_setup_note, care_note, seo_title, seo_description) as (
    values
    ('en',
      '27-inch 4K IPS monitor with HDMI and DisplayPort.',
      'Add a larger 27-inch screen to your temporary workspace in Valencia. The IPS panel has 3840 x 2160 resolution, HDMI and DisplayPort connections, built-in speakers and an adjustable stand.',
      'The rental includes the monitor, stand, power cable and HDMI cable.',
      'Your laptop must support HDMI or DisplayPort, either directly or through a compatible video adapter.',
      'Delivery and collection options for your Valencia address are shown with your booking.',
      'Do not press on the panel or use abrasive cleaning products. Return all included cables with the monitor.',
      '27-inch 4K Monitor Rental in Valencia',
      'Rent a 27-inch 4K IPS monitor in Valencia for remote work, with HDMI, DisplayPort, built-in speakers and an adjustable stand.'),
    ('es',
      'Monitor IPS 4K de 27 pulgadas con HDMI y DisplayPort.',
      'Añade una pantalla de 27 pulgadas a tu espacio de trabajo temporal en Valencia. El panel IPS ofrece resolución 3840 x 2160, conexiones HDMI y DisplayPort, altavoces integrados y soporte ajustable.',
      'El alquiler incluye el monitor, el soporte, el cable de alimentación y un cable HDMI.',
      'El portátil debe admitir HDMI o DisplayPort, directamente o mediante un adaptador de vídeo compatible.',
      'Las opciones de entrega y recogida para tu dirección en Valencia se muestran con la reserva.',
      'No presiones el panel ni utilices productos de limpieza abrasivos. Devuelve todos los cables incluidos con el monitor.',
      'Alquiler de monitor 4K de 27 pulgadas Valencia',
      'Alquila un monitor IPS 4K de 27 pulgadas en Valencia para teletrabajar, con HDMI, DisplayPort, altavoces integrados y soporte ajustable.')
  )
  update public.product_localizations localization
     set short_description=copy.short_description,
         detail_description=copy.detail_description,
         includes_text=copy.includes_text,
         constraints_text=copy.constraints_text,
         delivery_setup_note=copy.delivery_setup_note,
         care_note=copy.care_note,
         seo_title=copy.seo_title,
         seo_description=copy.seo_description,
         updated_at=now()
    from public.products product, copy
   where localization.product_id=product.id
     and product.slug='monitor-27'
     and localization.locale=copy.locale;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 2 then raise exception 'Expected two 27-inch monitor localizations, updated %', affected_rows; end if;

  delete from public.product_faqs faq
   using public.products product
   where faq.product_id=product.id and product.slug='monitor-27' and faq.locale in ('en','es');

  get diagnostics affected_rows = row_count;
  if affected_rows <> 5 then raise exception 'Expected five old monitor FAQs, deleted %', affected_rows; end if;

  insert into public.product_faqs(product_id,locale,question,answer,sort_order)
  select product.id,faq.locale,faq.question,faq.answer,faq.sort_order
    from public.products product
    cross join (values
      ('en',0,'What size and resolution is this monitor?','It is a 27-inch IPS monitor with 3840 x 2160 resolution.'),
      ('en',1,'Which video connections does it support?','This model supports HDMI and DisplayPort. A laptop with only USB-C needs a compatible video adapter.'),
      ('en',2,'Which cables are included?','The rental includes the monitor power cable and an HDMI cable.'),
      ('es',0,'¿Qué tamaño y resolución tiene este monitor?','Es un monitor IPS de 27 pulgadas con resolución 3840 x 2160.'),
      ('es',1,'¿Qué conexiones de vídeo admite?','Este modelo admite HDMI y DisplayPort. Un portátil que solo tenga USB-C necesita un adaptador de vídeo compatible.'),
      ('es',2,'¿Qué cables están incluidos?','El alquiler incluye el cable de alimentación del monitor y un cable HDMI.')
    ) as faq(locale,sort_order,question,answer)
   where product.slug='monitor-27';

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 6 then raise exception 'Expected six monitor FAQs, inserted %', inserted_rows; end if;
end
$$;
