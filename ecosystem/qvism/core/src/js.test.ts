import { describe, expect, it } from "bun:test";
import { runInNewContext } from "node:vm";

import { generateSharedJs, generateSlotRecipeJs } from "./js";

const definition = {
  name: "audit-button",
  slots: ["root", "label"],
  base: {},
  variants: {
    size: { small: {}, large: {} },
    disabled: { true: {}, false: {} },
  },
  defaultVariants: { size: "small", disabled: false },
  compoundVariants: [{ size: "large", disabled: true, css: {} }],
};

const generated = generateSlotRecipeJs(definition, { prefix: "seed", importCss: false });
const runtime = runInNewContext(
  `${generateSharedJs().replaceAll("export ", "")}\n${generated
    .replace(/^import .*;$/m, "")
    .replaceAll(
      "export ",
      "",
    )}\n({ recipe: auditButton, map: auditButtonVariantMap, keys: auditButtonVariantKeys })`,
) as {
  recipe: ((props?: Record<string, unknown>) => Record<string, string>) & {
    splitVariantProps(
      props: Record<string, unknown>,
    ): [Record<string, unknown>, Record<string, unknown>];
  };
  map: Record<string, unknown[]>;
  keys: string[];
};

describe("generated slot recipe shared runtime", () => {
  it("preserves the complete generated module", () => {
    expect(generated).toMatchSnapshot();
  });

  it("preserves default and boolean variants, compound order, and both slots", () => {
    expect(runtime.recipe()).toEqual({
      root: "seed-audit-button__root seed-audit-button__root--size_small seed-audit-button__root--disabled_false",
      label:
        "seed-audit-button__label seed-audit-button__label--size_small seed-audit-button__label--disabled_false",
    });
    expect(runtime.recipe({ size: "large", disabled: true })).toEqual({
      root: "seed-audit-button__root seed-audit-button__root--size_large seed-audit-button__root--disabled_true seed-audit-button__root--size_large-disabled_true",
      label:
        "seed-audit-button__label seed-audit-button__label--size_large seed-audit-button__label--disabled_true seed-audit-button__label--size_large-disabled_true",
    });
    expect(runtime.recipe({ size: null, disabled: undefined })).toEqual(runtime.recipe());
    expect(runtime.recipe({ disabled: false })).toEqual(runtime.recipe());
  });

  it("preserves public variant metadata and prop splitting including null", () => {
    expect(runtime.map).toEqual({ size: ["small", "large"], disabled: [true, false] });
    expect(runtime.keys).toEqual(["size", "disabled"]);
    expect(runtime.recipe.splitVariantProps({ size: null, disabled: false, id: "native" })).toEqual(
      [{ size: null, disabled: false }, { id: "native" }],
    );
  });
});
