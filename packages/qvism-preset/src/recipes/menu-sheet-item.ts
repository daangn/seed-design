import { menuSheetItem as vars, menuSheet as rootVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, engaged, focusVisible, pseudo } from "../utils/pseudo";
import { prefixIcon } from "../utils/icon";
import { createPressScaleVarStyles } from "../utils/press-scale";
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
  slots: ["root", "layout", "content", "label", "description"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",

      backgroundColor: vars.base.enabled.root.color,
      minHeight: vars.base.enabled.root.minHeight,
      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,
      boxShadow: `inset 0 calc(-1 * ${rootVars.base.enabled.divider.strokeBottomWidth}) 0 ${rootVars.base.enabled.divider.strokeColor}`,

      // iOS 15 has default margin on buttons
      margin: 0,

      border: "none",
      fontFamily: "inherit",

      [pseudo(engaged)]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      // press signal for the layout layer — custom properties inherit, so the layout
      // slot can consume this without any state forwarding in React.
      ...createPressScaleVarStyles("--menu-sheet-item-pressed-scale", { gate: pseudo(active) }),

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
    // layout layer — flex row holding prefixIcon/content; scales as a whole on press
    // while the pressed background stays on root.
    layout: {
      display: "flex",
      alignItems: "center",
      flexGrow: 1,

      gap: vars.base.enabled.root.gap,

      // The pressed value is inherited from root, so press detection stays on the
      // interactive element itself (same signal as the pressed background).
      scale: "var(--menu-sheet-item-pressed-scale, 1)",

      transition: `scale ${vars.base.enabled.root.contentScaleDuration} ${vars.base.enabled.root.contentScaleTimingFunction}`,
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
        layout: {
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
