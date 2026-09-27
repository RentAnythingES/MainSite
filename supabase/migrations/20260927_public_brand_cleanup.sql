-- Update current catalogue copy only; historical bookings/documents stay immutable.
update public.products
set brand = regexp_replace(regexp_replace(brand, 'rentanything\.es', 'rentandroll.com', 'gi'), 'rentanything', 'Rentandroll', 'gi')
where brand ~* 'rentanything';

update public.product_localizations
set detail_description = regexp_replace(regexp_replace(detail_description, 'rentanything\.es', 'rentandroll.com', 'gi'), 'rentanything', 'Rentandroll', 'gi'),
    constraints_text = regexp_replace(regexp_replace(constraints_text, 'rentanything\.es', 'rentandroll.com', 'gi'), 'rentanything', 'Rentandroll', 'gi')
where detail_description ~* 'rentanything' or constraints_text ~* 'rentanything';

update public.product_faqs
set answer = regexp_replace(regexp_replace(answer, 'rentanything\.es', 'rentandroll.com', 'gi'), 'rentanything', 'Rentandroll', 'gi')
where answer ~* 'rentanything';
