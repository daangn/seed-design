import { SeedRadio } from "../components/RadioGroup/SeedRadio";
import { SeedRadioGroup } from "../components/RadioGroup/SeedRadioGroup";

if (!customElements.get("seed-radio-group")) {
  customElements.define("seed-radio-group", SeedRadioGroup);
}
if (!customElements.get("seed-radio")) {
  customElements.define("seed-radio", SeedRadio);
}

declare global {
  interface HTMLElementTagNameMap {
    "seed-radio-group": SeedRadioGroup;
    "seed-radio": SeedRadio;
  }
}
