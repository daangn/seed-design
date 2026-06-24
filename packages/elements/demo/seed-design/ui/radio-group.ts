import { SeedRadio, SeedRadioGroup } from "@seed-design/elements";

if (!customElements.get("seed-radio-group")) {
  customElements.define("seed-radio-group", SeedRadioGroup);
}
if (!customElements.get("seed-radio")) {
  customElements.define("seed-radio", SeedRadio);
}
