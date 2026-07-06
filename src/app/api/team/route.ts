import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTeam } from "@/lib/data";
import { saveUpload } from "@/lib/upload";
import type { ResultSetHeader } from "mysql2";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ team: await getTeam() });
  } catch {
    return NextResponse.json({ error: "Veritabanına ulaşılamadı" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const role = String(form.get("role") || "").trim();
    if (!name || !role) {
      return NextResponse.json({ error: "İsim ve görev zorunlu" }, { status: 400 });
    }
    const bio = String(form.get("bio") || "").trim() || null;
    const sortOrder = Number(form.get("sort_order") || 0);

    let photoPath: string | null = null;
    const photo = form.get("photo");
    if (photo instanceof File && photo.size > 0) {
      const saved = await saveUpload(photo);
      photoPath = saved.path;
    }

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO team_members (name, role, bio, photo_path, sort_order) VALUES (?, ?, ?, ?, ?)",
      [name, role, bio, photoPath, sortOrder]
    );
    return NextResponse.json({ ok: true, id: result.insertId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Kayıt başarısız" }, { status: 500 });
  }
}
