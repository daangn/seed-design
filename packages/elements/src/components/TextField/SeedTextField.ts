import { textInput } from "@seed-design/css/recipes/text-input";
import type { TextInputVariantProps } from "@seed-design/css/recipes/text-input";
import { LightElement } from "../../internals/light-element";

type Variant = NonNullable<TextInputVariantProps["variant"]>;
type Size = NonNullable<TextInputVariantProps["size"]>;

/**
 * `<seed-text-field>` — single-line text input (form-associated).
 *
 * Core text-input only for now (no field label/description/char-count). The host
 * is the `text-input` root container; an inner native `<input>` holds the value
 * and participates in forms via `ElementInternals`. Emits `seed-input` on typing.
 */
export class SeedTextField extends LightElement {
  static formAssociated = true;

  static properties = {
    value: { type: String },
    name: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    variant: { type: String },
    size: { type: String },
  };

  declare value: string;
  declare name: string;
  declare placeholder: string;
  declare disabled: boolean;
  declare variant: Variant;
  declare size: Size;

  private _internals: ElementInternals;
  private _input?: HTMLInputElement;

  private _focusInput = () => {
    this._input?.focus();
  };

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.value = "";
    this.name = "";
    this.placeholder = "";
    this.disabled = false;
    this.variant = "outline";
    this.size = "large";
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this._input) {
      const input = document.createElement("input");
      input.type = "text";
      input.addEventListener("input", () => {
        this.value = input.value;
        this._internals.setFormValue(this.value);
        this.dispatchEvent(
          new CustomEvent("seed-input", { detail: { value: this.value }, bubbles: true }),
        );
      });
      this.appendChild(input);
      this._input = input;
    }
    this.addEventListener("click", this._focusInput);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._focusInput);
  }

  protected willUpdate() {
    const input = this._input;
    if (!input) return;

    const classes = textInput({ variant: this.variant, size: this.size });
    this.className = classes.root;
    input.className = classes.value;

    if (input.value !== this.value) input.value = this.value;
    input.placeholder = this.placeholder;
    input.disabled = this.disabled;
    input.name = this.name;

    this._internals.setFormValue(this.value);
    this.toggleAttribute("data-disabled", this.disabled);
  }

  formResetCallback() {
    this.value = "";
  }
}
