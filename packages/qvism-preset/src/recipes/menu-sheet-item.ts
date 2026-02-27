import { menuSheetItem as vars, menuSheet as rootVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, focusVisible, pseudo } from "../utils/pseudo";
import { prefixIcon } from "../utils/icon";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

const menuSheetItem = defineSlotRecipe({
  name: "menu-sheet-item",
  slots: ["root", "content", "label", "description"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",

      backgroundColor: vars.base.enabled.root.color,
      minHeight: vars.base.enabled.root.minHeight,
      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,
      gap: vars.base.enabled.root.gap,
      boxShadow: `inset 0 calc(-1 * ${rootVars.base.enabled.divider.strokeBottomWidth}) 0 ${rootVars.base.enabled.divider.strokeColor}`,

      // iOS 15 has default margin on buttons
      margin: 0,

      border: "none",
      fontFamily: "inherit",

      [pseudo(active)]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      "&:first-child": {
        // TODO: since we have this, overflow: hidden; from the group slot can be removed
        borderTopLeftRadius: rootVars.base.enabled.group.cornerRadius,
        borderTopRightRadius: rootVars.base.enabled.group.cornerRadius,
      },

      "&:last-child": {
        // TODO: since we have this, overflow: hidden; from the group slot can be removed
        borderBottomLeftRadius: rootVars.base.enabled.group.cornerRadius,
        borderBottomRightRadius: rootVars.base.enabled.group.cornerRadius,
        boxShadow: "none",
      },

      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      ...prefixIcon({
        size: vars.base.enabled.prefixIcon.size,
      }),
    },
    content: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.enabled.content.gap,
    },
    label: {
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
    description: {
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,

      color: vars.base.enabled.description.color,
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          ...prefixIcon({
            color: vars.toneNeutral.enabled.prefixIcon.color,
          }),
        },
        label: {
          color: vars.toneNeutral.enabled.label.color,
        },
      },
      critical: {
        root: {
          ...prefixIcon({
            color: vars.toneCritical.enabled.prefixIcon.color,
          }),
        },
        label: {
          color: vars.toneCritical.enabled.label.color,
        },
      },
    },
    labelAlign: {
      left: {
        content: {
          textAlign: "start",
        },
      },
      center: {
        root: {
          justifyContent: "center",
        },
        content: {
          alignItems: "center",
        },
      },
    },
  },
  defaultVariants: {
    tone: "neutral",
    labelAlign: "left",
  },
});

export default menuSheetItem;
