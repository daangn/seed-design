import { actionButton as vars } from "../../vars/component";

import { defineLynxSlotRecipe } from "../../utils/define-lynx";
import { active, disabled, loading, pseudo } from "../../utils/pseudo";

/**
 * ActionButton recipe (Lynx fork).
 *
 * Derived from the web `action-button` recipe with these changes for Lynx:
 * - **Slot-recipe shape** (`root`/`text`/`prefixIcon`/`suffixIcon`).
 * - **`prefixIcon`/`suffixIcon` 슬롯에 `color: var(--seed-color-...)` 만 지정한다.**
 *   Lynx 3.7 의 `<image>` 는 `tint-color` CSS property 도 `tint-color` attribute
 *   에서 `var()` 스트링도 해석하지 않는다. concrete color(hex/rgb) 만 받는다.
 *   대신 `<image>` 의 CSS `color` 값은 main-thread API `getComputedStyleProperty("color")`
 *   로 resolved hex 를 읽어올 수 있다 (POC D 에서 검증).
 *   따라서 recipe 는 slot 에 `color` 만 박고, React 쪽
 *   `ActionButton.PrefixIcon`/`SuffixIcon` 에서 `useIconColor` 훅이 main-thread 로
 *   가 `color` 를 읽어 `tint-color` attribute 로 mirror 하는 방식으로 처리한다.
 * - 슬롯에 width/height/flexShrink 만 남겨 아이콘 크기는 CSS 로 결정한다.
 * - `:active` pseudo replaces the web's `engaged` (hover+active).
 * - No focus-ring / `:focusVisible` — Lynx has no keyboard focus UX.
 * - No `iconOnly` / `loading` icon styles yet. `layout: "iconOnly"` and
 *   `loading` spinner remain Tier B (pending dedicated icon slots).
 * - `ghost` variant drops the `--seed-box-color` indirection since Lynx does
 *   not cascade CSS variables down to descendants the same way.
 * - `progressCircle` track/range custom properties preserved so the `loading`
 *   spinner component can opt in once implemented.
 */
const actionButton = defineLynxSlotRecipe({
  name: "action-button",
  slots: ["root", "text", "prefixIcon", "suffixIcon"],
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
  },
  variants: {
    variant: {
      brandSolid: {
        root: {
          background: vars.variantBrandSolid.enabled.root.color,
          "--track-color": vars.variantBrandSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantBrandSolid.enabled.progressCircle.rangeColor,

          [pseudo(active)]: {
            background: vars.variantBrandSolid.pressed.root.color,
          },
          [pseudo(disabled)]: {
            background: vars.variantBrandSolid.disabled.root.color,
          },
          [pseudo(loading)]: {
            background: vars.variantBrandSolid.loading.root.color,
          },
        },
        text: {
          color: vars.variantBrandSolid.enabled.label.color,
          [pseudo(disabled)]: { color: vars.variantBrandSolid.disabled.label.color },
        },
        prefixIcon: {
          color: vars.variantBrandSolid.enabled.prefixIcon.color,
          [pseudo(disabled)]: { color: vars.variantBrandSolid.disabled.prefixIcon.color },
        },
        suffixIcon: {
          color: vars.variantBrandSolid.enabled.suffixIcon.color,
          [pseudo(disabled)]: { color: vars.variantBrandSolid.disabled.suffixIcon.color },
        },
      },
      neutralSolid: {
        root: {
          background: vars.variantNeutralSolid.enabled.root.color,
          "--track-color": vars.variantNeutralSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantNeutralSolid.enabled.progressCircle.rangeColor,

          [pseudo(active)]: { background: vars.variantNeutralSolid.pressed.root.color },
          [pseudo(disabled)]: { background: vars.variantNeutralSolid.disabled.root.color },
          [pseudo(loading)]: { background: vars.variantNeutralSolid.loading.root.color },
        },
        text: {
          color: vars.variantNeutralSolid.enabled.label.color,
          [pseudo(disabled)]: { color: vars.variantNeutralSolid.disabled.label.color },
        },
        prefixIcon: {
          color: vars.variantNeutralSolid.enabled.prefixIcon.color,
          [pseudo(disabled)]: { color: vars.variantNeutralSolid.disabled.prefixIcon.color },
        },
        suffixIcon: {
          color: vars.variantNeutralSolid.enabled.suffixIcon.color,
          [pseudo(disabled)]: { color: vars.variantNeutralSolid.disabled.suffixIcon.color },
        },
      },
      neutralWeak: {
        root: {
          background: vars.variantNeutralWeak.enabled.root.color,
          "--track-color": vars.variantNeutralWeak.enabled.progressCircle.trackColor,
          "--range-color": vars.variantNeutralWeak.enabled.progressCircle.rangeColor,

          [pseudo(active)]: { background: vars.variantNeutralWeak.pressed.root.color },
          [pseudo(disabled)]: { background: vars.variantNeutralWeak.disabled.root.color },
          [pseudo(loading)]: { background: vars.variantNeutralWeak.loading.root.color },
        },
        text: {
          color: vars.variantNeutralWeak.enabled.label.color,
          [pseudo(disabled)]: { color: vars.variantNeutralWeak.disabled.label.color },
        },
        prefixIcon: {
          color: vars.variantNeutralWeak.enabled.prefixIcon.color,
          [pseudo(disabled)]: { color: vars.variantNeutralWeak.disabled.prefixIcon.color },
        },
        suffixIcon: {
          color: vars.variantNeutralWeak.enabled.suffixIcon.color,
          [pseudo(disabled)]: { color: vars.variantNeutralWeak.disabled.suffixIcon.color },
        },
      },
      criticalSolid: {
        root: {
          background: vars.variantCriticalSolid.enabled.root.color,
          "--track-color": vars.variantCriticalSolid.enabled.progressCircle.trackColor,
          "--range-color": vars.variantCriticalSolid.enabled.progressCircle.rangeColor,

          [pseudo(active)]: { background: vars.variantCriticalSolid.pressed.root.color },
          [pseudo(disabled)]: { background: vars.variantCriticalSolid.disabled.root.color },
          [pseudo(loading)]: { background: vars.variantCriticalSolid.loading.root.color },
        },
        text: {
          color: vars.variantCriticalSolid.enabled.label.color,
          [pseudo(disabled)]: { color: vars.variantCriticalSolid.disabled.label.color },
        },
        prefixIcon: {
          color: vars.variantCriticalSolid.enabled.prefixIcon.color,
          [pseudo(disabled)]: { color: vars.variantCriticalSolid.disabled.prefixIcon.color },
        },
        suffixIcon: {
          color: vars.variantCriticalSolid.enabled.suffixIcon.color,
          [pseudo(disabled)]: { color: vars.variantCriticalSolid.disabled.suffixIcon.color },
        },
      },
      brandOutline: {
        root: {
          borderStyle: "solid",
          background: vars.variantBrandOutline.enabled.root.color,
          borderWidth: vars.variantBrandOutline.enabled.root.strokeWidth,
          borderColor: vars.variantBrandOutline.enabled.root.strokeColor,
          "--track-color": vars.variantBrandOutline.enabled.progressCircle.trackColor,
          "--range-color": vars.variantBrandOutline.enabled.progressCircle.rangeColor,

          [pseudo(active)]: { background: vars.variantBrandOutline.pressed.root.color },
          [pseudo(disabled)]: {
            background: vars.variantBrandOutline.disabled.root.color,
            borderColor: vars.variantBrandOutline.disabled.root.strokeColor,
          },
          [pseudo(loading)]: { background: vars.variantBrandOutline.loading.root.color },
        },
        text: {
          color: vars.variantBrandOutline.enabled.label.color,
          [pseudo(disabled)]: { color: vars.variantBrandOutline.disabled.label.color },
        },
        prefixIcon: {
          color: vars.variantBrandOutline.enabled.prefixIcon.color,
          [pseudo(disabled)]: { color: vars.variantBrandOutline.disabled.prefixIcon.color },
        },
        suffixIcon: {
          color: vars.variantBrandOutline.enabled.suffixIcon.color,
          [pseudo(disabled)]: { color: vars.variantBrandOutline.disabled.suffixIcon.color },
        },
      },
      neutralOutline: {
        root: {
          borderStyle: "solid",
          background: vars.variantNeutralOutline.enabled.root.color,
          borderWidth: vars.variantNeutralOutline.enabled.root.strokeWidth,
          borderColor: vars.variantNeutralOutline.enabled.root.strokeColor,
          "--track-color": vars.variantNeutralOutline.enabled.progressCircle.trackColor,
          "--range-color": vars.variantNeutralOutline.enabled.progressCircle.rangeColor,

          [pseudo(active)]: { background: vars.variantNeutralOutline.pressed.root.color },
          [pseudo(disabled)]: {
            background: vars.variantNeutralOutline.disabled.root.color,
            borderColor: vars.variantNeutralOutline.disabled.root.strokeColor,
          },
          [pseudo(loading)]: { background: vars.variantNeutralOutline.loading.root.color },
        },
        text: {
          color: vars.variantNeutralOutline.enabled.label.color,
          [pseudo(disabled)]: { color: vars.variantNeutralOutline.disabled.label.color },
        },
        prefixIcon: {
          color: vars.variantNeutralOutline.enabled.prefixIcon.color,
          [pseudo(disabled)]: { color: vars.variantNeutralOutline.disabled.prefixIcon.color },
        },
        suffixIcon: {
          color: vars.variantNeutralOutline.enabled.suffixIcon.color,
          [pseudo(disabled)]: { color: vars.variantNeutralOutline.disabled.suffixIcon.color },
        },
      },
      ghost: {
        root: {
          background: vars.variantGhost.enabled.root.color,
          "--track-color": vars.variantGhost.enabled.progressCircle.trackColor,
          "--range-color": vars.variantGhost.enabled.progressCircle.rangeColor,

          [pseudo(active)]: { background: vars.variantGhost.pressed.root.color },
          [pseudo(disabled)]: { background: vars.variantGhost.disabled.root.color },
          [pseudo(loading)]: { background: vars.variantGhost.loading.root.color },
        },
        text: {
          color: vars.variantGhost.enabled.label.color,
          [pseudo(disabled)]: { color: vars.variantGhost.disabled.label.color },
        },
        prefixIcon: {
          color: vars.variantGhost.enabled.prefixIcon.color,
          [pseudo(disabled)]: { color: vars.variantGhost.disabled.prefixIcon.color },
        },
        suffixIcon: {
          color: vars.variantGhost.enabled.suffixIcon.color,
          [pseudo(disabled)]: { color: vars.variantGhost.disabled.suffixIcon.color },
        },
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
  },
  compoundVariants: [
    // size × layout=withText — padding, gap, font size, icon dimensions
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
      },
    },
  ],
  defaultVariants: {
    variant: "brandSolid",
    size: "medium",
    layout: "withText",
  },
});

export default actionButton;
