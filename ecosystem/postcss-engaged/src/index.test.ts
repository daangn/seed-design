import { describe, expect, test } from "bun:test";
import postcss from "postcss";
import postcssNested from "postcss-nested";
import { postcssEngaged } from "./index";

async function run(input: string, plugins: postcss.AcceptedPlugin[] = [postcssEngaged()]) {
  const result = await postcss(plugins).process(input);

  return result.css;
}

describe("postcss-engaged", () => {
  test("simple selector", async () => {
    const output = await run(".btn:--engaged { background: red; }");
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover { background: red; } }@media (hover: none) {.btn:active { background: red; } }"`,
    );
  });

  test("compound selector with :not(:disabled)", async () => {
    const output = await run(".btn:--engaged:not(:disabled) { background: red; }");
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover:not(:disabled) { background: red; } }@media (hover: none) {.btn:active:not(:disabled) { background: red; } }"`,
    );
  });

  test("works with postcss-nested", async () => {
    const output = await run(".parent { &:--engaged { color: blue; } }", [
      postcssEngaged(),
      postcssNested(),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.parent:hover { color: blue; } }@media (hover: none) {.parent:active { color: blue; } }"`,
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
      `"@media (hover: hover) {.a:hover, .b:hover { background: red; } }@media (hover: none) {.a:active, .b:active { background: red; } }"`,
    );
  });

  test("multiple declarations", async () => {
    const output = await run(".btn:--engaged { background: red; color: white; opacity: 0.8; }");
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover { background: red; color: white; opacity: 0.8; } }@media (hover: none) {.btn:active { background: red; color: white; opacity: 0.8; } }"`,
    );
  });

  test("custom selector option", async () => {
    const output = await run(".btn:--interact { background: red; }", [
      postcssEngaged({ selector: ":--interact" }),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover { background: red; } }@media (hover: none) {.btn:active { background: red; } }"`,
    );
  });

  test("partial comma selector – only some selectors have :--engaged", async () => {
    const output = await run(".a:--engaged, .b { color: red; }");
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.a:hover, .b { color: red; } }@media (hover: none) {.a:active, .b { color: red; } }"`,
    );
  });

  test("throws when nested deep inside @media (hover: hover)", async () => {
    const input =
      "@media (hover: hover) { @supports (display: grid) { .btn:--engaged { background: red; } } }";
    expect(run(input)).rejects.toThrow(/already inside/);
  });

  test("descendant combinator after :--engaged", async () => {
    const output = await run(".btn:--engaged .child { color: red; }");
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover .child { color: red; } }@media (hover: none) {.btn:active .child { color: red; } }"`,
    );
  });

  test("custom replace.hover", async () => {
    const output = await run(".btn:--engaged { background: red; }", [
      postcssEngaged({ replace: { hover: ":is(:hover, :focus-visible)" } }),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:is(:hover, :focus-visible) { background: red; } }@media (hover: none) {.btn:active { background: red; } }"`,
    );
  });

  test("custom replace.active", async () => {
    const output = await run(".btn:--engaged { background: red; }", [
      postcssEngaged({ replace: { active: ":is(:active, [data-active])" } }),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover { background: red; } }@media (hover: none) {.btn:is(:active, [data-active]) { background: red; } }"`,
    );
  });

  test("works inside @layer", async () => {
    const output = await run("@layer components { .btn:--engaged { background: red; } }");
    expect(output).toMatchInlineSnapshot(
      `"@layer components { @media (hover: hover) { .btn:hover { background: red; } } @media (hover: none) { .btn:active { background: red; } } }"`,
    );
  });

  test("works inside nested @layer with multiple rules", async () => {
    const output = await run(
      "@layer components { .a { color: blue; } .btn:--engaged { background: red; } .b { color: green; } }",
    );
    expect(output).toMatchInlineSnapshot(
      `"@layer components { .a { color: blue; } @media (hover: hover) { .btn:hover { background: red; } } @media (hover: none) { .btn:active { background: red; } } .b { color: green; } }"`,
    );
  });

  test("custom replace.hover and replace.active together", async () => {
    const output = await run(".btn:--engaged { background: red; }", [
      postcssEngaged({
        replace: { hover: ":is(:hover, :focus-visible)", active: ":is(:active, [data-active])" },
      }),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:is(:hover, :focus-visible) { background: red; } }@media (hover: none) {.btn:is(:active, [data-active]) { background: red; } }"`,
    );
  });

  test("custom media.hover", async () => {
    const output = await run(".btn:--engaged { background: red; }", [
      postcssEngaged({ media: { hover: "(hover: hover) and (pointer: fine)" } }),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) and (pointer: fine) {.btn:hover { background: red; } }@media (hover: none) {.btn:active { background: red; } }"`,
    );
  });

  test("custom media.active", async () => {
    const output = await run(".btn:--engaged { background: red; }", [
      postcssEngaged({ media: { active: "not all and (hover: hover) and (pointer: fine)" } }),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) {.btn:hover { background: red; } }@media not all and (hover: hover) and (pointer: fine) {.btn:active { background: red; } }"`,
    );
  });

  test("custom media.hover and media.active together", async () => {
    const output = await run(".btn:--engaged { background: red; }", [
      postcssEngaged({
        media: {
          hover: "(hover: hover) and (pointer: fine)",
          active: "not all and (hover: hover) and (pointer: fine)",
        },
      }),
    ]);
    expect(output).toMatchInlineSnapshot(
      `"@media (hover: hover) and (pointer: fine) {.btn:hover { background: red; } }@media not all and (hover: hover) and (pointer: fine) {.btn:active { background: red; } }"`,
    );
  });

  test("throws when inside custom media.hover", async () => {
    const input =
      "@media (hover: hover) and (pointer: fine) { .btn:--engaged { background: red; } }";
    expect(
      run(input, [postcssEngaged({ media: { hover: "(hover: hover) and (pointer: fine)" } })]),
    ).rejects.toThrow(/already inside/);
  });

  test("throws when inside custom media.active", async () => {
    const input =
      "@media not all and (hover: hover) and (pointer: fine) { .btn:--engaged { background: red; } }";
    expect(
      run(input, [
        postcssEngaged({
          media: { active: "not all and (hover: hover) and (pointer: fine)" },
        }),
      ]),
    ).rejects.toThrow(/already inside/);
  });
});
