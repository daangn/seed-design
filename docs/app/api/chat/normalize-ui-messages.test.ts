import { describe, expect, it } from "bun:test";
import { normalizeUIMessagesForValidation } from "./normalize-ui-messages";

describe("normalizeUIMessagesForValidation", () => {
  it("keeps already valid text-part messages", () => {
    const actual = normalizeUIMessagesForValidation([
      {
        id: "u1",
        role: "user",
        parts: [{ type: "text", text: "안녕" }],
      },
    ]);

    expect(actual).toEqual([
      {
        id: "u1",
        role: "user",
        parts: [{ type: "text", text: "안녕" }],
      },
    ]);
  });

  it("converts legacy content string to text parts", () => {
    const actual = normalizeUIMessagesForValidation([
      {
        id: "a1",
        role: "assistant",
        content: "legacy response",
      },
    ]);

    expect(actual).toEqual([
      {
        id: "a1",
        role: "assistant",
        parts: [{ type: "text", text: "legacy response" }],
      },
    ]);
  });

  it("converts content array entries to text parts", () => {
    const actual = normalizeUIMessagesForValidation([
      {
        role: "user",
        content: [
          { type: "input_text", text: "first" },
          "second",
          { type: "text", text: "third" },
          { type: "image", url: "https://example.com/image.png" },
        ],
      },
    ]);

    expect(actual).toEqual([
      {
        id: "normalized-message-1",
        role: "user",
        parts: [
          { type: "text", text: "first" },
          { type: "text", text: "second" },
          { type: "text", text: "third" },
        ],
      },
    ]);
  });

  it("drops messages without valid role or text payload", () => {
    const actual = normalizeUIMessagesForValidation([
      { role: "tool", content: "ignored" },
      { role: "assistant", parts: [{ type: "tool-search", state: "output-available" }] },
      { role: "assistant", parts: [{ type: "text", text: "ok" }] },
    ]);

    expect(actual).toEqual([
      {
        id: "normalized-message-3",
        role: "assistant",
        parts: [{ type: "text", text: "ok" }],
      },
    ]);
  });
});
