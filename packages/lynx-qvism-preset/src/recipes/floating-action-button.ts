import { floatingActionButton as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx FloatingActionButton recipe.
 *
 * Pressed is modeled as a background-thread boolean variant rather than a
 * pseudo selector. Scale Feedback owns the root transform on the Main Thread.
 *
 * The label stays mounted while collapsed. The root clips it and it fades out
 * on one line, so the icon is left-aligned with padding that centers it at the
 * collapsed size.
 */
const floatingActionButton = defineSlotRecipe({
  name: "floating-action-button",
  slots: ["root", "icon", "label"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      flexShrink: 0,
      maxWidth: "100%",
      overflow: "hidden",
      // Lynx does not animate `gap`; keep it constant so the label does not jump toward the icon.
      gap: vars.extendedTrue.enabled.root.gap,
      backgroundColor: vars.base.enabled.root.color,
      borderRadius: vars.base.enabled.root.cornerRadius,
      boxShadow: vars.base.enabled.root.shadow,
      transition: [
        `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
        `width ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
        `height ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
        `padding-left ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
        `padding-right ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
      ].join(", "),
    },
    icon: {
      flexShrink: 0,
      color: vars.base.enabled.icon.color,
      transition: [
        `width ${vars.base.enabled.icon.sizeDuration} ${vars.base.enabled.icon.sizeTimingFunction}`,
        `height ${vars.base.enabled.icon.sizeDuration} ${vars.base.enabled.icon.sizeTimingFunction}`,
      ].join(", "),
    },
    label: {
      width: "max-content",
      flexShrink: 0,
      whiteSpace: "nowrap",
      color: vars.extendedTrue.enabled.label.color,
      fontSize: vars.extendedTrue.enabled.label.fontSize,
      lineHeight: vars.extendedTrue.enabled.label.lineHeight,
      fontWeight: vars.extendedTrue.enabled.label.fontWeight,
      transition: `opacity ${vars.base.enabled.root.layoutDuration} ${vars.base.enabled.root.layoutTimingFunction}`,
    },
  },
  variants: {
    extended: {
      true: {
        root: {
          width: "fit-content",
          height: vars.extendedTrue.enabled.root.minHeight,
          paddingLeft: vars.extendedTrue.enabled.root.paddingX,
          paddingRight: vars.extendedTrue.enabled.root.paddingX,
        },
        icon: {
          width: vars.extendedTrue.enabled.icon.size,
          height: vars.extendedTrue.enabled.icon.size,
        },
      },
      false: {
        root: {
          width: vars.extendedFalse.enabled.root.size,
          height: vars.extendedFalse.enabled.root.size,
          paddingLeft: `calc((${vars.extendedFalse.enabled.root.size} - ${vars.extendedFalse.enabled.icon.size}) / 2)`,
          paddingRight: 0,
        },
        icon: {
          width: vars.extendedFalse.enabled.icon.size,
          height: vars.extendedFalse.enabled.icon.size,
        },
        label: {
          opacity: 0,
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
    disabled: {
      true: {},
      false: {},
    },
    transitionEnabled: {
      true: {},
      false: {
        root: { transitionDuration: "0s" },
        icon: { transitionDuration: "0s" },
        label: { transitionDuration: "0s" },
      },
    },
  },
  compoundVariants: [
    {
      extended: true,
      transitionEnabled: true,
      css: {
        root: {
          width: `calc(var(--fab-label-width) + ${vars.extendedTrue.enabled.icon.size} + ${vars.extendedTrue.enabled.root.gap} + 2 * ${vars.extendedTrue.enabled.root.paddingX})`,
        },
      },
    },
  ],
  defaultVariants: {
    extended: true,
    pressed: false,
    disabled: false,
    transitionEnabled: false,
  },
});

export default floatingActionButton;
