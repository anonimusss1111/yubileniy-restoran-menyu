import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  try {
    const nets = os.networkInterfaces();
    const ips: string[] = [];
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (net.family === "IPv4" && !net.internal) {
          ips.push(net.address);
        }
      }
    }
    const port = process.env.PORT || "3000";
    return NextResponse.json({ ok: true, data: { ips, port } });
  } catch {
    return NextResponse.json({ ok: false, error: { message: "Failed" } }, { status: 500 });
  }
}
