import { radio } from "@seed-design/css/recipes/radio";
import type { RadioVariantProps } from "@seed-design/css/recipes/radio";
import { radiomark } from "@seed-design/css/recipes/radiomark";
import { LightElement } from "../../internals/light-element";

type Weight = NonNullable<RadioVariantProps["weight"]>;
type Size = NonNullable<RadioVariantProps["size"]>;

/**
 * `<seed-radio value="...">` — one option inside `<seed-radio-group>`.
 *
 * The parent group owns selection and sets this element's `checked`. The radio
 * mark is a pure-CSS dot (no icon); the author's label children are kept.
 */
export class SeedRadio extends LightElement {
  static properties = {
    value: { type: String, reflect: true },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    weight: { type: String },
    size: { type: String },
  };

  declare value: string;
  declare checked: boolean;
  declare disabled: boolean;
  declare weight: Weight;
  declare size: Size;

  private _parts?: {
    control: HTMLSpanElement;
    icon: HTMLSpanElement;
    label: HTMLSpanElement;
  };

  constructor() {
    super();
    this.value = "";
    this.checked = false;
    this.disabled = false;
    this.weight = "regular";
    this.size = "medium";
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "radio");
    if (!this._parts) this._build();
  }

  private _build() {
    const label = document.createElement("span");
    while (this.firstChild) label.appendChild(this.firstChild);

    const control = document.createElement("span");
    // The radio dot is a fixed design shape (not a brand icon), rendered as an
    // inline SVG circle. `fill="currentColor"` picks up the recipe's icon color.
    const icon = document.createElement("span");
    icon.innerHTML =
      '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="12" /></svg>';
    control.appendChild(icon);

    this.append(control, label);
    this._parts = { control, icon, label };
  }

  protected willUpdate() {
    const parts = this._parts;
    if (!parts) return;

    const recipe = radio({ weight: this.weight, size: this.size });
    const mark = radiomark({ size: this.size });

    this.className = recipe.root;
    parts.label.className = recipe.label;
    parts.control.className = mark.root;
    parts.icon.className = mark.icon;
    this.setAttribute("aria-checked", String(this.checked));

    for (const el of [this, parts.control, parts.icon]) {
      el.toggleAttribute("data-checked", this.checked);
      el.toggleAttribute("data-disabled", this.disabled);
    }
  }
}
