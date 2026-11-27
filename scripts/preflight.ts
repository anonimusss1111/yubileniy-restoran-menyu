import fs from "fs";
import path from "path";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file not found");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const WEAK_PASSWORDS = ["admin123", "password", "123456", "admin", "qwerty"];

function check(name: string, ok: boolean, hint = "") {
  console.log(`${ok ? "✅" : "❌"} ${name}${hint ? ` (${hint})` : ""}`);
  return ok;
}

const env = loadEnv();
let allOk = true;

allOk = check("DATABASE_URL is postgres", env.DATABASE_URL?.startsWith("postgres"), "host: " + (env.DATABASE_URL?.split("@")[1]?.split("/")[0] || "?")) && allOk;
allOk = check("DATABASE_URL has -pooler", env.DATABASE_URL?.includes("-pooler")) && allOk;
allOk = check("DATABASE_URL has sslmode=require", env.DATABASE_URL?.includes("sslmode=require")) && allOk;
allOk = check("DIRECT_URL is postgres", env.DIRECT_URL?.startsWith("postgres")) && allOk;
allOk = check("DIRECT_URL no -pooler", !env.DIRECT_URL?.includes("-pooler")) && allOk;
allOk = check("JWT_SECRET >= 32 chars", (env.JWT_SECRET?.length || 0) >= 32 && !env.JWT_SECRET?.includes("change-this") && !env.JWT_SECRET?.includes("your-super")) && allOk;
allOk = check("ADMIN_PASSWORD strong", (env.ADMIN_PASSWORD?.length || 0) >= 12 && !WEAK_PASSWORDS.includes(env.ADMIN_PASSWORD || "")) && allOk;
allOk = check("NEXT_PUBLIC_APP_URL is https", env.NEXT_PUBLIC_APP_URL?.startsWith("https://") && !env.NEXT_PUBLIC_APP_URL?.includes("localhost")) && allOk;
allOk = check("STORAGE_PROVIDER = cloudinary", env.STORAGE_PROVIDER === "cloudinary") && allOk;
allOk = check("CLOUDINARY vars present", !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET)) && allOk;

if (!allOk) {
  console.error("\n❌ Preflight failed. Fix the items above.");
  process.exit(1);
}
console.log("\n✅ All checks passed");
