import { SeedSegmentedControl, SeedSegmentedControlItem } from "@seed-design/elements";

if (!customElements.get("seed-segmented-control")) {
  customElements.define("seed-segmented-control", SeedSegmentedControl);
}
if (!customElements.get("seed-segmented-control-item")) {
  customElements.define("seed-segmented-control-item", SeedSegmentedControlItem);
}
