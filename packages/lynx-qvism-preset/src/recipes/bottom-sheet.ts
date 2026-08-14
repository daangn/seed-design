import { defineSlotRecipe } from "../utils/define";
import { bottomSheet as vars } from "../vars/component";

/**
 * Lynx-전용 BottomSheet recipe.
 *
 * 정적 layout/surface/typography 스타일만 className으로 제공하고, backdrop/content
 * motion은 `@lynx-js/lynx-ui-sheet`의 main-thread worklet이 직접 구동한다.
 */
const bottomSheet = defineSlotRecipe({
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

      "--sheet-z-index": "20",
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

      background: vars.base.rest.backdrop.color,
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      background: vars.base.rest.content.color,
      borderTopLeftRadius: vars.base.rest.content.topCornerRadius,
      borderTopRightRadius: vars.base.rest.content.topCornerRadius,

      // Initial offscreen position; transforms are driven by main-thread motion.
      transform: "translate3d(0, 100%, 0)",
    },
    header: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.rest.header.gap,
      paddingTop: vars.base.rest.header.paddingTop,
      paddingBottom: vars.base.rest.header.paddingBottom,
    },
    title: {
      color: vars.base.rest.title.color,
      fontSize: vars.base.rest.title.fontSize,
      lineHeight: vars.base.rest.title.lineHeight,
      fontWeight: vars.base.rest.title.fontWeight,

      margin: 0,
    },
    description: {
      color: vars.base.rest.description.color,
      fontSize: vars.base.rest.description.fontSize,
      lineHeight: vars.base.rest.description.lineHeight,
      fontWeight: vars.base.rest.description.fontWeight,

      paddingLeft: vars.base.rest.description.paddingX,
      paddingRight: vars.base.rest.description.paddingX,

      margin: 0,
    },
    body: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: "0",

      paddingLeft: vars.base.rest.body.paddingX,
      paddingRight: vars.base.rest.body.paddingX,
    },
    footer: {
      display: "flex",
      flexDirection: "column",

      paddingLeft: vars.base.rest.footer.paddingX,
      paddingRight: vars.base.rest.footer.paddingX,

      paddingTop: vars.base.rest.footer.paddingTop,
      paddingBottom: vars.base.rest.footer.paddingBottom,
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
          paddingLeft: vars.headerAlignmentLeftCloseButtonFalse.rest.title.paddingLeft,
          paddingRight: vars.headerAlignmentLeftCloseButtonFalse.rest.title.paddingRight,
        },
      },
      center: {
        header: {
          justifyContent: "center",
          textAlign: "center",
        },
        title: {
          paddingLeft: vars.headerAlignmentCenterCloseButtonFalse.rest.title.paddingLeft,
          paddingRight: vars.headerAlignmentCenterCloseButtonFalse.rest.title.paddingRight,
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
