import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { saveUpload } from "@/lib/upload";
import { unlink } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

async function removeFile(filePath: string) {
  try {
    if (filePath.startsWith("/uploads/")) {
      await unlink(path.join(process.cwd(), "public", filePath));
    }
  } catch {}
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const form = await req.formData();

    const name = String(form.get("name") || "").trim();
    const sector = String(form.get("sector") || "").trim() || null;
    const description = String(form.get("description") || "").trim() || null;
    const websiteUrl = String(form.get("website_url") || "").trim() || null;
    const serviceIds = form.getAll("services").map((v) => Number(v)).filter(Boolean);

    await db.query(
      "UPDATE businesses SET name=?, sector=?, description=?, website_url=? WHERE id=?",
      [name, sector, description, websiteUrl, id]
    );

    // Kapak güncelleme
    const cover = form.get("cover");
    if (cover instanceof File && cover.size > 0) {
      const [old] = await db.query<any[]>("SELECT cover_path FROM businesses WHERE id=?", [id]);
      if (old[0]?.cover_path) await removeFile(old[0].cover_path);
      const saved = await saveUpload(cover);
      await db.query("UPDATE businesses SET cover_path=? WHERE id=?", [saved.path, id]);
    }

    // Hizmetleri yenile
    await db.query("DELETE FROM business_services WHERE business_id=?", [id]);
    if (serviceIds.length > 0) {
      await db.query(
        "INSERT INTO business_services (business_id, service_id) VALUES ?",
        [serviceIds.map((sid) => [id, sid])]
      );
    }

    // Silinecek medya
    const removeIds = String(form.get("remove_media") || "")
      .split(",")
      .map((v) => Number(v))
      .filter(Boolean);
    if (removeIds.length > 0) {
      const [rows] = await db.query<any[]>(
        "SELECT file_path FROM media WHERE id IN (?) AND business_id=?",
        [removeIds, id]
      );
      for (const r of rows) await removeFile(r.file_path);
      await db.query("DELETE FROM media WHERE id IN (?) AND business_id=?", [removeIds, id]);
    }

    // Yeni medya
    const mediaFiles = form.getAll("media").filter((f): f is File => f instanceof File && f.size > 0);
    for (let i = 0; i < mediaFiles.length; i++) {
      const saved = await saveUpload(mediaFiles[i]);
      await db.query(
        "INSERT INTO media (business_id, type, file_path, sort_order) VALUES (?, ?, ?, ?)",
        [id, saved.type, saved.path, 100 + i]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Güncelleme başarısız" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const [media] = await db.query<any[]>("SELECT file_path FROM media WHERE business_id=?", [id]);
    const [biz] = await db.query<any[]>("SELECT cover_path FROM businesses WHERE id=?", [id]);
    for (const m of media) await removeFile(m.file_path);
    if (biz[0]?.cover_path) await removeFile(biz[0].cover_path);
    await db.query("DELETE FROM businesses WHERE id=?", [id]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Silme başarısız" }, { status: 500 });
  }
}
