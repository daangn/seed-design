import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { clearLlmsPropsCache } from "./llms-props";
import {
  createClientTools,
  getComponentExamplePayload,
  normalizeComponentName,
  resolveComponentPreviewName,
  resolveInstallationComponentName,
} from "./tools";

describe("ai tools helpers", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    clearLlmsPropsCache();
  });

  afterEach(() => {
    clearLlmsPropsCache();
    globalThis.fetch = originalFetch;
  });

  it("normalizes component names to canonical kebab-case", () => {
    expect(normalizeComponentName("AlertDialog")).toBe("alert-dialog");
    expect(normalizeComponentName("ui:alert-dialog")).toBe("alert-dialog");
    expect(normalizeComponentName("react/alert-dialog/preview")).toBe("alert-dialog");
  });

  it("resolves preview path from component input", () => {
    expect(resolveComponentPreviewName({ component: "alert-dialog" })).toBe(
      "react/alert-dialog/preview",
    );
  });

  it("resolves installation name from legacy and canonical input", () => {
    expect(resolveInstallationComponentName({ name: "ui:alert-dialog" })).toBe("alert-dialog");
    expect(resolveInstallationComponentName({ component: "AlertDialog" })).toBe("alert-dialog");
  });

  it("returns fallback code when preview is missing but registry component exists", async () => {
    globalThis.fetch = (async (input) => {
      const url = typeof input === "string" ? input : input.url;

      if (url === "https://seed-design.io/react/llms.txt") {
        return new Response(
          `# index\n\n### components\n\n- [Alert Dialog](https://seed-design.io/llms/react/components/alert-dialog.txt)\n`,
          { status: 200 },
        );
      }

      if (url === "https://seed-design.io/llms/react/components/alert-dialog.txt") {
        return new Response(
          `# Alert Dialog\n\n## Preview\n\n\`\`\`tsx\nimport { AlertDialogRoot } from "@seed-design/react";\n\`\`\`\n`,
          { status: 200 },
        );
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const payload = await getComponentExamplePayload({
      name: "react/does-not-exist/preview",
      component: "alert-dialog",
    });

    expect(payload.previewFound).toBe(false);
    expect(typeof payload.fallbackCode).toBe("string");
    expect(payload.fallbackCode).toContain("AlertDialogRoot");
  });

  it("shows react type table rows from llms docs for box", async () => {
    globalThis.fetch = (async (input) => {
      const url = typeof input === "string" ? input : input.url;

      if (url === "https://seed-design.io/react/llms.txt") {
        return new Response(
          `# index\n\n### components\n\n- [Box](https://seed-design.io/llms/react/components/layout/box.txt)\n`,
          { status: 200 },
        );
      }

      if (url === "https://seed-design.io/llms/react/components/layout/box.txt") {
        return new Response(
          `# Box\n\nProps [#props]\n\n- \`as\`\n  - type: \`React.ElementType<any>\`\n  - default: \`undefined\`\n  - required: \`false\`\n`,
          { status: 200 },
        );
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const tools = createClientTools({ baseUrl: "https://seed-design.io" });
    const execute = (
      tools.showReactTypeTable as unknown as {
        execute: (input: { component: string }) => Promise<{
          rows: Array<{ name: string }>;
          error?: string;
        }>;
      }
    ).execute;
    const result = await execute({ component: "box" });

    expect(result.error).toBeUndefined();
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows.some((row) => row.name === "as")).toBe(true);
  });
});
