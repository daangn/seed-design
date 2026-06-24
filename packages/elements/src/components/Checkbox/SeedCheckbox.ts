import { checkbox } from "@seed-design/css/recipes/checkbox";
import type { CheckboxVariantProps } from "@seed-design/css/recipes/checkbox";
import { checkmark } from "@seed-design/css/recipes/checkmark";
import type { PropertyValues } from "lit";
import { LightElement } from "../../internals/light-element";
import { VISUALLY_HIDDEN } from "../../internals/visually-hidden";

type Weight = NonNullable<CheckboxVariantProps["weight"]>;
type Size = NonNullable<CheckboxVariantProps["size"]>;

/**
 * `<seed-checkbox>` — form-associated, **white-label** checkbox.
 *
 * Ships NO concrete check icon: the checkmark SVG is supplied by the consumer
 * through the `checkedIcon` property (typically pinned in a copied snippet that
 * subclasses this element), so the published package carries zero icon
 * dependency. An inner native `<input type="checkbox">` (visually hidden) holds
 * the form value via `ElementInternals`; the `checkbox`/`checkmark` recipes style
 * the host (as label) and the control. Author children become the label, and
 * interaction state is mirrored as `data-*` (the recipe CSS matches both native
 * pseudo-classes and `data-*`).
 */
export class SeedCheckbox extends LightElement {
  static formAssociated = true;

  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    value: { type: String },
    name: { type: String },
    weight: { type: String },
    size: { type: String },
    checkedIcon: { attribute: false },
  };

  declare checked: boolean;
  declare disabled: boolean;
  declare value: string;
  declare name: string;
  declare weight: Weight;
  declare size: Size;
  /** SVG markup for the checkmark. Supplied by the consumer (snippet), not the package. */
  declare checkedIcon: string;

  private _internals: ElementInternals;
  private _parts?: {
    input: HTMLInputElement;
    control: HTMLSpanElement;
    icon: HTMLSpanElement;
    label: HTMLSpanElement;
  };

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.checked = false;
    this.disabled = false;
    this.value = "on";
    this.name = "";
    this.weight = "regular";
    this.size = "medium";
    this.checkedIcon = "";
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._parts) this._build();
  }

  private _build() {
    // author children become the label
    const label = document.createElement("span");
    while (this.firstChild) label.appendChild(this.firstChild);

    const input = document.createElement("input");
    input.type = "checkbox";
    Object.assign(input.style, VISUALLY_HIDDEN);
    input.addEventListener("change", () => {
      this.checked = input.checked;
      this._emitChange();
    });

    const control = document.createElement("span");
    const icon = document.createElement("span");
    control.appendChild(icon);

    this.append(input, control, label);
    this._parts = { input, control, icon, label };

    // host acts as the label: a click anywhere toggles the input
    this.addEventListener("click", (event) => {
      if (this.disabled || event.target === input) return;

      input.click();
    });
  }

  protected willUpdate(changed: PropertyValues) {
    const parts = this._parts;
    if (!parts) return;

    const recipe = checkbox({ weight: this.weight, size: this.size });
    const mark = checkmark({ size: this.size });

    this.className = recipe.root;
    parts.label.className = recipe.label;
    parts.control.className = mark.root;
    parts.icon.className = mark.icon;

    // consumer-supplied checkmark SVG; reparse only when it changes
    if (changed.has("checkedIcon")) parts.icon.innerHTML = this.checkedIcon;

    parts.input.checked = this.checked;
    parts.input.disabled = this.disabled;
    parts.input.name = this.name;
    parts.input.value = this.value;

    for (const el of [this, parts.control, parts.icon, parts.label]) {
      el.toggleAttribute("data-checked", this.checked);
      el.toggleAttribute("data-disabled", this.disabled);
    }

    this._internals.setFormValue(this.checked ? this.value : null);
    this._internals.ariaChecked = String(this.checked);
  }

  private _emitChange() {
    this.dispatchEvent(
      new CustomEvent("seed-change", {
        detail: { checked: this.checked },
        bubbles: true,
      }),
    );
  }

  formResetCallback() {
    this.checked = false;
  }
}
