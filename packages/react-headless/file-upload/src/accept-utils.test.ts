import { describe, expect, it } from "bun:test";
import { isImageAccept, getFileAcceptType } from "./accept-utils";

describe("isImageAccept", () => {
  it("should return true for image/* MIME patterns", () => {
    expect(isImageAccept("image/*")).toBe(true);
    expect(isImageAccept("image/png")).toBe(true);
    expect(isImageAccept("image/jpeg")).toBe(true);
    expect(isImageAccept("image/webp")).toBe(true);
    expect(isImageAccept("image/heic")).toBe(true);
  });

  it("should return true for image file extensions", () => {
    expect(isImageAccept(".jpg")).toBe(true);
    expect(isImageAccept(".jpeg")).toBe(true);
    expect(isImageAccept(".png")).toBe(true);
    expect(isImageAccept(".gif")).toBe(true);
    expect(isImageAccept(".webp")).toBe(true);
    expect(isImageAccept(".avif")).toBe(true);
    expect(isImageAccept(".heic")).toBe(true);
    expect(isImageAccept(".svg")).toBe(true);
    expect(isImageAccept(".bmp")).toBe(true);
    expect(isImageAccept(".tiff")).toBe(true);
  });

  it("should be case-insensitive for extensions", () => {
    expect(isImageAccept(".JPG")).toBe(true);
    expect(isImageAccept(".Png")).toBe(true);
    expect(isImageAccept(".HEIC")).toBe(true);
  });

  it("should return false for non-image MIME patterns", () => {
    expect(isImageAccept("application/pdf")).toBe(false);
    expect(isImageAccept("text/plain")).toBe(false);
    expect(isImageAccept("video/mp4")).toBe(false);
  });

  it("should return false for non-image file extensions", () => {
    expect(isImageAccept(".pdf")).toBe(false);
    expect(isImageAccept(".txt")).toBe(false);
    expect(isImageAccept(".zip")).toBe(false);
    expect(isImageAccept(".mp4")).toBe(false);
  });

  it("should return false for unknown patterns", () => {
    expect(isImageAccept("foo")).toBe(false);
    expect(isImageAccept("")).toBe(false);
  });
});

describe("getFileAcceptType", () => {
  it("should return undefined when accept is undefined", () => {
    expect(getFileAcceptType(undefined)).toBeUndefined();
  });

  it("should return 'image' for image-only MIME string", () => {
    expect(getFileAcceptType("image/*")).toBe("image");
    expect(getFileAcceptType("image/png")).toBe("image");
  });

  it("should return 'image' for image-only extension string", () => {
    expect(getFileAcceptType(".jpg,.png,.gif")).toBe("image");
  });

  it("should return 'image' for mixed image MIME and extensions", () => {
    expect(getFileAcceptType("image/*,.heic")).toBe("image");
    expect(getFileAcceptType(".jpg,image/png")).toBe("image");
  });

  it("should return 'image' for image-only array", () => {
    expect(getFileAcceptType(["image/*"])).toBe("image");
    expect(getFileAcceptType([".jpg", ".png", ".gif"])).toBe("image");
    expect(getFileAcceptType(["image/*", ".heic"])).toBe("image");
  });

  it("should return undefined when mixed with non-image", () => {
    expect(getFileAcceptType(".pdf,image/png")).toBeUndefined();
    expect(getFileAcceptType(["image/*", ".pdf"])).toBeUndefined();
    expect(getFileAcceptType([".jpg", ".txt"])).toBeUndefined();
  });

  it("should return undefined for non-image only", () => {
    expect(getFileAcceptType(".pdf")).toBeUndefined();
    expect(getFileAcceptType("application/pdf")).toBeUndefined();
    expect(getFileAcceptType([".pdf", ".doc"])).toBeUndefined();
  });
});
