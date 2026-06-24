import { badge } from "@seed-design/css/recipes/badge";
import type { BadgeVariantProps } from "@seed-design/css/recipes/badge";
import { LightElement } from "../../internals/light-element";

type Size = NonNullable<BadgeVariantProps["size"]>;
type Variant = NonNullable<BadgeVariantProps["variant"]>;
type Tone = NonNullable<BadgeVariantProps["tone"]>;

/**
 * `<seed-badge>` — status badge.
 *
 * The `badge` slot recipe returns `{ root, label }`: the host takes the `root`
 * class and the author's children are wrapped in an inner label span that takes
 * the `label` class.
 */
export class SeedBadge extends LightElement {
  static properties = {
    size: { type: String },
    variant: { type: String },
    tone: { type: String },
  };

  declare size: Size;
  declare variant: Variant;
  declare tone: Tone;

  private _label?: HTMLSpanElement;

  constructor() {
    super();
    this.size = "medium";
    this.variant = "solid";
    this.tone = "neutral";
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this._label) {
      const label = document.createElement("span");
      while (this.firstChild) label.appendChild(this.firstChild);
      this.appendChild(label);
      this._label = label;
    }
  }

  protected willUpdate() {
    const recipe = badge({ size: this.size, variant: this.variant, tone: this.tone });
    this.setAttribute("class", recipe.root);
    if (this._label) this._label.className = recipe.label;
  }
}
