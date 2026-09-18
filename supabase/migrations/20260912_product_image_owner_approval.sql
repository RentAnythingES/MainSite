-- Owner approval is an editorial publication decision, not a claim of image ownership or supplier permission.
ALTER TABLE public.product_images DROP CONSTRAINT IF EXISTS product_images_rights_status_check;
ALTER TABLE public.product_images ADD CONSTRAINT product_images_rights_status_check
  CHECK (rights_status IN ('unknown', 'owned', 'licensed', 'manufacturer_approved', 'owner_approved'));
