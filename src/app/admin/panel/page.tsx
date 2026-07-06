"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Business, Service, TeamMember } from "@/lib/data";

export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<"isletmeler" | "ekip">("isletmeler");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Business | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/businesses", { cache: "no-store" });
    if (!res.ok) {
      setMsg("Veritabanına ulaşılamadı. .env.local ayarlarını ve MySQL'i kontrol et.");
      return;
    }
    const data = await res.json();
    setBusinesses(data.businesses);
    setServices(data.services);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  async function remove(b: Business) {
    if (!confirm(`"${b.name}" ve tüm medyası silinecek. Emin misin?`)) return;
    const res = await fetch(`/api/businesses/${b.id}`, { method: "DELETE" });
    if (res.ok) {
      setMsg(`"${b.name}" silindi.`);
      load();
    } else {
      setMsg("Silme başarısız.");
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-seam sticky top-0 bg-ink/90 backdrop-blur z-40">
        <div className="mx-auto max-w-page px-6 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo-white.webp" alt="Viamean" width={100} height={54} className="h-7 w-auto" />
            <span className="label text-tungsten">Yönetim Paneli</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="label text-ash hover:text-bone transition-colors">
              Siteyi Gör ↗
            </a>
            <button onClick={logout} className="btn !py-2 !px-4">
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-page px-6 py-12">
        <div className="flex gap-2 mb-10 border-b border-seam pb-5">
          <button
            onClick={() => setTab("isletmeler")}
            className={`label px-5 py-2.5 border transition-colors ${
              tab === "isletmeler" ? "border-tungsten text-tungsten" : "border-seam text-ash hover:text-bone"
            }`}
          >
            İşletmeler
          </button>
        </div>

        {msg && (
          <p className="border border-tungsten/40 text-tungsten text-sm px-5 py-4 mb-8">
            {msg}
          </p>
        )}

        {tab === "ekip" && <TeamManager onMsg={setMsg} />}

        <div className={tab === "isletmeler" ? "" : "hidden"}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="display text-3xl">İşletmeler</h1>
            <p className="text-ash text-sm mt-2">
              {businesses.length} kayıt · Eklediklerin sitede anında yayınlanır.
            </p>
          </div>
          <button
            className="btn btn-solid"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            + Yeni İşletme Ekle
          </button>
        </div>

        {showForm && (
          <BusinessForm
            services={services}
            editing={editing}
            onDone={(text) => {
              setShowForm(false);
              setEditing(null);
              setMsg(text);
              load();
            }}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {businesses.map((b) => (
            <div key={b.id} className="border border-seam bg-coal">
              <div className="aspect-video bg-ink overflow-hidden">
                {b.cover_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.cover_path} alt={b.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="display display-outline text-2xl">{b.name.slice(0, 2)}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="font-semibold">{b.name}</p>
                {b.sector && <p className="text-ash text-sm">{b.sector}</p>}
                <p className="label text-tungsten mt-3 leading-relaxed">
                  {b.services.map((s) => s.name).join(" · ") || "Hizmet seçilmedi"}
                </p>
                <p className="label text-ash mt-2">
                  {b.media.length} medya {b.website_url ? "· web sitesi var" : ""}
                </p>
                <div className="flex gap-2 mt-5">
                  <button
                    className="btn !py-2 !px-4 flex-1 justify-center"
                    onClick={() => {
                      setEditing(b);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn !py-2 !px-4 !border-red-900 hover:!border-red-500 hover:!text-red-400"
                    onClick={() => remove(b)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {businesses.length === 0 && !showForm && (
          <div className="border border-seam p-16 text-center">
            <p className="text-ash">
              Henüz işletme yok. &quot;Yeni İşletme Ekle&quot; ile ilk kaydı oluştur.
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

function BusinessForm({
  services,
  editing,
  onDone,
  onCancel,
}: {
  services: Service[];
  editing: Business | null;
  onDone: (msg: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(editing?.name || "");
  const [sector, setSector] = useState(editing?.sector || "");
  const [description, setDescription] = useState(editing?.description || "");
  const [websiteUrl, setWebsiteUrl] = useState(editing?.website_url || "");
  const [selected, setSelected] = useState<number[]>(
    editing?.services.map((s) => s.id) || []
  );
  const [removeMedia, setRemoveMedia] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const coverRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  const produksiyon = services.filter((s) => s.area === "produksiyon");
  const dijital = services.filter((s) => s.area === "dijital");

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const fd = new FormData();
    fd.set("name", name);
    fd.set("sector", sector);
    fd.set("description", description);
    fd.set("website_url", websiteUrl);
    selected.forEach((id) => fd.append("services", String(id)));

    const cover = coverRef.current?.files?.[0];
    if (cover) fd.set("cover", cover);

    const mediaFiles = mediaRef.current?.files;
    if (mediaFiles) {
      Array.from(mediaFiles).forEach((f) => fd.append("media", f));
    }

    if (editing && removeMedia.length > 0) {
      fd.set("remove_media", removeMedia.join(","));
    }

    const res = await fetch(
      editing ? `/api/businesses/${editing.id}` : "/api/businesses",
      { method: editing ? "PUT" : "POST", body: fd }
    );
    setSaving(false);

    if (res.ok) {
      onDone(editing ? `"${name}" güncellendi.` : `"${name}" eklendi ve yayında.`);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Kaydetme başarısız");
    }
  }

  return (
    <form onSubmit={submit} className="border border-tungsten/40 bg-coal p-8 mb-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="display text-2xl">
          {editing ? `Düzenle: ${editing.name}` : "Yeni İşletme"}
        </h2>
        <button type="button" onClick={onCancel} className="label text-ash hover:text-bone">
          Vazgeç ✕
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label text-ash block mb-2">İşletme Adı *</label>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label text-ash block mb-2">Sektör</label>
          <input
            className="field"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            placeholder="Kafe, İnşaat, Berber…"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="label text-ash block mb-2">Açıklama</label>
        <textarea
          className="field min-h-[90px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Bu işletme için ne yaptık? Kısaca anlat."
        />
      </div>

      <div className="mt-5">
        <label className="label text-ash block mb-2">
          Web Sitesi Adresi <span className="normal-case tracking-normal">(yaptıysak — &quot;Web Siteleri&quot; sekmesinde görünür)</span>
        </label>
        <input
          className="field"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="mt-8">
        <p className="label text-tungsten mb-4">Verilen Hizmetler *</p>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="label text-ash mb-3">Prodüksiyon &amp; Müzik</p>
            <div className="space-y-2">
              {produksiyon.map((s) => (
                <ServiceCheck key={s.id} s={s} checked={selected.includes(s.id)} onToggle={toggle} />
              ))}
            </div>
          </div>
          <div>
            <p className="label text-ash mb-3">Dijital &amp; Yazılım</p>
            <div className="space-y-2">
              {dijital.map((s) => (
                <ServiceCheck key={s.id} s={s} checked={selected.includes(s.id)} onToggle={toggle} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 mt-8">
        <div>
          <label className="label text-ash block mb-2">Kapak Görseli</label>
          <input ref={coverRef} type="file" accept="image/*" className="field" />
          {editing?.cover_path && (
            <p className="text-ash text-xs mt-2">Yeni görsel seçersen mevcut kapak değişir.</p>
          )}
        </div>
        <div>
          <label className="label text-ash block mb-2">Medya (Foto / Video — çoklu seçim)</label>
          <input
            ref={mediaRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            className="field"
          />
        </div>
      </div>

      {editing && editing.media.length > 0 && (
        <div className="mt-8">
          <p className="label text-ash mb-3">
            Mevcut Medya — silmek istediklerini işaretle
          </p>
          <div className="grid gap-3 grid-cols-3 md:grid-cols-6">
            {editing.media.map((m) => {
              const marked = removeMedia.includes(m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() =>
                    setRemoveMedia((prev) =>
                      marked ? prev.filter((x) => x !== m.id) : [...prev, m.id]
                    )
                  }
                  className={`relative border aspect-square overflow-hidden ${
                    marked ? "border-red-500 opacity-40" : "border-seam"
                  }`}
                >
                  {m.type === "video" ? (
                    <video src={m.file_path} muted className="w-full h-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.file_path} alt="" className="w-full h-full object-cover" />
                  )}
                  {marked && (
                    <span className="absolute inset-0 flex items-center justify-center label text-red-400">
                      Silinecek
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm mt-6">{error}</p>}

      <div className="flex gap-3 mt-8">
        <button className="btn btn-solid" disabled={saving}>
          {saving ? "Kaydediliyor…" : editing ? "Güncelle →" : "Ekle ve Yayınla →"}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Vazgeç
        </button>
      </div>
    </form>
  );
}

function ServiceCheck({
  s,
  checked,
  onToggle,
}: {
  s: Service;
  checked: boolean;
  onToggle: (id: number) => void;
}) {
  return (
    <label
      className={`flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors text-sm ${
        checked ? "border-tungsten text-bone" : "border-seam text-ash hover:text-bone"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(s.id)}
        className="accent-[#F2A33C]"
      />
      {s.name}
    </label>
  );
}

function TeamManager({ onMsg }: { onMsg: (m: string) => void }) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/team", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setTeam(data.team);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(m: TeamMember) {
    if (!confirm(`"${m.name}" ekipten silinecek. Emin misin?`)) return;
    const res = await fetch(`/api/team/${m.id}`, { method: "DELETE" });
    if (res.ok) {
      onMsg(`"${m.name}" silindi.`);
      load();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="display text-3xl">Ekip</h1>
          <p className="text-ash text-sm mt-2">
            {team.length} kişi · Sıra numarası küçük olan önce görünür.
          </p>
        </div>
        <button
          className="btn btn-solid"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Ekip Üyesi Ekle
        </button>
      </div>

      {showForm && (
        <TeamForm
          editing={editing}
          onDone={(text) => {
            setShowForm(false);
            setEditing(null);
            onMsg(text);
            load();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m) => (
          <div key={m.id} className="border border-seam bg-coal">
            <div className="aspect-[4/5] bg-ink overflow-hidden">
              {m.photo_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo_path} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="display display-outline text-3xl">
                    {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="font-semibold">{m.name}</p>
              <p className="label text-tungsten mt-1">{m.role}</p>
              <div className="flex gap-2 mt-4">
                <button
                  className="btn !py-2 !px-4 flex-1 justify-center"
                  onClick={() => {
                    setEditing(m);
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Düzenle
                </button>
                <button
                  className="btn !py-2 !px-4 !border-red-900 hover:!border-red-500 hover:!text-red-400"
                  onClick={() => remove(m)}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {team.length === 0 && !showForm && (
        <div className="border border-seam p-16 text-center">
          <p className="text-ash">
            Henüz ekip üyesi yok. &quot;Ekip Üyesi Ekle&quot; ile başla.
          </p>
        </div>
      )}
    </div>
  );
}

function TeamForm({
  editing,
  onDone,
  onCancel,
}: {
  editing: TeamMember | null;
  onDone: (msg: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(editing?.name || "");
  const [role, setRole] = useState(editing?.role || "");
  const [bio, setBio] = useState(editing?.bio || "");
  const [sortOrder, setSortOrder] = useState(String(editing?.sort_order ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const fd = new FormData();
    fd.set("name", name);
    fd.set("role", role);
    fd.set("bio", bio);
    fd.set("sort_order", sortOrder);
    const photo = photoRef.current?.files?.[0];
    if (photo) fd.set("photo", photo);

    const res = await fetch(editing ? `/api/team/${editing.id}` : "/api/team", {
      method: editing ? "PUT" : "POST",
      body: fd,
    });
    setSaving(false);

    if (res.ok) {
      onDone(editing ? `"${name}" güncellendi.` : `"${name}" ekibe eklendi.`);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Kaydetme başarısız");
    }
  }

  return (
    <form onSubmit={submit} className="border border-tungsten/40 bg-coal p-8 mb-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="display text-2xl">
          {editing ? `Düzenle: ${editing.name}` : "Yeni Ekip Üyesi"}
        </h2>
        <button type="button" onClick={onCancel} className="label text-ash hover:text-bone">
          Vazgeç ✕
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label text-ash block mb-2">İsim Soyisim *</label>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label text-ash block mb-2">Görev *</label>
          <input
            className="field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Yönetmen, Editör, Ses Mühendisi…"
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="label text-ash block mb-2">Kısa Tanıtım</label>
        <textarea
          className="field min-h-[80px]"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bir-iki cümle yeter."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 mt-5">
        <div>
          <label className="label text-ash block mb-2">Fotoğraf (dikey önerilir)</label>
          <input ref={photoRef} type="file" accept="image/*" className="field" />
          {editing?.photo_path && (
            <p className="text-ash text-xs mt-2">Yeni fotoğraf seçersen mevcut değişir.</p>
          )}
        </div>
        <div>
          <label className="label text-ash block mb-2">Sıra (küçük olan önce)</label>
          <input
            className="field"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-6">{error}</p>}

      <div className="flex gap-3 mt-8">
        <button className="btn btn-solid" disabled={saving}>
          {saving ? "Kaydediliyor…" : editing ? "Güncelle →" : "Ekle →"}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Vazgeç
        </button>
      </div>
    </form>
  );
}
