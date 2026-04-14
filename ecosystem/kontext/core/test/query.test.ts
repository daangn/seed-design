import { describe, expect, test } from "bun:test";
import { analyzeImpact, checkCompleteness, findAffectedBy, findDeps } from "../src/query.js";
import type { KontextGraph } from "../src/types.js";

function makeGraph(overrides?: Partial<KontextGraph>): KontextGraph {
  return {
    nodes: [
      { id: "a.yaml", packageDir: "packages/rootage", exists: true },
      { id: "b.ts", packageDir: "packages/react", exists: true },
      { id: "c.mdx", packageDir: "docs", exists: false },
      { id: "d.tsx", packageDir: "docs", exists: true },
    ],
    edges: [
      {
        source: "a.yaml",
        target: "b.ts",
        reason: "update component",
        generated: false,
        command: undefined,
        optional: false,
        definedBy: "packages/rootage/kontext.yaml",
      },
      {
        source: "a.yaml",
        target: "c.mdx",
        reason: "update docs",
        generated: false,
        command: undefined,
        optional: false,
        definedBy: "packages/rootage/kontext.yaml",
      },
      {
        source: "a.yaml",
        target: "d.tsx",
        generated: true,
        command: "bun generate",
        optional: false,
        definedBy: "packages/rootage/kontext.yaml",
      },
    ],
    packages: ["packages/rootage", "packages/react", "docs"],
    builtAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("findDeps", () => {
  test("returns all targets for a source", () => {
    const deps = findDeps(makeGraph(), "a.yaml");
    expect(deps).toHaveLength(3);
    expect(deps[0]!.path).toBe("b.ts");
    expect(deps[0]!.reason).toBe("update component");
    expect(deps[0]!.exists).toBe(true);
  });

  test("returns generated info", () => {
    const deps = findDeps(makeGraph(), "a.yaml");
    const gen = deps.find((d) => d.generated);
    expect(gen).toBeDefined();
    expect(gen!.command).toBe("bun generate");
  });

  test("returns empty for unknown source", () => {
    expect(findDeps(makeGraph(), "unknown.ts")).toHaveLength(0);
  });

  test("shows exists=false for missing targets", () => {
    const deps = findDeps(makeGraph(), "a.yaml");
    const missing = deps.find((d) => d.path === "c.mdx");
    expect(missing!.exists).toBe(false);
  });
});

describe("findAffectedBy", () => {
  test("returns sources that affect a target", () => {
    const affected = findAffectedBy(makeGraph(), "b.ts");
    expect(affected).toHaveLength(1);
    expect(affected[0]!.path).toBe("a.yaml");
  });

  test("returns empty for non-target", () => {
    expect(findAffectedBy(makeGraph(), "a.yaml")).toHaveLength(0);
  });
});

describe("checkCompleteness", () => {
  test("reports missing files", () => {
    const results = checkCompleteness(makeGraph());
    expect(results).toHaveLength(1); // only a.yaml has edges as source
    expect(results[0]!.source).toBe("a.yaml");
    expect(results[0]!.definedBy).toBe("packages/rootage/kontext.yaml");
    expect(results[0]!.total).toBe(3);
    expect(results[0]!.existing).toBe(2);
    expect(results[0]!.missing).toEqual(["c.mdx"]);
  });

  test("skips optional edges in completeness check", () => {
    const graph = makeGraph({
      edges: [
        {
          source: "a.yaml",
          target: "c.mdx",
          generated: false,
          optional: true,
          definedBy: "test.yaml",
        },
      ],
    });
    const results = checkCompleteness(graph);
    expect(results).toHaveLength(0); // optional edge skipped
  });
});

describe("analyzeImpact", () => {
  test("returns deps for changed files", () => {
    const impact = analyzeImpact(makeGraph(), ["a.yaml"]);
    expect(impact.size).toBe(1);
    expect(impact.get("a.yaml")).toHaveLength(3);
  });

  test("ignores files with no deps", () => {
    const impact = analyzeImpact(makeGraph(), ["b.ts", "unknown.ts"]);
    expect(impact.size).toBe(0);
  });

  test("handles multiple changed files", () => {
    const graph = makeGraph({
      edges: [
        ...makeGraph().edges,
        {
          source: "b.ts",
          target: "d.tsx",
          generated: false,
          optional: false,
          definedBy: "test.yaml",
        },
      ],
    });
    const impact = analyzeImpact(graph, ["a.yaml", "b.ts"]);
    expect(impact.size).toBe(2);
  });
});
