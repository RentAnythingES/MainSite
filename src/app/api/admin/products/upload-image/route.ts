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

function hasExpectedImageSignature(buffer: Buffer, contentType: string) {
  if (contentType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (contentType === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (contentType === "image/gif") {
    const signature = buffer.subarray(0, 6).toString("ascii");
    return signature === "GIF87a" || signature === "GIF89a";
  }

  if (contentType === "image/webp") {
    return buffer.length >= 12
      && buffer.subarray(0, 4).toString("ascii") === "RIFF"
      && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  }

  return false;
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

    if (!hasExpectedImageSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: "The uploaded file does not match its declared image format" },
        { status: 400 }
      );
    }

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
    const verification = await fetch(data.publicUrl, { cache: "no-store" });
    const verificationType = verification.headers.get("content-type") || "";

    if (!verification.ok || !verificationType.startsWith("image/")) {
      await supabase.storage.from(BUCKET).remove([path]);
      console.error("[admin/products/upload-image] public URL verification failed:", {
        status: verification.status,
        contentType: verificationType,
      });
      return NextResponse.json(
        { error: "Image was stored but could not be verified. Please try the upload again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl: data.publicUrl, path });
  } catch (err) {
    console.error("[admin/products/upload-image] POST error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
