import { SeedSegmentedControl } from "../components/SegmentedControl/SeedSegmentedControl";
import { SeedSegmentedControlItem } from "../components/SegmentedControl/SeedSegmentedControlItem";

if (!customElements.get("seed-segmented-control")) {
  customElements.define("seed-segmented-control", SeedSegmentedControl);
}
if (!customElements.get("seed-segmented-control-item")) {
  customElements.define("seed-segmented-control-item", SeedSegmentedControlItem);
}

declare global {
  interface HTMLElementTagNameMap {
    "seed-segmented-control": SeedSegmentedControl;
    "seed-segmented-control-item": SeedSegmentedControlItem;
  }
}
