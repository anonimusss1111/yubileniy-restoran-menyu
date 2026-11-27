# Deploy qo‘llanmasi (Netlify + Neon + Cloudinary)

## 1. Neon PostgreSQL
1. https://neon.tech da hisob oching
2. Yangi loyiha yarating (region: eng yaqin)
3. Connection string larni oling:
   - **Pooled** → `DATABASE_URL`
   - **Direct** → `DIRECT_URL`

## 2. Cloudinary
1. https://cloudinary.com da hisob oching
2. Dashboard dan oling: Cloud Name, API Key, API Secret

## 3. Maxfiy kalitlar
```bash
openssl rand -base64 48
```
Natijani `JWT_SECRET` ga qo‘ying. Kuchli admin parol tanlang.

## 4. Netlify
1. https://app.netlify.com da yangi site yarating (GitHub repo ulangan)
2. Environment variables qo‘shing (Site settings → Environment):
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` (deploydan keyin aniq URL)
   - `STORAGE_PROVIDER=cloudinary`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

## 5. Migratsiya va seed
```bash
DIRECT_URL="your-direct-url" npx prisma migrate deploy
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed:prod
```

## 6. Birinchi deploy
Netlify avtomatik deploy qiladi. Keyin `NEXT_PUBLIC_APP_URL` ni to‘g‘ri URLga o‘rnating va qayta deploy qiling.

## Creditlar
Netlify Free: 300 credit/oy. Har production deploy ≈ 15 credit. O‘zgarishlarni to‘plang, preview deploylar bepul.

## Backup
```bash
pg_dump "$DIRECT_URL" > backup.sql
```

## Render (muqobil hosting)

### Qadamlar
1. https://render.com da hisob oching (GitHub bilan)
2. **New → Web Service** → GitHub reponi tanlang
3. Sozlamalar:
   - Runtime: **Node**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free**
4. Environment Variables qo‘shing (`.env.example` dagi ro‘yxat). `STORAGE_PROVIDER=cloudinary` qiling.
5. Deploy qiling.

### Cold start
Free planda 15 daqiqa faoliyatsizlikdan keyin server uxlaydi. Birinchi so‘rov ~1 daqiqa kutadi. Buni oldini olish uchun:

### Free pinger
https://cron-job.org yoki https://uptimerobot.com da har 10 daqiqada:
```
GET https://SIZNING-URL.onrender.com/api/ping
```
**Muhim:** `/api/ping` ishlating (baza ulanmaydi, Neon uxlay oladi). `/api/health` ni faqat qo‘lda tekshirish uchun ishlating.

### Ogohlantirish
Render’ning bepul Postgres bazasini **ishlatmang** — 30 kundan keyin o‘chadi. Baza uchun **Neon** ni saqlang.
