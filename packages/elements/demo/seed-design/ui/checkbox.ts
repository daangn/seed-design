import { SeedCheckbox } from "@seed-design/elements";

/**
 * Snippet (layer 2) — the place to pin a concrete checkmark icon.
 *
 * DEFERRED: @karrotmarket/icon-data currently exposes icons as SVG *strings*
 * only, which would force a raw `innerHTML` injection. We're holding the icon
 * until icon-data provides them as SVG files (importable) or as icon web
 * components — then set `this.checkedIcon` (or compose the icon element) here.
 * Until then `<seed-checkbox>` renders without a checkmark glyph.
 */
export class Checkbox extends SeedCheckbox {}

if (!customElements.get("seed-checkbox")) {
  customElements.define("seed-checkbox", Checkbox);
}
