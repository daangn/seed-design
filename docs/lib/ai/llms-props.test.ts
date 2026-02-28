import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  clearLlmsPropsCache,
  loadReactComponentPropsFromLlms,
  parseReactLlmsComponentIndex,
  parseReactPropsRowsFromLlms,
} from "./llms-props";

const SAMPLE_INDEX = `# SEED Design React - LLM Reference

### components

- [Action Button](https://seed-design.io/llms/react/components/action-button.txt)
- [Box](https://seed-design.io/llms/react/components/layout/box.txt)
`;

const SAMPLE_BOX_DOC = `# Box

Props [#props]

- \`as\`
  - type: \`React.ElementType<any>\`
  - default: \`undefined\`
  - required: \`false\`
- \`gap\`
  - type: \`number | undefined\`
  - default: \`0\`
  - required: \`true\`
  - description: 간격 토큰입니다.

Usage [#usage]
`;

const getRequestUrl = (input: RequestInfo | URL) =>
  typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

describe("llms-props", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    clearLlmsPropsCache();
  });

  afterEach(() => {
    clearLlmsPropsCache();
    globalThis.fetch = originalFetch;
  });

  it("parses react llms index and maps box to layout path", () => {
    const index = parseReactLlmsComponentIndex(SAMPLE_INDEX);

    expect(index.byId.get("box")?.[0]?.path).toBe("/llms/react/components/layout/box.txt");
    expect(index.byId.get("action-button")?.[0]?.path).toBe("/llms/react/components/action-button.txt");
  });

  it("parses props rows from llms props block", () => {
    const rows = parseReactPropsRowsFromLlms(SAMPLE_BOX_DOC);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      name: "as",
      type: "React.ElementType<any>",
      defaultValue: null,
      required: false,
      description: "",
    });
    expect(rows[1]).toEqual({
      name: "gap",
      type: "number | undefined",
      defaultValue: "0",
      required: true,
      description: "간격 토큰입니다.",
    });
  });

  it("loads component props through react/llms.txt index without filesystem", async () => {
    globalThis.fetch = (async (input, init) => {
      const url = getRequestUrl(input);
      const method = init?.method ?? "GET";

      if (method === "GET" && url === "https://seed-design.io/react/llms.txt") {
        return new Response(SAMPLE_INDEX, { status: 200 });
      }

      if (method === "GET" && url === "https://seed-design.io/llms/react/components/layout/box.txt") {
        return new Response(SAMPLE_BOX_DOC, { status: 200 });
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const result = await loadReactComponentPropsFromLlms({
      component: "box",
      baseUrl: "https://seed-design.io",
    });

    expect(result.error).toBeUndefined();
    expect(result.sourcePath).toBe("/llms/react/components/layout/box.txt");
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows.some((row) => row.name === "as")).toBe(true);
    expect(result.rows.some((row) => row.name === "gap")).toBe(true);
  });
});
