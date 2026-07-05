"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/panel");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Giriş başarısız");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center spot-hero px-6">
      <form onSubmit={submit} className="w-full max-w-sm border border-seam bg-coal p-10">
        <Image
          src="/logo-white.webp"
          alt="Viamean"
          width={132}
          height={71}
          className="h-10 w-auto mb-8"
        />
        <p className="label text-tungsten mb-8">Yönetim Girişi</p>

        <label className="label text-ash block mb-2">Kullanıcı Adı</label>
        <input
          className="field mb-5"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <label className="label text-ash block mb-2">Şifre</label>
        <input
          className="field mb-6"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="text-sm text-red-400 mb-5">{error}</p>}

        <button className="btn btn-solid w-full justify-center" disabled={loading}>
          {loading ? "Kontrol Ediliyor…" : "Giriş Yap →"}
        </button>
      </form>
    </div>
  );
}
