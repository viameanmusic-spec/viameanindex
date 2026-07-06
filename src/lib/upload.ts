import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp"; // Sharp kütüphanesini dahil ettik

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveUpload(file: File): Promise<{ path: string; type: "image" | "video" }> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  
  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".mp4", ".webm", ".mov"];
  
  if (!allowed.includes(ext)) {
    throw new Error(`Desteklenmeyen dosya türü: ${ext}`);
  }

  const isVideo = [".mp4", ".webm", ".mov"].includes(ext);
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  // VİDEO İŞLEMLERİ (Aynen korundu)
  if (isVideo) {
    const finalName = `${uniqueName}${ext}`;
    await writeFile(path.join(UPLOAD_DIR, finalName), buffer);
    return { path: `/uploads/${finalName}`, type: "video" };
  } 
  
  // GÖRSEL İŞLEMLERİ (Sharp ile Optimize Ediliyor)
  else {
    // Tüm resimleri modern ve optimize WebP formatına çeviriyoruz
    const finalName = `${uniqueName}.webp`; 
    const finalPath = path.join(UPLOAD_DIR, finalName);

    await sharp(buffer)
      .resize(1600, 1600, { 
        fit: "inside", 
        withoutEnlargement: true // Eğer resim zaten küçükse boşuna büyütüp kalitesini bozmaz
      })
      .webp({ quality: 82 }) // %82 kalite oranı, gözle görülür kayıp olmadan muazzam bir sıkıştırma sağlar
      .toFile(finalPath);

    return { path: `/uploads/${finalName}`, type: "image" };
  }
}