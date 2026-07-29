import { actionButton } from "@seed-design/css/recipes/action-button";
import type { ActionButtonVariantProps } from "@seed-design/css/recipes/action-button";
import { LightElement } from "../../internals/light-element";

type Variant = NonNullable<ActionButtonVariantProps["variant"]>;
type Size = NonNullable<ActionButtonVariantProps["size"]>;
type Layout = NonNullable<ActionButtonVariantProps["layout"]>;

/**
 * `<seed-action-button>` — interactive button.
 *
 * Follows the verified Light-DOM interactive pattern: author children are moved
 * into an inner native `<button>` (giving native focus, keyboard, and `:disabled`
 * for free), and the `actionButton` recipe className is applied to that button.
 * The host element itself is never made `role="button"`.
 */
export class SeedActionButton extends LightElement {
  static properties = {
    variant: { type: String },
    size: { type: String },
    layout: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  declare variant: Variant;
  declare size: Size;
  declare layout: Layout;
  declare disabled: boolean;

  private _button?: HTMLButtonElement;

  constructor() {
    super();
    this.variant = "brandSolid";
    this.size = "medium";
    this.layout = "withText";
    this.disabled = false;
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this._button) {
      const button = document.createElement("button");
      button.type = "button";
      while (this.firstChild) button.appendChild(this.firstChild);
      this.appendChild(button);
      this._button = button;
    }
  }

  protected willUpdate() {
    const button = this._button;
    if (!button) return;

    button.className = actionButton({
      variant: this.variant,
      size: this.size,
      layout: this.layout,
    });
    button.disabled = this.disabled;
  }
}
