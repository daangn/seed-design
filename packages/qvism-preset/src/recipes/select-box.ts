import { defineRecipe, defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { prefixIcon } from "../utils/icon";
import { engaged, checked, disabled, focusVisible, not, open, pseudo } from "../utils/pseudo";
import { selectBox as vars } from "../vars/component";
import { selectBoxGroup as groupVars } from "../vars/component";
import { selectBoxCheckmark as checkmarkVars } from "../vars/component";

export const selectBoxGroup = defineRecipe({
  name: "select-box-group",
  base: {
    display: "grid",
    width: "100%",

    gridTemplateColumns: "repeat(var(--seed-select-box-group--columns, 1), minmax(0, 1fr))",

    rowGap: groupVars.base.rest.root.gapY,
    columnGap: groupVars.base.rest.root.gapX,

    "&:not([data-columns='1'])": {
      gridAutoRows: "1fr",
    },
  },
  variants: {},
  defaultVariants: {},
});

export const selectBox = defineSlotRecipe({
  name: "select-box",
  slots: ["root", "trigger", "content", "body", "label", "description", "footer"],
  base: {
    root: {
      cursor: "pointer",
      position: "relative",

      display: "flex",
      flexDirection: "column",

      borderRadius: vars.base.rest.root.cornerRadius,

      backgroundColor: vars.base.rest.root.color,

      boxShadow: `inset 0 0 0 ${vars.base.rest.root.strokeWidth} ${vars.base.rest.root.strokeColor}`,

      transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, ${FOCUS_RING_TRANSITION}`,

      overflow: "hidden",

      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",

        borderWidth: vars.base.selected.root.strokeWidth,

        transition: `border-color ${vars.base.rest.root.strokeDuration} ${vars.base.rest.root.strokeTimingFunction}`,

        pointerEvents: "none",
      },

      [pseudo(not(disabled), engaged)]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      [pseudo(not(disabled), checked)]: {
        "&::after": {
          borderWidth: vars.base.selected.root.strokeWidth,
          borderColor: vars.base.selected.root.strokeColor,
        },
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",

        boxShadow: `inset 0 0 0 ${vars.base.rest.root.strokeWidth} ${vars.base.disabled.root.strokeColor}`,
      },

      [pseudo(disabled, checked)]: {
        boxShadow: `inset 0 0 0 ${vars.base.selected.root.strokeWidth} ${vars.base.disabled.root.strokeColor}`,
      },

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
    },
    trigger: {
      display: "flex",
      justifyContent: "space-between",

      gap: vars.base.rest.trigger.gap,

      flexGrow: 1,

      "--seed-focus-ring": "none",
    },
    content: {
      display: "flex",

      ...prefixIcon({
        size: vars.base.rest.prefixIcon.size,
        color: vars.base.rest.prefixIcon.color,
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

      gap: vars.base.rest.body.gap,

      marginRight: "auto",
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: vars.base.rest.label.gap,
      justifyContent: "flex-start",

      color: vars.base.rest.label.color,

      fontSize: vars.base.rest.label.fontSize,
      lineHeight: vars.base.rest.label.lineHeight,
      fontWeight: vars.base.rest.label.fontWeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.label.color,
      },
    },
    description: {
      color: vars.base.rest.description.color,

      fontSize: vars.base.rest.description.fontSize,
      lineHeight: vars.base.rest.description.lineHeight,
      fontWeight: vars.base.rest.description.fontWeight,

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
        transition: `height ${vars.base.rest.footer.collapseHeightDuration} ${vars.base.rest.footer.collapseHeightTimingFunction}, opacity ${vars.base.rest.footer.collapseOpacityDuration} ${vars.base.rest.footer.collapseOpacityTimingFunction}`,
      },

      [pseudo("[data-collapsible]", open)]: {
        height: "var(--collapsible-content-height)",
        opacity: 1,

        // when opening
        transition: `height ${vars.base.rest.footer.expandHeightDuration} ${vars.base.rest.footer.expandHeightTimingFunction}, opacity ${vars.base.rest.footer.expandOpacityDuration} ${vars.base.rest.footer.expandOpacityTimingFunction}`,
      },
    },
  },
  variants: {
    layout: {
      horizontal: {
        trigger: {
          alignItems: "center",

          paddingLeft: vars.layoutHorizontal.rest.trigger.paddingLeft,
          paddingRight: vars.layoutHorizontal.rest.trigger.paddingRight,
          paddingBlock: vars.layoutHorizontal.rest.trigger.paddingY,
        },
        content: {
          alignItems: "center",

          gap: vars.layoutHorizontal.rest.content.gap,
        },
      },
      vertical: {
        trigger: {
          paddingInline: vars.layoutVertical.rest.trigger.paddingX,
          paddingBlock: vars.layoutVertical.rest.trigger.paddingY,
        },
        content: {
          flexDirection: "column",

          gap: vars.layoutVertical.rest.content.gap,
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

      width: checkmarkVars.base.rest.root.size,
      height: checkmarkVars.base.rest.root.size,
    },
    icon: {
      display: "block",
      position: "absolute",
      margin: "auto",
      inset: 0,
      textAlign: "center",
      overflow: "initial",

      width: checkmarkVars.base.rest.icon.size,
      height: checkmarkVars.base.rest.icon.size,
      color: checkmarkVars.base.rest.icon.color,

      transition: `color ${checkmarkVars.base.rest.icon.colorDuration} ${checkmarkVars.base.rest.icon.colorTimingFunction}`,

      [pseudo(not(disabled), engaged)]: {
        color: checkmarkVars.base.pressed.icon.color,
      },

      [pseudo(not(disabled), checked)]: {
        color: checkmarkVars.base.selected.icon.color,
      },

      [pseudo(disabled)]: {
        color: checkmarkVars.base.disabled.icon.color,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});
