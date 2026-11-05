import { describe, it, expect } from "bun:test";
import { splitFileName } from "./utils";

describe("splitFileName", () => {
  it("should split a normal filename", () => {
    expect(splitFileName("document.pdf")).toEqual({
      basename: "document",
      extension: ".pdf",
    });
  });

  it("should handle multiple dots", () => {
    expect(splitFileName("my.file.name.txt")).toEqual({
      basename: "my.file.name",
      extension: ".txt",
    });
  });

  it("should handle no extension", () => {
    expect(splitFileName("README")).toEqual({
      basename: "README",
      extension: "",
    });
  });

  it("should handle dotfile", () => {
    expect(splitFileName(".gitignore")).toEqual({
      basename: ".gitignore",
      extension: "",
    });
  });

  it("should handle empty string", () => {
    expect(splitFileName("")).toEqual({
      basename: "",
      extension: "",
    });
  });

  it("should handle long extension", () => {
    expect(splitFileName("archive.tar.gz")).toEqual({
      basename: "archive.tar",
      extension: ".gz",
    });
  });
});
