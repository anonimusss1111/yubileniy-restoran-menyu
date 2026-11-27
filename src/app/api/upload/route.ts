import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ ok: false, error: { message: "Fayl yo‘q" } }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: { message: "Maksimal 5MB" } }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: { message: "Faqat rasm" } }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    await sharp(buffer)
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(uploadDir, filename));

    return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Upload xatosi" } }, { status: 500 });
  }
}
