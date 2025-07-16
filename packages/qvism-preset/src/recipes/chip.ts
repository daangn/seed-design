import { chip as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { active, checked, disabled, focus, pseudo } from "../utils/pseudo";

const chip = defineSlotRecipe({
  name: "chip",
  slots: ["root", "label", "prefixIcon", "suffixIcon", "prefixAvatar"],
  base: {
    root: {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      cursor: "pointer",
      border: "none",
      textTransform: "none",
      textAlign: "start",
      whiteSpace: "nowrap",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      flexShrink: 0,
      lineHeight: 1,

      borderRadius: vars.base.enabled.root.cornerRadius,
      transitionDuration: vars.base.enabled.root.colorDuration,
      transitionTimingFunction: vars.base.enabled.root.colorTimingFunction,
      transitionProperty: "background-color, color, border-color, box-shadow",

      [pseudo(focus)]: {
        outline: "none",
      },
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    label: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: vars.base.enabled.label.fontWeight,
      paddingInline: vars.base.enabled.label.paddingX,
    },
    prefixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      paddingLeft: vars.base.enabled.prefixIcon.paddingLeft,

      ...onlyIcon({
        color: "inherit",
        size: "inherit",
      }),
    },
    prefixAvatar: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
    },
    suffixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      paddingRight: vars.base.enabled.suffixIcon.paddingRight,

      ...onlyIcon({
        color: "inherit",
        size: "inherit",
      }),
    },
  },
  variants: {
    variant: {
      solid: {
        root: {
          color: vars.variantSolid.enabled.root.color,
          background: vars.variantSolid.enabled.root.backgroundColor,
          [pseudo(active)]: {
            color: vars.variantSolid.pressed.root.color,
            background: vars.variantSolid.pressed.root.backgroundColor,
          },
          [pseudo(checked)]: {
            boxShadow: "none",
            color: vars.variantSolid.selected.root.color,
            background: vars.variantSolid.selected.root.backgroundColor,
          },
          [pseudo(checked, active)]: {
            color: vars.variantSolid.selectedPressed.root.color,
            background: vars.variantSolid.selectedPressed.root.backgroundColor,
          },
          [pseudo(disabled)]: {
            opacity: vars.variantSolid.disabled.root.opacity,
          },
        },
        label: {
          color: "inherit",
        },
        prefixIcon: {
          color: "inherit",
        },
        suffixIcon: {
          color: "inherit",
        },
      },
      outlineStrong: {
        root: {
          color: vars.variantOutlineStrong.enabled.root.color,
          boxShadow: `inset 0 0 0 ${vars.variantOutlineStrong.enabled.root.strokeWidth} ${vars.variantOutlineStrong.enabled.root.strokeColor}`,
          [pseudo(active)]: {
            color: vars.variantOutlineStrong.pressed.root.color,
            background: vars.variantOutlineStrong.pressed.root.backgroundColor,
          },
          [pseudo(checked)]: {
            color: vars.variantOutlineStrong.selected.root.color,
            background: vars.variantOutlineStrong.selected.root.backgroundColor,
          },
          [pseudo(checked, active)]: {
            color: vars.variantOutlineStrong.selectedPressed.root.color,
            background: vars.variantOutlineStrong.selectedPressed.root.backgroundColor,
          },
          [pseudo(disabled)]: {
            opacity: vars.variantOutlineStrong.disabled.root.opacity,
          },
        },
        label: {
          color: "inherit",
        },
        prefixIcon: {
          color: "inherit",
        },
        suffixIcon: {
          color: "inherit",
        },
        icon: {
          ...onlyIcon({ color: "inherit" }),
        },
      },
      outlineWeak: {
        root: {
          color: vars.variantOutlineWeak.enabled.root.color,
          boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.enabled.root.strokeWidth} ${vars.variantOutlineWeak.enabled.root.strokeColor}`,
          [pseudo(active)]: {
            color: vars.variantOutlineWeak.pressed.root.color,
            background: vars.variantOutlineWeak.pressed.root.backgroundColor,
            boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.pressed.root.strokeWidth} ${vars.variantOutlineWeak.pressed.root.strokeColor}`,
          },
          [pseudo(checked)]: {
            color: vars.variantOutlineWeak.selected.root.color,
            background: vars.variantOutlineWeak.selected.root.backgroundColor,
            boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.selected.root.strokeWidth} ${vars.variantOutlineWeak.selected.root.strokeColor}`,
          },
          [pseudo(checked, active)]: {
            color: vars.variantOutlineWeak.selectedPressed.root.color,
            background: vars.variantOutlineWeak.selectedPressed.root.backgroundColor,
            boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.selectedPressed.root.strokeWidth} ${vars.variantOutlineWeak.selectedPressed.root.strokeColor}`,
          },
          [pseudo(disabled)]: {
            opacity: vars.variantOutlineWeak.disabled.root.opacity,
          },
        },
        label: {
          color: "inherit",
        },
        prefixIcon: {
          color: "inherit",
        },
        suffixIcon: {
          color: "inherit",
        },
      },
    },
    size: {
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.height,
          gap: vars.sizeLarge.enabled.root.gap,
          paddingInline: vars.sizeLarge.enabled.root.paddingX,
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
        },
        prefixIcon: {
          ...onlyIcon({
            size: vars.sizeLarge.enabled.prefixIcon.size,
            color: "inherit",
          }),
        },
        suffixIcon: {
          ...onlyIcon({
            size: vars.sizeLarge.enabled.suffixIcon.size,
            color: "inherit",
          }),
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.height,
          gap: vars.sizeMedium.enabled.root.gap,
          paddingInline: vars.sizeMedium.enabled.root.paddingX,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
        prefixIcon: {
          ...onlyIcon({
            size: vars.sizeMedium.enabled.prefixIcon.size,
            color: "inherit",
          }),
        },
        suffixIcon: {
          ...onlyIcon({
            size: vars.sizeMedium.enabled.suffixIcon.size,
            color: "inherit",
          }),
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.height,
          gap: vars.sizeSmall.enabled.root.gap,
          paddingInline: vars.sizeSmall.enabled.root.paddingX,
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          lineHeight: vars.sizeSmall.enabled.label.lineHeight,
        },
        prefixIcon: {
          ...onlyIcon({
            size: vars.sizeSmall.enabled.prefixIcon.size,
            color: "inherit",
          }),
        },
        suffixIcon: {
          ...onlyIcon({
            size: vars.sizeSmall.enabled.suffixIcon.size,
            color: "inherit",
          }),
        },
      },
    },
    layout: {
      withText: {},
      iconOnly: {},
    },
  },
  compoundVariants: [],
  defaultVariants: {
    variant: "solid",
    size: "medium",
    layout: "withText",
  },
});

export default chip;
