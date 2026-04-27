import { floatingActionButton as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
import { engaged, disabled, focusVisible, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import spec from "@seed-design/rootage-artifacts/components/floating-action-button.json" with {
  type: "json",
};

const floatingActionButton = defineSlotRecipe({
  name: "floating-action-button",
  slots: ["root", "icon", "label"],
  base: {
    root: {
      display: "inline-flex",
      boxSizing: "border-box",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      border: "none",
      textTransform: "none",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textDecoration: "none",
      fontFamily: "inherit",
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
      position: "relative",
      overflow: "hidden",

      background: vars.base.enabled.root.color,
      borderRadius: vars.base.enabled.root.cornerRadius,
      boxShadow: vars.base.enabled.root.shadow,

      color: vars.extendedTrue.enabled.label.color,
      fontSize: vars.extendedTrue.enabled.label.fontSize,
      lineHeight: vars.extendedTrue.enabled.label.lineHeight,
      fontWeight: vars.extendedTrue.enabled.label.fontWeight,

      transition: [
        `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
        `max-width ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
        `height ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
        `padding ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
        FOCUS_RING_TRANSITION,
      ].join(", "),

      [pseudo(engaged)]: {
        background: vars.base.pressed.root.color,
      },
    },
    icon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color: vars.base.enabled.icon.color,
      transition: [
        `margin-right ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
        `width ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
        `height ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
      ].join(", "),
    },
    label: {
      wordBreak: "keep-all",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  },
  variants: {
    extended: {
      true: {
        root: {
          paddingLeft: vars.extendedTrue.enabled.root.paddingX,
          paddingRight: vars.extendedTrue.enabled.root.paddingX,
          height: vars.extendedTrue.enabled.root.minHeight,

          // trick for width transition
          width: "fit-content",
          maxWidth: "999px",
        },
        icon: {
          width: vars.extendedTrue.enabled.icon.size,
          height: vars.extendedTrue.enabled.icon.size,

          marginRight: vars.extendedTrue.enabled.root.gap,

          transition: "none",
        },
      },
      false: {
        root: {
          padding: 0,

          minWidth: vars.extendedFalse.enabled.root.size,
          maxWidth: vars.extendedFalse.enabled.root.size,
          height: vars.extendedFalse.enabled.root.size,
        },
        icon: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: vars.extendedFalse.enabled.icon.size,
          height: vars.extendedFalse.enabled.icon.size,
        },
        label: {
          opacity: 0,
        },
      },
    },
  },
  defaultVariants: {
    extended: true,
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default floatingActionButton;
