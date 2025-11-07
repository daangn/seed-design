import { chip as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { active, checked, disabled, focus, not, pseudo } from "../utils/pseudo";
import { baseStateLayer, stateLayer } from "../utils/state-layer";

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

      borderRadius: vars.base.enabled.root.cornerRadius,
      transitionDuration: vars.base.enabled.root.colorDuration,
      transitionTimingFunction: vars.base.enabled.root.colorTimingFunction,
      transitionProperty: "background-color, color, border-color, box-shadow",

      // State layer base structure (Material Design pattern)
      ...baseStateLayer({
        transitionProperty: "background-color, opacity",
        transitionDuration: vars.base.enabled.root.colorDuration,
        transitionTimingFunction: vars.base.enabled.root.colorTimingFunction,
      }),

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
    },
  },
  variants: {
    variant: {
      solid: {
        root: {
          background: vars.variantSolid.enabled.root.color,

          // Solid variant doesn't use state layer
          ...stateLayer({ display: "none" }),

          ...onlyIcon({
            color: vars.variantSolid.enabled.icon.color,
          }),

          [pseudo(checked)]: {
            boxShadow: "none",
            background: vars.variantSolid.selected.root.color,

            ...onlyIcon({
              color: vars.variantSolid.selected.icon.color,
            }),
          },
          [pseudo(active, not(disabled))]: {
            background: vars.variantSolid.pressed.root.color,
          },
          [pseudo(checked, active, not(disabled))]: {
            background: vars.variantSolid.selectedPressed.root.color,
          },
          [pseudo(disabled)]: {
            opacity: vars.variantSolid.disabled.root.opacity,
          },
        },
        label: {
          color: vars.variantSolid.enabled.label.color,

          [pseudo(checked)]: {
            color: vars.variantSolid.selected.label.color,
          },
        },
        prefixIcon: {
          color: vars.variantSolid.enabled.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantSolid.enabled.suffixIcon.color,
        },
      },
      outlineStrong: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutlineStrong.enabled.root.strokeWidth} ${vars.variantOutlineStrong.enabled.root.strokeColor}`,

          ...stateLayer({ background: "transparent" }),

          ...onlyIcon({
            color: vars.variantOutlineStrong.enabled.icon.color,
          }),

          [pseudo(checked)]: {
            background: vars.variantOutlineStrong.selected.root.color,
            ...onlyIcon({
              color: vars.variantOutlineStrong.selected.icon.color,
            }),
          },
          [pseudo(active, not(disabled))]: {
            ...stateLayer({
              background: vars.variantOutlineStrong.pressed.stateLayer.color,
            }),
          },
          [pseudo(checked, active, not(disabled))]: {
            ...stateLayer({
              background: vars.variantOutlineStrong.selectedPressed.stateLayer.color,
            }),
          },
          [pseudo(disabled)]: {
            opacity: vars.variantOutlineStrong.disabled.root.opacity,
          },
        },
        label: {
          color: vars.variantOutlineStrong.enabled.label.color,

          [pseudo(checked)]: {
            color: vars.variantOutlineStrong.selected.label.color,
          },
        },
        prefixIcon: {
          color: vars.variantOutlineStrong.enabled.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantOutlineStrong.enabled.suffixIcon.color,
        },
      },
      outlineWeak: {
        root: {
          boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.enabled.root.strokeWidth} ${vars.variantOutlineWeak.enabled.root.strokeColor}`,

          ...stateLayer({ background: "transparent" }),

          ...onlyIcon({
            color: vars.variantOutlineWeak.enabled.icon.color,
          }),

          [pseudo(checked)]: {
            background: vars.variantOutlineWeak.selected.root.color,
            boxShadow: `inset 0 0 0 ${vars.variantOutlineWeak.enabled.root.strokeWidth} ${vars.variantOutlineWeak.selected.root.strokeColor}`,
          },
          [pseudo(active, not(disabled))]: {
            ...stateLayer({
              background: vars.variantOutlineWeak.pressed.stateLayer.color,
            }),
          },
          [pseudo(checked, active, not(disabled))]: {
            ...stateLayer({
              background: vars.variantOutlineWeak.selectedPressed.stateLayer.color,
            }),
          },
          [pseudo(disabled)]: {
            opacity: vars.variantOutlineWeak.disabled.root.opacity,
          },
        },
        label: {
          color: vars.variantOutlineWeak.enabled.label.color,
        },
        prefixIcon: {
          color: vars.variantOutlineWeak.enabled.prefixIcon.color,
        },
        suffixIcon: {
          color: vars.variantOutlineWeak.enabled.suffixIcon.color,
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
