import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

// Execute the copyable configuration itself so documentation and tests cannot drift.
const guide = readFileSync(
  resolve(import.meta.dir, "../content/lynx/getting-started/styling/tailwind-css-4.mdx"),
  "utf8",
);
const configs = [...guide.matchAll(/```js title="postcss.config.js"\n([\s\S]*?)```/g)];
const configSource = configs[0]?.[1];
if (!configSource) throw new Error("Tailwind v4 PostCSS example is missing");
const config = new Function(
  "tailwindcss",
  configSource
    .replace('import tailwindcss from "@tailwindcss/postcss";', "")
    .replace("export default", "return"),
)(tailwindcss);
const compatibility = config.plugins[1];
const transform = async (css: string) =>
  (await postcss([compatibility]).process(css, { from: undefined })).css;

describe("documented Lynx Tailwind compatibility", () => {
  test.each([
    ":root, :host",
    ":host,:root",
    ":host ,\n :root",
  ])("preserves theme variables for %s", async (selector) => {
    const css = await transform(`${selector} { --color-fg: var(--seed-color-fg); }`);
    const rule = postcss.parse(css).first as postcss.Rule;
    expect(rule.selector).toBe(":root");
    expect(rule.nodes[0]).toMatchObject({ prop: "--color-fg", value: "var(--seed-color-fg)" });
  });

  test("does not rewrite unrelated or functional selectors", async () => {
    const input =
      ":host(.dark), :root { color: red } :is(:root, :host) { color: blue } .other, :root, :host { color: green }";
    expect(await transform(input)).toBe(input);
  });

  test("unwraps nested layers while preserving source order and declarations", async () => {
    const css = await transform(`
      @layer theme, utilities;
      .recipe { color: red !important; }
      @layer theme { :root, :host { --color-fg: black; } }
      @layer utilities { @layer nested { .text-fg { color: var(--color-fg); } } }
      .override { color: blue; }
    `);
    const root = postcss.parse(css);
    const selectors: string[] = [];
    root.walkAtRules("layer", () => {
      throw new Error("layer remains");
    });
    root.walkRules((rule) => {
      selectors.push(rule.selector);
    });
    expect(selectors).toEqual([".recipe", ":root", ".text-fg", ".override"]);
    expect((root.first as postcss.Rule).first).toMatchObject({ important: true });
  });

  test("runs after real Tailwind theme and utility generation", async () => {
    const input =
      '@theme { --color-check: var(--seed-color-fg-neutral); } @tailwind utilities; @source inline("text-check");';
    const result = await postcss(config.plugins).process(input, { from: undefined });
    expect(result.css).toContain("--color-check: var(--seed-color-fg-neutral)");
    expect(result.css).toContain(".text-check");
    expect(result.css).toContain("color: var(--color-check)");
    expect(result.css).not.toContain(":host");
    expect(result.css).not.toContain("@layer");
  });
});

describe("SEED Tailwind token providers", () => {
  test.each([
    "tailwind3-plugin/src/index.ts",
    "tailwind4-theme/index.css",
  ])("%s references tokens supplied by Lynx base.css", (file) => {
    const packages = resolve(import.meta.dir, "../../packages");
    const source = readFileSync(resolve(packages, file), "utf8");
    const base = readFileSync(resolve(packages, "lynx-css/base.css"), "utf8");
    const references = [...new Set(source.match(/--seed-[\w-]+/g))];
    const definitions = new Set(
      [...base.matchAll(/(--seed-[\w-]+)\s*:/g)].map((match) => match[1]),
    );
    expect(references.length).toBeGreaterThan(0);
    expect(references.filter((name) => !definitions.has(name))).toEqual([]);
  });
});

describe("Lynx Styling navigation and permanent links", () => {
  const docs = resolve(import.meta.dir, "..");
  const redirects = readFileSync(resolve(docs, "public/_redirects"), "utf8");

  test("groups theming and both Tailwind versions in the Styling folder", () => {
    const parent = JSON.parse(
      readFileSync(resolve(docs, "content/lynx/getting-started/meta.json"), "utf8"),
    );
    const styling = JSON.parse(
      readFileSync(resolve(docs, "content/lynx/getting-started/styling/meta.json"), "utf8"),
    );
    expect(parent.pages).toContain("styling");
    expect(parent.pages).not.toContain("theming");
    expect(styling.pages).toEqual(["theming", "tailwind-css-4", "tailwind-css-3"]);
    for (const page of styling.pages) {
      expect(
        readFileSync(resolve(docs, `content/lynx/getting-started/styling/${page}.mdx`), "utf8"),
      ).toContain("title:");
    }
  });

  test.each([
    ["foundation/layout/styling", "getting-started/styling/tailwind-css-3"],
    ["getting-started/theming", "getting-started/styling/theming"],
  ])("redirects the previous %s page and LLM endpoint", (oldPath, newPath) => {
    for (const prefix of ["/lynx", "/llms/lynx"]) {
      expect(redirects.split("\n")).toContain(`${prefix}/${oldPath} ${prefix}/${newPath} 301`);
    }
    expect(readFileSync(resolve(docs, `content/lynx/${newPath}.mdx`), "utf8")).toContain("title:");
  });
});
