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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const role = String(form.get("role") || "").trim();
    const bio = String(form.get("bio") || "").trim() || null;
    const sortOrder = Number(form.get("sort_order") || 0);

    await db.query(
      "UPDATE team_members SET name=?, role=?, bio=?, sort_order=? WHERE id=?",
      [name, role, bio, sortOrder, id]
    );

    const photo = form.get("photo");
    if (photo instanceof File && photo.size > 0) {
      const [old] = await db.query<any[]>("SELECT photo_path FROM team_members WHERE id=?", [id]);
      if (old[0]?.photo_path) await removeFile(old[0].photo_path);
      const saved = await saveUpload(photo);
      await db.query("UPDATE team_members SET photo_path=? WHERE id=?", [saved.path, id]);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Güncelleme başarısız" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const [rows] = await db.query<any[]>("SELECT photo_path FROM team_members WHERE id=?", [id]);
    if (rows[0]?.photo_path) await removeFile(rows[0].photo_path);
    await db.query("DELETE FROM team_members WHERE id=?", [id]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Silme başarısız" }, { status: 500 });
  }
}
