import { describe, expect, it } from "vitest";
import { splitMultipleVariantsProps } from "../split-multiple-variants-props";

function makeRecipe<V extends Record<string, unknown>>(variantKeys: (keyof V)[]) {
  return {
    splitVariantProps: (props: Record<string, unknown>) => {
      const variantProps: Record<string, unknown> = {};
      const rest: Record<string, unknown> = {};
      for (const key in props) {
        if (variantKeys.includes(key as keyof V)) {
          variantProps[key] = props[key];
        } else {
          rest[key] = props[key];
        }
      }
      return [variantProps, rest] as [V, Omit<Record<string, unknown>, keyof V>];
    },
  };
}

describe("splitMultipleVariantsProps", () => {
  it("splits props across disjoint recipes", () => {
    const a = makeRecipe<{ size: string }>(["size"]);
    const b = makeRecipe<{ tone: string }>(["tone"]);

    const [{ a: av, b: bv }, rest] = splitMultipleVariantsProps(
      { size: "32", tone: "brand", onTap: () => {}, children: "x" },
      { a, b },
    );

    expect(av).toEqual({ size: "32" });
    expect(bv).toEqual({ tone: "brand" });
    expect(rest).toEqual({ onTap: expect.any(Function), children: "x" });
  });

  it("puts shared variant keys into every recipe bucket", () => {
    const a = makeRecipe<{ size: string }>(["size"]);
    const b = makeRecipe<{ size: string; tone: string }>(["size", "tone"]);

    const [{ a: av, b: bv }, rest] = splitMultipleVariantsProps(
      { size: "32", tone: "brand", disabled: true },
      { a, b },
    );

    expect(av).toEqual({ size: "32" });
    expect(bv).toEqual({ size: "32", tone: "brand" });
    expect(rest).toEqual({ disabled: true });
  });

  it("returns empty variant buckets when no recipe claims a prop", () => {
    const a = makeRecipe<{ size: string }>(["size"]);

    const [{ a: av }, rest] = splitMultipleVariantsProps(
      { onTap: () => {}, className: "x" },
      { a },
    );

    expect(av).toEqual({});
    expect(rest).toEqual({ onTap: expect.any(Function), className: "x" });
  });
});
