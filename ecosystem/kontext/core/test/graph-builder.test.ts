import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildGraph } from "../src/graph-builder.js";

const TMP = join(import.meta.dirname, "__tmp_test__");

function setup(files: Record<string, string>) {
  mkdirSync(TMP, { recursive: true });
  for (const [path, content] of Object.entries(files)) {
    const full = join(TMP, path);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, content);
  }
}

beforeEach(() => rmSync(TMP, { recursive: true, force: true }));
afterEach(() => rmSync(TMP, { recursive: true, force: true }));

describe("buildGraph", () => {
  test("builds graph from single kontext.yaml", () => {
    setup({
      "pkg-a/kontext.yaml": `
apiVersion: kontext/v1
relations:
  - when: "src/*.ts"
    affects:
      - path: pkg-b/docs/
        reason: update docs
`,
      "pkg-a/src/foo.ts": "export const foo = 1;",
      "pkg-b/docs/placeholder": "",
    });

    const graph = buildGraph({ rootDir: TMP });

    expect(graph.packages).toContain("pkg-a");
    expect(graph.edges.length).toBeGreaterThanOrEqual(1);

    const edge = graph.edges.find((e) => e.source === "pkg-a/src/foo.ts");
    expect(edge).toBeDefined();
    expect(edge!.target).toBe("pkg-b/docs/");
    expect(edge!.reason).toBe("update docs");
    expect(edge!.definedBy).toBe("pkg-a/kontext.yaml");
  });

  test("applies ignore patterns", () => {
    setup({
      "pkg/kontext.yaml": `
apiVersion: kontext/v1
ignore:
  - "**/*.test.ts"
relations:
  - when: "src/*.ts"
    affects:
      - path: pkg/docs/
`,
      "pkg/src/main.ts": "",
      "pkg/src/main.test.ts": "",
      "pkg/docs/placeholder": "",
    });

    const graph = buildGraph({ rootDir: TMP });
    const sources = graph.edges.map((e) => e.source);

    expect(sources).toContain("pkg/src/main.ts");
    expect(sources).not.toContain("pkg/src/main.test.ts");
  });

  test("applies exclude patterns", () => {
    setup({
      "pkg/kontext.yaml": `
apiVersion: kontext/v1
relations:
  - when: "src/*.ts"
    exclude:
      - "src/internal.ts"
    affects:
      - path: pkg/docs/
`,
      "pkg/src/public.ts": "",
      "pkg/src/internal.ts": "",
      "pkg/docs/placeholder": "",
    });

    const graph = buildGraph({ rootDir: TMP });
    const sources = graph.edges.map((e) => e.source);

    expect(sources).toContain("pkg/src/public.ts");
    expect(sources).not.toContain("pkg/src/internal.ts");
  });

  test("expands {id} and {Id} templates", () => {
    setup({
      "pkg/kontext.yaml": `
apiVersion: kontext/v1
relations:
  - when: "components/*.yaml"
    affects:
      - path: src/{Id}/{Id}.tsx
`,
      "pkg/components/action-button.yaml": "",
      "src/ActionButton/ActionButton.tsx": "",
    });

    const graph = buildGraph({ rootDir: TMP });
    const edge = graph.edges.find((e) => e.source === "pkg/components/action-button.yaml");

    expect(edge).toBeDefined();
    expect(edge!.target).toBe("src/ActionButton/ActionButton.tsx");
  });

  test("applies overrides for matching files", () => {
    setup({
      "pkg/kontext.yaml": `
apiVersion: kontext/v1
relations:
  - when: "components/*.yaml"
    affects:
      - path: docs/{id}.mdx
    overrides:
      - match: "components/{special-a,special-b}.yaml"
        affects:
          - path: docs/special/{id}.mdx
`,
      "pkg/components/normal.yaml": "",
      "pkg/components/special-a.yaml": "",
      "docs/normal.mdx": "",
      "docs/special/special-a.mdx": "",
    });

    const graph = buildGraph({ rootDir: TMP });

    const normalEdge = graph.edges.find((e) => e.source === "pkg/components/normal.yaml");
    expect(normalEdge!.target).toBe("docs/normal.mdx");

    const overrideEdge = graph.edges.find((e) => e.source === "pkg/components/special-a.yaml");
    expect(overrideEdge!.target).toBe("docs/special/special-a.mdx");
  });

  test("marks non-existent targets", () => {
    setup({
      "pkg/kontext.yaml": `
apiVersion: kontext/v1
relations:
  - when: "src/*.ts"
    affects:
      - path: does-not-exist/file.ts
`,
      "pkg/src/foo.ts": "",
    });

    const graph = buildGraph({ rootDir: TMP });
    const targetNode = graph.nodes.find((n) => n.id === "does-not-exist/file.ts");

    expect(targetNode).toBeDefined();
    expect(targetNode!.exists).toBe(false);
  });

  test("sets optional flag on edges", () => {
    setup({
      "pkg/kontext.yaml": `
apiVersion: kontext/v1
relations:
  - when: "src/*.ts"
    affects:
      - path: required/file.ts
      - path: optional/file.ts
        optional: true
`,
      "pkg/src/foo.ts": "",
    });

    const graph = buildGraph({ rootDir: TMP });

    const required = graph.edges.find((e) => e.target === "required/file.ts");
    const optional = graph.edges.find((e) => e.target === "optional/file.ts");

    expect(required!.optional).toBe(false);
    expect(optional!.optional).toBe(true);
  });
});
