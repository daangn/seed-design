import sharp from "sharp";
import type { LoaderContext } from "webpack";

const DEFAULT_MAX_SIZE = 24 * 3;
const DEFAULT_QUALITY = 90;

interface LoaderOptions {
  maxSize?: number;
  quality?: number;
}

async function lynxIconLoader(this: LoaderContext<LoaderOptions>, source: ArrayBuffer) {
  const callback = this.async();
  const options = this.getOptions();

  const size = options.maxSize ?? DEFAULT_MAX_SIZE;
  const quality = options.quality ?? DEFAULT_QUALITY;

  try {
    const buffer = await sharp(Buffer.from(source))
      .resize({
        width: size,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality })
      .toBuffer();

    const base64 = buffer.toString("base64");
    callback(null, `export default "data:image/webp;base64,${base64}";`);
  } catch (err: unknown) {
    callback(err as Error);
  }
}

lynxIconLoader.raw = true;

export default lynxIconLoader;
