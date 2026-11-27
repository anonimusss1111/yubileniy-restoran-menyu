# Yubileniy Restoran Digital Menu

QR Code Digital Restaurant Menu + Admin Dashboard for Uzbekistan market.

## Setup

1. Copy `.env.example` to `.env` and fill values.
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npx prisma db seed`
5. `npm run dev`

Default admin: admin@yubileniy.uz / admin123

## Features

- Customer mobile-first menu with i18n (UZ/RU/EN)
- Promo carousel
- Product details
- Selection (no payment)
- Waiter call
- Admin dashboard with CRUD
- QR generation
- Stop-list

## Decisions

- SQLite for local, switch to PostgreSQL by changing provider in schema.prisma
- Local uploads in public/uploads, can be replaced with Cloudinary via StorageProvider

See full spec in the original request for complete implementation details.

<!-- redeploy category filter -->
