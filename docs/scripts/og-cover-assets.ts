import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  COVER_IMAGE_HEIGHT,
  COVER_IMAGE_WIDTH,
  publicPathToFilePath,
  resolveCoverImagePaths,
  resolveDocsPublicDir,
  resolveDocsRoot,
} from "../lib/cover-image";

export interface DocsWorkspace {
  docsRoot: string;
  contentDir: string;
  publicDir: string;
  requiredCoverImages?: RequiredCoverImageReference[];
}

export interface RequiredCoverImageReference {
  sourceFile: string;
  value: string;
}

export interface CoverImageReference {
  sourceFile: string;
  value: string;
  base: string;
  png: string;
  webp: string;
  pngFilePath: string;
  webpFilePath: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CoverImageValidationError {
  base: string;
  sourceFiles: string[];
  message: string;
}

export interface CoverImageValidationResult {
  references: CoverImageReference[];
  errors: CoverImageValidationError[];
}

export type CoverImageFormat = "png" | "webp";

export interface CoverImageGenerationAction {
  base: string;
  sourceFiles: string[];
  sourceFilePath: string;
  targetFilePath: string;
  targetFormat: CoverImageFormat;
}

export interface CoverImageGenerationPlan {
  references: CoverImageReference[];
  actions: CoverImageGenerationAction[];
  errors: CoverImageValidationError[];
}

interface Frontmatter {
  coverImage?: unknown;
}

export const REQUIRED_OG_COVER_IMAGES: RequiredCoverImageReference[] = [
  { sourceFile: "lib/seo.ts", value: "/og/default" },
  { sourceFile: "app/updates/page.tsx", value: "/og/updates" },
];

export function resolveDocsWorkspace(cwd = process.cwd()): DocsWorkspace {
  const docsRoot = resolveDocsRoot(cwd);
  return {
    docsRoot,
    contentDir: path.join(docsRoot, "content"),
    publicDir: resolveDocsPublicDir(cwd),
  };
}

function collectMdxFiles(dir: string, base = ""): string[] {
  if (!existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const relPath = base ? `${base}/${entry}` : entry;
    if (statSync(fullPath).isDirectory()) {
      files.push(...collectMdxFiles(fullPath, relPath));
    } else if (entry.endsWith(".mdx")) {
      files.push(relPath);
    }
  }
  return files;
}

function createCoverImageReference(
  workspace: DocsWorkspace,
  sourceFile: string,
  value: string,
): CoverImageReference {
  const paths = resolveCoverImagePaths(value);

  return {
    sourceFile,
    value,
    base: paths.base,
    png: paths.png,
    webp: paths.webp,
    pngFilePath: publicPathToFilePath(paths.png, workspace.publicDir),
    webpFilePath: publicPathToFilePath(paths.webp, workspace.publicDir),
  };
}

export function collectCoverImageReferences(
  workspace = resolveDocsWorkspace(),
): CoverImageReference[] {
  const references: CoverImageReference[] = [];

  for (const reference of workspace.requiredCoverImages ?? REQUIRED_OG_COVER_IMAGES) {
    references.push(createCoverImageReference(workspace, reference.sourceFile, reference.value));
  }

  for (const relPath of collectMdxFiles(workspace.contentDir)) {
    const fullPath = path.join(workspace.contentDir, relPath);
    const frontmatter = matter(readFileSync(fullPath, "utf8")).data as Frontmatter;
    if (typeof frontmatter.coverImage !== "string") {
      continue;
    }

    references.push(
      createCoverImageReference(
        workspace,
        path.relative(workspace.docsRoot, fullPath),
        frontmatter.coverImage,
      ),
    );
  }

  return references;
}

export function groupCoverImageReferences(
  references: CoverImageReference[],
): Map<string, CoverImageReference[]> {
  const groups = new Map<string, CoverImageReference[]>();
  for (const reference of references) {
    const group = groups.get(reference.base) ?? [];
    group.push(reference);
    groups.set(reference.base, group);
  }
  return groups;
}

export function readImageDimensions(filePath: string): ImageDimensions {
  const buffer = readFileSync(filePath);

  if (isPng(buffer)) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (isWebp(buffer)) {
    return readWebpDimensions(buffer, filePath);
  }

  throw new Error(`Unsupported image format: ${filePath}`);
}

function isPng(buffer: Buffer): boolean {
  return (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer.toString("ascii", 1, 4) === "PNG" &&
    buffer.toString("ascii", 12, 16) === "IHDR"
  );
}

function isWebp(buffer: Buffer): boolean {
  return (
    buffer.length >= 25 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
}

function readWebpDimensions(buffer: Buffer, filePath: string): ImageDimensions {
  const chunkType = buffer.toString("ascii", 12, 16);

  if (chunkType === "VP8X") {
    return {
      width: 1 + readUInt24LE(buffer, 24),
      height: 1 + readUInt24LE(buffer, 27),
    };
  }

  if (chunkType === "VP8L") {
    const b0 = buffer[21];
    const b1 = buffer[22];
    const b2 = buffer[23];
    const b3 = buffer[24];
    return {
      width: 1 + (((b1 & 0x3f) << 8) | b0),
      height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
    };
  }

  if (chunkType === "VP8 ") {
    const frameStart = 20;
    const startCodeOffset = frameStart + 3;
    if (
      buffer.length >= frameStart + 10 &&
      buffer[startCodeOffset] === 0x9d &&
      buffer[startCodeOffset + 1] === 0x01 &&
      buffer[startCodeOffset + 2] === 0x2a
    ) {
      return {
        width: buffer.readUInt16LE(startCodeOffset + 3) & 0x3fff,
        height: buffer.readUInt16LE(startCodeOffset + 5) & 0x3fff,
      };
    }
  }

  throw new Error(`Unsupported WebP bitstream: ${filePath}`);
}

function readUInt24LE(buffer: Buffer, offset: number): number {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

export function validateOgCoverAssets(
  workspace = resolveDocsWorkspace(),
): CoverImageValidationResult {
  const references = collectCoverImageReferences(workspace);
  const errors: CoverImageValidationError[] = [];

  for (const [base, group] of groupCoverImageReferences(references)) {
    const representative = group[0];
    const sourceFiles = group.map((item) => item.sourceFile);
    const pngExists = existsSync(representative.pngFilePath);
    const webpExists = existsSync(representative.webpFilePath);

    if (!pngExists) {
      errors.push({
        base,
        sourceFiles,
        message: `Missing PNG cover image: ${representative.pngFilePath}`,
      });
    }

    if (!webpExists) {
      errors.push({
        base,
        sourceFiles,
        message: `Missing WebP cover image: ${representative.webpFilePath}`,
      });
    }

    if (pngExists) {
      pushDimensionError(errors, representative.pngFilePath, "PNG", base, sourceFiles);
    }

    if (webpExists) {
      pushDimensionError(errors, representative.webpFilePath, "WebP", base, sourceFiles);
    }
  }

  return { references, errors };
}

export function planOgCoverAssetGeneration(
  workspace = resolveDocsWorkspace(),
): CoverImageGenerationPlan {
  const references = collectCoverImageReferences(workspace);
  const actions: CoverImageGenerationAction[] = [];
  const errors: CoverImageValidationError[] = [];

  for (const [base, group] of groupCoverImageReferences(references)) {
    const representative = group[0];
    const sourceFiles = group.map((item) => item.sourceFile);
    const pngExists = existsSync(representative.pngFilePath);
    const webpExists = existsSync(representative.webpFilePath);

    if (!pngExists && !webpExists) {
      errors.push({
        base,
        sourceFiles,
        message: `Missing PNG and WebP cover image pair: ${representative.pngFilePath}, ${representative.webpFilePath}`,
      });
      continue;
    }

    if (pngExists && !webpExists) {
      actions.push({
        base,
        sourceFiles,
        sourceFilePath: representative.pngFilePath,
        targetFilePath: representative.webpFilePath,
        targetFormat: "webp",
      });
    }

    if (webpExists && !pngExists) {
      actions.push({
        base,
        sourceFiles,
        sourceFilePath: representative.webpFilePath,
        targetFilePath: representative.pngFilePath,
        targetFormat: "png",
      });
    }
  }

  return { references, actions, errors };
}

function pushDimensionError(
  errors: CoverImageValidationError[],
  filePath: string,
  format: "PNG" | "WebP",
  base: string,
  sourceFiles: string[],
) {
  const dimensions = readImageDimensions(filePath);
  if (dimensions.width === COVER_IMAGE_WIDTH && dimensions.height === COVER_IMAGE_HEIGHT) {
    return;
  }

  errors.push({
    base,
    sourceFiles,
    message: `${format} cover image must be ${COVER_IMAGE_WIDTH}x${COVER_IMAGE_HEIGHT}, got ${dimensions.width}x${dimensions.height}: ${filePath}`,
  });
}

export function formatValidationResult(result: CoverImageValidationResult): string {
  if (result.errors.length === 0) {
    const count = groupCoverImageReferences(result.references).size;
    return `OG cover image validation passed (${count} cover${count === 1 ? "" : "s"}).`;
  }

  return [
    "OG cover image validation failed:",
    ...result.errors.map((error) => {
      const sources = error.sourceFiles.join(", ");
      return `- ${error.message} (referenced by ${sources})`;
    }),
    "Run `bun docs:images:og:generate` to create missing pairs from existing PNG/WebP sources.",
  ].join("\n");
}

export function formatGenerationPlan(plan: CoverImageGenerationPlan): string {
  if (plan.errors.length > 0) {
    return [
      "OG cover image generation cannot continue:",
      ...plan.errors.map((error) => {
        const sources = error.sourceFiles.join(", ");
        return `- ${error.message} (referenced by ${sources})`;
      }),
    ].join("\n");
  }

  if (plan.actions.length === 0) {
    const count = groupCoverImageReferences(plan.references).size;
    return `OG cover image pairs are already complete (${count} cover${count === 1 ? "" : "s"}).`;
  }

  return [
    "OG cover image generation plan:",
    ...plan.actions.map((action) => {
      const sources = action.sourceFiles.join(", ");
      return `- ${action.sourceFilePath} -> ${action.targetFilePath} (${action.targetFormat}, referenced by ${sources})`;
    }),
  ].join("\n");
}
