# Viamean Production — Web Sitesi

Next.js 14 + TypeScript + MySQL. Karanlık, sinematik, çok sayfalı kurumsal site + yönetim paneli.

## Sayfalar
| Yol | Açıklama |
|---|---|
| `/` | Ana sayfa (hero, iki disiplin, son işler, CTA) |
| `/hizmetler` | 11 hizmet, iki disiplin altında |
| `/paketler` | Başlangıç · İvme · Zirve (fiyat için iletişim) |
| `/isler` | Portfolyo + referanslar — **Web Siteleri ayrı sekmede**, diğer işler hizmete göre filtrelenir |
| `/ekip` | Ekip üyeleri (panelden yönetilir) |
| `/iletisim` | Telefon, e-posta, adres, çalışma saatleri, Viamean Music |
| `/admin` | Yönetim girişi |
| `/admin/panel` | İki sekme: **İşletmeler** (ekle/düzenle/sil, foto-video) ve **Ekip** (üye ekle/düzenle/sil, fotoğraf) |

## Panel nasıl çalışır
1. `/admin` → `.env.local`'daki kullanıcı adı ve şifreyle gir.
2. "Yeni İşletme Ekle": ad, sektör, açıklama, verilen hizmetler (checkbox), kapak görseli, çoklu foto/video.
3. **Web Sitesi Adresi** doldurursan işletme, İşlerimiz sayfasındaki "Web Siteleri" sekmesinde site linkiyle görünür.
4. Kaydet → sitede anında yayında. Koda girmene gerek yok.
5. **Ekip sekmesi:** isim, görev, kısa tanıtım, fotoğraf ve sıra numarası — `/ekip` sayfasında anında görünür.

## Sürüm güncellemesi
Yeni tablo eklendiğinde `schema.sql` güvenle tekrar çalıştırılabilir (`IF NOT EXISTS` + `INSERT IGNORE`), mevcut veriye dokunmaz:
```bash
mysql --default-character-set=utf8mb4 -u root -p < database/schema.sql
```

---

## Lokal geliştirme

```bash
# 1) Veritabanı (MySQL 8 veya MariaDB)
mysql --default-character-set=utf8mb4 -u root -p < database/schema.sql
mysql -u root -p -e "CREATE USER 'viamean'@'localhost' IDENTIFIED BY 'guclu-bir-sifre'; GRANT ALL ON viamean_site.* TO 'viamean'@'localhost'; FLUSH PRIVILEGES;"

# 2) Ortam değişkenleri
cp .env.example .env.local   # içini düzenle

# 3) Çalıştır
npm install
npm run dev
```

## Ubuntu sunucuya kurulum (PM2 + Nginx) — tek script

Aşağıyı olduğu gibi yapıştır; sadece en üstteki 4 değişkeni kendine göre değiştir:

```bash
# ================= DEĞİŞTİR =================
DB_SIFRE='guclu-bir-sifre'
ADMIN_KULLANICI='admin'
ADMIN_SIFRE='cok-guclu-panel-sifresi'
DOMAIN='viamean.com'
# ============================================

cd /var/www/viamean

# Veritabanı
sudo mysql --default-character-set=utf8mb4 < database/schema.sql
sudo mysql -e "CREATE USER IF NOT EXISTS 'viamean'@'localhost' IDENTIFIED BY '${DB_SIFRE}'; GRANT ALL ON viamean_site.* TO 'viamean'@'localhost'; FLUSH PRIVILEGES;"

# Ortam değişkenleri
cat > .env.local << ENV
DB_HOST=localhost
DB_PORT=3306
DB_USER=viamean
DB_PASSWORD=${DB_SIFRE}
DB_NAME=viamean_site
ADMIN_USERNAME=${ADMIN_KULLANICI}
ADMIN_PASSWORD=${ADMIN_SIFRE}
AUTH_SECRET=$(openssl rand -hex 32)
ENV

# Build + PM2
npm install
npm run build
pm2 delete viamean-site 2>/dev/null || true
pm2 start npm --name viamean-site -- start
pm2 save

# Nginx
sudo tee /etc/nginx/sites-available/viamean-site > /dev/null << NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    client_max_body_size 200M;

    location /uploads/ {
        alias /var/www/viamean/public/uploads/;
        expires 30d;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/viamean-site /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "Bitti → http://${DOMAIN} · Panel: http://${DOMAIN}/admin"
```

> SSL için: `sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}`

## Notlar
- Yüklenen dosyalar `public/uploads/` klasörüne yazılır — sunucu yedeğine bu klasörü dahil et.
- `client_max_body_size 200M` video yüklemeleri için; daha büyük videolar gerekiyorsa hem Nginx'te hem `next.config.mjs`'te artır.
- Hizmet listesi `database/schema.sql` içinde seed edilir; yeni hizmet eklemek istersen `services` tablosuna satır ekle, panelde otomatik görünür.
