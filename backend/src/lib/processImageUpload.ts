import crypto from 'node:crypto';
import sharp from 'sharp';

const MAX_INPUT_PIXELS = 40_000_000;
const ALLOWED_INPUT_FORMATS = new Set(['jpeg', 'png', 'webp', 'heif']);

export interface ProcessedImage {
  data: Buffer;
  filename: string;
}

export async function processImageUpload(input: Buffer): Promise<ProcessedImage> {
  const image = sharp(input, {
    failOn: 'error',
    limitInputPixels: MAX_INPUT_PIXELS,
  });
  const metadata = await image.metadata();

  if (!metadata.format || !ALLOWED_INPUT_FORMATS.has(metadata.format)) {
    throw new Error('Only valid JPEG, PNG, WEBP, or AVIF images are allowed');
  }

  // Re-encoding proves the input is decodable, strips embedded metadata, and
  // ensures client-controlled bytes and filename extensions are never served.
  const data = await image.rotate().webp({ quality: 85 }).toBuffer();
  const filename = `${Date.now()}-${crypto.randomBytes(12).toString('hex')}.webp`;

  return { data, filename };
}
