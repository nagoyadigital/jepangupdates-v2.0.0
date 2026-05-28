# Setup Guide - Jepang Updates CMS Backend

## Prerequisites
- Node.js 20+
- PostgreSQL 14+ (di VPS Tencent)

## 1. Install Dependencies
```bash
npm install
```

## 2. Konfigurasi Database
Edit file `.env` dan ganti `DATABASE_URL` dengan kredensial PostgreSQL VPS:
```
DATABASE_URL="postgresql://username:password@IP_VPS:5432/japanupdates?schema=public"
```

Generate AUTH_SECRET:
```bash
openssl rand -base64 32
```

## 3. Setup Database
```bash
# Push schema ke database (untuk development)
npm run db:push

# Atau gunakan migration (untuk production)
npm run db:migrate

# Seed data awal (Super Admin + Categories)
npm run db:seed
```

## 4. Login Credentials (setelah seed)
- **Email:** admin@jepangupdates.com
- **Password:** SuperAdmin123!
- **Role:** SUPER_ADMIN

⚠️ **PENTING:** Segera ganti password setelah login pertama kali!

## 5. Jalankan Development Server
```bash
npm run dev
```

## 6. Akses
- Frontend: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin
- Login: http://localhost:3000/login
- Prisma Studio: `npm run db:studio`

---

## Struktur Role & Permission

| Role | Artikel | Publish | Kategori | Media | Iklan | User | Settings |
|------|---------|---------|----------|-------|-------|------|----------|
| Super Admin | ✅ Semua | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ Semua | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Editor | ✅ Semua | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Penulis | ✅ Sendiri | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Kontributor | ✅ Draft | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

## Article Workflow
```
Kontributor/Penulis → DRAFT → Submit → REVIEW → Editor approve → PUBLISHED
                                                  Editor reject → DRAFT
Admin/Super Admin → Bisa langsung PUBLISHED
```

---

## API Endpoints

### Public (tanpa auth)
- `GET /api/articles` - List artikel published
- `GET /api/articles/[slug]` - Detail artikel
- `GET /api/ads?position=HEADER_TOP` - Iklan aktif

### Admin (perlu auth)
- `GET/POST /api/admin/articles` - CRUD artikel
- `GET/PUT/DELETE /api/admin/articles/[id]`
- `GET/POST /api/admin/categories`
- `GET/PUT/DELETE /api/admin/categories/[id]`
- `GET/POST /api/admin/users`
- `GET/PUT/DELETE /api/admin/users/[id]`
- `GET/POST /api/admin/media` - Upload & list media
- `PUT/DELETE /api/admin/media/[id]`
- `GET/POST /api/admin/ads`
- `GET/PUT/DELETE /api/admin/ads/[id]`
- `GET/PUT /api/admin/settings` - Site settings
- `GET/PUT /api/admin/seo` - SEO settings
- `GET/POST/PUT /api/admin/layout` - Layout widgets
- `PUT/DELETE /api/admin/layout/[id]`
- `GET/POST /api/admin/menus` - Menu management
- `GET/POST /api/admin/tags`
- `GET /api/admin/dashboard` - Dashboard stats
- `GET/PUT /api/admin/profile` - Update profil sendiri

---

## URL Structure (SEO-friendly)
- `jepangupdates.com/nama-artikel` ← Artikel langsung di root
- `jepangupdates.com/kategori/nama-kategori`
- `jepangupdates.com/search?q=keyword`
- `jepangupdates.com/admin` ← Dashboard

---

## Deploy ke VPS

### 1. Install PostgreSQL di VPS
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb japanupdates
sudo -u postgres psql -c "CREATE USER japanuser WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE japanupdates TO japanuser;"
```

### 2. Clone & Setup
```bash
git clone <repo-url>
cd japanupdates-v2
npm install
cp .env.example .env
# Edit .env dengan kredensial yang benar
npm run db:push
npm run db:seed
npm run build
```

### 3. Jalankan dengan PM2
```bash
npm install -g pm2
pm2 start npm --name "japanupdates" -- start
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name jepangupdates.com www.jepangupdates.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files directly via Nginx (faster)
    location /uploads/ {
        alias /path/to/japanupdates-v2/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5. SSL dengan Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d jepangupdates.com -d www.jepangupdates.com
```
