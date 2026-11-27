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
