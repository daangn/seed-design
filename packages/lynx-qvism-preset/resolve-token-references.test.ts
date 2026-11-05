import { describe, expect, it } from "bun:test";

import { resolveTokenReferences } from "./src/utils/resolve-token-references";

describe("resolveTokenReferences", () => {
  it("resolves inherited, mode-specific, and embedded token references", () => {
    const tokens = {
      _raw: `:root {
  --seed-dimension-base: 4px;
  --seed-dimension-semantic: var(--seed-dimension-base);
}

:root,
.seed-color-mode-light {
  --seed-color-palette-neutral: #111111;
  --seed-color-fg-neutral: var(--seed-color-palette-neutral);
  --seed-color-fg-static: var(--seed-color-palette-neutral);
  --seed-gradient-fade: var(--seed-color-fg-neutral) 0%, #00000000 100%;
  --seed-component-spacing: var(--seed-dimension-semantic);
}

.seed-color-mode-dark {
  --seed-color-palette-neutral: #eeeeee;
  --seed-color-fg-neutral: var(--seed-color-palette-neutral);
  --seed-gradient-fade: var(--seed-color-fg-neutral) 0%, #00000000 100%;
  --seed-component-fg-static: var(--seed-color-fg-static);
  --seed-component-spacing: var(--seed-dimension-semantic);
}`,
    };

    expect(resolveTokenReferences(tokens)._raw).toBe(`:root {
  --seed-dimension-base: 4px;
  --seed-dimension-semantic: 4px;
}

:root,
.seed-color-mode-light {
  --seed-color-palette-neutral: #111111;
  --seed-color-fg-neutral: #111111;
  --seed-color-fg-static: #111111;
  --seed-gradient-fade: #111111 0%, #00000000 100%;
  --seed-component-spacing: 4px;
}

.seed-color-mode-dark {
  --seed-color-palette-neutral: #eeeeee;
  --seed-color-fg-neutral: #eeeeee;
  --seed-gradient-fade: #eeeeee 0%, #00000000 100%;
  --seed-component-fg-static: #111111;
  --seed-component-spacing: 4px;
}`);
  });
});
