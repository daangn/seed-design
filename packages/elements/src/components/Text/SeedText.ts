import { text } from "@seed-design/css/recipes/text";
import type { TextVariantProps } from "@seed-design/css/recipes/text";
import { LightElement } from "../../internals/light-element";

type TextStyle = NonNullable<TextVariantProps["textStyle"]>;
type MaxLines = NonNullable<TextVariantProps["maxLines"]>;
type TextDecorationLine = NonNullable<TextVariantProps["textDecorationLine"]>;

/**
 * `<seed-text>` — typography.
 *
 * Non-interactive presentational pattern: the `text` recipe className is applied
 * to the host and author children are left untouched (no `render()`).
 */
export class SeedText extends LightElement {
  static properties = {
    textStyle: { type: String, attribute: "text-style" },
    maxLines: { type: String, attribute: "max-lines" },
    textDecorationLine: { type: String, attribute: "text-decoration-line" },
  };

  declare textStyle: TextStyle;
  declare maxLines: MaxLines;
  declare textDecorationLine: TextDecorationLine;

  constructor() {
    super();
    this.textStyle = "t5Regular";
    this.maxLines = "none";
    this.textDecorationLine = "none";
  }

  protected willUpdate() {
    this.setAttribute(
      "class",
      text({
        textStyle: this.textStyle,
        maxLines: this.maxLines,
        textDecorationLine: this.textDecorationLine,
      }),
    );
  }
}
