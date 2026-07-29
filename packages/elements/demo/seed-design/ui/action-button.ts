import { SeedActionButton } from "@seed-design/elements";

/**
 * Snippet (layer 2) — ActionButton needs no icon/label baked in, so this is just
 * the class registered under its tag. Extend it here if you want project defaults.
 */
if (!customElements.get("seed-action-button")) {
  customElements.define("seed-action-button", SeedActionButton);
}
