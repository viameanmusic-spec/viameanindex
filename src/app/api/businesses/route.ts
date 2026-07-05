import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getBusinesses, getServices } from "@/lib/data";
import { saveUpload, slugify } from "@/lib/upload";
import type { ResultSetHeader } from "mysql2";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [businesses, services] = await Promise.all([getBusinesses(), getServices()]);
    return NextResponse.json({ businesses, services });
  } catch {
    return NextResponse.json({ error: "Veritabanına ulaşılamadı" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    if (!name) {
      return NextResponse.json({ error: "İşletme adı zorunlu" }, { status: 400 });
    }

    const sector = String(form.get("sector") || "").trim() || null;
    const description = String(form.get("description") || "").trim() || null;
    const websiteUrl = String(form.get("website_url") || "").trim() || null;
    const serviceIds = form
      .getAll("services")
      .map((v) => Number(v))
      .filter(Boolean);

    let coverPath: string | null = null;
    const cover = form.get("cover");
    if (cover instanceof File && cover.size > 0) {
      const saved = await saveUpload(cover);
      coverPath = saved.path;
    }

    let slug = slugify(name);
    // Slug çakışmasını önle
    const [existing] = await db.query<any[]>(
      "SELECT COUNT(*) as c FROM businesses WHERE slug LIKE ?",
      [`${slug}%`]
    );
    if (existing[0].c > 0) slug = `${slug}-${existing[0].c + 1}`;

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO businesses (name, slug, sector, description, cover_path, website_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, slug, sector, description, coverPath, websiteUrl]
    );
    const businessId = result.insertId;

    if (serviceIds.length > 0) {
      await db.query(
        "INSERT INTO business_services (business_id, service_id) VALUES ?",
        [serviceIds.map((sid) => [businessId, sid])]
      );
    }

    const mediaFiles = form.getAll("media").filter((f): f is File => f instanceof File && f.size > 0);
    for (let i = 0; i < mediaFiles.length; i++) {
      const saved = await saveUpload(mediaFiles[i]);
      await db.query(
        "INSERT INTO media (business_id, type, file_path, sort_order) VALUES (?, ?, ?, ?)",
        [businessId, saved.type, saved.path, i]
      );
    }

    return NextResponse.json({ ok: true, id: businessId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Kayıt başarısız" }, { status: 500 });
  }
}
