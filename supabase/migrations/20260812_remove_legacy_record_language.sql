-- Replace internal data-reference wording introduced during the legacy FAQ repair.

do $$
declare
  affected_rows integer;
begin
  update public.products
     set brand='', updated_at=now()
   where slug='high-chair';

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'Expected one high-chair brand, updated %', affected_rows; end if;

  with copy(slug, locale, short_description, detail_description, seo_description) as (
    values
    ('air-purifier','en','HEPA H13 air purifier with an air-quality sensor and quiet night mode.','Use the purifier in rooms of up to 40 m² during your Valencia stay. It offers a 320 m³/h CADR, HEPA H13 filter, air-quality sensor, timer, app control and a noise range of 24 to 48 dB.','Rent a HEPA H13 air purifier in Valencia for rooms up to 40 m², with an air-quality sensor, timer, app control and quiet night mode.'),
    ('air-purifier','es','Purificador de aire HEPA H13 con sensor de calidad del aire y modo nocturno silencioso.','Utiliza el purificador en habitaciones de hasta 40 m² durante tu estancia en Valencia. Ofrece un CADR de 320 m³/h, filtro HEPA H13, sensor de calidad del aire, temporizador, control mediante aplicación y un nivel sonoro de 24 a 48 dB.','Alquila un purificador HEPA H13 en Valencia para habitaciones de hasta 40 m², con sensor, temporizador, aplicación y modo nocturno silencioso.'),
    ('ergonomic-chair','en','Ergonomic office chair with a mesh back, lumbar support and adjustable height, armrests and recline.','Create a more comfortable temporary workspace with a mesh-backed chair that adjusts to your seating position. It offers a seat-height range of 40 to 52 cm, adjustable lumbar support and armrests, a recline mechanism and a maximum capacity of 130 kg.','Rent an ergonomic office chair in Valencia with a mesh back, lumbar support, adjustable armrests, recline and a 40–52 cm seat-height range.'),
    ('ergonomic-chair','es','Silla de oficina ergonómica con respaldo de malla, soporte lumbar y ajustes de altura, brazos e inclinación.','Crea un espacio de trabajo temporal más cómodo con una silla de respaldo de malla que se adapta a tu posición. Ofrece una altura de asiento de 40 a 52 cm, soporte lumbar y brazos regulables, mecanismo de inclinación y una capacidad máxima de 130 kg.','Alquila una silla ergonómica en Valencia con respaldo de malla, soporte lumbar, brazos regulables, inclinación y asiento de 40 a 52 cm.'),
    ('high-chair','en','Adjustable and foldable baby high chair with a five-point harness and removable tray.','Give your child a dedicated place for meals at your Valencia accommodation. The high chair offers adjustable height, a five-point harness, removable tray, easy-clean surfaces and a folding design for children from approximately 6 months to 3 years and up to 20 kg.','Rent an adjustable, folding baby high chair in Valencia with a five-point harness, removable tray and 20 kg maximum capacity.'),
    ('high-chair','es','Trona infantil regulable y plegable con arnés de cinco puntos y bandeja extraíble.','Ofrece a tu hijo un lugar propio para comer en el alojamiento de Valencia. La trona tiene altura ajustable, arnés de cinco puntos, bandeja extraíble, superficies fáciles de limpiar y diseño plegable para niños de aproximadamente 6 meses a 3 años y hasta 20 kg.','Alquila una trona infantil regulable y plegable en Valencia con arnés de cinco puntos, bandeja extraíble y capacidad máxima de 20 kg.')
  )
  update public.product_localizations localization
     set short_description=copy.short_description,
         detail_description=copy.detail_description,
         seo_description=copy.seo_description,
         updated_at=now()
    from public.products product, copy
   where localization.product_id=product.id and product.slug=copy.slug and localization.locale=copy.locale;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 6 then raise exception 'Expected six localization descriptions, updated %', affected_rows; end if;

  with faq_copy(slug, locale, sort_order, answer) as (
    values
    ('air-purifier','en',0,'The purifier covers rooms up to 40 m² and offers a CADR of 320 m³/h.'),
    ('air-purifier','es',0,'El purificador cubre habitaciones de hasta 40 m² y ofrece un CADR de 320 m³/h.'),
    ('ergonomic-chair','en',1,'The maximum capacity is 130 kg.'),
    ('ergonomic-chair','es',1,'La capacidad máxima es de 130 kg.'),
    ('high-chair','en',2,'Yes. It folds to take up less storage space at the accommodation.'),
    ('high-chair','es',2,'Sí. Se pliega para ocupar menos espacio de almacenamiento en el alojamiento.')
  )
  update public.product_faqs faq
     set answer=faq_copy.answer
    from public.products product, faq_copy
   where faq.product_id=product.id and product.slug=faq_copy.slug
     and faq.locale=faq_copy.locale and faq.sort_order=faq_copy.sort_order;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 6 then raise exception 'Expected six FAQ answers, updated %', affected_rows; end if;
end
$$;
