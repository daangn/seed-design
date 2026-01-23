import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { prefixIcon } from "../utils/icon";
import { active, checked, disabled, not, open, pseudo } from "../utils/pseudo";
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
  slots: ["root", "trigger", "content", "body", "label", "description", "footer"],
  base: {
    root: {
      cursor: "pointer",
      position: "relative",

      display: "flex",
      flexDirection: "column",

      borderRadius: vars.base.enabled.root.cornerRadius,

      backgroundColor: vars.base.enabled.root.color,

      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,

      overflow: "hidden",

      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: "inherit",
        borderStyle: "solid",
        borderColor: "transparent",

        borderWidth: vars.base.selected.root.strokeWidth,

        transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,

        pointerEvents: "none",
      },

      [pseudo(not(disabled), active)]: {
        backgroundColor: vars.base.enabledPressed.root.color,
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
    },
    trigger: {
      display: "flex",
      justifyContent: "space-between",

      gap: vars.base.enabled.trigger.gap,

      flexGrow: 1,
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
          paddingTop: vars.layoutHorizontal.enabled.trigger.paddingY,
          paddingBottom: vars.layoutHorizontal.enabled.trigger.paddingY,
        },
        content: {
          alignItems: "center",

          gap: vars.layoutHorizontal.enabled.content.gap,
        },
      },
      vertical: {
        trigger: {
          paddingLeft: vars.layoutVertical.enabled.trigger.paddingX,
          paddingRight: vars.layoutVertical.enabled.trigger.paddingX,
          paddingTop: vars.layoutVertical.enabled.trigger.paddingY,
          paddingBottom: vars.layoutVertical.enabled.trigger.paddingY,
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
  name: "selectBoxCheckmark",
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
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      textAlign: "center",
      overflow: "initial",

      width: checkmarkVars.base.enabled.icon.size,
      height: checkmarkVars.base.enabled.icon.size,
      color: checkmarkVars.base.enabled.icon.color,

      transition: `color ${checkmarkVars.base.enabled.icon.colorDuration} ${checkmarkVars.base.enabled.icon.colorTimingFunction}`,

      [pseudo(not(disabled), active)]: {
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
