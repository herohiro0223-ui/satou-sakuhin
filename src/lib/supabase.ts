import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * base64 data URL を Supabase Storage にアップロードし、公開URLを返す。
 * すでにURLの場合はそのまま返す。
 */
export async function uploadImage(
  base64DataUrl: string,
  fileName: string
): Promise<string> {
  if (!base64DataUrl.startsWith("data:")) {
    return base64DataUrl;
  }

  const res = await fetch(base64DataUrl);
  const blob = await res.blob();

  const path = `${Date.now()}_${fileName}`;
  const { error } = await supabase.storage
    .from("artworks")
    .upload(path, blob, { contentType: blob.type, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("artworks").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Supabase Storage 上の画像を削除する。
 * Storage URL でなければ何もしない。
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl.includes("supabase.co/storage/")) return;

  const parts = imageUrl.split("/object/public/artworks/");
  const path = parts[1];
  if (path) {
    await supabase.storage.from("artworks").remove([decodeURIComponent(path)]);
  }
}
