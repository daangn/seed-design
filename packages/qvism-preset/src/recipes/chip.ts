import { chip as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { engaged, checked, disabled, focusVisible, not, pseudo } from "../utils/pseudo";
import { createFocusRingRestStyles, createFocusRingStyles } from "../utils/focus-ring";
import spec from "@seed-design/rootage-artifacts/components/chip";

const chip = defineSlotRecipe({
  name: "chip",
  slots: ["root", "label", "prefixIcon", "suffixIcon", "prefixAvatar"],
  base: {
    root: {
      position: "relative",
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
      fontFamily: "inherit",
      flexShrink: 0,
      lineHeight: 1,

      borderRadius: vars.base.rest.root.cornerRadius,
      transitionDuration: vars.base.rest.root.colorDuration,
      transitionTimingFunction: vars.base.rest.root.colorTimingFunction,
      transitionProperty: "background-color, color, border-color, box-shadow, outline-color",

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    label: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: vars.base.rest.label.fontWeight,
      paddingInline: vars.base.rest.label.paddingX,
    },
    prefixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      paddingLeft: vars.base.rest.prefixIcon.paddingLeft,
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
      paddingRight: vars.base.rest.suffixIcon.paddingRight,
    },
  },
  variants: {
    variant: {
      solid: {
        root: {
          background: vars.variantSolid.rest.root.color,

          ...onlyIcon({
            color: vars.variantSolid.rest.icon.color,
          }),

          [pseudo(checked)]: {
            boxShadow: "none",
            background: vars.variantSolid.selected.root.color,

            ...onlyIcon({
              color: vars.variantSolid.selected.icon.color,
            }),
          },
          [pseudo(engaged, not(disabled))]: {
            background: vars.variantSolid.pressed.root.color,
          },
          [pseudo(checked, engaged, not(disabled))]: {
            background: vars.variantSolid.pressedSelected.root.color,
          },
          [pseudo(disabled)]: {
            opacity: vars.variantSolid.disabled.root.opacity,
          },
        },
        label: {
          color: vars.variantSolid.rest.label.color,

          [pseudo(checked)]: {
            color: vars.variantSolid.selected.label.color,
          },
        },
        prefixIcon: {
          color: vars.variantSolid.rest.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantSolid.rest.suffixIcon.color,
        },
      },
      outlineStrong: {
        root: {
          background: vars.variantOutlineStrong.rest.root.color,
          boxShadow: `inset 0 0 0 ${vars.variantOutlineStrong.rest.root.strokeWidth} ${vars.variantOutlineStrong.rest.root.strokeColor}`,

          ...onlyIcon({
            color: vars.variantOutlineStrong.rest.icon.color,
          }),

          [pseudo(engaged, not(disabled))]: {
            background: vars.variantOutlineStrong.pressed.root.color,
          },
          [pseudo(checked)]: {
            background: vars.variantOutlineStrong.selected.root.color,
            ...onlyIcon({
              color: vars.variantOutlineStrong.selected.icon.color,
            }),
          },
          [pseudo(checked, engaged, not(disabled))]: {
            background: vars.variantOutlineStrong.pressedSelected.root.color,
          },
          [pseudo(disabled)]: {
            opacity: vars.variantOutlineStrong.disabled.root.opacity,
          },
        },
        label: {
          color: vars.variantOutlineStrong.rest.label.color,

          [pseudo(checked)]: {
            color: vars.variantOutlineStrong.selected.label.color,
          },
        },
        prefixIcon: {
          color: vars.variantOutlineStrong.rest.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantOutlineStrong.rest.suffixIcon.color,
        },
      },
      outlineWeak: {
        root: {
          background: vars.variantOutlineWeak.rest.root.color,
          boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.rest.root.strokeWidth} ${vars.variantOutlineWeak.rest.root.strokeColor}`,

          ...onlyIcon({
            color: vars.variantOutlineWeak.rest.icon.color,
          }),

          [pseudo(engaged, not(disabled))]: {
            background: vars.variantOutlineWeak.pressed.root.color,
          },
          [pseudo(checked)]: {
            background: vars.variantOutlineWeak.selected.root.color,
            boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.rest.root.strokeWidth} ${vars.variantOutlineWeak.selected.root.strokeColor}`,
          },
          [pseudo(checked, engaged, not(disabled))]: {
            background: vars.variantOutlineWeak.pressedSelected.root.color,
          },
          [pseudo(disabled)]: {
            opacity: vars.variantOutlineWeak.disabled.root.opacity,
          },
        },
        label: {
          color: vars.variantOutlineWeak.rest.label.color,
        },
        prefixIcon: {
          color: vars.variantOutlineWeak.rest.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantOutlineWeak.rest.suffixIcon.color,
        },
      },
    },
    size: {
      large: {
        root: {
          height: vars.sizeLarge.rest.root.height,
          paddingInline: vars.sizeLarge.rest.root.paddingX,

          ...onlyIcon({
            size: vars.sizeLarge.rest.icon.size,
          }),
        },
        label: {
          fontSize: vars.sizeLarge.rest.label.fontSize,
          lineHeight: vars.sizeLarge.rest.label.lineHeight,
        },
        prefixIcon: {
          ...onlyIcon({
            size: vars.sizeLarge.rest.prefixIcon.size,
          }),
        },
        suffixIcon: {
          ...onlyIcon({
            size: vars.sizeLarge.rest.suffixIcon.size,
          }),
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.rest.root.height,
          paddingInline: vars.sizeMedium.rest.root.paddingX,

          ...onlyIcon({
            size: vars.sizeMedium.rest.icon.size,
          }),
        },
        label: {
          fontSize: vars.sizeMedium.rest.label.fontSize,
          lineHeight: vars.sizeMedium.rest.label.lineHeight,
        },
        prefixIcon: {
          ...onlyIcon({
            size: vars.sizeMedium.rest.prefixIcon.size,
          }),
        },
        suffixIcon: {
          ...onlyIcon({
            size: vars.sizeMedium.rest.suffixIcon.size,
          }),
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.rest.root.height,
          paddingInline: vars.sizeSmall.rest.root.paddingX,

          ...onlyIcon({
            size: vars.sizeSmall.rest.icon.size,
          }),
        },
        label: {
          fontSize: vars.sizeSmall.rest.label.fontSize,
          lineHeight: vars.sizeSmall.rest.label.lineHeight,
        },
        prefixIcon: {
          ...onlyIcon({
            size: vars.sizeSmall.rest.prefixIcon.size,
          }),
        },
        suffixIcon: {
          ...onlyIcon({
            size: vars.sizeSmall.rest.suffixIcon.size,
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
      layout: "withText",
      css: {
        root: {
          minWidth: vars.sizeSmallLayoutWithText.rest.root.minWidth,
        },
      },
    },
    {
      size: "medium",
      layout: "withText",
      css: {
        root: {
          minWidth: vars.sizeMediumLayoutWithText.rest.root.minWidth,
        },
      },
    },
    {
      size: "large",
      layout: "withText",
      css: {
        root: {
          minWidth: vars.sizeLargeLayoutWithText.rest.root.minWidth,
        },
      },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeSmallLayoutIconOnly.rest.root.minWidth,
        },
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeMediumLayoutIconOnly.rest.root.minWidth,
        },
      },
    },
    {
      size: "large",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeLargeLayoutIconOnly.rest.root.minWidth,
        },
      },
    },
  ],
  defaultVariants: {
    variant: "solid",
    size: "medium",
    layout: "withText",
  },
  metadata: {
    variants: {
      variant: spec.data.schema.variants.variant,
    },
  },
});

export default chip;
