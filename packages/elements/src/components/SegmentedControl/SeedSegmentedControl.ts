import { segmentedControl } from "@seed-design/css/recipes/segmented-control";
import { LightElement } from "../../internals/light-element";

/**
 * `<seed-segmented-control>` — single-select group with a sliding indicator.
 *
 * Cross-element pattern: the root owns `value`/`name`, toggles each child
 * `<seed-segmented-control-item>`'s `data-checked`, and positions the indicator
 * purely via CSS custom properties (`--segment-count`, `--segment-index`) — no
 * layout measurement needed. Participates in forms via `ElementInternals`.
 */
export class SeedSegmentedControl extends LightElement {
  static formAssociated = true;

  static properties = {
    value: { type: String },
    name: { type: String },
  };

  declare value: string;
  declare name: string;

  private _internals: ElementInternals;
  private _indicator?: HTMLSpanElement;

  private _onClick = (event: Event) => {
    const item = (event.target as HTMLElement).closest("seed-segmented-control-item");
    if (!item || item.hasAttribute("disabled")) return;

    const next = item.getAttribute("value") ?? "";
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

    if (!this._indicator) {
      const indicator = document.createElement("span");
      this.prepend(indicator);
      this._indicator = indicator;
    }
    this.addEventListener("click", this._onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._onClick);
  }

  protected willUpdate() {
    const classes = segmentedControl();
    this.className = classes.root;

    const items = [...this.querySelectorAll("seed-segmented-control-item")];
    this.style.setProperty("--segment-count", String(items.length));

    let selectedIndex = -1;
    items.forEach((item, index) => {
      const isSelected = item.getAttribute("value") === this.value;
      item.toggleAttribute("data-checked", isSelected);
      if (isSelected) selectedIndex = index;
    });

    if (this._indicator) {
      this._indicator.className = classes.indicator;
      this._indicator.style.setProperty("--segment-index", String(Math.max(selectedIndex, 0)));
      this._indicator.hidden = selectedIndex < 0;
    }

    this._internals.setFormValue(this.value || null);
  }
}
