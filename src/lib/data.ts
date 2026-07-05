import { db } from "./db";
import type { RowDataPacket } from "mysql2";

export type Service = {
  id: number;
  slug: string;
  name: string;
  area: "produksiyon" | "dijital";
  description: string;
};

export type Media = {
  id: number;
  business_id: number;
  type: "image" | "video";
  file_path: string;
  caption: string | null;
  sort_order: number;
};

export type Business = {
  id: number;
  name: string;
  slug: string;
  sector: string | null;
  description: string | null;
  cover_path: string | null;
  website_url: string | null;
  created_at: string;
  services: Service[];
  media: Media[];
};

export async function getServices(): Promise<Service[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM services ORDER BY area, id"
  );
  return rows as Service[];
}

export async function getBusinesses(): Promise<Business[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM businesses ORDER BY created_at DESC, id DESC"
  );
  const businesses = rows as Business[];
  if (businesses.length === 0) return [];

  const ids = businesses.map((b) => b.id);
  const [svcRows] = await db.query<RowDataPacket[]>(
    `SELECT bs.business_id, s.* FROM business_services bs
     JOIN services s ON s.id = bs.service_id
     WHERE bs.business_id IN (?)`,
    [ids]
  );
  const [mediaRows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM media WHERE business_id IN (?) ORDER BY sort_order, id`,
    [ids]
  );

  for (const b of businesses) {
    b.services = (svcRows as any[]).filter((r) => r.business_id === b.id);
    b.media = (mediaRows as Media[]).filter((m) => m.business_id === b.id);
  }
  return businesses;
}

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  photo_path: string | null;
  sort_order: number;
};

export async function getTeam(): Promise<TeamMember[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM team_members ORDER BY sort_order, id"
  );
  return rows as TeamMember[];
}
