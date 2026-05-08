import { actionButton as vars } from "../../vars/component";

import { defineLynxSlotRecipe } from "../../utils/define-lynx";

/**
 * Lynx-전용 ActionButton recipe.
 *
 * `pressed`, `disabled`, `loading` 상태는 boolean variant로 받아 slot별 className
 * 조합으로 반영한다. 아이콘 slot은 `useIconColor`가 resolved color를 native tint로
 * mirror할 수 있도록 color만 가진다.
 */
const actionButton = defineLynxSlotRecipe({
  name: "action-button",
  slots: ["root", "text", "prefixIcon", "suffixIcon", "icon"],
  base: {
    root: {
      display: "flex",
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      flexShrink: 0,

      "--seed-box-flex-grow": "0",
      flexGrow: "var(--seed-box-flex-grow)",
      "--seed-box-min-width": "auto",
      minWidth: "var(--seed-box-min-width)",

      "--seed-box-padding-bottom": "auto",
      "--seed-box-padding-top": "auto",
      "--seed-box-padding-left": "auto",
      "--seed-box-padding-right": "auto",
      paddingTop: "var(--seed-box-padding-top)",
      paddingBottom: "var(--seed-box-padding-bottom)",
      paddingLeft: "var(--seed-box-padding-left)",
      paddingRight: "var(--seed-box-padding-right)",

      "--seed-box-bleed-bottom": "0px",
      "--seed-box-bleed-top": "0px",
      "--seed-box-bleed-left": "0px",
      "--seed-box-bleed-right": "0px",
      marginTop: "calc(var(--seed-box-bleed-top) * -1)",
      marginBottom: "calc(var(--seed-box-bleed-bottom) * -1)",
      marginLeft: "calc(var(--seed-box-bleed-left) * -1)",
      marginRight: "calc(var(--seed-box-bleed-right) * -1)",

      transition: `background-color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    },
    text: {
      fontFamily: "inherit",
      fontWeight: vars.base.enabled.label.fontWeight,

      transition: `color ${vars.base.enabled.root.colorDuration} ${vars.base.enabled.root.colorTimingFunction}`,
    },
    prefixIcon: {
      flexShrink: 0,
    },
    suffixIcon: {
      flexShrink: 0,
    },
    icon: {
      flexShrink: 0,
    },
  },
  variants: {
    variant: {
      brandSolid: {
        root: {
          background: vars.variantBrandSolid.enabled.root.color,
          "--track-color": vars.variantBrandSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantBrandSolid.enabled.progressCircle.rangeColor,
        },
        text: { color: vars.variantBrandSolid.enabled.label.color },
        prefixIcon: { color: vars.variantBrandSolid.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantBrandSolid.enabled.suffixIcon.color },
        icon: { color: vars.variantBrandSolid.enabled.icon.color },
      },
      neutralSolid: {
        root: {
          background: vars.variantNeutralSolid.enabled.root.color,
          "--track-color": vars.variantNeutralSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantNeutralSolid.enabled.progressCircle.rangeColor,
        },
        text: { color: vars.variantNeutralSolid.enabled.label.color },
        prefixIcon: { color: vars.variantNeutralSolid.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantNeutralSolid.enabled.suffixIcon.color },
        icon: { color: vars.variantNeutralSolid.enabled.icon.color },
      },
      neutralWeak: {
        root: {
          background: vars.variantNeutralWeak.enabled.root.color,
          "--track-color": vars.variantNeutralWeak.enabled.progressCircle.trackColor,
          "--range-color": vars.variantNeutralWeak.enabled.progressCircle.rangeColor,
        },
        text: { color: vars.variantNeutralWeak.enabled.label.color },
        prefixIcon: { color: vars.variantNeutralWeak.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantNeutralWeak.enabled.suffixIcon.color },
        icon: { color: vars.variantNeutralWeak.enabled.icon.color },
      },
      criticalSolid: {
        root: {
          background: vars.variantCriticalSolid.enabled.root.color,
          "--track-color": vars.variantCriticalSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantCriticalSolid.enabled.progressCircle.rangeColor,
        },
        text: { color: vars.variantCriticalSolid.enabled.label.color },
        prefixIcon: { color: vars.variantCriticalSolid.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantCriticalSolid.enabled.suffixIcon.color },
        icon: { color: vars.variantCriticalSolid.enabled.icon.color },
      },
      brandOutline: {
        root: {
          borderStyle: "solid",
          background: vars.variantBrandOutline.enabled.root.color,
          borderWidth: vars.variantBrandOutline.enabled.root.strokeWidth,
          borderColor: vars.variantBrandOutline.enabled.root.strokeColor,
          "--track-color": vars.variantBrandOutline.enabled.progressCircle.trackColor,
          "--range-color": vars.variantBrandOutline.enabled.progressCircle.rangeColor,
        },
        text: { color: vars.variantBrandOutline.enabled.label.color },
        prefixIcon: { color: vars.variantBrandOutline.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantBrandOutline.enabled.suffixIcon.color },
        icon: { color: vars.variantBrandOutline.enabled.icon.color },
      },
      neutralOutline: {
        root: {
          borderStyle: "solid",
          background: vars.variantNeutralOutline.enabled.root.color,
          borderWidth: vars.variantNeutralOutline.enabled.root.strokeWidth,
          borderColor: vars.variantNeutralOutline.enabled.root.strokeColor,
          "--track-color": vars.variantNeutralOutline.enabled.progressCircle.trackColor,
          "--range-color": vars.variantNeutralOutline.enabled.progressCircle.rangeColor,
        },
        text: { color: vars.variantNeutralOutline.enabled.label.color },
        prefixIcon: { color: vars.variantNeutralOutline.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantNeutralOutline.enabled.suffixIcon.color },
        icon: { color: vars.variantNeutralOutline.enabled.icon.color },
      },
      ghost: {
        root: {
          background: vars.variantGhost.enabled.root.color,
          "--track-color": vars.variantGhost.enabled.progressCircle.trackColor,
          "--range-color": vars.variantGhost.enabled.progressCircle.rangeColor,
        },
        text: { color: vars.variantGhost.enabled.label.color },
        prefixIcon: { color: vars.variantGhost.enabled.prefixIcon.color },
        suffixIcon: { color: vars.variantGhost.enabled.suffixIcon.color },
        icon: { color: vars.variantGhost.enabled.icon.color },
      },
    },
    size: {
      xsmall: {
        root: {
          height: vars.sizeXsmall.enabled.root.minHeight,
          borderRadius: vars.sizeXsmall.enabled.root.cornerRadius,

          "--size": vars.sizeXsmall.enabled.progressCircle.size,
          "--thickness": vars.sizeXsmall.enabled.progressCircle.thickness,
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.enabled.root.minHeight,
          borderRadius: vars.sizeSmall.enabled.root.cornerRadius,

          "--size": vars.sizeSmall.enabled.progressCircle.size,
          "--thickness": vars.sizeSmall.enabled.progressCircle.thickness,
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.enabled.root.minHeight,
          borderRadius: vars.sizeMedium.enabled.root.cornerRadius,

          "--size": vars.sizeMedium.enabled.progressCircle.size,
          "--thickness": vars.sizeMedium.enabled.progressCircle.thickness,
        },
      },
      large: {
        root: {
          height: vars.sizeLarge.enabled.root.minHeight,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,

          "--size": vars.sizeLarge.enabled.progressCircle.size,
          "--thickness": vars.sizeLarge.enabled.progressCircle.thickness,
        },
      },
    },
    layout: {
      withText: {},
      iconOnly: {},
    },
    pressed: {
      true: {},
      false: {},
    },
    disabled: {
      true: {},
      false: {},
    },
    loading: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    // ── size × layout=withText — padding, gap, font size, icon dimensions ───
    {
      size: "xsmall",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeXsmallLayoutWithText.enabled.root.gap,
          "--seed-box-padding-left": vars.sizeXsmallLayoutWithText.enabled.root.paddingX,
          "--seed-box-padding-right": vars.sizeXsmallLayoutWithText.enabled.root.paddingX,
          "--seed-box-padding-top": vars.sizeXsmallLayoutWithText.enabled.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeXsmallLayoutWithText.enabled.root.paddingY,
        },
        text: {
          fontSize: vars.sizeXsmallLayoutWithText.enabled.label.fontSize,
          lineHeight: vars.sizeXsmallLayoutWithText.enabled.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeXsmallLayoutWithText.enabled.prefixIcon.size,
          height: vars.sizeXsmallLayoutWithText.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeXsmallLayoutWithText.enabled.suffixIcon.size,
          height: vars.sizeXsmallLayoutWithText.enabled.suffixIcon.size,
        },
      },
    },
    {
      size: "xsmall",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeXsmallLayoutIconOnly.enabled.root.minWidth,
          "--seed-box-padding-left": vars.sizeXsmallLayoutIconOnly.enabled.root.paddingX,
          "--seed-box-padding-right": vars.sizeXsmallLayoutIconOnly.enabled.root.paddingX,
          "--seed-box-padding-top": vars.sizeXsmallLayoutIconOnly.enabled.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeXsmallLayoutIconOnly.enabled.root.paddingY,
        },
        icon: {
          width: vars.sizeXsmallLayoutIconOnly.enabled.icon.size,
          height: vars.sizeXsmallLayoutIconOnly.enabled.icon.size,
        },
      },
    },
    {
      size: "small",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeSmallLayoutWithText.enabled.root.gap,
          "--seed-box-padding-left": vars.sizeSmallLayoutWithText.enabled.root.paddingX,
          "--seed-box-padding-right": vars.sizeSmallLayoutWithText.enabled.root.paddingX,
          "--seed-box-padding-top": vars.sizeSmallLayoutWithText.enabled.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeSmallLayoutWithText.enabled.root.paddingY,
        },
        text: {
          fontSize: vars.sizeSmallLayoutWithText.enabled.label.fontSize,
          lineHeight: vars.sizeSmallLayoutWithText.enabled.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeSmallLayoutWithText.enabled.prefixIcon.size,
          height: vars.sizeSmallLayoutWithText.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeSmallLayoutWithText.enabled.suffixIcon.size,
          height: vars.sizeSmallLayoutWithText.enabled.suffixIcon.size,
        },
      },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeSmallLayoutIconOnly.enabled.root.minWidth,
          "--seed-box-padding-left": vars.sizeSmallLayoutIconOnly.enabled.root.paddingX,
          "--seed-box-padding-right": vars.sizeSmallLayoutIconOnly.enabled.root.paddingX,
          "--seed-box-padding-top": vars.sizeSmallLayoutIconOnly.enabled.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeSmallLayoutIconOnly.enabled.root.paddingY,
        },
        icon: {
          width: vars.sizeSmallLayoutIconOnly.enabled.icon.size,
          height: vars.sizeSmallLayoutIconOnly.enabled.icon.size,
        },
      },
    },
    {
      size: "medium",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeMediumLayoutWithText.enabled.root.gap,
          "--seed-box-padding-left": vars.sizeMediumLayoutWithText.enabled.root.paddingX,
          "--seed-box-padding-right": vars.sizeMediumLayoutWithText.enabled.root.paddingX,
          "--seed-box-padding-top": vars.sizeMediumLayoutWithText.enabled.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeMediumLayoutWithText.enabled.root.paddingY,
        },
        text: {
          fontSize: vars.sizeMediumLayoutWithText.enabled.label.fontSize,
          lineHeight: vars.sizeMediumLayoutWithText.enabled.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeMediumLayoutWithText.enabled.prefixIcon.size,
          height: vars.sizeMediumLayoutWithText.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeMediumLayoutWithText.enabled.suffixIcon.size,
          height: vars.sizeMediumLayoutWithText.enabled.suffixIcon.size,
        },
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeMediumLayoutIconOnly.enabled.root.minWidth,
          "--seed-box-padding-left": vars.sizeMediumLayoutIconOnly.enabled.root.paddingX,
          "--seed-box-padding-right": vars.sizeMediumLayoutIconOnly.enabled.root.paddingX,
          "--seed-box-padding-top": vars.sizeMediumLayoutIconOnly.enabled.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeMediumLayoutIconOnly.enabled.root.paddingY,
        },
        icon: {
          width: vars.sizeMediumLayoutIconOnly.enabled.icon.size,
          height: vars.sizeMediumLayoutIconOnly.enabled.icon.size,
        },
      },
    },
    {
      size: "large",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeLargeLayoutWithText.enabled.root.gap,
          "--seed-box-padding-left": vars.sizeLargeLayoutWithText.enabled.root.paddingX,
          "--seed-box-padding-right": vars.sizeLargeLayoutWithText.enabled.root.paddingX,
          "--seed-box-padding-top": vars.sizeLargeLayoutWithText.enabled.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeLargeLayoutWithText.enabled.root.paddingY,
        },
        text: {
          fontSize: vars.sizeLargeLayoutWithText.enabled.label.fontSize,
          lineHeight: vars.sizeLargeLayoutWithText.enabled.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeLargeLayoutWithText.enabled.prefixIcon.size,
          height: vars.sizeLargeLayoutWithText.enabled.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeLargeLayoutWithText.enabled.suffixIcon.size,
          height: vars.sizeLargeLayoutWithText.enabled.suffixIcon.size,
        },
      },
    },
    {
      size: "large",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeLargeLayoutIconOnly.enabled.root.minWidth,
          "--seed-box-padding-left": vars.sizeLargeLayoutIconOnly.enabled.root.paddingX,
          "--seed-box-padding-right": vars.sizeLargeLayoutIconOnly.enabled.root.paddingX,
          "--seed-box-padding-top": vars.sizeLargeLayoutIconOnly.enabled.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeLargeLayoutIconOnly.enabled.root.paddingY,
        },
        icon: {
          width: vars.sizeLargeLayoutIconOnly.enabled.icon.size,
          height: vars.sizeLargeLayoutIconOnly.enabled.icon.size,
        },
      },
    },

    // ── variant × pressed — root background only ────────────────────────────
    {
      variant: "brandSolid",
      pressed: true,
      css: { root: { background: vars.variantBrandSolid.pressed.root.color } },
    },
    {
      variant: "neutralSolid",
      pressed: true,
      css: { root: { background: vars.variantNeutralSolid.pressed.root.color } },
    },
    {
      variant: "neutralWeak",
      pressed: true,
      css: { root: { background: vars.variantNeutralWeak.pressed.root.color } },
    },
    {
      variant: "criticalSolid",
      pressed: true,
      css: { root: { background: vars.variantCriticalSolid.pressed.root.color } },
    },
    {
      variant: "brandOutline",
      pressed: true,
      css: { root: { background: vars.variantBrandOutline.pressed.root.color } },
    },
    {
      variant: "neutralOutline",
      pressed: true,
      css: { root: { background: vars.variantNeutralOutline.pressed.root.color } },
    },
    {
      variant: "ghost",
      pressed: true,
      css: { root: { background: vars.variantGhost.pressed.root.color } },
    },

    // ── variant × disabled — all slots ──────────────────────────────────────
    {
      variant: "brandSolid",
      disabled: true,
      css: {
        root: { background: vars.variantBrandSolid.disabled.root.color },
        text: { color: vars.variantBrandSolid.disabled.label.color },
        prefixIcon: { color: vars.variantBrandSolid.disabled.prefixIcon.color },
        suffixIcon: { color: vars.variantBrandSolid.disabled.suffixIcon.color },
        icon: { color: vars.variantBrandSolid.disabled.icon.color },
      },
    },
    {
      variant: "neutralSolid",
      disabled: true,
      css: {
        root: { background: vars.variantNeutralSolid.disabled.root.color },
        text: { color: vars.variantNeutralSolid.disabled.label.color },
        prefixIcon: { color: vars.variantNeutralSolid.disabled.prefixIcon.color },
        suffixIcon: { color: vars.variantNeutralSolid.disabled.suffixIcon.color },
        icon: { color: vars.variantNeutralSolid.disabled.icon.color },
      },
    },
    {
      variant: "neutralWeak",
      disabled: true,
      css: {
        root: { background: vars.variantNeutralWeak.disabled.root.color },
        text: { color: vars.variantNeutralWeak.disabled.label.color },
        prefixIcon: { color: vars.variantNeutralWeak.disabled.prefixIcon.color },
        suffixIcon: { color: vars.variantNeutralWeak.disabled.suffixIcon.color },
        icon: { color: vars.variantNeutralWeak.disabled.icon.color },
      },
    },
    {
      variant: "criticalSolid",
      disabled: true,
      css: {
        root: { background: vars.variantCriticalSolid.disabled.root.color },
        text: { color: vars.variantCriticalSolid.disabled.label.color },
        prefixIcon: { color: vars.variantCriticalSolid.disabled.prefixIcon.color },
        suffixIcon: { color: vars.variantCriticalSolid.disabled.suffixIcon.color },
        icon: { color: vars.variantCriticalSolid.disabled.icon.color },
      },
    },
    {
      variant: "brandOutline",
      disabled: true,
      css: {
        root: {
          background: vars.variantBrandOutline.disabled.root.color,
          borderColor: vars.variantBrandOutline.disabled.root.strokeColor,
        },
        text: { color: vars.variantBrandOutline.disabled.label.color },
        prefixIcon: { color: vars.variantBrandOutline.disabled.prefixIcon.color },
        suffixIcon: { color: vars.variantBrandOutline.disabled.suffixIcon.color },
        icon: { color: vars.variantBrandOutline.disabled.icon.color },
      },
    },
    {
      variant: "neutralOutline",
      disabled: true,
      css: {
        root: {
          background: vars.variantNeutralOutline.disabled.root.color,
          borderColor: vars.variantNeutralOutline.disabled.root.strokeColor,
        },
        text: { color: vars.variantNeutralOutline.disabled.label.color },
        prefixIcon: { color: vars.variantNeutralOutline.disabled.prefixIcon.color },
        suffixIcon: { color: vars.variantNeutralOutline.disabled.suffixIcon.color },
        icon: { color: vars.variantNeutralOutline.disabled.icon.color },
      },
    },
    {
      variant: "ghost",
      disabled: true,
      css: {
        root: { background: vars.variantGhost.disabled.root.color },
        text: { color: vars.variantGhost.disabled.label.color },
        prefixIcon: { color: vars.variantGhost.disabled.prefixIcon.color },
        suffixIcon: { color: vars.variantGhost.disabled.suffixIcon.color },
        icon: { color: vars.variantGhost.disabled.icon.color },
      },
    },

    // ── variant × loading — root background only ────────────────────────────
    {
      variant: "brandSolid",
      loading: true,
      css: { root: { background: vars.variantBrandSolid.loading.root.color } },
    },
    {
      variant: "neutralSolid",
      loading: true,
      css: { root: { background: vars.variantNeutralSolid.loading.root.color } },
    },
    {
      variant: "neutralWeak",
      loading: true,
      css: { root: { background: vars.variantNeutralWeak.loading.root.color } },
    },
    {
      variant: "criticalSolid",
      loading: true,
      css: { root: { background: vars.variantCriticalSolid.loading.root.color } },
    },
    {
      variant: "brandOutline",
      loading: true,
      css: { root: { background: vars.variantBrandOutline.loading.root.color } },
    },
    {
      variant: "neutralOutline",
      loading: true,
      css: { root: { background: vars.variantNeutralOutline.loading.root.color } },
    },
    {
      variant: "ghost",
      loading: true,
      css: { root: { background: vars.variantGhost.loading.root.color } },
    },
  ],
  defaultVariants: {
    variant: "brandSolid",
    size: "medium",
    layout: "withText",
    pressed: false,
    disabled: false,
    loading: false,
  },
});

export default actionButton;
