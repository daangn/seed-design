import { chip as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { active, checked, disabled, focus, not, pressed, pseudo } from "../utils/pseudo";

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
      ...onlyIcon({
        color: "inherit",
      }),
    },
    label: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: vars.base.enabled.label.fontWeight,
      paddingInline: vars.base.enabled.label.paddingX,
      color: "inherit",
    },
    prefixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      paddingLeft: vars.base.enabled.prefixIcon.paddingLeft,
      ...onlyIcon({ color: "inherit" }),
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
      ...onlyIcon({ color: "inherit" }),
    },
  },
  variants: {
    variant: {
      solid: {
        root: {
          background: vars.variantSolid.enabled.root.color,
          color: vars.variantSolid.enabled.label.color,
          [pseudo(checked)]: {
            boxShadow: "none",
            background: vars.variantSolid.selected.root.color,
            color: vars.variantSolid.selected.label.color,
            ...onlyIcon({
              color: vars.variantSolid.selected.prefixIcon.color,
            }),
          },
          [pseudo(active, not(disabled))]: {
            background: vars.variantSolid.pressed.root.color,
            color: vars.variantSolid.pressed.label.color,
            ...onlyIcon({
              color: vars.variantSolid.pressed.prefixIcon.color,
            }),
          },
          [pseudo(checked, active, not(disabled))]: {
            background: vars.variantSolid.selectedPressed.root.color,
            color: vars.variantSolid.selectedPressed.label.color,
            ...onlyIcon({
              color: vars.variantSolid.selectedPressed.prefixIcon.color,
            }),
          },
          [pseudo(disabled)]: {
            opacity: vars.variantSolid.disabled.root.opacity,
          },
          ...onlyIcon({
            color: vars.variantSolid.enabled.icon.color,
          }),
        },
      },
      outlineStrong: {
        root: {
          background: vars.variantOutlineStrong.enabled.root.color,
          boxShadow: `inset 0 0 0 ${vars.variantOutlineStrong.enabled.root.strokeWidth} ${vars.variantOutlineStrong.enabled.root.strokeColor}`,
          color: vars.variantOutlineStrong.enabled.label.color,
          [pseudo(active, not(disabled))]: {
            background: vars.variantOutlineStrong.pressed.root.color,
            color: vars.variantOutlineStrong.pressed.label.color,
            ...onlyIcon({
              color: vars.variantOutlineStrong.pressed.prefixIcon.color,
            }),
          },
          [pseudo(checked)]: {
            background: vars.variantOutlineStrong.selected.root.color,
            color: vars.variantOutlineStrong.selected.label.color,
            ...onlyIcon({
              color: vars.variantOutlineStrong.selected.prefixIcon.color,
            }),
          },
          [pseudo(checked, active, not(disabled))]: {
            background: vars.variantOutlineStrong.selectedPressed.root.color,
            color: vars.variantOutlineStrong.selectedPressed.label.color,
            ...onlyIcon({
              color: vars.variantOutlineStrong.selectedPressed.prefixIcon.color,
            }),
          },
          [pseudo(disabled)]: {
            opacity: vars.variantOutlineStrong.disabled.root.opacity,
          },
          ...onlyIcon({
            color: vars.variantOutlineStrong.enabled.icon.color,
          }),
        },
      },
      outlineWeak: {
        root: {
          background: vars.variantOutlineWeak.enabled.root.color,
          boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.enabled.root.strokeWidth} ${vars.variantOutlineWeak.enabled.root.strokeColor}`,
          color: vars.variantOutlineWeak.enabled.label.color,
          [pseudo(active, not(disabled))]: {
            background: vars.variantOutlineWeak.pressed.root.color,
            boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.pressed.root.strokeWidth} ${vars.variantOutlineWeak.pressed.root.strokeColor}`,
            color: vars.variantOutlineWeak.pressed.label.color,
            ...onlyIcon({
              color: vars.variantOutlineWeak.pressed.prefixIcon.color,
            }),
          },
          [pseudo(checked)]: {
            background: vars.variantOutlineWeak.selected.root.color,
            boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.selected.root.strokeWidth} ${vars.variantOutlineWeak.selected.root.strokeColor}`,
            color: vars.variantOutlineWeak.selected.label.color,
            ...onlyIcon({
              color: vars.variantOutlineWeak.selected.prefixIcon.color,
            }),
          },
          [pseudo(checked, active, not(disabled))]: {
            background: vars.variantOutlineWeak.selectedPressed.root.color,
            boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.selectedPressed.root.strokeWidth} ${vars.variantOutlineWeak.selectedPressed.root.strokeColor}`,
            color: vars.variantOutlineWeak.selectedPressed.label.color,
            ...onlyIcon({
              color: vars.variantOutlineWeak.selectedPressed.prefixIcon.color,
            }),
          },
          [pseudo(disabled)]: {
            opacity: vars.variantOutlineWeak.disabled.root.opacity,
          },
          ...onlyIcon({
            color: vars.variantOutlineWeak.enabled.icon.color,
          }),
        },
      },
    },
    size: {
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.height,
          paddingInline: vars.sizeLarge.enabled.root.paddingX,
          ...onlyIcon({
            size: vars.sizeLarge.enabled.icon.size,
          }),
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
        },
        prefixIcon: {
          ...onlyIcon({
            size: vars.sizeLarge.enabled.prefixIcon.size,
          }),
        },
        suffixIcon: {
          ...onlyIcon({
            size: vars.sizeLarge.enabled.suffixIcon.size,
          }),
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.height,
          paddingInline: vars.sizeMedium.enabled.root.paddingX,

          ...onlyIcon({
            size: vars.sizeMedium.enabled.icon.size,
          }),
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
        prefixIcon: {
          ...onlyIcon({
            size: vars.sizeMedium.enabled.prefixIcon.size,
          }),
        },
        suffixIcon: {
          ...onlyIcon({
            size: vars.sizeMedium.enabled.suffixIcon.size,
          }),
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.height,
          paddingInline: vars.sizeSmall.enabled.root.paddingX,

          ...onlyIcon({
            size: vars.sizeSmall.enabled.icon.size,
          }),
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          lineHeight: vars.sizeSmall.enabled.label.lineHeight,
        },
        prefixIcon: {
          ...onlyIcon({
            size: vars.sizeSmall.enabled.prefixIcon.size,
          }),
        },
        suffixIcon: {
          ...onlyIcon({
            size: vars.sizeSmall.enabled.suffixIcon.size,
          }),
        },
      },
    },
    layout: {
      iconOnly: {},
      withText: {},
    },
  },
  compoundVariants: [
    {
      size: "small",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeSmallLayoutIconOnly.enabled.root.minWidth,
        },
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeMediumLayoutIconOnly.enabled.root.minWidth,
        },
      },
    },
    {
      size: "large",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeLargeLayoutIconOnly.enabled.root.minWidth,
        },
      },
    },
  ],
  defaultVariants: {
    variant: "solid",
    size: "medium",
    layout: "withText",
  },
});

export default chip;
