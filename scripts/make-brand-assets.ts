import sharp from "sharp";
import path from "path";
import fs from "fs";

const src = path.join(process.cwd(), "public/images/logo-source.jpg");
const outDir = path.join(process.cwd(), "public/brand");

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  // Stats for palette
  const stats = await sharp(src).stats();
  console.log("Dominant colors (approximate):");
  console.log("  Dominant:", stats.dominant);
  console.log("  Channels mean:", stats.channels.map((c) => Math.round(c.mean)));

  // Circular crop + resize
  const size = 512;
  const circleSvg = Buffer.from(
    `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`
  );

  const rounded = await sharp(src)
    .resize(size, size, { fit: "cover" })
    .composite([{ input: circleSvg, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(rounded).webp({ quality: 90 }).toFile(path.join(outDir, "logo-512.webp"));
  await sharp(rounded).resize(192).png().toFile(path.join(outDir, "logo-192.png"));
  await sharp(rounded).resize(64).webp({ quality: 90 }).toFile(path.join(outDir, "logo-64.webp"));

  // Favicon-ish
  await sharp(rounded).resize(32).png().toFile(path.join(outDir, "favicon-32.png"));
  await sharp(rounded).resize(180).png().toFile(path.join(process.cwd(), "src/app/apple-icon.png"));
  await sharp(rounded).resize(32).png().toFile(path.join(process.cwd(), "src/app/icon.png"));

  // OG image
  const og = await sharp({
    create: { width: 1200, height: 630, channels: 3, background: { r: 31, g: 8, b: 9 } },
  })
    .composite([
      {
        input: await sharp(rounded).resize(280).png().toBuffer(),
        gravity: "center",
      },
    ])
    .jpeg({ quality: 85 })
    .toFile(path.join(outDir, "og-image.jpg"));

  console.log("Brand assets generated in public/brand/");
}

main().catch(console.error);
