-- Make the 24-, 29- and 32-inch monitor listings describe their verified variants.
-- This does not change pricing, availability, images or the existing 27-inch monitor.

do $$
declare
  affected_rows integer;
  inserted_rows integer;
begin
  update public.product_localizations localization
     set short_description = case product.slug
           when '24-inch-monitor-hdmi-cable' then '24-inch 4K IPS monitor with HDMI and DisplayPort.'
           when '29-inch-monitor-hdmi-cable' then '29-inch 4K IPS monitor with USB-C, HDMI and DisplayPort.'
           when '32-inch-monitor-hdmi-cable' then '32-inch 4K IPS monitor with USB-C, HDMI and DisplayPort.'
         end,
         detail_description = case product.slug
           when '24-inch-monitor-hdmi-cable' then 'A 24-inch IPS monitor with 3840 x 2160 resolution, HDMI, DisplayPort, built-in speakers and an adjustable stand for a temporary workspace in Valencia.'
           when '29-inch-monitor-hdmi-cable' then 'A 29-inch IPS monitor with 3840 x 2160 resolution, USB-C with up to 65 W charging, HDMI, DisplayPort, built-in speakers and an adjustable stand.'
           when '32-inch-monitor-hdmi-cable' then 'A 32-inch IPS monitor with 3840 x 2160 resolution, USB-C with up to 65 W charging, HDMI, DisplayPort, built-in speakers and an adjustable stand.'
         end,
         constraints_text = case product.slug
           when '24-inch-monitor-hdmi-cable' then 'Your laptop must support HDMI or DisplayPort, either directly or through a compatible adapter.'
           else 'Your laptop must be compatible with the chosen connection. USB-C charging depends on device compatibility.'
         end,
         seo_title = case product.slug
           when '24-inch-monitor-hdmi-cable' then '24-inch 4K monitor rental in Valencia'
           when '29-inch-monitor-hdmi-cable' then '29-inch 4K monitor rental in Valencia'
           when '32-inch-monitor-hdmi-cable' then '32-inch 4K monitor rental in Valencia'
         end,
         seo_description = case product.slug
           when '24-inch-monitor-hdmi-cable' then 'Rent a 24-inch 4K IPS monitor in Valencia for remote work, with HDMI, DisplayPort, built-in speakers and an adjustable stand.'
           when '29-inch-monitor-hdmi-cable' then 'Rent a 29-inch 4K IPS monitor in Valencia for remote work, with USB-C charging up to 65 W, HDMI, DisplayPort and built-in speakers.'
           when '32-inch-monitor-hdmi-cable' then 'Rent a 32-inch 4K IPS monitor in Valencia for remote work, with USB-C charging up to 65 W, HDMI, DisplayPort and built-in speakers.'
         end,
         updated_at = now()
    from public.products product
   where localization.product_id = product.id
     and localization.locale = 'en'
     and product.slug in (
       '24-inch-monitor-hdmi-cable',
       '29-inch-monitor-hdmi-cable',
       '32-inch-monitor-hdmi-cable'
     )
     and product.specs ->> 'Resolution' = '3840x2160'
     and product.specs ->> 'Screen' = case product.slug
       when '24-inch-monitor-hdmi-cable' then '24 inch IPS'
       when '29-inch-monitor-hdmi-cable' then '29 inch IPS'
       when '32-inch-monitor-hdmi-cable' then '32 inch IPS'
     end;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 3 then
    raise exception 'Expected to align three English monitor localizations, updated %', affected_rows;
  end if;

  update public.product_localizations localization
     set short_description = case product.slug
           when '24-inch-monitor-hdmi-cable' then 'Monitor IPS 4K de 24 pulgadas con HDMI y DisplayPort.'
           when '29-inch-monitor-hdmi-cable' then 'Monitor IPS 4K de 29 pulgadas con USB-C, HDMI y DisplayPort.'
           when '32-inch-monitor-hdmi-cable' then 'Monitor IPS 4K de 32 pulgadas con USB-C, HDMI y DisplayPort.'
         end,
         detail_description = case product.slug
           when '24-inch-monitor-hdmi-cable' then 'Monitor IPS de 24 pulgadas con resolución 3840 x 2160, HDMI, DisplayPort, altavoces integrados y soporte ajustable para montar un espacio de trabajo temporal en Valencia.'
           when '29-inch-monitor-hdmi-cable' then 'Monitor IPS de 29 pulgadas con resolución 3840 x 2160, USB-C con carga de hasta 65 W, HDMI, DisplayPort, altavoces integrados y soporte ajustable.'
           when '32-inch-monitor-hdmi-cable' then 'Monitor IPS de 32 pulgadas con resolución 3840 x 2160, USB-C con carga de hasta 65 W, HDMI, DisplayPort, altavoces integrados y soporte ajustable.'
         end,
         constraints_text = case product.slug
           when '24-inch-monitor-hdmi-cable' then 'El portátil debe admitir HDMI o DisplayPort, directamente o mediante un adaptador compatible.'
           else 'El portátil debe ser compatible con la conexión elegida. La carga USB-C depende de la compatibilidad del dispositivo.'
         end,
         seo_title = case product.slug
           when '24-inch-monitor-hdmi-cable' then 'Alquiler de monitor 4K de 24 pulgadas en Valencia'
           when '29-inch-monitor-hdmi-cable' then 'Alquiler de monitor 4K de 29 pulgadas en Valencia'
           when '32-inch-monitor-hdmi-cable' then 'Alquiler de monitor 4K de 32 pulgadas en Valencia'
         end,
         seo_description = case product.slug
           when '24-inch-monitor-hdmi-cable' then 'Alquila un monitor IPS 4K de 24 pulgadas en Valencia para teletrabajar, con HDMI, DisplayPort, altavoces integrados y soporte ajustable.'
           when '29-inch-monitor-hdmi-cable' then 'Alquila un monitor IPS 4K de 29 pulgadas en Valencia, con USB-C y carga de hasta 65 W, HDMI, DisplayPort y altavoces integrados.'
           when '32-inch-monitor-hdmi-cable' then 'Alquila un monitor IPS 4K de 32 pulgadas en Valencia, con USB-C y carga de hasta 65 W, HDMI, DisplayPort y altavoces integrados.'
         end,
         updated_at = now()
    from public.products product
   where localization.product_id = product.id
     and localization.locale = 'es'
     and product.slug in (
       '24-inch-monitor-hdmi-cable',
       '29-inch-monitor-hdmi-cable',
       '32-inch-monitor-hdmi-cable'
     )
     and product.specs ->> 'Resolution' = '3840x2160'
     and product.specs ->> 'Screen' = case product.slug
       when '24-inch-monitor-hdmi-cable' then '24 inch IPS'
       when '29-inch-monitor-hdmi-cable' then '29 inch IPS'
       when '32-inch-monitor-hdmi-cable' then '32 inch IPS'
     end;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 3 then
    raise exception 'Expected to align three Spanish monitor localizations, updated %', affected_rows;
  end if;

  insert into public.product_faqs (product_id, locale, question, answer, sort_order)
  select product.id, faq.locale, faq.question, faq.answer, faq.sort_order
    from (
      values
      ('24-inch-monitor-hdmi-cable', 'en', 'What size and resolution is this monitor?', 'It is a 24-inch IPS monitor with 3840 x 2160 resolution.', 0),
      ('24-inch-monitor-hdmi-cable', 'en', 'Which video connections does it support?', 'This model supports HDMI and DisplayPort. Check your laptop video output before booking, especially if you need an adapter.', 1),
      ('24-inch-monitor-hdmi-cable', 'en', 'Does this monitor connect by USB-C?', 'This 24-inch model is listed with HDMI and DisplayPort rather than USB-C. A laptop with only USB-C needs a compatible video adapter.', 2),
      ('24-inch-monitor-hdmi-cable', 'es', '¿Qué tamaño y resolución tiene este monitor?', 'Es un monitor IPS de 24 pulgadas con resolución 3840 x 2160.', 0),
      ('24-inch-monitor-hdmi-cable', 'es', '¿Qué conexiones de vídeo admite?', 'Este modelo admite HDMI y DisplayPort. Comprueba la salida de vídeo de tu portátil antes de reservar, especialmente si necesitas un adaptador.', 1),
      ('24-inch-monitor-hdmi-cable', 'es', '¿Este monitor se conecta por USB-C?', 'Este modelo de 24 pulgadas ofrece HDMI y DisplayPort, no USB-C. Un portátil que solo tenga USB-C necesita un adaptador de vídeo compatible.', 2),
      ('29-inch-monitor-hdmi-cable', 'en', 'What size and resolution is this monitor?', 'It is a 29-inch IPS monitor with 3840 x 2160 resolution.', 0),
      ('29-inch-monitor-hdmi-cable', 'en', 'Which video connections does it support?', 'This model supports USB-C, HDMI and DisplayPort. Your laptop must support the connection you plan to use.', 1),
      ('29-inch-monitor-hdmi-cable', 'en', 'Can the USB-C connection charge my laptop?', 'The USB-C port provides up to 65 W charging, subject to laptop compatibility. Some laptops may still need their own charger.', 2),
      ('29-inch-monitor-hdmi-cable', 'es', '¿Qué tamaño y resolución tiene este monitor?', 'Es un monitor IPS de 29 pulgadas con resolución 3840 x 2160.', 0),
      ('29-inch-monitor-hdmi-cable', 'es', '¿Qué conexiones de vídeo admite?', 'Este modelo admite USB-C, HDMI y DisplayPort. El portátil debe ser compatible con la conexión que quieras utilizar.', 1),
      ('29-inch-monitor-hdmi-cable', 'es', '¿La conexión USB-C puede cargar el portátil?', 'El puerto USB-C proporciona hasta 65 W de carga, según la compatibilidad del portátil. Algunos portátiles pueden seguir necesitando su propio cargador.', 2),
      ('32-inch-monitor-hdmi-cable', 'en', 'What size and resolution is this monitor?', 'It is a 32-inch IPS monitor with 3840 x 2160 resolution.', 0),
      ('32-inch-monitor-hdmi-cable', 'en', 'Which video connections does it support?', 'This model supports USB-C, HDMI and DisplayPort. Your laptop must support the connection you plan to use.', 1),
      ('32-inch-monitor-hdmi-cable', 'en', 'Can the USB-C connection charge my laptop?', 'The USB-C port provides up to 65 W charging, subject to laptop compatibility. Some laptops may still need their own charger.', 2),
      ('32-inch-monitor-hdmi-cable', 'es', '¿Qué tamaño y resolución tiene este monitor?', 'Es un monitor IPS de 32 pulgadas con resolución 3840 x 2160.', 0),
      ('32-inch-monitor-hdmi-cable', 'es', '¿Qué conexiones de vídeo admite?', 'Este modelo admite USB-C, HDMI y DisplayPort. El portátil debe ser compatible con la conexión que quieras utilizar.', 1),
      ('32-inch-monitor-hdmi-cable', 'es', '¿La conexión USB-C puede cargar el portátil?', 'El puerto USB-C proporciona hasta 65 W de carga, según la compatibilidad del portátil. Algunos portátiles pueden seguir necesitando su propio cargador.', 2)
    ) as faq(slug, locale, question, answer, sort_order)
    join public.products product on product.slug = faq.slug
   where not exists (
     select 1
       from public.product_faqs existing
      where existing.product_id = product.id
        and existing.locale = faq.locale
        and existing.sort_order = faq.sort_order
   );

  get diagnostics inserted_rows = row_count;
  if inserted_rows <> 18 then
    raise exception 'Expected to insert 18 monitor FAQs, inserted %', inserted_rows;
  end if;

  if exists (
    select 1
      from public.products product
      left join public.product_faqs faq on faq.product_id = product.id
     where product.slug in (
       '24-inch-monitor-hdmi-cable',
       '29-inch-monitor-hdmi-cable',
       '32-inch-monitor-hdmi-cable'
     )
     group by product.slug
    having count(*) filter (where faq.locale = 'en') < 3
        or count(*) filter (where faq.locale = 'es') < 3
  ) then
    raise exception 'Bilingual monitor FAQ coverage remains incomplete';
  end if;
end
$$;
