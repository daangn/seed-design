import { chip as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx Chip recipe.
 *
 * Web pseudo states are represented as explicit boolean variants so the
 * ReactLynx component can connect touch and selection state directly.
 */
const chip = defineSlotRecipe({
  name: "chip",
  slots: ["root", "label", "prefixIcon", "prefixAvatar", "suffixIcon", "icon"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      border: "none",
      borderRadius: vars.base.enabled.root.cornerRadius,
      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, border-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}, box-shadow ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    },
    label: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontWeight: vars.base.enabled.label.fontWeight,
      paddingLeft: vars.base.enabled.label.paddingX,
      paddingRight: vars.base.enabled.label.paddingX,
    },
    prefixIcon: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      marginLeft: vars.base.enabled.prefixIcon.paddingLeft,
    },
    prefixAvatar: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
    suffixIcon: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      marginRight: vars.base.enabled.suffixIcon.paddingRight,
    },
    icon: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
  },
  variants: {
    variant: {
      solid: {
        root: { background: vars.variantSolid.enabled.root.color },
        label: { color: vars.variantSolid.enabled.label.color },
        prefixIcon: { color: vars.variantSolid.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantSolid.enabled.suffixIcon.color },
        icon: { color: vars.variantSolid.enabled.icon.color },
      },
      outlineStrong: {
        root: {
          background: vars.variantOutlineStrong.enabled.root.color,
          boxShadow: `inset 0 0 0 ${vars.variantOutlineStrong.enabled.root.strokeWidth} ${vars.variantOutlineStrong.enabled.root.strokeColor}`,
        },
        label: { color: vars.variantOutlineStrong.enabled.label.color },
        prefixIcon: { color: vars.variantOutlineStrong.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantOutlineStrong.enabled.suffixIcon.color },
        icon: { color: vars.variantOutlineStrong.enabled.icon.color },
      },
      outlineWeak: {
        root: {
          background: vars.variantOutlineWeak.enabled.root.color,
          boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.enabled.root.strokeWidth} ${vars.variantOutlineWeak.enabled.root.strokeColor}`,
        },
        label: { color: vars.variantOutlineWeak.enabled.label.color },
        prefixIcon: { color: vars.variantOutlineWeak.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantOutlineWeak.enabled.suffixIcon.color },
        icon: { color: vars.variantOutlineWeak.enabled.icon.color },
      },
    },
    size: {
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.height,
          paddingLeft: vars.sizeSmall.enabled.root.paddingX,
          paddingRight: vars.sizeSmall.enabled.root.paddingX,
        },
        label: {
          fontSize: vars.sizeSmall.enabled.label.fontSize,
          lineHeight: vars.sizeSmall.enabled.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeSmall.enabled.prefixIcon.size,
          height: vars.sizeSmall.enabled.prefixIcon.size,
        },
        prefixAvatar: {
          width: vars.sizeSmall.enabled.prefixAvatar.size,
          height: vars.sizeSmall.enabled.prefixAvatar.size,
        },
        suffixIcon: {
          width: vars.sizeSmall.enabled.suffixIcon.size,
          height: vars.sizeSmall.enabled.suffixIcon.size,
        },
        icon: {
          width: vars.sizeSmall.enabled.icon.size,
          height: vars.sizeSmall.enabled.icon.size,
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.height,
          paddingLeft: vars.sizeMedium.enabled.root.paddingX,
          paddingRight: vars.sizeMedium.enabled.root.paddingX,
        },
        label: {
          fontSize: vars.sizeMedium.enabled.label.fontSize,
          lineHeight: vars.sizeMedium.enabled.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeMedium.enabled.prefixIcon.size,
          height: vars.sizeMedium.enabled.prefixIcon.size,
        },
        prefixAvatar: {
          width: vars.sizeMedium.enabled.prefixAvatar.size,
          height: vars.sizeMedium.enabled.prefixAvatar.size,
        },
        suffixIcon: {
          width: vars.sizeMedium.enabled.suffixIcon.size,
          height: vars.sizeMedium.enabled.suffixIcon.size,
        },
        icon: {
          width: vars.sizeMedium.enabled.icon.size,
          height: vars.sizeMedium.enabled.icon.size,
        },
      },
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.height,
          paddingLeft: vars.sizeLarge.enabled.root.paddingX,
          paddingRight: vars.sizeLarge.enabled.root.paddingX,
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeLarge.enabled.prefixIcon.size,
          height: vars.sizeLarge.enabled.prefixIcon.size,
          marginLeft: vars.sizeLarge.enabled.prefixIcon.paddingLeft,
        },
        prefixAvatar: {
          width: vars.sizeLarge.enabled.prefixAvatar.size,
          height: vars.sizeLarge.enabled.prefixAvatar.size,
        },
        suffixIcon: {
          width: vars.sizeLarge.enabled.suffixIcon.size,
          height: vars.sizeLarge.enabled.suffixIcon.size,
        },
        icon: {
          width: vars.sizeLarge.enabled.icon.size,
          height: vars.sizeLarge.enabled.icon.size,
        },
      },
    },
    layout: {
      iconOnly: {},
      withText: {},
    },
    selected: {
      true: {},
      false: {},
    },
    pressed: {
      true: {},
      false: {},
    },
    disabled: {
      true: { root: { opacity: vars.variantSolid.disabled.root.opacity } },
      false: {},
    },
  },
  compoundVariants: [
    {
      size: "small",
      layout: "withText",
      css: { root: { minWidth: vars.sizeSmallLayoutWithText.enabled.root.minWidth } },
    },
    {
      size: "medium",
      layout: "withText",
      css: { root: { minWidth: vars.sizeMediumLayoutWithText.enabled.root.minWidth } },
    },
    {
      size: "large",
      layout: "withText",
      css: { root: { minWidth: vars.sizeLargeLayoutWithText.enabled.root.minWidth } },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: { root: { minWidth: vars.sizeSmallLayoutIconOnly.enabled.root.minWidth } },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: { root: { minWidth: vars.sizeMediumLayoutIconOnly.enabled.root.minWidth } },
    },
    {
      size: "large",
      layout: "iconOnly",
      css: { root: { minWidth: vars.sizeLargeLayoutIconOnly.enabled.root.minWidth } },
    },
    {
      variant: "solid",
      selected: true,
      css: {
        root: { background: vars.variantSolid.selected.root.color },
        label: { color: vars.variantSolid.selected.label.color },
        prefixIcon: { color: vars.variantSolid.selected.prefixIcon.color },
        suffixIcon: { color: vars.variantSolid.selected.suffixIcon.color },
        icon: { color: vars.variantSolid.selected.icon.color },
      },
    },
    {
      variant: "outlineStrong",
      selected: true,
      css: {
        root: { background: vars.variantOutlineStrong.selected.root.color },
        label: { color: vars.variantOutlineStrong.selected.label.color },
        prefixIcon: { color: vars.variantOutlineStrong.selected.prefixIcon.color },
        suffixIcon: { color: vars.variantOutlineStrong.selected.suffixIcon.color },
        icon: { color: vars.variantOutlineStrong.selected.icon.color },
      },
    },
    {
      variant: "outlineWeak",
      selected: true,
      css: {
        root: {
          background: vars.variantOutlineWeak.selected.root.color,
          boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.enabled.root.strokeWidth} ${vars.variantOutlineWeak.selected.root.strokeColor}`,
        },
      },
    },
    {
      variant: "solid",
      pressed: true,
      selected: false,
      css: { root: { background: vars.variantSolid.pressed.root.color } },
    },
    {
      variant: "outlineStrong",
      pressed: true,
      selected: false,
      css: { root: { background: vars.variantOutlineStrong.pressed.root.color } },
    },
    {
      variant: "outlineWeak",
      pressed: true,
      selected: false,
      css: { root: { background: vars.variantOutlineWeak.pressed.root.color } },
    },
    {
      variant: "solid",
      selected: true,
      pressed: true,
      css: { root: { background: vars.variantSolid.selectedPressed.root.color } },
    },
    {
      variant: "outlineStrong",
      selected: true,
      pressed: true,
      css: { root: { background: vars.variantOutlineStrong.selectedPressed.root.color } },
    },
    {
      variant: "outlineWeak",
      selected: true,
      pressed: true,
      css: { root: { background: vars.variantOutlineWeak.selectedPressed.root.color } },
    },
  ],
  defaultVariants: {
    variant: "solid",
    size: "medium",
    layout: "withText",
    selected: false,
    pressed: false,
    disabled: false,
  },
});

export default chip;
