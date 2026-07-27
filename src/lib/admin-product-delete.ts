import type { SupabaseClient } from "@supabase/supabase-js";

export async function deleteProductAndRelations(supabase: SupabaseClient, id: string) {
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("slug")
    .eq("id", id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

  await supabase.from("pricing_tiers").delete().eq("product_id", id);
  await supabase.from("product_quantity_discounts").delete().eq("product_id", id);
  await supabase.from("product_localizations").delete().eq("product_id", id);
  await supabase.from("product_images").delete().eq("product_id", id);
  await supabase.from("product_availability").delete().eq("product_id", id);
  await supabase.from("booking_items").delete().eq("product_id", id);
  await supabase.from("reviews").delete().eq("product_id", id);
  await supabase.from("products").delete().eq("id", id);

  return product?.slug ?? null;
}
