import { defineLynxSlotRecipe } from "../../utils/define-lynx";
import { bottomSheet as vars } from "../../vars/component";

/**
 * BottomSheet recipe (Lynx fork).
 *
 * Derived from the web `bottom-sheet` recipe but pruned for Lynx runtime:
 * - No `[data-snap-points]` / `[data-open]` attribute selectors (Lynx only
 *   supports class-based selectors). Backdrop opacity and content transform
 *   are driven entirely by `@lynx-js/lynx-ui-sheet` via main-thread worklets.
 * - No `::after` pseudo-element (unsupported in Lynx) — the web rule extends
 *   content background below the viewport to hide bounce-back. Not needed on
 *   Lynx because there is no native rubber-band scroll beneath the sheet.
 * - No `animation-name` / `animation-duration`. Open/close/snap animations are
 *   tweened by lynx-ui-sheet's motion engine, not CSS keyframes.
 * - No `focus` / `focusVisible` outline — Lynx has no keyboard focus UX.
 *   `closeButton` slot is retained for future Tier B SVG support.
 */
const bottomSheet = defineLynxSlotRecipe({
  name: "bottom-sheet",
  slots: [
    "positioner",
    "backdrop",
    "content",
    "header",
    "body",
    "footer",
    "title",
    "description",
    "closeButton",
  ],
  base: {
    positioner: {
      position: "fixed",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      "--sheet-z-index": "2",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
    },
    backdrop: {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      // Start fully transparent — lynx-ui-sheet's motion engine drives opacity
      // from the sheet's position via `setStyleProperty` on the main thread.
      opacity: 0,

      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      boxSizing: "border-box",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      borderTopLeftRadius: vars.base.enabled.content.topCornerRadius,
      borderTopRightRadius: vars.base.enabled.content.topCornerRadius,
      paddingBottom: "var(--seed-safe-area-bottom)",

      // Initial offscreen position; transforms are driven by main-thread motion.
      transform: "translate3d(0, 100%, 0)",
    },
    header: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.enabled.header.gap,
      paddingTop: vars.base.enabled.header.paddingTop,
      paddingBottom: vars.base.enabled.header.paddingBottom,
    },
    title: {
      color: vars.base.enabled.title.color,
      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,

      margin: 0,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,

      paddingLeft: vars.base.enabled.description.paddingX,
      paddingRight: vars.base.enabled.description.paddingX,

      margin: 0,
    },
    body: {
      display: "flex",
      flexDirection: "column",

      paddingLeft: vars.base.enabled.body.paddingX,
      paddingRight: vars.base.enabled.body.paddingX,
    },
    footer: {
      display: "flex",
      flexDirection: "column",

      paddingLeft: vars.base.enabled.footer.paddingX,
      paddingRight: vars.base.enabled.footer.paddingX,

      paddingTop: vars.base.enabled.footer.paddingTop,
      paddingBottom: vars.base.enabled.footer.paddingBottom,
    },
    closeButton: {
      // Tier B placeholder: Lynx SVG support pending. Kept so the slot exists
      // in the generated recipe output and can be filled in later without a
      // schema change.
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  variants: {
    headerAlign: {
      left: {
        header: {
          justifyContent: "flex-start",
        },
        title: {
          paddingLeft: vars.headerAlignmentLeftCloseButtonFalse.enabled.title.paddingLeft,
          paddingRight: vars.headerAlignmentLeftCloseButtonFalse.enabled.title.paddingRight,
        },
      },
      center: {
        header: {
          justifyContent: "center",
          textAlign: "center",
        },
        title: {
          paddingLeft: vars.headerAlignmentCenterCloseButtonFalse.enabled.title.paddingLeft,
          paddingRight: vars.headerAlignmentCenterCloseButtonFalse.enabled.title.paddingRight,
        },
      },
    },
    skipAnimation: {
      // Retained for API parity; Lynx animations are motion-engine-driven, so
      // there is no CSS-level switching between "animated" and "skip" states.
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    headerAlign: "left",
    skipAnimation: false,
  },
});

export default bottomSheet;
