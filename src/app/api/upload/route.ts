import { NextResponse } from "next/server";
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

    const webp = await sharp(buffer)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer();

    const dataUrl = `data:image/webp;base64,${webp.toString("base64")}`;

    return NextResponse.json({ ok: true, url: dataUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message || "Upload xatosi" } }, { status: 500 });
  }
}
