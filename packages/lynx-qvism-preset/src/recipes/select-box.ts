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
    multiColumn: {
      true: {
        gridAutoRows: "1fr",
      },
      false: {},
    },
  },
  defaultVariants: {
    multiColumn: false,
  },
});

export const selectBox = defineSlotRecipe({
  name: "select-box",
  slots: [
    "interactionRoot",
    "root",
    "selectedStroke",
    "trigger",
    "content",
    "prefixIcon",
    "body",
    "label",
    "description",
    "footer",
    "footerInner",
  ],
  base: {
    interactionRoot: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      width: "100%",
      height: "100%",
      minHeight: 0,
      gap: 0,
    },
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      width: "100%",
      height: "100%",
      borderRadius: vars.base.enabled.root.cornerRadius,
      backgroundColor: vars.base.enabled.root.color,
      boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.enabled.root.strokeColor}`,
      overflow: "hidden",
      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    },
    selectedStroke: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderStyle: "solid",
      borderWidth: vars.base.selected.root.strokeWidth,
      borderColor: "transparent",
      borderRadius: vars.base.enabled.root.cornerRadius,
      transition: `border-color ${vars.base.enabled.root.strokeDuration} ${vars.base.enabled.root.strokeTimingFunction}`,
    },
    trigger: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      gap: vars.base.enabled.trigger.gap,
      flexGrow: 1,
    },
    content: {
      display: "flex",
      flexDirection: "row",
      minWidth: 0,
    },
    prefixIcon: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      width: vars.base.enabled.prefixIcon.size,
      height: vars.base.enabled.prefixIcon.size,
      color: vars.base.enabled.prefixIcon.color,
    },
    body: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      gap: vars.base.enabled.body.gap,
      marginRight: "auto",
    },
    label: {
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
    footer: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: 0,
      opacity: 0,
      overflow: "hidden",
      transition: `height ${vars.base.enabled.footer.collapseHeightDuration} ${vars.base.enabled.footer.collapseHeightTimingFunction}, opacity ${vars.base.enabled.footer.collapseOpacityDuration} ${vars.base.enabled.footer.collapseOpacityTimingFunction}`,
    },
    footerInner: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      width: "100%",
      height: "max-content",
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
    selected: {
      true: {
        selectedStroke: {
          borderColor: vars.base.enabledSelected.root.strokeColor,
        },
      },
      false: {},
    },
    pressed: {
      true: {
        root: {
          backgroundColor: vars.base.enabledPressed.root.color,
        },
      },
      false: {},
    },
    disabled: {
      true: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.base.enabled.root.strokeWidth} ${vars.base.disabled.root.strokeColor}`,
        },
        prefixIcon: {
          color: vars.base.disabled.prefixIcon.color,
        },
        label: {
          color: vars.base.disabled.label.color,
        },
        description: {
          color: vars.base.disabled.description.color,
        },
      },
      false: {},
    },
    footerOpen: {
      true: {
        footer: {
          opacity: 1,
          transition: `height ${vars.base.enabled.footer.expandHeightDuration} ${vars.base.enabled.footer.expandHeightTimingFunction}, opacity ${vars.base.enabled.footer.expandOpacityDuration} ${vars.base.enabled.footer.expandOpacityTimingFunction}`,
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      selected: true,
      disabled: true,
      css: {
        selectedStroke: {
          borderColor: vars.base.disabled.root.strokeColor,
        },
      },
    },
    {
      pressed: true,
      disabled: true,
      css: {
        root: {
          backgroundColor: vars.base.enabled.root.color,
        },
      },
    },
  ],
  defaultVariants: {
    layout: "horizontal",
    selected: false,
    pressed: false,
    disabled: false,
    footerOpen: false,
  },
});

export const selectBoxCheckmark = defineSlotRecipe({
  name: "select-box-checkmark",
  slots: ["root", "icon"],
  base: {
    root: {
      position: "relative",
      flexShrink: 0,
      width: checkmarkVars.base.enabled.root.size,
      height: checkmarkVars.base.enabled.root.size,
    },
    icon: {
      display: "flex",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: checkmarkVars.base.enabled.icon.size,
      height: checkmarkVars.base.enabled.icon.size,
      margin: "auto",
      color: checkmarkVars.base.enabled.icon.color,
    },
  },
  variants: {
    selected: {
      true: {
        icon: {
          color: checkmarkVars.base.enabledSelected.icon.color,
        },
      },
      false: {},
    },
    pressed: {
      true: {
        icon: {
          color: checkmarkVars.base.pressed.icon.color,
        },
      },
      false: {},
    },
    disabled: {
      true: {
        icon: {
          color: checkmarkVars.base.disabled.icon.color,
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      selected: true,
      pressed: true,
      disabled: false,
      css: {
        icon: {
          color: checkmarkVars.base.enabledSelectedPressed.icon.color,
        },
      },
    },
    {
      selected: true,
      disabled: true,
      css: {
        icon: {
          color: checkmarkVars.base.disabledSelected.icon.color,
        },
      },
    },
  ],
  defaultVariants: {
    selected: false,
    pressed: false,
    disabled: false,
  },
});
