import { LitElement } from "lit";

/**
 * Base class for all SEED elements.
 *
 * Renders into **Light DOM** (`createRenderRoot` returns the host itself) so that
 * SEED's global, class-based recipe CSS and `:root` design tokens apply directly,
 * matching the `@seed-design/react` model where `@seed-design/css` is a peer that
 * the consumer loads globally. Shadow DOM, `<slot>`, `::part`, and `static styles`
 * are intentionally unavailable here.
 */
export class LightElement extends LitElement {
  protected createRenderRoot() {
    return this;
  }
}
