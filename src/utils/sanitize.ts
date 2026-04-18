import sharp from "sharp";
import fs from "fs";

export async function sanitizeImage(path: string) {
  const buffer = await sharp(path)
    .jpeg({ quality: 90 })
    .toBuffer();

  fs.writeFileSync(path, buffer);
}