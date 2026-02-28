import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  clearComponentGuideIntentCache,
  detectComponentGuideIntent,
  extractLatestUserText,
} from "./component-guide-intent";
import { clearLlmsPropsCache } from "./llms-props";

const SAMPLE_REACT_LLMS_INDEX = `# SEED Design React - LLM Reference

### components

- [Box](https://seed-design.io/llms/react/components/layout/box.txt)
- [Alert Dialog](https://seed-design.io/llms/react/components/alert-dialog.txt)
`;

describe("detectComponentGuideIntent", () => {
  const originalFetch = globalThis.fetch;
  const componentIds = ["alert-dialog", "action-button", "checkbox"];

  beforeEach(() => {
    clearComponentGuideIntentCache();
    clearLlmsPropsCache();
  });

  afterEach(() => {
    clearComponentGuideIntentCache();
    clearLlmsPropsCache();
    globalThis.fetch = originalFetch;
  });

  it("detects Korean usage query with spaced component name", async () => {
    const result = await detectComponentGuideIntent("alert dialog 어떻게 사용해?", { componentIds });

    expect(result?.type).toBe("component-guide");
    expect(result?.component.id).toBe("alert-dialog");
  });

  it("detects PascalCase component query", async () => {
    const result = await detectComponentGuideIntent("AlertDialog 설치 방법 알려줘", { componentIds });

    expect(result?.component.id).toBe("alert-dialog");
  });

  it("detects kebab-case component props query", async () => {
    const result = await detectComponentGuideIntent("alert-dialog props 알려줘", { componentIds });

    expect(result?.component.id).toBe("alert-dialog");
  });

  it("returns null when query is not a guide question", async () => {
    const result = await detectComponentGuideIntent("최근 배포 이슈 요약해줘", { componentIds });

    expect(result).toBeNull();
  });

  it("loads component ids from react/llms.txt using baseUrl", async () => {
    globalThis.fetch = (async (input) => {
      const url = typeof input === "string" ? input : input.url;
      if (url === "https://seed-design.io/react/llms.txt") {
        return new Response(SAMPLE_REACT_LLMS_INDEX, { status: 200 });
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const result = await detectComponentGuideIntent("box props는 어떤게 있어?", {
      baseUrl: "https://seed-design.io",
    });

    expect(result?.type).toBe("component-guide");
    expect(result?.component.id).toBe("box");
  });
});

describe("extractLatestUserText", () => {
  it("extracts latest user text from message parts", () => {
    const messages = [
      {
        role: "user",
        parts: [{ type: "text", text: "이전 질문" }],
      },
      {
        role: "assistant",
        parts: [{ type: "text", text: "이전 답변" }],
      },
      {
        role: "user",
        parts: [{ type: "text", text: "alert dialog 어떻게 사용해?" }],
      },
    ];

    expect(extractLatestUserText(messages)).toBe("alert dialog 어떻게 사용해?");
  });
});
