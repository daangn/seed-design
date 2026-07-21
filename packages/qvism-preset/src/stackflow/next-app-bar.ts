import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { focusVisible, pseudo } from "../utils/pseudo";
import { vars as tokens } from "../vars/";
import {
  topNavigation as vars,
  topNavigationIconButton as iconButtonVars,
} from "../vars/component";

export const nextAppBarMain = defineSlotRecipe({
  name: "next-app-bar-main",
  slots: ["root", "title", "subtitle"],
  base: {
    root: {
      flex: 1,
    },
    title: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    subtitle: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  variants: {
    layout: {
      // NOTE: nested clamp — outer component bounds narrow the inner global clamp baked into
      // the token (intersection; requires component range ⊆ global range). see packages/qvism-preset/src/global.ts
      titleOnly: {
        title: {
          fontSize: `clamp(calc(${tokens.$fontSize.t6Static} * ${vars.titleLayoutTitleOnly.enabled.title.minFontSizeScale}), ${vars.titleLayoutTitleOnly.enabled.title.fontSize}, calc(${tokens.$fontSize.t6Static} * ${vars.titleLayoutTitleOnly.enabled.title.maxFontSizeScale}))`,
          fontWeight: vars.titleLayoutTitleOnly.enabled.title.fontWeight,
          lineHeight: `clamp(calc(${tokens.$lineHeight.t6Static} * ${vars.titleLayoutTitleOnly.enabled.title.minLineHeightScale}), ${vars.titleLayoutTitleOnly.enabled.title.lineHeight}, calc(${tokens.$lineHeight.t6Static} * ${vars.titleLayoutTitleOnly.enabled.title.maxLineHeightScale}))`,
        },
      },
      withSubtitle: {
        title: {
          fontSize: `clamp(calc(${tokens.$fontSize.t5Static} * ${vars.titleLayoutWithSubtitle.enabled.title.minFontSizeScale}), ${vars.titleLayoutWithSubtitle.enabled.title.fontSize}, calc(${tokens.$fontSize.t5Static} * ${vars.titleLayoutWithSubtitle.enabled.title.maxFontSizeScale}))`,
          fontWeight: vars.titleLayoutWithSubtitle.enabled.title.fontWeight,
          lineHeight: `clamp(calc(${tokens.$lineHeight.t5Static} * ${vars.titleLayoutWithSubtitle.enabled.title.minLineHeightScale}), ${vars.titleLayoutWithSubtitle.enabled.title.lineHeight}, calc(${tokens.$lineHeight.t5Static} * ${vars.titleLayoutWithSubtitle.enabled.title.maxLineHeightScale}))`,
        },
        subtitle: {
          fontSize: `clamp(calc(${tokens.$fontSize.t2Static} * ${vars.titleLayoutWithSubtitle.enabled.subtitle.minFontSizeScale}), ${vars.titleLayoutWithSubtitle.enabled.subtitle.fontSize}, calc(${tokens.$fontSize.t2Static} * ${vars.titleLayoutWithSubtitle.enabled.subtitle.maxFontSizeScale}))`,
          fontWeight: vars.titleLayoutWithSubtitle.enabled.subtitle.fontWeight,
          lineHeight: `clamp(calc(${tokens.$lineHeight.t2Static} * ${vars.titleLayoutWithSubtitle.enabled.subtitle.minLineHeightScale}), ${vars.titleLayoutWithSubtitle.enabled.subtitle.lineHeight}, calc(${tokens.$lineHeight.t2Static} * ${vars.titleLayoutWithSubtitle.enabled.subtitle.maxLineHeightScale}))`,
        },
      },
    },
    theme: {
      cupertino: {
        root: {
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          top: "var(--seed-safe-area-top)",
          bottom: 0,
          insetInline: 0,
          paddingInline: "var(--centered-title-padding-x, 0)",
          pointerEvents: "none",
        },
      },
      android: {
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",

          width: "100%",
          minWidth: 0, // ensures that the text-overflow works correctly

          height: "100%",
        },
      },
    },
    // The NextAppBar is embedded in the screen layer and moves with it as one
    // piece — declared only so the styled layer can forward the variant.
    transitionStyle: {
      horizontalSlide: {},
      verticalSlide: {},
      fadeIn: {},
    },
    tone: {
      layer: {
        root: {
          color: vars.toneLayer.enabled.title.color,
        },
        title: {
          color: vars.toneLayer.enabled.title.color,
        },
        subtitle: {
          color: vars.toneLayer.enabled.subtitle.color,
        },
      },
      transparent: {
        root: {
          color: vars.toneTransparent.enabled.title.color,
        },
        title: {
          color: vars.toneTransparent.enabled.title.color,
        },
        subtitle: {
          color: vars.toneTransparent.enabled.subtitle.color,
        },
      },
    },
  },
  defaultVariants: {
    layout: "titleOnly",
    theme: "cupertino",
    transitionStyle: "horizontalSlide",
    tone: "layer",
  },
});

export const nextAppBar = defineSlotRecipe({
  name: "next-app-bar",
  slots: ["root", "background", "left", "right", "iconButton", "icon", "custom"],
  base: {
    root: {
      // The bar lives inside the screen layer (the transition unit), so it has
      // no stack z-index tier — it only needs to sit above the content.
      zIndex: 1,
      top: 0,

      position: "absolute",
      boxSizing: "border-box",
      width: "100%",
      display: "flex",
      alignItems: "flex-end",
    },
    background: {
      position: "absolute",
      pointerEvents: "none",
      inset: 0,
      zIndex: -1,
    },
    left: {
      display: "flex",
      alignItems: "center",
      height: "100%",
    },
    right: {
      display: "flex",
      alignItems: "center",
      height: "100%",
      marginLeft: "auto",
    },
    iconButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      border: "none",
      background: "none",
      fontFamily: "inherit",
      padding: 0,

      borderRadius: tokens.$radius.r1,
      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),
    },
    icon: {
      display: "inline-block",
      flexShrink: 0,
    },
  },
  variants: {
    theme: {
      cupertino: {
        root: {
          height: `calc(${vars.themeIos.enabled.root.height} + var(--seed-safe-area-top))`,
          paddingInline: vars.themeIos.enabled.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        iconButton: {
          width: iconButtonVars.base.enabled.root.size,
          height: iconButtonVars.base.enabled.root.size,

          "&:first-child": {
            marginLeft: `calc(-1 * (${iconButtonVars.base.enabled.root.size} - ${iconButtonVars.base.enabled.icon.size}) / 2)`,
          },
          "&:last-child": {
            marginRight: `calc(-1 * (${iconButtonVars.base.enabled.root.size} - ${iconButtonVars.base.enabled.icon.size}) / 2)`,
          },
        },
        icon: {
          width: `var(--seed-icon-size, ${iconButtonVars.base.enabled.icon.size})`,
          height: `var(--seed-icon-size, ${iconButtonVars.base.enabled.icon.size})`,
        },
      },
      android: {
        root: {
          height: `calc(${vars.themeAndroid.enabled.root.height} + var(--seed-safe-area-top))`,
          paddingInline: vars.themeAndroid.enabled.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        iconButton: {
          width: iconButtonVars.base.enabled.root.size,
          height: iconButtonVars.base.enabled.root.size,

          "&:first-child": {
            marginLeft: `calc(-1 * (${iconButtonVars.base.enabled.root.size} - ${iconButtonVars.base.enabled.icon.size}) / 2)`,
          },
          "&:last-child": {
            marginRight: `calc(-1 * (${iconButtonVars.base.enabled.root.size} - ${iconButtonVars.base.enabled.icon.size}) / 2)`,
          },
        },
        icon: {
          width: `var(--seed-icon-size, ${iconButtonVars.base.enabled.icon.size})`,
          height: `var(--seed-icon-size, ${iconButtonVars.base.enabled.icon.size})`,
        },
        left: {
          paddingRight: vars.themeAndroid.enabled.main.paddingLeft,
        },
      },
    },
    // Embedded in the layer; declared only for variant forwarding.
    transitionStyle: {
      horizontalSlide: {},
      verticalSlide: {},
      fadeIn: {},
    },
    tone: {
      layer: {
        background: {
          background: `var(--seed-box-background, ${vars.toneLayer.enabled.root.color})`,
        },
        icon: {
          color: `var(--seed-icon-color, ${iconButtonVars.toneLayer.enabled.icon.color})`,
        },
      },
      transparent: {
        root: {
          backgroundColor: vars.toneTransparentGradientFalse.enabled.root.color,
        },
        icon: {
          color: `var(--seed-icon-color, ${iconButtonVars.toneTransparent.enabled.icon.color})`,
        },
      },
    },
    gradient: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      tone: "transparent",
      gradient: true,
      css: {
        background: {
          background: `linear-gradient(180deg, ${vars.toneTransparentGradientTrue.enabled.root.gradient})`,
          height: `calc(100% + ${vars.toneTransparentGradientTrue.enabled.root.bleedBottom})`,
        },
      },
    },
  ],
  defaultVariants: {
    theme: "cupertino",
    transitionStyle: "horizontalSlide",
    tone: "layer",
    gradient: true,
  },
});
