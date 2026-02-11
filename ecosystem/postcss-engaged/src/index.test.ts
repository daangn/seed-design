import { describe, expect, test } from "bun:test";
import postcss from "postcss";
import postcssNested from "postcss-nested";
import postcssEngaged from "./index";

async function run(input: string, plugins: postcss.AcceptedPlugin[] = [postcssEngaged()]) {
  const result = await postcss(plugins).process(input, { from: undefined });
  return result.css;
}

describe("postcss-engaged", () => {
  test("simple selector", async () => {
    const output = await run(".btn:--engaged { background: red; }");
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover { background: red; } }@media (hover: none) {.btn:is(:active, [data-active]) { background: red; } }"`,
    );
  });

  test("compound selector with :not(:disabled)", async () => {
    const output = await run(".btn:--engaged:not(:disabled) { background: red; }");
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover:not(:disabled) { background: red; } }@media (hover: none) {.btn:is(:active, [data-active]):not(:disabled) { background: red; } }"`,
    );
  });

  test("works with postcss-nested", async () => {
    const output = await run(".parent { &:--engaged { color: blue; } }", [
      postcssEngaged(),
      postcssNested(),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.parent:hover { color: blue; } }@media (hover: none) {.parent:is(:active, [data-active]) { color: blue; } }"`,
    );
  });

  test("skips rules without :--engaged", async () => {
    const input = ".btn:hover { background: red; }";
    const output = await run(input);
    expect(output).toBe(input);
  });

  test("throws when inside @media (hover: hover)", async () => {
    const input = "@media (hover: hover) { .btn:--engaged { background: red; } }";
    expect(run(input)).rejects.toThrow(/already inside/);
  });

  test("throws when inside @media (hover: none)", async () => {
    const input = "@media (hover: none) { .btn:--engaged { background: red; } }";
    expect(run(input)).rejects.toThrow(/already inside/);
  });

  test("comma selectors", async () => {
    const output = await run(".a:--engaged, .b:--engaged { background: red; }");
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.a:hover, .b:hover { background: red; } }@media (hover: none) {.a:is(:active, [data-active]), .b:is(:active, [data-active]) { background: red; } }"`,
    );
  });

  test("multiple declarations", async () => {
    const output = await run(".btn:--engaged { background: red; color: white; opacity: 0.8; }");
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover { background: red; color: white; opacity: 0.8; } }@media (hover: none) {.btn:is(:active, [data-active]) { background: red; color: white; opacity: 0.8; } }"`,
    );
  });

  test("custom selector option", async () => {
    const output = await run(".btn:--interact { background: red; }", [
      postcssEngaged({ selector: ":--interact" }),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover { background: red; } }@media (hover: none) {.btn:is(:active, [data-active]) { background: red; } }"`,
    );
  });
});
