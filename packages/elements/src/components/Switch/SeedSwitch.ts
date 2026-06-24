import { switchStyle } from "@seed-design/css/recipes/switch";
import type { SwitchVariantProps } from "@seed-design/css/recipes/switch";
import { switchmark } from "@seed-design/css/recipes/switchmark";
import { LightElement } from "../../internals/light-element";
import { VISUALLY_HIDDEN } from "../../internals/visually-hidden";

type Size = NonNullable<SwitchVariantProps["size"]>;

/**
 * `<seed-switch>` — form-associated toggle.
 *
 * Same composite-form pattern as `<seed-checkbox>`: an inner native
 * `<input type="checkbox" role="switch">` (visually hidden) holds the form value
 * via `ElementInternals`, and the `switch`/`switchmark` recipes style the host
 * (as label), the track, and the thumb. No icon needed (the thumb is pure CSS).
 */
export class SeedSwitch extends LightElement {
  static formAssociated = true;

  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    value: { type: String },
    name: { type: String },
    size: { type: String },
  };

  declare checked: boolean;
  declare disabled: boolean;
  declare value: string;
  declare name: string;
  declare size: Size;

  private _internals: ElementInternals;
  private _parts?: {
    input: HTMLInputElement;
    control: HTMLSpanElement;
    thumb: HTMLSpanElement;
    label: HTMLSpanElement;
  };

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.checked = false;
    this.disabled = false;
    this.value = "on";
    this.name = "";
    this.size = "32";
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._parts) this._build();
  }

  private _build() {
    const label = document.createElement("span");
    while (this.firstChild) label.appendChild(this.firstChild);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("role", "switch");
    Object.assign(input.style, VISUALLY_HIDDEN);
    input.addEventListener("change", () => {
      this.checked = input.checked;
      this._emitChange();
    });

    const control = document.createElement("span");
    // thumb has no `display` in the recipe CSS (React renders it as a div); a
    // span would be inline and drop its width/height, so use a div.
    const thumb = document.createElement("div");
    control.appendChild(thumb);

    this.append(input, control, label);
    this._parts = { input, control, thumb, label };

    this.addEventListener("click", (event) => {
      if (this.disabled || event.target === input) return;

      input.click();
    });
  }

  protected willUpdate() {
    const parts = this._parts;
    if (!parts) return;

    const recipe = switchStyle({ size: this.size });
    const mark = switchmark({ size: this.size });

    this.className = recipe.root;
    parts.label.className = recipe.label;
    parts.control.className = mark.root;
    parts.thumb.className = mark.thumb;

    parts.input.checked = this.checked;
    parts.input.disabled = this.disabled;
    parts.input.name = this.name;
    parts.input.value = this.value;

    for (const el of [this, parts.control, parts.thumb, parts.label]) {
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
