-- RentAnything.es — Product image storage bucket
-- Creates the public bucket used by the admin product image uploader.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  create policy "Public read product images"
    on storage.objects
    for select
    using (bucket_id = 'product-images');
exception
  when duplicate_object then null;
end $$;
