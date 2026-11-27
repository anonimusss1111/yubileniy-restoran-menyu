import sharp from "sharp";
import path from "path";

async function main() {
  const input = path.join(process.cwd(), "public/images/source-bg.jpg");
  for (const size of [640, 1280, 1920]) {
    await sharp(input)
      .resize(size)
      .webp({ quality: 78 })
      .toFile(path.join(process.cwd(), `public/images/bg-restaurant-${size}.webp`));
  }
  console.log("Optimized images created");
}
main().catch(console.error);
