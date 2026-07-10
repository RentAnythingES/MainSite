import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

const BUCKET = "product-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function getExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;

  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "bin";
}

function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const productSlug = formData.get("productSlug");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Please upload a JPG, PNG, WebP, or GIF image" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 5 MB" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const folder = slugifySegment(typeof productSlug === "string" ? productSlug : "") || "uncategorized";
    const extension = getExtension(file);
    const path = `${folder}/${Date.now()}-${randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      console.error("[admin/products/upload-image] upload error:", error);
      return NextResponse.json(
        { error: "Image upload failed. Check that the product-images storage bucket migration has been run." },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({ imageUrl: data.publicUrl, path });
  } catch (err) {
    console.error("[admin/products/upload-image] POST error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
