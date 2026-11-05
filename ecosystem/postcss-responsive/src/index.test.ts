import { describe, expect, test } from "bun:test";
import postcss from "postcss";

import { postcssResponsive } from "./index";

const defaultBreakpoints = [
  { name: "base", minWidth: 0 },
  { name: "sm", minWidth: 480 },
  { name: "md", minWidth: 768 },
  { name: "lg", minWidth: 1280 },
  { name: "xl", minWidth: 1440 },
];

async function run(
  input: string,
  plugins: postcss.AcceptedPlugin[] = [postcssResponsive({ breakpoints: defaultBreakpoints })],
) {
  const result = await postcss(plugins).process(input, { from: undefined });
  return result.css;
}

describe("postcss-responsive", () => {
  test("single responsive variable", async () => {
    const output = await run(".seed-box { --seed-box-padding--responsive: 0 }");
    expect(output).toMatchInlineSnapshot(`
      ".seed-box { --seed-box-padding-base: 0 ; --seed-box-padding-sm: var(--seed-box-padding-base, initial); --seed-box-padding-md: var(--seed-box-padding-sm, initial); --seed-box-padding-lg: var(--seed-box-padding-md, initial); --seed-box-padding-xl: var(--seed-box-padding-lg, initial); --seed-box-padding: var(--seed-box-padding-base, initial)}
      @media (min-width: 480px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-sm, initial)}}
      @media (min-width: 768px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-md, initial)}}
      @media (min-width: 1280px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-lg, initial)}}
      @media (min-width: 1440px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-xl, initial)}}"
    `);
  });

  test("multiple responsive variables in same rule", async () => {
    const output = await run(
      ".seed-box { --seed-box-padding--responsive: 0; --seed-box-gap--responsive: initial }",
    );
    expect(output).toMatchInlineSnapshot(`
      ".seed-box { --seed-box-padding-base: 0; --seed-box-padding-sm: var(--seed-box-padding-base, initial); --seed-box-padding-md: var(--seed-box-padding-sm, initial); --seed-box-padding-lg: var(--seed-box-padding-md, initial); --seed-box-padding-xl: var(--seed-box-padding-lg, initial); --seed-box-padding: var(--seed-box-padding-base, initial); --seed-box-gap-base: initial ; --seed-box-gap-sm: var(--seed-box-gap-base, initial); --seed-box-gap-md: var(--seed-box-gap-sm, initial); --seed-box-gap-lg: var(--seed-box-gap-md, initial); --seed-box-gap-xl: var(--seed-box-gap-lg, initial); --seed-box-gap: var(--seed-box-gap-base, initial)}
      @media (min-width: 480px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-sm, initial); --seed-box-gap: var(--seed-box-gap-sm, initial)}}
      @media (min-width: 768px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-md, initial); --seed-box-gap: var(--seed-box-gap-md, initial)}}
      @media (min-width: 1280px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-lg, initial); --seed-box-gap: var(--seed-box-gap-lg, initial)}}
      @media (min-width: 1440px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-xl, initial); --seed-box-gap: var(--seed-box-gap-xl, initial)}}"
    `);
  });

  test("preserves non-responsive declarations", async () => {
    const output = await run(
      ".seed-box { --seed-box-color: initial; --seed-box-padding--responsive: 0 }",
    );
    expect(output).toMatchInlineSnapshot(`
      ".seed-box { --seed-box-color: initial; --seed-box-padding-base: 0 ; --seed-box-padding-sm: var(--seed-box-padding-base, initial); --seed-box-padding-md: var(--seed-box-padding-sm, initial); --seed-box-padding-lg: var(--seed-box-padding-md, initial); --seed-box-padding-xl: var(--seed-box-padding-lg, initial); --seed-box-padding: var(--seed-box-padding-base, initial)}
      @media (min-width: 480px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-sm, initial)}}
      @media (min-width: 768px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-md, initial)}}
      @media (min-width: 1280px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-lg, initial)}}
      @media (min-width: 1440px) {
       .seed-box { --seed-box-padding: var(--seed-box-padding-xl, initial)}}"
    `);
  });

  test("custom marker", async () => {
    const output = await run(".seed-box { --seed-box-gap--bp: 0 }", [
      postcssResponsive({ marker: "--bp", breakpoints: defaultBreakpoints }),
    ]);
    expect(output).toMatchInlineSnapshot(`
      ".seed-box { --seed-box-gap-base: 0 ; --seed-box-gap-sm: var(--seed-box-gap-base, initial); --seed-box-gap-md: var(--seed-box-gap-sm, initial); --seed-box-gap-lg: var(--seed-box-gap-md, initial); --seed-box-gap-xl: var(--seed-box-gap-lg, initial); --seed-box-gap: var(--seed-box-gap-base, initial)}
      @media (min-width: 480px) {
       .seed-box { --seed-box-gap: var(--seed-box-gap-sm, initial)}}
      @media (min-width: 768px) {
       .seed-box { --seed-box-gap: var(--seed-box-gap-md, initial)}}
      @media (min-width: 1280px) {
       .seed-box { --seed-box-gap: var(--seed-box-gap-lg, initial)}}
      @media (min-width: 1440px) {
       .seed-box { --seed-box-gap: var(--seed-box-gap-xl, initial)}}"
    `);
  });

  test("fewer breakpoints", async () => {
    const output = await run(".box { --gap--responsive: 0 }", [
      postcssResponsive({
        breakpoints: [
          { name: "base", minWidth: 0 },
          { name: "md", minWidth: 768 },
        ],
      }),
    ]);
    expect(output).toMatchInlineSnapshot(`
      ".box { --gap-base: 0 ; --gap-md: var(--gap-base, initial); --gap: var(--gap-base, initial)}
      @media (min-width: 768px) {
       .box { --gap: var(--gap-md, initial)}}"
    `);
  });

  test("throws without options", () => {
    expect(() => postcssResponsive()).toThrow(/options with breakpoints are required/);
  });

  test("throws without base breakpoint", () => {
    expect(() => postcssResponsive({ breakpoints: [{ name: "md", minWidth: 768 }] })).toThrow(
      /base breakpoint with minWidth 0 is required/,
    );
  });

  test("default value with var() reference", async () => {
    const output = await run(
      ".seed-box { --seed-box-padding-y--responsive: var(--seed-box-padding) }",
    );
    expect(output).toMatchInlineSnapshot(`
      ".seed-box { --seed-box-padding-y-base: var(--seed-box-padding) ; --seed-box-padding-y-sm: var(--seed-box-padding-y-base, initial); --seed-box-padding-y-md: var(--seed-box-padding-y-sm, initial); --seed-box-padding-y-lg: var(--seed-box-padding-y-md, initial); --seed-box-padding-y-xl: var(--seed-box-padding-y-lg, initial); --seed-box-padding-y: var(--seed-box-padding-y-base, initial)}
      @media (min-width: 480px) {
       .seed-box { --seed-box-padding-y: var(--seed-box-padding-y-sm, initial)}}
      @media (min-width: 768px) {
       .seed-box { --seed-box-padding-y: var(--seed-box-padding-y-md, initial)}}
      @media (min-width: 1280px) {
       .seed-box { --seed-box-padding-y: var(--seed-box-padding-y-lg, initial)}}
      @media (min-width: 1440px) {
       .seed-box { --seed-box-padding-y: var(--seed-box-padding-y-xl, initial)}}"
    `);
  });

  test("cascade chain order is base → sm → md → lg → xl → resolved", async () => {
    const output = await run(".seed-box { --x--responsive: 0 }");
    expect(output).toMatchInlineSnapshot(`
      ".seed-box { --x-base: 0 ; --x-sm: var(--x-base, initial); --x-md: var(--x-sm, initial); --x-lg: var(--x-md, initial); --x-xl: var(--x-lg, initial); --x: var(--x-base, initial)}
      @media (min-width: 480px) {
       .seed-box { --x: var(--x-sm, initial)}}
      @media (min-width: 768px) {
       .seed-box { --x: var(--x-md, initial)}}
      @media (min-width: 1280px) {
       .seed-box { --x: var(--x-lg, initial)}}
      @media (min-width: 1440px) {
       .seed-box { --x: var(--x-xl, initial)}}"
    `);
  });
});
