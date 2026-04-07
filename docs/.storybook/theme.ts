import { create } from "storybook/theming/create";

/**
 * Storybook brand theme for Ride Design System.
 *
 * IMPORTANT: The values below mirror the SEMANTIC tokens defined in
 * `packages/rootage/color.yaml` (Ride Design System rootage). Storybook's
 * manager UI is a build-time React app that cannot resolve CSS custom
 * properties like `var(--ride-color-*)`, so we hardcode the hex values here.
 *
 * If rootage ever changes, re-sync these values from:
 *   $color.fg.neutral              → gray-1000
 *   $color.fg.neutral-muted        → gray-800
 *   $color.fg.neutral-subtle       → gray-700
 *   $color.fg.brand                → carrot-600 (remapped to Ride blue)
 *   $color.fg.brand-contrast       → carrot-700 (remapped to Ride blue)
 *   $color.bg.layer-basement       → gray-200
 *   $color.bg.layer-default        → gray-00
 *   $color.bg.neutral-weak         → gray-200
 *   $color.bg.brand-weak           → carrot-100 (remapped to Ride blue)
 *   $color.stroke.neutral-muted    → static-black-alpha-300
 */
const color = {
  // Foreground / text
  fgNeutral: "#1a1c20",         // fg.neutral        (gray-1000)
  fgNeutralMuted: "#555d6d",    // fg.neutral-muted  (gray-800)
  fgNeutralSubtle: "#868b94",   // fg.neutral-subtle (gray-700)
  fgBrand: "#0a93ff",           // fg.brand          (carrot-600 → blue-600)
  fgBrandContrast: "#0679df",   // fg.brand-contrast (carrot-700 → blue-700)

  // Background / surfaces
  bgLayerBasement: "#f3f4f5",   // bg.layer-basement (gray-200)
  bgLayerDefault: "#ffffff",    // bg.layer-default  (gray-00)
  bgNeutralWeak: "#f3f4f5",     // bg.neutral-weak   (gray-200)
  bgBrandWeak: "#ebf6ff",       // bg.brand-weak     (carrot-100 → blue-100)

  // Stroke / borders
  strokeNeutralMuted: "#00000010", // stroke.neutral-muted (static-black-alpha-300)
};

export default create({
  base: "light",
  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: "monospace",

  brandTitle: "Ride Design Storybook",

  brandImage: "/ridelogo.png",
  brandTarget: "_self",

  // Brand accents
  colorPrimary: color.fgBrand,
  colorSecondary: color.fgBrandContrast,

  // UI surfaces
  appBg: color.bgLayerBasement,
  appContentBg: color.bgLayerDefault,
  appPreviewBg: color.bgLayerDefault,
  appBorderColor: color.strokeNeutralMuted,
  appBorderRadius: 12,

  // Text
  textColor: color.fgNeutral,
  textInverseColor: color.bgLayerDefault,
  textMutedColor: color.fgNeutralSubtle,

  // Toolbar
  barTextColor: color.fgNeutralMuted,
  barSelectedColor: color.fgBrand,
  barHoverColor: color.fgBrandContrast,
  barBg: color.bgLayerDefault,

  // Buttons
  buttonBg: color.bgNeutralWeak,
  buttonBorder: color.strokeNeutralMuted,

  // Form
  inputBg: color.bgLayerDefault,
  inputBorder: color.strokeNeutralMuted,
  inputTextColor: color.fgNeutral,
  inputBorderRadius: 10,

  // Booleans / toggles
  booleanBg: color.bgNeutralWeak,
  booleanSelectedBg: color.bgBrandWeak,
});
