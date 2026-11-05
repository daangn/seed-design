import { existsSync } from "node:fs";
import path from "node:path";

export const COVER_IMAGE_WIDTH = 3200;
export const COVER_IMAGE_HEIGHT = 1680;

const COVER_IMAGE_EXTENSION_RE = /\.(png|webp|jpe?g|avif)$/i;
export const COVER_IMAGE_PATH_ERROR_MESSAGE =
  "Cover image must be a non-empty public path without null bytes, backslashes, or dot segments.";

export interface CoverImagePaths {
  base: string;
  png: string;
  webp: string;
}

export function isValidCoverImagePath(coverImage: string): boolean {
  const trimmedPath = coverImage.trim();
  if (trimmedPath.includes(String.fromCharCode(0)) || trimmedPath.includes("\\")) {
    return false;
  }

  const base = trimmedPath.replace(COVER_IMAGE_EXTENSION_RE, "");
  if (base === "" || /^\/+$/u.test(base)) {
    return false;
  }

  return !base.split("/").some((segment) => segment === "." || segment === "..");
}

function assertValidCoverImagePath(coverImage: string): void {
  if (!isValidCoverImagePath(coverImage)) {
    throw new Error(`${COVER_IMAGE_PATH_ERROR_MESSAGE} Received: ${JSON.stringify(coverImage)}`);
  }
}

export function normalizeCoverImageBase(coverImage: string): string {
  assertValidCoverImagePath(coverImage);
  const base = coverImage.trim().replace(COVER_IMAGE_EXTENSION_RE, "");
  return base.startsWith("/") ? base : `/${base}`;
}

export function resolveCoverImagePaths(coverImage: string): CoverImagePaths {
  const base = normalizeCoverImageBase(coverImage);
  return {
    base,
    png: `${base}.png`,
    webp: `${base}.webp`,
  };
}

export function resolveDocsRoot(cwd = process.cwd()): string {
  if (existsSync(path.join(cwd, "content")) && existsSync(path.join(cwd, "public"))) {
    return cwd;
  }

  return path.join(cwd, "docs");
}

export function resolveDocsPublicDir(cwd = process.cwd()): string {
  return path.join(resolveDocsRoot(cwd), "public");
}

export function publicPathToFilePath(
  publicPath: string,
  publicDir = resolveDocsPublicDir(),
): string {
  assertValidCoverImagePath(publicPath);

  const resolvedPublicDir = path.resolve(publicDir);
  const filePath = path.resolve(resolvedPublicDir, publicPath.replace(/^\/+/, ""));
  const relativePath = path.relative(resolvedPublicDir, filePath);
  const escapesPublicDir =
    path.isAbsolute(relativePath) ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`);

  if (escapesPublicDir) {
    throw new Error(
      `${COVER_IMAGE_PATH_ERROR_MESSAGE} Resolved outside public directory: ${JSON.stringify(publicPath)}`,
    );
  }

  return filePath;
}

export function coverImageFileExists(publicPath: string, publicDir?: string): boolean {
  return existsSync(publicPathToFilePath(publicPath, publicDir));
}
