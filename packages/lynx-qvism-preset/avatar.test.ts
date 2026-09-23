import { describe, expect, it } from "bun:test";

import avatar from "./src/recipes/avatar";

describe("Lynx Avatar mask transitions", () => {
  it("keeps a fully opaque mask and stable geometry when the cutout is disabled", () => {
    for (const slot of ["imageContainer", "fallback", "stroke"] as const) {
      const base = avatar.base[slot];
      expect(base.maskImage).toBe("linear-gradient(#000, #000)");
      expect(base.maskSize).toBe("100% 100%");
      expect(base.maskPosition).toBe("0px 0px");
      expect(base.maskRepeat).toBe("no-repeat");

      for (const shape of ["circle", "flower", "shield"] as const) {
        const resolved = { ...base, ...avatar.variants.badgeMask[shape][slot] };
        expect(resolved.maskImage).toBe(`var(--avatar-badge-mask-${shape})`);
        expect(resolved.maskSize).toBe(base.maskSize);
        expect(resolved.maskPosition).toBe(base.maskPosition);
        expect(resolved.maskRepeat).toBe(base.maskRepeat);
      }
    }
  });
});
