import {
  select as selectVars,
  selectItem as selectItemVars,
  selectTrigger as selectTriggerVars,
} from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

export const select = defineSlotRecipe({
  name: "select",
  slots: ["root", "backdrop", "scrollArea", "group", "groupLabel"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      borderRadius: selectVars.base.enabled.root.cornerRadius,
      backgroundColor: selectVars.base.enabled.root.color,
      boxShadow: selectVars.base.enabled.root.shadow,
    },
    backdrop: {
      position: "absolute",
      top: "-100vh",
      left: "-100vw",
      width: "300vw",
      height: "300vh",
    },
    scrollArea: {
      display: "flex",
      flexGrow: 1,
      flexDirection: "column",
      minHeight: 0,
      maxHeight: selectVars.base.enabled.root.maxHeight,
      gap: selectVars.base.enabled.root.gap,
      overflowY: "auto",
      paddingTop: selectVars.base.enabled.root.paddingY,
      paddingBottom: selectVars.base.enabled.root.paddingY,
    },
    group: { display: "flex", flexDirection: "column" },
    groupLabel: { color: selectVars.base.enabled.groupLabel.color },
  },
  variants: {
    size: {
      large: {
        groupLabel: {
          paddingTop: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingRight: selectVars.sizeLarge.enabled.groupLabel.paddingX,
          paddingBottom: selectVars.sizeLarge.enabled.groupLabel.paddingY,
          paddingLeft: selectVars.sizeLarge.enabled.groupLabel.paddingX,
          fontSize: selectVars.sizeLarge.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeLarge.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeLarge.enabled.groupLabel.fontWeight,
        },
      },
      medium: {
        groupLabel: {
          paddingTop: selectVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingRight: selectVars.sizeMedium.enabled.groupLabel.paddingX,
          paddingBottom: selectVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingLeft: selectVars.sizeMedium.enabled.groupLabel.paddingX,
          fontSize: selectVars.sizeMedium.enabled.groupLabel.fontSize,
          lineHeight: selectVars.sizeMedium.enabled.groupLabel.lineHeight,
          fontWeight: selectVars.sizeMedium.enabled.groupLabel.fontWeight,
        },
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
});

export const selectTrigger = defineSlotRecipe({
  name: "select-trigger",
  slots: ["root", "value", "placeholder", "prefixIcon", "suffixIcon"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      overflow: "hidden",
      backgroundColor: selectTriggerVars.base.enabled.root.color,
      boxShadow: `inset 0 0 0 ${selectTriggerVars.base.enabled.root.strokeWidth} ${selectTriggerVars.base.enabled.root.strokeColor}`,
      transition: `background-color ${selectTriggerVars.base.enabled.root.colorDuration} ${selectTriggerVars.base.enabled.root.colorTimingFunction}`,
    },
    value: {
      flexGrow: 1,
      minWidth: 0,
      overflow: "hidden",
      color: selectTriggerVars.base.enabled.value.color,
      fontWeight: selectTriggerVars.base.enabled.value.fontWeight,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    placeholder: {
      flexGrow: 1,
      minWidth: 0,
      overflow: "hidden",
      color: selectTriggerVars.base.enabled.placeholder.color,
      fontWeight: selectTriggerVars.base.enabled.placeholder.fontWeight,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    prefixIcon: { flexShrink: 0, color: selectTriggerVars.base.enabled.prefixIcon.color },
    suffixIcon: {
      flexShrink: 0,
      color: selectTriggerVars.base.enabled.suffixIcon.color,
      transform: "rotate(0deg)",
      transition: `transform ${selectTriggerVars.base.enabled.suffixIcon.closeRotateDuration} ${selectTriggerVars.base.enabled.suffixIcon.closeRotateTimingFunction}`,
    },
  },
  variants: {
    size: {
      large: {
        root: {
          height: selectTriggerVars.sizeLarge.enabled.root.height,
          gap: selectTriggerVars.sizeLarge.enabled.root.gap,
          borderRadius: selectTriggerVars.sizeLarge.enabled.root.cornerRadius,
          paddingLeft: selectTriggerVars.sizeLarge.enabled.root.paddingX,
          paddingRight: selectTriggerVars.sizeLarge.enabled.root.paddingX,
        },
        value: {
          fontSize: selectTriggerVars.sizeLarge.enabled.value.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeLarge.enabled.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeLarge.enabled.placeholder.lineHeight,
        },
        prefixIcon: {
          width: selectTriggerVars.sizeLarge.enabled.prefixIcon.size,
          height: selectTriggerVars.sizeLarge.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: selectTriggerVars.sizeLarge.enabled.suffixIcon.size,
          height: selectTriggerVars.sizeLarge.enabled.suffixIcon.size,
        },
      },
      medium: {
        root: {
          height: selectTriggerVars.sizeMedium.enabled.root.height,
          gap: selectTriggerVars.sizeMedium.enabled.root.gap,
          borderRadius: selectTriggerVars.sizeMedium.enabled.root.cornerRadius,
          paddingLeft: selectTriggerVars.sizeMedium.enabled.root.paddingX,
          paddingRight: selectTriggerVars.sizeMedium.enabled.root.paddingX,
        },
        value: {
          fontSize: selectTriggerVars.sizeMedium.enabled.value.fontSize,
          lineHeight: selectTriggerVars.sizeMedium.enabled.value.lineHeight,
        },
        placeholder: {
          fontSize: selectTriggerVars.sizeMedium.enabled.placeholder.fontSize,
          lineHeight: selectTriggerVars.sizeMedium.enabled.placeholder.lineHeight,
        },
        prefixIcon: {
          width: selectTriggerVars.sizeMedium.enabled.prefixIcon.size,
          height: selectTriggerVars.sizeMedium.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: selectTriggerVars.sizeMedium.enabled.suffixIcon.size,
          height: selectTriggerVars.sizeMedium.enabled.suffixIcon.size,
        },
      },
    },
    open: {
      true: {
        suffixIcon: {
          transform: "rotate(180deg)",
          transition: `transform ${selectTriggerVars.base.enabled.suffixIcon.openRotateDuration} ${selectTriggerVars.base.enabled.suffixIcon.openRotateTimingFunction}`,
        },
      },
      false: {},
    },
    pressed: {
      true: { root: { backgroundColor: selectTriggerVars.base.pressed.root.color } },
      false: {},
    },
    disabled: {
      true: {
        root: { backgroundColor: selectTriggerVars.base.disabled.root.color },
        value: { color: selectTriggerVars.base.disabled.value.color },
        placeholder: { color: selectTriggerVars.base.disabled.placeholder.color },
        prefixIcon: { color: selectTriggerVars.base.disabled.prefixIcon.color },
        suffixIcon: { color: selectTriggerVars.base.disabled.suffixIcon.color },
      },
      false: {},
    },
    invalid: {
      true: {
        root: {
          boxShadow: `inset 0 0 0 ${selectTriggerVars.base.invalid.root.strokeWidth} ${selectTriggerVars.base.invalid.root.strokeColor}`,
        },
      },
      false: {},
    },
    readOnly: {
      true: {
        root: { backgroundColor: selectTriggerVars.base.readonly.root.color },
        value: { color: selectTriggerVars.base.readonly.value.color },
        placeholder: { color: selectTriggerVars.base.readonly.placeholder.color },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      pressed: true,
      disabled: true,
      css: { root: { backgroundColor: selectTriggerVars.base.disabled.root.color } },
    },
    {
      pressed: true,
      readOnly: true,
      css: { root: { backgroundColor: selectTriggerVars.base.readonly.root.color } },
    },
  ],
  defaultVariants: {
    size: "large",
    open: false,
    pressed: false,
    disabled: false,
    invalid: false,
    readOnly: false,
  },
});

export const selectItem = defineSlotRecipe({
  name: "select-item",
  slots: ["root", "prefixIcon", "body", "label", "description", "indicator"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: selectItemVars.base.enabled.root.paddingX,
      paddingRight: selectItemVars.base.enabled.root.paddingX,
      borderRadius: selectItemVars.base.enabled.root.cornerRadius,
      backgroundColor: "transparent",
      transition: `background-color ${selectItemVars.base.enabled.root.colorDuration} ${selectItemVars.base.enabled.root.colorTimingFunction}, margin ${selectItemVars.base.enabled.root.marginDuration} ${selectItemVars.base.enabled.root.marginTimingFunction}`,
    },
    prefixIcon: { flexShrink: 0, color: selectItemVars.base.enabled.prefixIcon.color },
    body: {
      display: "flex",
      flexGrow: 1,
      flexDirection: "column",
      minWidth: 0,
      gap: selectItemVars.base.enabled.body.gap,
    },
    label: {
      color: selectItemVars.base.enabled.label.color,
      fontWeight: selectItemVars.base.enabled.label.fontWeight,
    },
    description: {
      color: selectItemVars.base.enabled.description.color,
      fontWeight: selectItemVars.base.enabled.description.fontWeight,
    },
    indicator: { flexShrink: 0, color: selectItemVars.base.enabled.indicator.color },
  },
  variants: {
    size: {
      large: {
        root: {
          gap: selectItemVars.sizeLarge.enabled.root.gap,
          paddingTop: selectItemVars.sizeLarge.enabled.root.paddingY,
          paddingBottom: selectItemVars.sizeLarge.enabled.root.paddingY,
        },
        prefixIcon: {
          width: selectItemVars.sizeLarge.enabled.prefixIcon.size,
          height: selectItemVars.sizeLarge.enabled.prefixIcon.size,
        },
        label: {
          fontSize: selectItemVars.sizeLarge.enabled.label.fontSize,
          lineHeight: selectItemVars.sizeLarge.enabled.label.lineHeight,
        },
        description: {
          fontSize: selectItemVars.sizeLarge.enabled.description.fontSize,
          lineHeight: selectItemVars.sizeLarge.enabled.description.lineHeight,
        },
        indicator: {
          width: selectItemVars.sizeLarge.enabled.indicator.size,
          height: selectItemVars.sizeLarge.enabled.indicator.size,
        },
      },
      medium: {
        root: {
          gap: selectItemVars.sizeMedium.enabled.root.gap,
          paddingTop: selectItemVars.sizeMedium.enabled.root.paddingY,
          paddingBottom: selectItemVars.sizeMedium.enabled.root.paddingY,
        },
        prefixIcon: {
          width: selectItemVars.sizeMedium.enabled.prefixIcon.size,
          height: selectItemVars.sizeMedium.enabled.prefixIcon.size,
        },
        label: {
          fontSize: selectItemVars.sizeMedium.enabled.label.fontSize,
          lineHeight: selectItemVars.sizeMedium.enabled.label.lineHeight,
        },
        description: {
          fontSize: selectItemVars.sizeMedium.enabled.description.fontSize,
          lineHeight: selectItemVars.sizeMedium.enabled.description.lineHeight,
        },
        indicator: {
          width: selectItemVars.sizeMedium.enabled.indicator.size,
          height: selectItemVars.sizeMedium.enabled.indicator.size,
        },
      },
    },
    pressed: {
      true: {
        root: {
          marginLeft: selectItemVars.base.pressed.root.marginX,
          marginRight: selectItemVars.base.pressed.root.marginX,
          backgroundColor: selectItemVars.base.pressed.root.color,
        },
      },
      false: {},
    },
    disabled: {
      true: {
        prefixIcon: { color: selectItemVars.base.disabled.prefixIcon.color },
        label: { color: selectItemVars.base.disabled.label.color },
        description: { color: selectItemVars.base.disabled.description.color },
        indicator: { color: selectItemVars.base.disabled.indicator.color },
      },
      false: {},
    },
    selected: { true: {}, false: {} },
  },
  defaultVariants: {
    size: "large",
    pressed: false,
    disabled: false,
    selected: false,
  },
});
