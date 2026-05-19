import { defineGlobalCss, defineKeyframes, defineRecipe } from "./define";

void defineRecipe({
  name: "strict-ok",
  base: {
    display: "flex",
    "--seed-strict-ok-color": "currentColor",
  },
  variants: {},
  defaultVariants: {},
});

void defineGlobalCss({
  ".seed-strict-ok": {
    display: "flex",
    "--seed-strict-ok-color": "currentColor",
  },
});

void defineKeyframes({
  "strict-ok": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

void defineRecipe({
  name: "strict-bad-inset",
  base: {
    // @ts-expect-error inset shorthand must be expanded to top/right/bottom/left.
    inset: 0,
  },
  variants: {},
  defaultVariants: {},
});

void defineRecipe({
  name: "strict-bad-property",
  base: {
    // @ts-expect-error boxSizing is intentionally disallowed in Lynx preset sources.
    boxSizing: "border-box",
  },
  variants: {},
  defaultVariants: {},
});

void defineGlobalCss({
  ".seed-bad-keyword": {
    // @ts-expect-error CSS-wide keywords must be replaced with explicit Lynx fallbacks.
    "--seed-bad-value": "initial",
  },
});

void defineKeyframes({
  "strict-bad-keyframe": {
    from: {
      // @ts-expect-error SVG stroke animation is outside the Lynx preset CSS contract.
      strokeDasharray: "0, 1000%",
    },
  },
});
