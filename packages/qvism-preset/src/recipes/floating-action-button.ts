import { floatingActionButton as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
import { engaged, disabled, focusVisible, pseudo } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import spec from "@seed-design/rootage-artifacts/components/floating-action-button";

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

      background: vars.base.rest.root.color,
      borderRadius: vars.base.rest.root.cornerRadius,
      boxShadow: vars.base.rest.root.shadow,

      color: vars.extendedTrue.rest.label.color,
      fontSize: vars.extendedTrue.rest.label.fontSize,
      lineHeight: vars.extendedTrue.rest.label.lineHeight,
      fontWeight: vars.extendedTrue.rest.label.fontWeight,

      transition: [
        `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}`,
        `max-width ${vars.base.rest.root.layoutDuration} ${vars.base.rest.root.layoutTimingFunction}`,
        `height ${vars.base.rest.root.layoutDuration} ${vars.base.rest.root.layoutTimingFunction}`,
        `padding ${vars.base.rest.root.layoutDuration} ${vars.base.rest.root.layoutTimingFunction}`,
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
      color: vars.base.rest.icon.color,
      transition: [
        `margin-right ${vars.base.rest.root.layoutDuration} ${vars.base.rest.root.layoutTimingFunction}`,
        `width ${vars.base.rest.root.layoutDuration} ${vars.base.rest.root.layoutTimingFunction}`,
        `height ${vars.base.rest.root.layoutDuration} ${vars.base.rest.root.layoutTimingFunction}`,
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
          paddingInline: vars.extendedTrue.rest.root.paddingX,
          height: vars.extendedTrue.rest.root.minHeight,

          // trick for width transition
          width: "fit-content",
          maxWidth: "999px",
        },
        icon: {
          width: vars.extendedTrue.rest.icon.size,
          height: vars.extendedTrue.rest.icon.size,

          marginRight: vars.extendedTrue.rest.root.gap,

          transition: "none",
        },
      },
      false: {
        root: {
          padding: 0,

          minWidth: vars.extendedFalse.rest.root.size,
          maxWidth: vars.extendedFalse.rest.root.size,
          height: vars.extendedFalse.rest.root.size,
        },
        icon: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: vars.extendedFalse.rest.icon.size,
          height: vars.extendedFalse.rest.icon.size,
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
