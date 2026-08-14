import { describe, expect, it } from "bun:test";
import YAML from "yaml";

import { parseComponentSpecDeclaration } from "../parser/authoring/component-spec";
import type { Authoring } from "../parser";
import { getEffectiveStates, resolveComponentSpec, type ResolvedSlots } from "./resolve";

function parse(yaml: string) {
  return parseComponentSpecDeclaration(YAML.parse(yaml) as Authoring.ComponentSpecModel);
}

function colorAt(resolved: ResolvedSlots, slot: string, property: string) {
  const value = resolved[slot]?.[property]?.declaration.value;

  if (value?.kind !== "ColorHexLit") {
    throw new Error(`"${slot}.${property}" did not resolve to a color literal`);
  }

  return value.value;
}

/**
 * The shape the Slack report was about: `loading` and `disabled` are independent
 * flags, `loading` declares only the background, and `disabled` declares the whole
 * surface.
 */
const button = `
kind: ComponentSpec
metadata:
  id: button
  name: Button
data:
  schema:
    slots:
      root:
        properties:
          color:
            type: color
      label:
        properties:
          color:
            type: color
    variants:
      variant:
        values:
          brandSolid: {}
          neutralSolid: {}
    states:
      - id: pressed
      - id: loading
      - id: disabled
        suppresses: [pressed]
  rules:
    - slots:
        root:
          color: "#000000"
        label:
          color: "#000000"
    - variants:
        variant: brandSolid
      slots:
        root:
          color: "#111111"
    - variants:
        variant: brandSolid
      states: [pressed]
      slots:
        root:
          color: "#222222"
    - variants:
        variant: brandSolid
      states: [loading]
      slots:
        root:
          color: "#333333"
    - variants:
        variant: brandSolid
      states: [disabled]
      slots:
        root:
          color: "#444444"
        label:
          color: "#444444"
`;

describe("resolveComponentSpec", () => {
  it("should take the narrower variant when no state is active", () => {
    const resolved = resolveComponentSpec(parse(button), {
      variants: { variant: "brandSolid" },
      states: [],
    });

    expect(colorAt(resolved, "root", "color")).toBe("#111111");
    expect(colorAt(resolved, "label", "color")).toBe("#000000");
  });

  it("should leave a property no matching rule narrows at its widest declaration", () => {
    const resolved = resolveComponentSpec(parse(button), {
      variants: { variant: "neutralSolid" },
      states: [],
    });

    expect(colorAt(resolved, "root", "color")).toBe("#000000");
  });

  it("should give the stronger state every property, not only the ones it shares", () => {
    const resolved = resolveComponentSpec(parse(button), {
      variants: { variant: "brandSolid" },
      states: ["loading", "disabled"],
    });

    expect(colorAt(resolved, "root", "color")).toBe("#444444");
    expect(colorAt(resolved, "label", "color")).toBe("#444444");
  });

  it("should resolve the same whichever order the active states arrive in", () => {
    const spec = parse(button);
    const variants = { variant: "brandSolid" };

    expect(resolveComponentSpec(spec, { variants, states: ["disabled", "loading"] })).toEqual(
      resolveComponentSpec(spec, { variants, states: ["loading", "disabled"] }),
    );
  });

  it("should ignore a suppressed state entirely", () => {
    const resolved = resolveComponentSpec(parse(button), {
      variants: { variant: "brandSolid" },
      states: ["pressed", "disabled"],
    });

    expect(colorAt(resolved, "root", "color")).toBe("#444444");
  });

  it("should rank a state above a narrower variant", () => {
    const yaml = `
kind: ComponentSpec
metadata:
  id: test
  name: test
data:
  schema:
    slots:
      root:
        properties:
          color:
            type: color
    variants:
      variant:
        values:
          brandSolid: {}
    states:
      - id: disabled
  rules:
    - states: [disabled]
      slots:
        root:
          color: "#dddddd"
    - variants:
        variant: brandSolid
      slots:
        root:
          color: "#bbbbbb"
`;

    const resolved = resolveComponentSpec(parse(yaml), {
      variants: { variant: "brandSolid" },
      states: ["disabled"],
    });

    expect(colorAt(resolved, "root", "color")).toBe("#dddddd");
  });

  it("should rank a larger set of states above a subset of it", () => {
    const yaml = `
kind: ComponentSpec
metadata:
  id: test
  name: test
data:
  schema:
    slots:
      root:
        properties:
          color:
            type: color
    states:
      - id: selected
      - id: disabled
  rules:
    - states: [disabled]
      slots:
        root:
          color: "#dddddd"
    - states: [selected, disabled]
      slots:
        root:
          color: "#eeeeee"
`;

    const spec = parse(yaml);

    expect(
      colorAt(resolveComponentSpec(spec, { variants: {}, states: ["disabled"] }), "root", "color"),
    ).toBe("#dddddd");
    expect(
      colorAt(
        resolveComponentSpec(spec, { variants: {}, states: ["selected", "disabled"] }),
        "root",
        "color",
      ),
    ).toBe("#eeeeee");
  });

  it("should refuse to pick between two rules neither of which contains the other", () => {
    const yaml = `
kind: ComponentSpec
metadata:
  id: test
  name: test
data:
  schema:
    slots:
      root:
        properties:
          color:
            type: color
    variants:
      size:
        values:
          large: {}
      type:
        values:
          multiline: {}
  rules:
    - variants:
        size: large
      slots:
        root:
          color: "#aaaaaa"
    - variants:
        type: multiline
      slots:
        root:
          color: "#cccccc"
`;

    expect(() =>
      resolveComponentSpec(parse(yaml), {
        variants: { size: "large", type: "multiline" },
        states: [],
      }),
    ).toThrow("neither takes precedence");
  });
});

describe("getEffectiveStates", () => {
  it("should drop a state cancelled by a surviving stronger state", () => {
    expect(getEffectiveStates(parse(button), ["pressed", "loading", "disabled"])).toEqual([
      "loading",
      "disabled",
    ]);
  });

  it("should keep a state whose only suppressor is inactive", () => {
    expect(getEffectiveStates(parse(button), ["pressed", "loading"])).toEqual([
      "pressed",
      "loading",
    ]);
  });

  it("should return the surviving states weakest first regardless of input order", () => {
    expect(getEffectiveStates(parse(button), ["disabled", "loading"])).toEqual([
      "loading",
      "disabled",
    ]);
  });
});
