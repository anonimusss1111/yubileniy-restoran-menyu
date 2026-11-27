import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const urlIdx = args.indexOf("--url");
const url = urlIdx >= 0 ? args[urlIdx + 1] : "";

if (!url || !url.startsWith("https://")) {
  console.error("Usage: npm run render:env -- --url https://your-service.onrender.com");
  process.exit(1);
}

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const out = [
  `DATABASE_URL=${env.DATABASE_URL || ""}`,
  `DIRECT_URL=${env.DIRECT_URL || ""}`,
  `JWT_SECRET=${env.JWT_SECRET || ""}`,
  `NEXT_PUBLIC_APP_URL=${url}`,
  `STORAGE_PROVIDER=cloudinary`,
  `CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME || ""}`,
  `CLOUDINARY_API_KEY=${env.CLOUDINARY_API_KEY || ""}`,
  `CLOUDINARY_API_SECRET=${env.CLOUDINARY_API_SECRET || ""}`,
  `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME || ""}`,
  `NODE_VERSION=22`,
  `NODE_OPTIONS=--max-old-space-size=460`,
].join("\n");

const outPath = path.join(process.cwd(), "render.env");
fs.writeFileSync(outPath, out);
console.log(`✅ render.env created for ${url}`);
console.log("⚠️  This file contains secrets. Do not commit it. Delete after use: npm run render:env:clean");
