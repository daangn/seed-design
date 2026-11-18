// `<blur-view>` JSX entry for this package's own compilation only.
//
// `@lynx-js/types` declares `blur-view` from 4.0, but this package builds against 3.9. Only
// `components/private/LiquidGlass.tsx` renders it, and it pulls this file in with a reference directive,
// which TypeScript does not keep in declaration output, so consumers never see this augmentation.
// Once the package builds against 4.x, this declaration conflicts with the real one (TS2717): delete the file.

import type { StandardProps } from "@lynx-js/types";

declare module "@lynx-js/types" {
  interface IntrinsicElements {
    /** The subset of `@lynx-js/types` 4.x `BlurViewProps` that SEED uses. */
    "blur-view": StandardProps & {
      "blur-effect"?: "light" | "extra-light" | "dark" | "glass" | "glass-container";
      "glass-interactive"?: boolean;
      "glass-style"?: "regular" | "clear";
      /** A resolved color string. CSS variables are not resolved. */
      "glass-tint-color"?: string;
      "ios-user-interface-style"?: "dark" | "light";
    };
  }
}
