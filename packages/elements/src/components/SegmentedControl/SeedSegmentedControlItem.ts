import { segmentedControl } from "@seed-design/css/recipes/segmented-control";
import { LightElement } from "../../internals/light-element";

/**
 * `<seed-segmented-control-item value="...">` — one segment.
 *
 * The parent `<seed-segmented-control>` owns selection and toggles this item's
 * `data-checked`; here we only apply the `item` recipe class to the host and
 * keep the author's label children.
 */
export class SeedSegmentedControlItem extends LightElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  declare value: string;
  declare disabled: boolean;

  constructor() {
    super();
    this.value = "";
    this.disabled = false;
  }

  protected willUpdate() {
    this.setAttribute("class", segmentedControl().item);
  }
}
