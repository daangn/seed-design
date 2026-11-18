import { beforeAll, describe, expect, test } from "bun:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import YAML from "yaml";
import { Authoring } from "../parser";
import { getTailwind3PluginCode } from "./tailwind3";
import { getTailwind4CompleteThemeCode } from "./tailwind4";

const root = new URL("../../../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const require3 = createRequire(new URL("packages/tailwind3-plugin/package.json", root));
const require4 = createRequire(new URL("packages/tailwind4-theme/package.json", root));
const tailwind3 = require3("tailwindcss");
const plugin = require3("tailwindcss/plugin");
const postcss = createRequire(require3.resolve("tailwindcss"))("postcss");
const tailwind4 = require4("tailwindcss");
const foundation = YAML.parse(read("packages/rootage/gradient.yaml"));
const tokens = Authoring.parseTokensDocument(foundation).data;
type Stop = { color: string; position: number };
const gradients = Object.entries(foundation.data.tokens).map(([id, token]) => ({
  name: id.replace("$gradient.", ""),
  values: (token as { values: Record<string, { value: Stop[] }> }).values,
}));
const directions = {
  t: "top",
  tr: "top right",
  r: "right",
  br: "bottom right",
  b: "bottom",
  bl: "bottom left",
  l: "left",
  tl: "top left",
};
const cases = gradients.flatMap(({ name }) => [
  ...Object.entries(directions).flatMap(([suffix, direction]) => [
    { name, className: `bg-${name}-to-${suffix}`, angle: `to ${direction}` },
    { name, className: `bg-gradient-${name}-to-${suffix}`, angle: `to ${direction}` },
  ]),
  ...[
    "0deg",
    "45deg",
    "120deg",
    "270deg",
    "360deg",
    "45.5deg",
    "-45deg",
    "0.25turn",
    "1rad",
    "50grad",
  ].map((angle) => ({
    name,
    className: `bg-gradient-${name}-[${angle}]`,
    angle,
  })),
]);
const candidates = cases.map(({ className }) => className);

function required<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("Missing foundation token or generated utility");
  return value;
}

// Resolve nested CSS var fallbacks independently of either generator.
function resolve(value: string, vars: Record<string, string>): string {
  let result = value;
  for (let i = 0; result.includes("var(") && i < 20; i++) {
    result = result.replace(
      /var\((--[\w-]+)(?:,\s*([^()]*))?\)/g,
      (_, key, fallback) => vars[key] ?? fallback ?? `UNRESOLVED:${key}`,
    );
  }
  return result;
}
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/#[0-9a-f]+/g, (hex) => {
      let s = hex.slice(1);
      if (s.length <= 4) s = [...s].map((c) => c + c).join("");
      if (s.length === 6) s += "ff";
      return `#${s}`;
    })
    .replace(/\d+(?:\.\d+)?%/g, (s) => `${Number(Number.parseFloat(s).toFixed(6))}%`)
    .replace(/\s+/g, " ")
    .trim();
}
function variables(css: string, dark = false): Record<string, string> {
  const vars: Record<string, string> = {};
  postcss
    .parse(css)
    .walkDecls((d: { prop: string; value: string; parent: { selector?: string } }) => {
      if (!d.prop.startsWith("--")) return;
      const isDark =
        d.parent.selector === undefined ? undefined : /dark-only/.test(d.parent.selector);
      if (isDark === undefined || isDark === dark) vars[d.prop] = d.value;
    });
  return vars;
}
function backgrounds(css: string): Map<string, string> {
  const result = new Map<string, string>();
  postcss
    .parse(css)
    .walkRules(
      (rule: {
        selector: string;
        walkDecls: (property: string, callback: (declaration: { value: string }) => void) => void;
      }) => {
        rule.walkDecls("background-image", (d: { value: string }) =>
          result.set(rule.selector.replaceAll("\\", "").slice(1), d.value),
        );
      },
    );
  return result;
}
async function compile3(source: string, classes: string[]) {
  const seed = new Function(
    "plugin",
    source
      .replace('import plugin from "tailwindcss/plugin";', "")
      .replace("export default plugin(", "return plugin("),
  )(plugin);
  return (
    await postcss([
      tailwind3({
        content: [{ raw: classes.join(" ") }],
        corePlugins: { preflight: false },
        plugins: [seed],
      }),
    ]).process("@tailwind components; @tailwind utilities;", { from: undefined })
  ).css as string;
}
async function compile4(source: string, classes: string[]) {
  return (await tailwind4.compile(`${source}\n@tailwind utilities;`)).build(classes) as string;
}

for (const version of [3, 4] as const) {
  for (const surface of ["generator", "package"] as const) {
    describe(`Tailwind ${version} ${surface}: foundation gradients`, () => {
      let css: string;
      let rules: Map<string, string>;
      beforeAll(async () => {
        const source =
          version === 3
            ? surface === "generator"
              ? getTailwind3PluginCode(tokens, [], { prefix: "seed" })
              : read("packages/tailwind3-plugin/src/index.ts")
            : surface === "generator"
              ? getTailwind4CompleteThemeCode(tokens, [], { sourcePrefix: "seed" })
              : read("packages/tailwind4-theme/index.css");
        css = await (version === 3 ? compile3 : compile4)(source, candidates);
        rules = backgrounds(css);
      });
      test("emits every token, both direction spellings, arbitrary angles", () => {
        expect(
          cases.filter(({ className }) => !rules.has(className)).map((c) => c.className),
        ).toEqual([]);
      });
      for (const platform of ["css", "lynx-css"]) {
        for (const dark of [false, true]) {
          test(`${platform} ${dark ? "dark" : "light"}: exact foundation colors and stop positions`, () => {
            const vars = {
              ...variables(css),
              ...variables(read(`packages/${platform}/base.css`), dark),
            };
            for (const { name, values } of gradients) {
              const stops = values[dark ? "theme-dark" : "theme-light"].value;
              const expected = stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");
              for (const c of cases.filter((c) => c.name === name)) {
                expect(rules.get(c.className), c.className).toBeDefined();
                expect(
                  normalize(resolve(required(rules.get(c.className)), vars)),
                  c.className,
                ).toBe(normalize(`linear-gradient(${c.angle}, ${expected})`));
              }
            }
          });
        }
      }
      test("preserves fade's sixteen stops when older token CSS lacks the variable", () => {
        const vars = variables(css);
        const fade = required(gradients.find((g) => g.name === "fade-mask"));
        expect(fade.values["theme-light"].value).toHaveLength(16);
        const expected = fade.values["theme-light"].value
          .map((s) => `${s.color} ${s.position * 100}%`)
          .join(", ");
        expect(normalize(resolve(required(rules.get("bg-gradient-fade-mask-[45deg]")), vars))).toBe(
          normalize(`linear-gradient(45deg, ${expected})`),
        );
      });
    });
  }
}

for (const version of [3, 4] as const) {
  test(`Tailwind ${version}: README classes compile and nonexistent foundation tokens stay absent`, async () => {
    const pkg = version === 3 ? "tailwind3-plugin" : "tailwind4-theme";
    const classes = [...read(`packages/${pkg}/README.md`).matchAll(/className="([^"]+)"/g)].flatMap(
      (m) => m[1].split(" "),
    );
    const absent = [
      "radius-r8",
      "rounded-r8",
      "border-stroke-brand",
      "bg-gradient-fade-mask-0deg",
      "bg-gradient-fade-mask-45deg",
      "bg-gradient-fade-mask-360deg",
      "bg-gradient-fade-mask-361deg",
      "bg-gradient-fade-mask-45.5deg",
      "bg-fade-mask-to-invalid",
      "bg-gradient-fade-mask-to-invalid",
      "bg-fade-mask-to-[45deg]",
    ];
    const source = read(`packages/${pkg}/${version === 3 ? "src/index.ts" : "index.css"}`);
    const output = await (version === 3 ? compile3 : compile4)(source, [...classes, ...absent]);
    const selectors = new Set<string>();
    postcss
      .parse(output)
      .walkRules((r: { selector: string }) => selectors.add(r.selector.replaceAll("\\", "")));
    for (const c of classes) expect(selectors.has(`.${c}`), c).toBe(true);
    for (const c of absent) expect(selectors.has(`.${c}`), c).toBe(false);
  });
  test(`Tailwind ${version}: sourcePrefix and prefix resolve the gradient at the source`, async () => {
    for (const options of [{ prefix: "custom", sourcePrefix: "seed" }, { prefix: "custom" }, {}]) {
      const source =
        version === 3
          ? getTailwind3PluginCode(tokens, [], options)
          : getTailwind4CompleteThemeCode(tokens, [], options);
      const output = await (version === 3 ? compile3 : compile4)(source, [
        "bg-gradient-fade-mask-[45deg]",
      ]);
      const value = required(backgrounds(output).get("bg-gradient-fade-mask-[45deg]"));
      const prefix = options.sourcePrefix || options.prefix;
      const variable = `--${prefix ? `${prefix}-` : ""}gradient-fade-mask`;
      expect(value).toContain(`var(${variable},`);
      expect(resolve(value, { [variable]: "#123456 0%, #abcdef 100%" })).toBe(
        "linear-gradient(45deg, #123456 0%, #abcdef 100%)",
      );
    }
  });
}
