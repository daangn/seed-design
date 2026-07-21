import { defineRecipe, defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { prefixIcon } from "../utils/icon";
import {
  active,
  engaged,
  checked,
  disabled,
  focusVisible,
  not,
  open,
  pseudo,
} from "../utils/pseudo";
import {
  createPressScaleRestStyles,
  createPressScaleStyles,
  PRESS_SCALE_TRANSITION,
} from "../utils/press-scale";
import { selectBox as vars } from "../vars/component";
import { selectBoxGroup as groupVars } from "../vars/component";
import { selectBoxCheckmark as checkmarkVars } from "../vars/component";

export const selectBoxGroup = defineRecipe({
  name: "select-box-group",
  base: {
    display: "grid",
    width: "100%",

    gridTemplateColumns: "repeat(var(--seed-select-box-group--columns, 1), minmax(0, 1fr))",

    rowGap: groupVars.base.enabled.root.gapY,
    columnGap: groupVars.base.enabled.root.gapX,

    "&:not([data-columns='1'])": {
      gridAutoRows: "1fr",
    },
  },
  variants: {},
  defaultVariants: {},
});

export const selectBox = defineSlotRecipe({
  name: "select-box",
  slots: ["root", "inner", "trigger", "content", "body", "label", "description", "footer"],
  base: {
    root: {
      cursor: "pointer",
      position: "relative",

      display: "flex",
      flexDirection: "column",

      borderRadius: vars.base.enabled.root.cornerRadius,

      backgroundColor: vars.base.enabled.root.color,

      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      overflow: "hidden",

      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",

        borderWidth: vars.base.selected.root.strokeWidth,

        transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,

        pointerEvents: "none",
      },

      [pseudo(not(disabled), engaged)]: {
        backgroundColor: vars.base.enabledPressed.root.color,
      },

      // press signal for the inner layer — custom properties inherit, so the inner
      // slot can consume this without any state forwarding in React.
      ...createPressScaleRestStyles({ as: "--select-box-pressed-scale" }),
      [pseudo(not(disabled), active)]: {
        ...createPressScaleStyles({ as: "--select-box-pressed-scale" }),
      },

      [pseudo(not(disabled), checked)]: {
        "&::after": {
          borderWidth: vars.base.selected.root.strokeWidth,
          borderColor: vars.base.enabledSelected.root.strokeColor,
        },
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",

        boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.disabled.root.strokeColor}`,
      },

      [pseudo(disabled, checked)]: {
        boxShadow: `inset 0 0 0 ${vars.base.selected.root.strokeWidth} ${vars.base.disabled.root.strokeColor}`,
      },

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
    },
    // inner layer — wraps trigger + footer so they scale as one unit on press while
    // the pressed background, stroke, and selected border stay fixed on root.
    // ("layout" is taken by the layout variant, hence "inner".)
    inner: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,

      // The pressed value is inherited from root, so press detection stays on the
      // interactive element itself (same signal as the pressed background).
      scale: "var(--select-box-pressed-scale, 1)",

      transition: PRESS_SCALE_TRANSITION,
    },
    trigger: {
      display: "flex",
      justifyContent: "space-between",

      gap: vars.base.enabled.trigger.gap,

      flexGrow: 1,

      "--seed-focus-ring": "none",
    },
    content: {
      display: "flex",

      ...prefixIcon({
        size: vars.base.enabled.prefixIcon.size,
        color: vars.base.enabled.prefixIcon.color,
      }),

      [pseudo(disabled)]: {
        ...prefixIcon({
          color: vars.base.disabled.prefixIcon.color,
        }),
      },
    },
    body: {
      display: "flex",
      flexDirection: "column",

      gap: vars.base.enabled.body.gap,

      marginRight: "auto",
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: vars.base.enabled.label.gap,
      justifyContent: "flex-start",

      color: vars.base.enabled.label.color,

      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
      fontWeight: vars.base.enabled.label.fontWeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
    description: {
      color: vars.base.enabled.description.color,

      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.description.color,
      },
    },
    footer: {
      [pseudo("[data-collapsible]")]: {
        overflow: "hidden",
        height: 0,
        opacity: 0,

        // when closing
        transition: `height ${vars.base.enabled.footer.collapseHeightDuration} ${vars.base.enabled.footer.collapseHeightTimingFunction}, opacity ${vars.base.enabled.footer.collapseOpacityDuration} ${vars.base.enabled.footer.collapseOpacityTimingFunction}`,
      },

      [pseudo("[data-collapsible]", open)]: {
        height: "var(--collapsible-content-height)",
        opacity: 1,

        // when opening
        transition: `height ${vars.base.enabled.footer.expandHeightDuration} ${vars.base.enabled.footer.expandHeightTimingFunction}, opacity ${vars.base.enabled.footer.expandOpacityDuration} ${vars.base.enabled.footer.expandOpacityTimingFunction}`,
      },
    },
  },
  variants: {
    layout: {
      horizontal: {
        trigger: {
          alignItems: "center",

          paddingLeft: vars.layoutHorizontal.enabled.trigger.paddingLeft,
          paddingRight: vars.layoutHorizontal.enabled.trigger.paddingRight,
          paddingBlock: vars.layoutHorizontal.enabled.trigger.paddingY,
        },
        content: {
          alignItems: "center",

          gap: vars.layoutHorizontal.enabled.content.gap,
        },
      },
      vertical: {
        trigger: {
          paddingInline: vars.layoutVertical.enabled.trigger.paddingX,
          paddingBlock: vars.layoutVertical.enabled.trigger.paddingY,
        },
        content: {
          flexDirection: "column",

          gap: vars.layoutVertical.enabled.content.gap,
        },
      },
    },
  },
  defaultVariants: {
    layout: "horizontal",
  },
});

export const selectBoxCheckmark = defineSlotRecipe({
  name: "select-box-checkmark",
  slots: ["root", "icon"],
  base: {
    root: {
      position: "relative",
      boxSizing: "border-box",
      flex: "none",

      width: checkmarkVars.base.enabled.root.size,
      height: checkmarkVars.base.enabled.root.size,
    },
    icon: {
      display: "block",
      position: "absolute",
      margin: "auto",
      inset: 0,
      textAlign: "center",
      overflow: "initial",

      width: checkmarkVars.base.enabled.icon.size,
      height: checkmarkVars.base.enabled.icon.size,
      color: checkmarkVars.base.enabled.icon.color,

      transition: `color ${checkmarkVars.base.enabled.icon.colorDuration} ${checkmarkVars.base.enabled.icon.colorTimingFunction}`,

      [pseudo(not(disabled), engaged)]: {
        color: checkmarkVars.base.pressed.icon.color,
      },

      [pseudo(not(disabled), checked)]: {
        color: checkmarkVars.base.enabledSelected.icon.color,
      },

      [pseudo(disabled)]: {
        color: checkmarkVars.base.disabled.icon.color,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});
