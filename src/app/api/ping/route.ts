import { NextResponse } from "next/server";

// Uptime pingers must use /api/ping (no DB) so Neon can scale to zero.
// Use /api/health only for manual checks.
export async function GET() {
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } }
  );
}
