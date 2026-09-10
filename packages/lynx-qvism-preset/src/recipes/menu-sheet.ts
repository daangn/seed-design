import { menuSheetCloseButton as closeButtonVars, menuSheet as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx MenuSheet recipe.
 *
 * Backdrop and moving content surface motion are owned by BottomSheet's
 * main-thread engine. This recipe only supplies their static presentation.
 */
const menuSheet = defineSlotRecipe({
  name: "menu-sheet",
  slots: [
    "positioner",
    "backdrop",
    "content",
    "contentInner",
    "header",
    "title",
    "description",
    "list",
    "group",
    "footer",
    "closeButton",
    "closeButtonLabel",
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

      // The BottomSheet worklet drives opacity from the current sheet position.
      opacity: 0,
      backgroundColor: vars.base.enabled.backdrop.color,
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",
    },
    content: {
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      zIndex: "calc(var(--sheet-z-index) + var(--layer-index, 0))",

      backgroundColor: vars.base.enabled.content.color,
      maxWidth: vars.base.enabled.content.maxWidth,
      borderTopLeftRadius: vars.base.enabled.content.topCornerRadius,
      borderTopRightRadius: vars.base.enabled.content.topCornerRadius,

      // The BottomSheet worklet owns this transform after the initial frame.
      transform: "translate3d(0, 100%, 0)",
    },
    contentInner: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      paddingTop: vars.base.enabled.content.paddingTop,
      paddingRight: vars.base.enabled.content.paddingX,
      paddingLeft: vars.base.enabled.content.paddingX,
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: vars.base.enabled.header.gap,
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
      margin: 0,
    },
    list: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: vars.base.enabled.list.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      overflow: "hidden",
      borderRadius: vars.base.enabled.group.cornerRadius,
    },
    footer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      paddingTop: vars.base.enabled.footer.paddingTop,
    },
    closeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: closeButtonVars.base.enabled.root.color,
      minHeight: closeButtonVars.base.enabled.root.minHeight,
      paddingTop: closeButtonVars.base.enabled.root.paddingY,
      paddingRight: closeButtonVars.base.enabled.root.paddingX,
      paddingBottom: closeButtonVars.base.enabled.root.paddingY,
      paddingLeft: closeButtonVars.base.enabled.root.paddingX,
      borderRadius: closeButtonVars.base.enabled.root.cornerRadius,
    },
    closeButtonLabel: {
      color: closeButtonVars.base.enabled.label.color,
      fontSize: closeButtonVars.base.enabled.label.fontSize,
      lineHeight: closeButtonVars.base.enabled.label.lineHeight,
      fontWeight: closeButtonVars.base.enabled.label.fontWeight,
    },
  },
  variants: {
    skipAnimation: {
      true: {},
      false: {},
    },
    closeButtonPressed: {
      true: {
        closeButton: {
          backgroundColor: closeButtonVars.base.pressed.root.color,
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    skipAnimation: false,
    closeButtonPressed: false,
  },
});

export default menuSheet;
