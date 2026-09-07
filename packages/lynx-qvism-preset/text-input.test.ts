import { describe, expect, it } from "bun:test";

import textInput from "./src/recipes/text-input";
import { textInput as vars } from "./src/vars/component";
import { pseudo } from "./src/utils/pseudo";

describe("Lynx text input recipe", () => {
  it("uses the component tokens for enabled and disabled placeholders", () => {
    expect(textInput.base["value"][pseudo("::placeholder")]).toEqual({
      color: vars.base.enabled.placeholder.color,
      fontWeight: vars.base.enabled.placeholder.fontWeight,
    });
    expect(
      textInput.variants["disabled"]["true"]["value"][pseudo("::placeholder")],
    ).toEqual({
      color: vars.base.disabled.placeholder.color,
    });
  });
});
