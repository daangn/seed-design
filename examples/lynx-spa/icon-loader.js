import sharp from 'sharp';

const MONOCHROME_ICON_MAX_SIZE = 24 * 3;
const MONOCHROME_ICON_QUALITY = 90;
const ICON_MONOCHROME_PATH = '@karrotmarket/assets-monochrome/svg/';
const ICON_MULTICOLOR_PATH = '@karrotmarket/assets-multicolor/svg/';

async function iconLoader(source) {
  const callback = this.async();
  const resourcePath = this.resourcePath;

  if (
    !resourcePath.includes(ICON_MONOCHROME_PATH) &&
    !resourcePath.includes(ICON_MULTICOLOR_PATH)
  ) {
    return callback(null, source);
  }

  const size = MONOCHROME_ICON_MAX_SIZE;
  const quality = MONOCHROME_ICON_QUALITY;

  try {
    const buffer = await sharp(Buffer.from(source))
      .resize({
        width: size,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality })
      .toBuffer();

    const base64String = buffer.toString('base64');
    const dataUrl = `data:image/webp;base64,${base64String}`;

    callback(null, `export default "${dataUrl}"`);
  } catch (err) {
    callback(err);
  }
}

iconLoader.raw = true;

export default iconLoader;
