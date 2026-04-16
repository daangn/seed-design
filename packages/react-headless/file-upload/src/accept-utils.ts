import type { FileAcceptType } from "./types";

/**
 * Image extension set sourced from mime-db (MIT license).
 * @see https://www.npmjs.com/package/mime
 */
const IMAGE_EXTENSIONS = new Set([
  "exr",
  "apng",
  "avci",
  "avcs",
  "avif",
  "bmp",
  "dib",
  "cgm",
  "drle",
  "dpx",
  "emf",
  "fits",
  "g3",
  "gif",
  "heic",
  "heics",
  "heif",
  "heifs",
  "hej2",
  "ief",
  "jaii",
  "jais",
  "jls",
  "jp2",
  "jpg2",
  "jpg",
  "jpeg",
  "jpe",
  "jph",
  "jhc",
  "jpm",
  "jpgm",
  "jpx",
  "jpf",
  "jxl",
  "jxr",
  "jxra",
  "jxrs",
  "jxs",
  "jxsc",
  "jxsi",
  "jxss",
  "ktx",
  "ktx2",
  "jfif",
  "png",
  "sgi",
  "svg",
  "svgz",
  "t38",
  "tif",
  "tiff",
  "tfx",
  "webp",
  "wmf",
]);

export function isImageAccept(pattern: string): boolean {
  if (pattern.startsWith("image/")) return true;

  if (pattern.startsWith(".")) return IMAGE_EXTENSIONS.has(pattern.slice(1).toLowerCase());

  return false;
}

/**
 * Determines the file accept type category based on accept patterns.
 * Returns "image" if all patterns are image-related, undefined otherwise.
 */
export function getFileAcceptType(accept: string | string[] | undefined): FileAcceptType {
  if (!accept) return undefined;

  const list = Array.isArray(accept) ? accept : accept.split(",").map((s) => s.trim());

  return list.every(isImageAccept) ? "image" : undefined;
}
