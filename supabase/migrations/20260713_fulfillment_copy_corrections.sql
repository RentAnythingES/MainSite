update public.pickup_locations
set customer_instructions = replace(customer_instructions, 'Parterna', 'Paterna')
where customer_instructions like '%Parterna%';
