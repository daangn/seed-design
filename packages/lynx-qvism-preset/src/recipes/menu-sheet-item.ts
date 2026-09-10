import { menuSheet as menuSheetVars, menuSheetItem as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx MenuSheet item recipe.
 *
 * Group clipping supplies corner geometry and an explicit divider slot replaces
 * web-only sibling selectors. Press feedback is provided by the `pressed`
 * variant because Lynx does not expose the web pseudo-state surface.
 */
const menuSheetItem = defineSlotRecipe({
  name: "menu-sheet-item",
  slots: ["root", "content", "label", "description", "prefixIcon", "divider"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      minHeight: vars.base.enabled.root.minHeight,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingBottom: vars.base.enabled.root.paddingY,
      paddingLeft: vars.base.enabled.root.paddingX,
      gap: vars.base.enabled.root.gap,
      backgroundColor: vars.base.enabled.root.color,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
      gap: vars.base.enabled.content.gap,
    },
    label: {
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,
    },
    prefixIcon: {
      flexShrink: 0,
      width: vars.base.enabled.prefixIcon.size,
      height: vars.base.enabled.prefixIcon.size,
    },
    divider: {
      width: "100%",
      height: menuSheetVars.base.enabled.divider.strokeBottomWidth,
      backgroundColor: menuSheetVars.base.enabled.divider.strokeColor,
    },
  },
  variants: {
    tone: {
      neutral: {
        prefixIcon: {
          color: vars.toneNeutral.enabled.prefixIcon.color,
        },
        label: {
          color: vars.toneNeutral.enabled.label.color,
        },
      },
      critical: {
        prefixIcon: {
          color: vars.toneCritical.enabled.prefixIcon.color,
        },
        label: {
          color: vars.toneCritical.enabled.label.color,
        },
      },
    },
    labelAlign: {
      left: {
        content: {
          alignItems: "flex-start",
          textAlign: "start",
        },
      },
      center: {
        root: {
          justifyContent: "center",
        },
        content: {
          alignItems: "center",
          textAlign: "center",
        },
      },
    },
    pressed: {
      true: {
        root: {
          backgroundColor: vars.base.pressed.root.color,
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    tone: "neutral",
    labelAlign: "left",
    pressed: false,
  },
});

export default menuSheetItem;
