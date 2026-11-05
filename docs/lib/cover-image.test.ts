import { describe, expect, it } from "bun:test";
import path from "node:path";
import {
  normalizeCoverImageBase,
  publicPathToFilePath,
  resolveCoverImagePaths,
} from "./cover-image";

describe("cover image path normalization", () => {
  it("keeps extensionless public paths as canonical bases", () => {
    expect(normalizeCoverImageBase("/og/default")).toBe("/og/default");
    expect(resolveCoverImagePaths("/og/default")).toEqual({
      base: "/og/default",
      png: "/og/default.png",
      webp: "/og/default.webp",
    });
  });

  it("strips supported image extensions", () => {
    for (const extension of ["png", "webp", "jpg", "jpeg", "avif", "PNG", "WeBp", "JPEG"]) {
      expect(normalizeCoverImageBase(`/og/default.${extension}`)).toBe("/og/default");
    }
  });

  it("normalizes relative frontmatter values to public paths", () => {
    expect(resolveCoverImagePaths("og/default.webp")).toEqual({
      base: "/og/default",
      png: "/og/default.png",
      webp: "/og/default.webp",
    });
  });

  it("rejects empty, root-only, null, backslash, and dot-segment paths", () => {
    const nullByte = String.fromCharCode(0);
    const invalidPaths = [
      "",
      "   ",
      "/",
      "///",
      `/og/${nullByte}default`,
      "\\og\\default",
      ".",
      "..",
      "./og/default",
      "../og/default",
      "/og/./default",
      "/og/../default",
      "/og/default/.",
      "/og/default/..",
    ];

    for (const invalidPath of invalidPaths) {
      expect(() => normalizeCoverImageBase(invalidPath)).toThrow();
    }
  });
});

describe("public cover image filesystem paths", () => {
  const publicDir = path.resolve("tmp", "seed-docs", "public");

  it("resolves ordinary nested public paths and supported extensions", () => {
    for (const value of [
      "/og/nested/card",
      "/og/nested/card.png",
      "/og/nested/card.webp",
      "/og/nested/card.jpg",
      "/og/nested/card.jpeg",
      "/og/nested/card.avif",
    ]) {
      expect(publicPathToFilePath(value, publicDir)).toBe(
        path.resolve(publicDir, value.replace(/^\/+/, "")),
      );
    }
  });

  it("rejects direct traversal into a sibling whose name shares the public prefix", () => {
    expect(() => publicPathToFilePath("../public-evil/cover.png", publicDir)).toThrow();
  });
});
