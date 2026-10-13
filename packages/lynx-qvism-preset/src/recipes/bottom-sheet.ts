import { defineSlotRecipe } from "../utils/define";
import { bottomSheetCloseButton as closeButtonVars, bottomSheet as vars } from "../vars/component";

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
    "closeButtonIcon",
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

      background: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      background: vars.base.enabled.content.color,
      maxWidth: vars.base.enabled.content.maxWidth,
      borderTopLeftRadius: vars.base.enabled.content.topCornerRadius,
      borderTopRightRadius: vars.base.enabled.content.topCornerRadius,

      // Initial offscreen position; transforms are driven by main-thread motion.
      transform: "translate3d(0, 100%, 0)",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      // Lynx gives flex items no `min-height: auto`, so without this the header and footer shrink
      // along with the body once the content reaches its max height.
      flexShrink: 0,

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
      flexShrink: 0,

      paddingLeft: vars.base.enabled.footer.paddingX,
      paddingRight: vars.base.enabled.footer.paddingX,

      paddingTop: vars.base.enabled.footer.paddingTop,
      paddingBottom: vars.base.enabled.footer.paddingBottom,
    },
    closeButton: {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      top: vars.base.enabled.closeButton.fromTop,
      right: vars.base.enabled.closeButton.fromRight,
      width: closeButtonVars.base.enabled.root.size,
      height: closeButtonVars.base.enabled.root.size,
      borderRadius: closeButtonVars.base.enabled.root.cornerRadius,
      backgroundColor: closeButtonVars.base.enabled.root.color,
    },
    closeButtonIcon: {
      flexShrink: 0,
      width: closeButtonVars.base.enabled.icon.size,
      height: closeButtonVars.base.enabled.icon.size,
      color: closeButtonVars.base.enabled.icon.color,
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
    // Set by Root while a CloseButton is rendered, so the title leaves room for it.
    closeButton: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      headerAlign: "left",
      closeButton: true,
      css: {
        title: {
          paddingLeft: vars.headerAlignmentLeftCloseButtonTrue.enabled.title.paddingLeft,
          paddingRight: vars.headerAlignmentLeftCloseButtonTrue.enabled.title.paddingRight,
        },
      },
    },
    {
      headerAlign: "center",
      closeButton: true,
      css: {
        title: {
          paddingLeft: vars.headerAlignmentCenterCloseButtonTrue.enabled.title.paddingLeft,
          paddingRight: vars.headerAlignmentCenterCloseButtonTrue.enabled.title.paddingRight,
        },
      },
    },
  ],
  defaultVariants: {
    headerAlign: "left",
    skipAnimation: false,
    closeButton: false,
  },
});

export default bottomSheet;
