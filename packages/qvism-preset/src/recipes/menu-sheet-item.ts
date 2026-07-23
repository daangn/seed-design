import { menuSheetItem as vars, menuSheet as rootVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, engaged, focusVisible, pseudo } from "../utils/pseudo";
import { prefixIcon } from "../utils/icon";
import {
  createPressScaleCounterRestStyles,
  createPressScaleCounterStyles,
  createPressScaleRestStyles,
  createPressScaleStyles,
  PRESS_SCALE_TRANSITION,
} from "../utils/press-scale";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import spec from "@seed-design/rootage-artifacts/components/menu-sheet-item.json" with {
  type: "json",
};

const menuSheetItem = defineSlotRecipe({
  name: "menu-sheet-item",
  slots: ["root", "content", "label", "description"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",

      minHeight: vars.base.enabled.root.minHeight,
      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,
      gap: vars.base.enabled.root.gap,

      // iOS 15 has default margin on buttons
      margin: 0,

      border: "none",
      fontFamily: "inherit",

      // The row scales as a whole on press; the background and divider live on
      // ::before and cancel that scale, so they stay flush with the neighbouring
      // rows instead of opening gaps between them.
      position: "relative",
      isolation: "isolate",

      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -1,

        backgroundColor: vars.base.enabled.root.color,
        boxShadow: `inset 0 calc(-1 * ${rootVars.base.enabled.divider.strokeBottomWidth}) 0 ${rootVars.base.enabled.divider.strokeColor}`,

        ...createPressScaleCounterRestStyles(),
        transition: PRESS_SCALE_TRANSITION,
      },

      [pseudo(engaged, "::before")]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      ...createPressScaleRestStyles(),
      [pseudo(active)]: createPressScaleStyles(),
      [pseudo(active, "::before")]: createPressScaleCounterStyles(),

      "&:first-child::before": {
        // TODO: since we have this, overflow: hidden; from the group slot can be removed
        borderTopLeftRadius: rootVars.base.enabled.group.cornerRadius,
        borderTopRightRadius: rootVars.base.enabled.group.cornerRadius,
      },

      "&:last-child::before": {
        // TODO: since we have this, overflow: hidden; from the group slot can be removed
        borderBottomLeftRadius: rootVars.base.enabled.group.cornerRadius,
        borderBottomRightRadius: rootVars.base.enabled.group.cornerRadius,
        boxShadow: "none",
      },

      transition: `${PRESS_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,
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
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default menuSheetItem;
