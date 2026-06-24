import { radioGroup } from "@seed-design/css/recipes/radio-group";
import { LightElement } from "../../internals/light-element";
import type { SeedRadio } from "./SeedRadio";

/**
 * `<seed-radio-group value name>` — single-select radio group.
 *
 * Cross-element + form pattern: owns `value`/`name`, sets each child
 * `<seed-radio>`'s `checked`, and participates in forms via `ElementInternals`.
 */
export class SeedRadioGroup extends LightElement {
  static formAssociated = true;

  static properties = {
    value: { type: String },
    name: { type: String },
  };

  declare value: string;
  declare name: string;

  private _internals: ElementInternals;

  private _onClick = (event: Event) => {
    const radio = (event.target as HTMLElement).closest("seed-radio");
    if (!radio || radio.hasAttribute("disabled")) return;

    const next = radio.getAttribute("value") ?? "";
    if (next === this.value) return;

    this.value = next;
    this.dispatchEvent(
      new CustomEvent("seed-change", { detail: { value: this.value }, bubbles: true }),
    );
  };

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._internals.role = "radiogroup";
    this.value = "";
    this.name = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this._onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._onClick);
  }

  protected willUpdate() {
    this.className = radioGroup();

    const radios = [...this.querySelectorAll<SeedRadio>("seed-radio")];
    for (const radio of radios) {
      radio.checked = radio.getAttribute("value") === this.value;
    }

    this._internals.setFormValue(this.value || null);
  }
}
