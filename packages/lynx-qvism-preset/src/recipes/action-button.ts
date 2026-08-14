import { actionButton as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx-전용 ActionButton recipe.
 *
 * `pressed`, `disabled`, `loading` 상태는 boolean variant로 받아 slot별 className
 * 조합으로 반영한다. 아이콘 slot은 `useIconColor`가 resolved color를 native tint로
 * mirror할 수 있도록 color만 가진다.
 */
const actionButton = defineSlotRecipe({
  name: "action-button",
  slots: ["root", "content", "text", "prefixIcon", "suffixIcon", "icon", "loadingIndicator"],
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

      transform: "scale(1)",

      transition: `background-color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}, transform ${vars.base.rest.root.scaleDuration} ${vars.base.rest.root.scaleTimingFunction}`,
    },
    text: {
      fontWeight: vars.base.rest.label.fontWeight,

      transition: `color ${vars.base.rest.root.colorDuration} ${vars.base.rest.root.colorTimingFunction}`,
    },
    content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0,
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
    loadingIndicator: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  variants: {
    variant: {
      brandSolid: {
        root: {
          background: vars.variantBrandSolid.rest.root.color,
          "--track-color": vars.variantBrandSolid.rest.progressCircle.trackColor,
          "--range-color": vars.variantBrandSolid.rest.progressCircle.rangeColor,
        },
        text: { color: vars.variantBrandSolid.rest.label.color },
        prefixIcon: { color: vars.variantBrandSolid.rest.prefixIcon.color },
        suffixIcon: { color: vars.variantBrandSolid.rest.suffixIcon.color },
        icon: { color: vars.variantBrandSolid.rest.icon.color },
      },
      neutralSolid: {
        root: {
          background: vars.variantNeutralSolid.rest.root.color,
          "--track-color": vars.variantNeutralSolid.rest.progressCircle.trackColor,
          "--range-color": vars.variantNeutralSolid.rest.progressCircle.rangeColor,
        },
        text: { color: vars.variantNeutralSolid.rest.label.color },
        prefixIcon: { color: vars.variantNeutralSolid.rest.prefixIcon.color },
        suffixIcon: { color: vars.variantNeutralSolid.rest.suffixIcon.color },
        icon: { color: vars.variantNeutralSolid.rest.icon.color },
      },
      neutralWeak: {
        root: {
          background: vars.variantNeutralWeak.rest.root.color,
          "--track-color": vars.variantNeutralWeak.rest.progressCircle.trackColor,
          "--range-color": vars.variantNeutralWeak.rest.progressCircle.rangeColor,
        },
        text: { color: vars.variantNeutralWeak.rest.label.color },
        prefixIcon: { color: vars.variantNeutralWeak.rest.prefixIcon.color },
        suffixIcon: { color: vars.variantNeutralWeak.rest.suffixIcon.color },
        icon: { color: vars.variantNeutralWeak.rest.icon.color },
      },
      criticalSolid: {
        root: {
          background: vars.variantCriticalSolid.rest.root.color,
          "--track-color": vars.variantCriticalSolid.rest.progressCircle.trackColor,
          "--range-color": vars.variantCriticalSolid.rest.progressCircle.rangeColor,
        },
        text: { color: vars.variantCriticalSolid.rest.label.color },
        prefixIcon: { color: vars.variantCriticalSolid.rest.prefixIcon.color },
        suffixIcon: { color: vars.variantCriticalSolid.rest.suffixIcon.color },
        icon: { color: vars.variantCriticalSolid.rest.icon.color },
      },
      brandOutline: {
        root: {
          borderStyle: "solid",
          background: vars.variantBrandOutline.rest.root.color,
          borderWidth: vars.variantBrandOutline.rest.root.strokeWidth,
          borderColor: vars.variantBrandOutline.rest.root.strokeColor,
          "--track-color": vars.variantBrandOutline.rest.progressCircle.trackColor,
          "--range-color": vars.variantBrandOutline.rest.progressCircle.rangeColor,
        },
        text: { color: vars.variantBrandOutline.rest.label.color },
        prefixIcon: { color: vars.variantBrandOutline.rest.prefixIcon.color },
        suffixIcon: { color: vars.variantBrandOutline.rest.suffixIcon.color },
        icon: { color: vars.variantBrandOutline.rest.icon.color },
      },
      neutralOutline: {
        root: {
          borderStyle: "solid",
          background: vars.variantNeutralOutline.rest.root.color,
          borderWidth: vars.variantNeutralOutline.rest.root.strokeWidth,
          borderColor: vars.variantNeutralOutline.rest.root.strokeColor,
          "--track-color": vars.variantNeutralOutline.rest.progressCircle.trackColor,
          "--range-color": vars.variantNeutralOutline.rest.progressCircle.rangeColor,
        },
        text: { color: vars.variantNeutralOutline.rest.label.color },
        prefixIcon: { color: vars.variantNeutralOutline.rest.prefixIcon.color },
        suffixIcon: { color: vars.variantNeutralOutline.rest.suffixIcon.color },
        icon: { color: vars.variantNeutralOutline.rest.icon.color },
      },
      ghost: {
        root: {
          background: vars.variantGhost.rest.root.color,
          "--track-color": vars.variantGhost.rest.progressCircle.trackColor,
          "--range-color": vars.variantGhost.rest.progressCircle.rangeColor,
        },
        text: { color: vars.variantGhost.rest.label.color },
        prefixIcon: { color: vars.variantGhost.rest.prefixIcon.color },
        suffixIcon: { color: vars.variantGhost.rest.suffixIcon.color },
        icon: { color: vars.variantGhost.rest.icon.color },
      },
    },
    size: {
      xsmall: {
        root: {
          height: vars.sizeXsmall.rest.root.minHeight,
          borderRadius: vars.sizeXsmall.rest.root.cornerRadius,

          "--size": vars.sizeXsmall.rest.progressCircle.size,
          "--thickness": vars.sizeXsmall.rest.progressCircle.thickness,
        },
      },
      small: {
        root: {
          height: vars.sizeSmall.rest.root.minHeight,
          borderRadius: vars.sizeSmall.rest.root.cornerRadius,

          "--size": vars.sizeSmall.rest.progressCircle.size,
          "--thickness": vars.sizeSmall.rest.progressCircle.thickness,
        },
      },
      medium: {
        root: {
          height: vars.sizeMedium.rest.root.minHeight,
          borderRadius: vars.sizeMedium.rest.root.cornerRadius,

          "--size": vars.sizeMedium.rest.progressCircle.size,
          "--thickness": vars.sizeMedium.rest.progressCircle.thickness,
        },
      },
      large: {
        root: {
          height: vars.sizeLarge.rest.root.minHeight,
          borderRadius: vars.sizeLarge.rest.root.cornerRadius,

          "--size": vars.sizeLarge.rest.progressCircle.size,
          "--thickness": vars.sizeLarge.rest.progressCircle.thickness,
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
          gap: vars.sizeXsmallLayoutWithText.rest.root.gap,
          "--seed-box-padding-left": vars.sizeXsmallLayoutWithText.rest.root.paddingX,
          "--seed-box-padding-right": vars.sizeXsmallLayoutWithText.rest.root.paddingX,
          "--seed-box-padding-top": vars.sizeXsmallLayoutWithText.rest.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeXsmallLayoutWithText.rest.root.paddingY,
        },
        content: {
          gap: vars.sizeXsmallLayoutWithText.rest.root.gap,
        },
        text: {
          fontSize: vars.sizeXsmallLayoutWithText.rest.label.fontSize,
          lineHeight: vars.sizeXsmallLayoutWithText.rest.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeXsmallLayoutWithText.rest.prefixIcon.size,
          height: vars.sizeXsmallLayoutWithText.rest.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeXsmallLayoutWithText.rest.suffixIcon.size,
          height: vars.sizeXsmallLayoutWithText.rest.suffixIcon.size,
        },
      },
    },
    {
      size: "xsmall",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeXsmallLayoutIconOnly.rest.root.minWidth,
          "--seed-box-padding-left": vars.sizeXsmallLayoutIconOnly.rest.root.paddingX,
          "--seed-box-padding-right": vars.sizeXsmallLayoutIconOnly.rest.root.paddingX,
          "--seed-box-padding-top": vars.sizeXsmallLayoutIconOnly.rest.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeXsmallLayoutIconOnly.rest.root.paddingY,
        },
        icon: {
          width: vars.sizeXsmallLayoutIconOnly.rest.icon.size,
          height: vars.sizeXsmallLayoutIconOnly.rest.icon.size,
        },
      },
    },
    {
      size: "small",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeSmallLayoutWithText.rest.root.gap,
          "--seed-box-padding-left": vars.sizeSmallLayoutWithText.rest.root.paddingX,
          "--seed-box-padding-right": vars.sizeSmallLayoutWithText.rest.root.paddingX,
          "--seed-box-padding-top": vars.sizeSmallLayoutWithText.rest.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeSmallLayoutWithText.rest.root.paddingY,
        },
        content: {
          gap: vars.sizeSmallLayoutWithText.rest.root.gap,
        },
        text: {
          fontSize: vars.sizeSmallLayoutWithText.rest.label.fontSize,
          lineHeight: vars.sizeSmallLayoutWithText.rest.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeSmallLayoutWithText.rest.prefixIcon.size,
          height: vars.sizeSmallLayoutWithText.rest.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeSmallLayoutWithText.rest.suffixIcon.size,
          height: vars.sizeSmallLayoutWithText.rest.suffixIcon.size,
        },
      },
    },
    {
      size: "small",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeSmallLayoutIconOnly.rest.root.minWidth,
          "--seed-box-padding-left": vars.sizeSmallLayoutIconOnly.rest.root.paddingX,
          "--seed-box-padding-right": vars.sizeSmallLayoutIconOnly.rest.root.paddingX,
          "--seed-box-padding-top": vars.sizeSmallLayoutIconOnly.rest.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeSmallLayoutIconOnly.rest.root.paddingY,
        },
        icon: {
          width: vars.sizeSmallLayoutIconOnly.rest.icon.size,
          height: vars.sizeSmallLayoutIconOnly.rest.icon.size,
        },
      },
    },
    {
      size: "medium",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeMediumLayoutWithText.rest.root.gap,
          "--seed-box-padding-left": vars.sizeMediumLayoutWithText.rest.root.paddingX,
          "--seed-box-padding-right": vars.sizeMediumLayoutWithText.rest.root.paddingX,
          "--seed-box-padding-top": vars.sizeMediumLayoutWithText.rest.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeMediumLayoutWithText.rest.root.paddingY,
        },
        content: {
          gap: vars.sizeMediumLayoutWithText.rest.root.gap,
        },
        text: {
          fontSize: vars.sizeMediumLayoutWithText.rest.label.fontSize,
          lineHeight: vars.sizeMediumLayoutWithText.rest.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeMediumLayoutWithText.rest.prefixIcon.size,
          height: vars.sizeMediumLayoutWithText.rest.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeMediumLayoutWithText.rest.suffixIcon.size,
          height: vars.sizeMediumLayoutWithText.rest.suffixIcon.size,
        },
      },
    },
    {
      size: "medium",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeMediumLayoutIconOnly.rest.root.minWidth,
          "--seed-box-padding-left": vars.sizeMediumLayoutIconOnly.rest.root.paddingX,
          "--seed-box-padding-right": vars.sizeMediumLayoutIconOnly.rest.root.paddingX,
          "--seed-box-padding-top": vars.sizeMediumLayoutIconOnly.rest.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeMediumLayoutIconOnly.rest.root.paddingY,
        },
        icon: {
          width: vars.sizeMediumLayoutIconOnly.rest.icon.size,
          height: vars.sizeMediumLayoutIconOnly.rest.icon.size,
        },
      },
    },
    {
      size: "large",
      layout: "withText",
      css: {
        root: {
          gap: vars.sizeLargeLayoutWithText.rest.root.gap,
          "--seed-box-padding-left": vars.sizeLargeLayoutWithText.rest.root.paddingX,
          "--seed-box-padding-right": vars.sizeLargeLayoutWithText.rest.root.paddingX,
          "--seed-box-padding-top": vars.sizeLargeLayoutWithText.rest.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeLargeLayoutWithText.rest.root.paddingY,
        },
        content: {
          gap: vars.sizeLargeLayoutWithText.rest.root.gap,
        },
        text: {
          fontSize: vars.sizeLargeLayoutWithText.rest.label.fontSize,
          lineHeight: vars.sizeLargeLayoutWithText.rest.label.lineHeight,
        },
        prefixIcon: {
          width: vars.sizeLargeLayoutWithText.rest.prefixIcon.size,
          height: vars.sizeLargeLayoutWithText.rest.prefixIcon.size,
        },
        suffixIcon: {
          width: vars.sizeLargeLayoutWithText.rest.suffixIcon.size,
          height: vars.sizeLargeLayoutWithText.rest.suffixIcon.size,
        },
      },
    },
    {
      size: "large",
      layout: "iconOnly",
      css: {
        root: {
          minWidth: vars.sizeLargeLayoutIconOnly.rest.root.minWidth,
          "--seed-box-padding-left": vars.sizeLargeLayoutIconOnly.rest.root.paddingX,
          "--seed-box-padding-right": vars.sizeLargeLayoutIconOnly.rest.root.paddingX,
          "--seed-box-padding-top": vars.sizeLargeLayoutIconOnly.rest.root.paddingY,
          "--seed-box-padding-bottom": vars.sizeLargeLayoutIconOnly.rest.root.paddingY,
        },
        icon: {
          width: vars.sizeLargeLayoutIconOnly.rest.icon.size,
          height: vars.sizeLargeLayoutIconOnly.rest.icon.size,
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

    // ── size × pressed — root scale ──────────────────────────────────────────
    // Lynx has no individual `scale:` property and does not evaluate
    // prefers-reduced-motion, so scale is applied via the `transform` shorthand
    // and always animates on-device (the reduced-motion guard is dropped in
    // lynx-css at the token layer).
    {
      size: "xsmall",
      pressed: true,
      css: { root: { transform: `scale(${vars.sizeXsmall.pressed.root.scale})` } },
    },
    {
      size: "small",
      pressed: true,
      css: { root: { transform: `scale(${vars.sizeSmall.pressed.root.scale})` } },
    },
    {
      size: "medium",
      pressed: true,
      css: { root: { transform: `scale(${vars.sizeMedium.pressed.root.scale})` } },
    },
    {
      size: "large",
      pressed: true,
      css: { root: { transform: `scale(${vars.sizeLarge.pressed.root.scale})` } },
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
