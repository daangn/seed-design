import { describe, expect, it } from "bun:test";
import { summarizeGenericToolOutput } from "./tool-result-renderer";

describe("summarizeGenericToolOutput", () => {
  it("extracts string content from generic output", () => {
    const summary = summarizeGenericToolOutput("read_doc", { content: "문서 본문" });

    expect(summary.isError).toBe(false);
    expect(summary.body).toBe("문서 본문");
  });

  it("marks error output", () => {
    const summary = summarizeGenericToolOutput("update_doc", { error: "권한이 없어요." });

    expect(summary.isError).toBe(true);
    expect(summary.body).toContain("권한이 없어요.");
  });
});
