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
const codeBlock = (title: string, lang: string) => {
  const fence = "```";
  const block = guide.match(
    new RegExp(`${fence}${lang} title="${title}"\\n([\\s\\S]*?)${fence}`),
  )?.[1];
  if (!block) throw new Error(`Tailwind v4 ${title} example is missing`);
  return block;
};
const config = new Function(
  "tailwindcss",
  codeBlock("postcss.config.js", "js")
    .replace('import tailwindcss from "@tailwindcss/postcss";', "")
    .replace("export default", "return"),
)(tailwindcss);
// Replace directory scanning with fixed candidates so the result does not depend on the checkout.
const globalCss = codeBlock("src/styles/global.css", "css")
  .replace(
    '@import "tailwindcss/utilities.css";',
    '@import "tailwindcss/utilities.css" source(none);',
  )
  .replace('@source "../";', '@source inline("bg-bg-brand-solid rounded-r2 p-x2 t5-regular");');

describe("documented Lynx Tailwind setup", () => {
  test("emits CSS that the Lynx template encoder keeps", async () => {
    const { css } = await postcss(config.plugins).process(globalCss, {
      from: resolve(import.meta.dir, "global.css"),
    });
    const root = postcss.parse(css);
    // Lynx drops rules combined with :host and everything inside @layer.
    expect(css).not.toContain(":host");
    const layers: string[] = [];
    root.walkAtRules("layer", (rule) => {
      layers.push(rule.params);
    });
    // Only the @property fallback layer may remain; Lynx can drop it without losing utilities.
    expect(layers.filter((name) => name !== "properties")).toEqual([]);

    const declarations = (selector: string) => {
      const found: Record<string, string> = {};
      root.walkRules(selector, (rule) => {
        if (rule.parent?.type !== "root") return;
        rule.walkDecls((decl) => {
          found[decl.prop] = decl.value;
        });
      });
      return found;
    };
    expect(declarations(".bg-bg-brand-solid")).toEqual({
      "background-color": "var(--seed-color-bg-brand-solid)",
    });
    expect(declarations(".rounded-r2")).toEqual({ "border-radius": "var(--seed-radius-r2)" });
    expect(declarations(".p-x2")).toEqual({ padding: "var(--seed-dimension-x2)" });
    expect(declarations(".t5-regular")).toMatchObject({
      "font-size": "var(--seed-font-size-t5)",
    });
  });
});

describe("SEED Tailwind token providers", () => {
  test.each(["tailwind3-plugin/src/index.ts", "tailwind4-theme/index.css"])(
    "%s references tokens supplied by Lynx base.css",
    (file) => {
      const packages = resolve(import.meta.dir, "../../packages");
      const source = readFileSync(resolve(packages, file), "utf8");
      const base = readFileSync(resolve(packages, "lynx-css/base.css"), "utf8");
      const references = [...new Set(source.match(/--seed-[\w-]+/g))];
      const definitions = new Set(
        [...base.matchAll(/(--seed-[\w-]+)\s*:/g)].map((match) => match[1]),
      );
      expect(references.length).toBeGreaterThan(0);
      expect(references.filter((name) => !definitions.has(name))).toEqual([]);
    },
  );
});

describe("Lynx Styling permanent links", () => {
  const docs = resolve(import.meta.dir, "..");
  const redirects = readFileSync(resolve(docs, "public/_redirects"), "utf8");

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
