import {
  selectBox as vars,
  selectBoxCheckmark as checkmarkVars,
  selectBoxGroup as groupVars,
} from "../vars/component";
import { defineRecipe, defineSlotRecipe } from "../utils/define";

export const selectBoxGroup = defineRecipe({
  name: "select-box-group",
  base: {
    display: "grid",
    width: "100%",
    rowGap: groupVars.base.enabled.root.gapY,
    columnGap: groupVars.base.enabled.root.gapX,
  },
  variants: {
    columns: {
      1: { gridTemplateColumns: "1fr" },
      2: { gridTemplateColumns: "repeat(2, 1fr)" },
    },
  },
  defaultVariants: {
    columns: 1,
  },
});

export const selectBoxCheckmark = defineSlotRecipe({
  name: "select-box-checkmark",
  slots: ["root", "icon"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
      width: checkmarkVars.base.enabled.root.size,
      height: checkmarkVars.base.enabled.root.size,
    },
    icon: {
      width: checkmarkVars.base.enabled.icon.size,
      height: checkmarkVars.base.enabled.icon.size,
      color: checkmarkVars.base.enabled.icon.color,
      transition: `color ${checkmarkVars.base.enabled.icon.colorDuration} ${checkmarkVars.base.enabled.icon.colorTimingFunction}`,
    },
  },
  variants: {
    selected: {
      true: { icon: { color: checkmarkVars.base.enabledSelected.icon.color } },
      false: {},
    },
    pressed: {
      true: { icon: { color: checkmarkVars.base.pressed.icon.color } },
      false: {},
    },
    disabled: {
      true: { icon: { color: checkmarkVars.base.disabled.icon.color } },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
    pressed: false,
    disabled: false,
  },
});

export const selectBox = defineSlotRecipe({
  name: "select-box",
  slots: ["root", "trigger", "content", "body", "label", "description", "footer"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      borderRadius: vars.base.enabled.root.cornerRadius,
      backgroundColor: vars.base.enabled.root.color,
      borderStyle: "solid",
      borderWidth: vars.base.enabled.root.strokeWidth,
      borderColor: vars.base.enabled.root.strokeColor,
      overflow: "hidden",
    },
    trigger: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: vars.base.enabled.trigger.gap,
      flexGrow: 1,
    },
    content: {
      display: "flex",
      flexGrow: 1,
    },
    body: {
      display: "flex",
      flexDirection: "column",
      gap: vars.base.enabled.body.gap,
      marginRight: "auto",
    },
    label: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: vars.base.enabled.label.gap,
      color: vars.base.enabled.label.color,
      fontSize: vars.base.enabled.label.fontSize,
      lineHeight: vars.base.enabled.label.lineHeight,
      fontWeight: vars.base.enabled.label.fontWeight,
    },
    description: {
      color: vars.base.enabled.description.color,
      fontSize: vars.base.enabled.description.fontSize,
      lineHeight: vars.base.enabled.description.lineHeight,
      fontWeight: vars.base.enabled.description.fontWeight,
    },
    footer: {},
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
          flexDirection: "row",
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
    selected: {
      true: {
        root: {
          borderWidth: vars.base.selected.root.strokeWidth,
          borderColor: vars.base.enabledSelected.root.strokeColor,
        },
      },
      false: {},
    },
    pressed: {
      true: { root: { backgroundColor: vars.base.enabledPressed.root.color } },
      false: {},
    },
    disabled: {
      true: {
        root: { borderColor: vars.base.disabled.root.strokeColor },
        label: { color: vars.base.disabled.label.color },
        description: { color: vars.base.disabled.description.color },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      selected: true,
      disabled: true,
      css: {
        root: {
          borderWidth: vars.base.selected.root.strokeWidth,
          borderColor: vars.base.disabled.root.strokeColor,
        },
      },
    },
  ],
  defaultVariants: {
    layout: "horizontal",
    selected: false,
    pressed: false,
    disabled: false,
  },
});
