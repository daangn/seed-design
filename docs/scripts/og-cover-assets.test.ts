import { afterEach, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { COVER_IMAGE_HEIGHT, COVER_IMAGE_WIDTH } from "../lib/cover-image";
import {
  formatGenerationPlan,
  formatValidationResult,
  planOgCoverAssetGeneration,
  readImageDimensions,
  resolveDocsWorkspace,
  validateOgCoverAssets,
} from "./og-cover-assets";

const tempDirs: string[] = [];

afterEach(() => {
  for (const tempDir of tempDirs.splice(0)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

function createWorkspace() {
  const root = mkdtempSync(path.join(tmpdir(), "seed-og-cover-"));
  tempDirs.push(root);
  const docsRoot = path.join(root, "docs");
  const contentPath = path.join(docsRoot, "content", "get-started", "index.mdx");
  mkdirSync(path.dirname(contentPath), { recursive: true });
  writeFileSync(
    contentPath,
    [
      "---",
      "title: Get Started",
      "description: Start with SEED Design.",
      "coverImage: /og/test",
      "---",
      "",
      "# Get Started",
    ].join("\n"),
  );
  return { root, docsRoot, workspace: { ...resolveDocsWorkspace(root), requiredCoverImages: [] } };
}

function writeCoverPair(
  docsRoot: string,
  width = COVER_IMAGE_WIDTH,
  height = COVER_IMAGE_HEIGHT,
  name = "test",
) {
  writePngHeaderForTest(path.join(docsRoot, "public", "og", `${name}.png`), width, height);
  writeWebpHeaderForTest(path.join(docsRoot, "public", "og", `${name}.webp`), width, height);
}

function writePngHeaderForTest(filePath: string, width: number, height: number) {
  const buffer = Buffer.alloc(24);
  buffer.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, buffer);
}

function writeWebpHeaderForTest(filePath: string, width: number, height: number) {
  const widthMinusOne = width - 1;
  const heightMinusOne = height - 1;
  const buffer = Buffer.alloc(25);
  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(17, 4);
  buffer.write("WEBP", 8, "ascii");
  buffer.write("VP8L", 12, "ascii");
  buffer.writeUInt32LE(5, 16);
  buffer[20] = 0x2f;
  buffer[21] = widthMinusOne & 0xff;
  buffer[22] = ((widthMinusOne >> 8) & 0x3f) | ((heightMinusOne & 0x03) << 6);
  buffer[23] = (heightMinusOne >> 2) & 0xff;
  buffer[24] = (heightMinusOne >> 10) & 0x0f;
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, buffer);
}

describe("OG cover image dimensions", () => {
  it("reads PNG and WebP dimensions from headers", () => {
    const { docsRoot } = createWorkspace();
    writeCoverPair(docsRoot);

    expect(readImageDimensions(path.join(docsRoot, "public", "og", "test.png"))).toEqual({
      width: COVER_IMAGE_WIDTH,
      height: COVER_IMAGE_HEIGHT,
    });
    expect(readImageDimensions(path.join(docsRoot, "public", "og", "test.webp"))).toEqual({
      width: COVER_IMAGE_WIDTH,
      height: COVER_IMAGE_HEIGHT,
    });
  });
});

describe("OG cover image validation", () => {
  it("passes when referenced PNG and WebP cover assets exist at 3200x1680", () => {
    const { docsRoot, workspace } = createWorkspace();
    writeCoverPair(docsRoot);

    const result = validateOgCoverAssets(workspace);

    expect(result.errors).toEqual([]);
    expect(formatValidationResult(result)).toContain("validation passed (1 cover)");
  });

  it("includes required non-frontmatter covers in validation", () => {
    const { docsRoot, root } = createWorkspace();
    writeCoverPair(docsRoot);
    writeCoverPair(docsRoot, COVER_IMAGE_WIDTH, COVER_IMAGE_HEIGHT, "default");
    writeCoverPair(docsRoot, COVER_IMAGE_WIDTH, COVER_IMAGE_HEIGHT, "updates");

    const result = validateOgCoverAssets(resolveDocsWorkspace(root));

    expect(result.errors).toEqual([]);
    expect(formatValidationResult(result)).toContain("validation passed (3 covers)");
    expect(result.references.map((reference) => reference.base)).toEqual([
      "/og/default",
      "/og/updates",
      "/og/test",
    ]);
  });

  it("fails when the referenced PNG is missing", () => {
    const { docsRoot, workspace } = createWorkspace();
    writeWebpHeaderForTest(path.join(docsRoot, "public", "og", "test.webp"), 3200, 1680);

    const result = validateOgCoverAssets(workspace);

    expect(result.errors.map((error) => error.message)).toContain(
      `Missing PNG cover image: ${path.join(docsRoot, "public", "og", "test.png")}`,
    );
  });

  it("fails when the referenced WebP is missing", () => {
    const { docsRoot, workspace } = createWorkspace();
    writePngHeaderForTest(path.join(docsRoot, "public", "og", "test.png"), 3200, 1680);

    const result = validateOgCoverAssets(workspace);

    expect(result.errors.map((error) => error.message)).toContain(
      `Missing WebP cover image: ${path.join(docsRoot, "public", "og", "test.webp")}`,
    );
  });

  it("fails when both referenced formats are missing", () => {
    const { docsRoot, workspace } = createWorkspace();

    const result = validateOgCoverAssets(workspace);

    expect(result.errors.map((error) => error.message)).toEqual([
      `Missing PNG cover image: ${path.join(docsRoot, "public", "og", "test.png")}`,
      `Missing WebP cover image: ${path.join(docsRoot, "public", "og", "test.webp")}`,
    ]);
  });

  it("fails when either referenced format has non-standard dimensions", () => {
    const { docsRoot, workspace } = createWorkspace();
    writeCoverPair(docsRoot, 1600, 840);

    const result = validateOgCoverAssets(workspace);

    expect(result.errors.map((error) => error.message)).toEqual([
      `PNG cover image must be 3200x1680, got 1600x840: ${path.join(docsRoot, "public", "og", "test.png")}`,
      `WebP cover image must be 3200x1680, got 1600x840: ${path.join(docsRoot, "public", "og", "test.webp")}`,
    ]);
  });

  it("rejects traversal frontmatter even when a matching pair exists outside public", () => {
    const { docsRoot, workspace } = createWorkspace();
    const outsideBase = path.join(docsRoot, "outside");
    writePngHeaderForTest(`${outsideBase}.png`, COVER_IMAGE_WIDTH, COVER_IMAGE_HEIGHT);
    writeWebpHeaderForTest(`${outsideBase}.webp`, COVER_IMAGE_WIDTH, COVER_IMAGE_HEIGHT);
    writeFileSync(
      path.join(docsRoot, "content", "get-started", "index.mdx"),
      [
        "---",
        "title: Get Started",
        "description: Start with SEED Design.",
        "coverImage: ../outside",
        "---",
      ].join("\n"),
    );

    expect(() => validateOgCoverAssets(workspace)).toThrow();
  });

  it("rejects empty frontmatter instead of silently skipping validation", () => {
    const { docsRoot, workspace } = createWorkspace();
    writeFileSync(
      path.join(docsRoot, "content", "get-started", "index.mdx"),
      [
        "---",
        "title: Get Started",
        "description: Start with SEED Design.",
        'coverImage: "   "',
        "---",
      ].join("\n"),
    );

    expect(() => validateOgCoverAssets(workspace)).toThrow();
  });

  it("rejects traversal in required cover references before reading outside public", () => {
    const { docsRoot, workspace } = createWorkspace();
    writeCoverPair(docsRoot);
    const outsideBase = path.join(docsRoot, "outside");
    writePngHeaderForTest(`${outsideBase}.png`, COVER_IMAGE_WIDTH, COVER_IMAGE_HEIGHT);
    writeWebpHeaderForTest(`${outsideBase}.webp`, COVER_IMAGE_WIDTH, COVER_IMAGE_HEIGHT);

    expect(() =>
      validateOgCoverAssets({
        ...workspace,
        requiredCoverImages: [{ sourceFile: "required", value: "../outside" }],
      }),
    ).toThrow();
  });
});

describe("OG cover image generation planning", () => {
  it("plans a lossless WebP sidecar when only the PNG exists", () => {
    const { docsRoot, workspace } = createWorkspace();
    writePngHeaderForTest(path.join(docsRoot, "public", "og", "test.png"), 3200, 1680);

    const plan = planOgCoverAssetGeneration(workspace);

    expect(plan.errors).toEqual([]);
    expect(plan.actions).toEqual([
      {
        base: "/og/test",
        sourceFiles: ["content/get-started/index.mdx"],
        sourceFilePath: path.join(docsRoot, "public", "og", "test.png"),
        targetFilePath: path.join(docsRoot, "public", "og", "test.webp"),
        targetFormat: "webp",
      },
    ]);
    expect(formatGenerationPlan(plan)).toContain("test.png ->");
  });

  it("plans a PNG sidecar when only the WebP exists", () => {
    const { docsRoot, workspace } = createWorkspace();
    writeWebpHeaderForTest(path.join(docsRoot, "public", "og", "test.webp"), 3200, 1680);

    const plan = planOgCoverAssetGeneration(workspace);

    expect(plan.errors).toEqual([]);
    expect(plan.actions).toEqual([
      {
        base: "/og/test",
        sourceFiles: ["content/get-started/index.mdx"],
        sourceFilePath: path.join(docsRoot, "public", "og", "test.webp"),
        targetFilePath: path.join(docsRoot, "public", "og", "test.png"),
        targetFormat: "png",
      },
    ]);
  });

  it("fails planning when neither side of the pair exists", () => {
    const { workspace } = createWorkspace();

    const plan = planOgCoverAssetGeneration(workspace);

    expect(plan.actions).toEqual([]);
    expect(plan.errors.map((error) => error.message)).toEqual([
      expect.stringContaining("Missing PNG and WebP cover image pair"),
    ]);
  });
});
