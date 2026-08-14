import { menuSheetItem as vars, menuSheet as rootVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { engaged, focusVisible, pseudo } from "../utils/pseudo";
import { prefixIcon } from "../utils/icon";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import spec from "@seed-design/rootage-artifacts/components/menu-sheet-item";

const menuSheetItem = defineSlotRecipe({
  name: "menu-sheet-item",
  slots: ["root", "content", "label", "description"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",

      backgroundColor: vars.base.rest.root.color,
      minHeight: vars.base.rest.root.minHeight,
      paddingInline: vars.base.rest.root.paddingX,
      paddingBlock: vars.base.rest.root.paddingY,
      gap: vars.base.rest.root.gap,
      boxShadow: `inset 0 calc(-1 * ${rootVars.base.rest.divider.strokeBottomWidth}) 0 ${rootVars.base.rest.divider.strokeColor}`,

      // iOS 15 has default margin on buttons
      margin: 0,

      border: "none",
      fontFamily: "inherit",

      [pseudo(engaged)]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      "&:first-child": {
        // TODO: since we have this, overflow: hidden; from the group slot can be removed
        borderTopLeftRadius: rootVars.base.rest.group.cornerRadius,
        borderTopRightRadius: rootVars.base.rest.group.cornerRadius,
      },

      "&:last-child": {
        // TODO: since we have this, overflow: hidden; from the group slot can be removed
        borderBottomLeftRadius: rootVars.base.rest.group.cornerRadius,
        borderBottomRightRadius: rootVars.base.rest.group.cornerRadius,
        boxShadow: "none",
      },

      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),

      ...prefixIcon({
        size: vars.base.rest.prefixIcon.size,
      }),
    },
    content: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.rest.content.gap,
    },
    label: {
      fontSize: vars.base.rest.label.fontSize,
      lineHeight: vars.base.rest.label.lineHeight,
      fontWeight: vars.base.rest.label.fontWeight,
    },
    description: {
      fontSize: vars.base.rest.description.fontSize,
      lineHeight: vars.base.rest.description.lineHeight,
      fontWeight: vars.base.rest.description.fontWeight,

      color: vars.base.rest.description.color,
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          ...prefixIcon({
            color: vars.toneNeutral.rest.prefixIcon.color,
          }),
        },
        label: {
          color: vars.toneNeutral.rest.label.color,
        },
      },
      critical: {
        root: {
          ...prefixIcon({
            color: vars.toneCritical.rest.prefixIcon.color,
          }),
        },
        label: {
          color: vars.toneCritical.rest.label.color,
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
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default menuSheetItem;
