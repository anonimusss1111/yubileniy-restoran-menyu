import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    execSync("npx prisma db push --accept-data-loss", { stdio: "pipe" });
    execSync("npx tsx prisma/seed.ts", { stdio: "pipe" });
    return NextResponse.json({ ok: true, message: "Schema pushed and seeded" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
