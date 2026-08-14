import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { pseudo, focusVisible } from "../utils/pseudo";
import { topNavigation as vars } from "../vars/component";
import { topNavigationIconButton as iconButtonVars } from "../vars/component";
import { vars as tokens } from "../vars/";

export const appBarMain = defineSlotRecipe({
  name: "app-bar-main",
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
      // TODO: have some better way to derive static font-size/line-height token references
      // NOTE: when updating vars, update static token references accordingly
      // NOTE: nested clamp — outer component bounds narrow the inner global clamp baked into the token (intersection; requires component range ⊆ global range). see packages/qvism-preset/src/global.ts
      titleOnly: {
        title: {
          fontSize: `clamp(calc(${tokens.$fontSize.t6Static} * ${vars.titleLayoutTitleOnly.rest.title.minFontSizeScale}), ${vars.titleLayoutTitleOnly.rest.title.fontSize}, calc(${tokens.$fontSize.t6Static} * ${vars.titleLayoutTitleOnly.rest.title.maxFontSizeScale}))`,
          fontWeight: vars.titleLayoutTitleOnly.rest.title.fontWeight,
          lineHeight: `clamp(calc(${tokens.$lineHeight.t6Static} * ${vars.titleLayoutTitleOnly.rest.title.minLineHeightScale}), ${vars.titleLayoutTitleOnly.rest.title.lineHeight}, calc(${tokens.$lineHeight.t6Static} * ${vars.titleLayoutTitleOnly.rest.title.maxLineHeightScale}))`,
        },
      },
      withSubtitle: {
        title: {
          fontSize: `clamp(calc(${tokens.$fontSize.t5Static} * ${vars.titleLayoutWithSubtitle.rest.title.minFontSizeScale}), ${vars.titleLayoutWithSubtitle.rest.title.fontSize}, calc(${tokens.$fontSize.t5Static} * ${vars.titleLayoutWithSubtitle.rest.title.maxFontSizeScale}))`,
          fontWeight: vars.titleLayoutWithSubtitle.rest.title.fontWeight,
          lineHeight: `clamp(calc(${tokens.$lineHeight.t5Static} * ${vars.titleLayoutWithSubtitle.rest.title.minLineHeightScale}), ${vars.titleLayoutWithSubtitle.rest.title.lineHeight}, calc(${tokens.$lineHeight.t5Static} * ${vars.titleLayoutWithSubtitle.rest.title.maxLineHeightScale}))`,
        },
        subtitle: {
          fontSize: `clamp(calc(${tokens.$fontSize.t2Static} * ${vars.titleLayoutWithSubtitle.rest.subtitle.minFontSizeScale}), ${vars.titleLayoutWithSubtitle.rest.subtitle.fontSize}, calc(${tokens.$fontSize.t2Static} * ${vars.titleLayoutWithSubtitle.rest.subtitle.maxFontSizeScale}))`,
          fontWeight: vars.titleLayoutWithSubtitle.rest.subtitle.fontWeight,
          lineHeight: `clamp(calc(${tokens.$lineHeight.t2Static} * ${vars.titleLayoutWithSubtitle.rest.subtitle.minLineHeightScale}), ${vars.titleLayoutWithSubtitle.rest.subtitle.lineHeight}, calc(${tokens.$lineHeight.t2Static} * ${vars.titleLayoutWithSubtitle.rest.subtitle.maxLineHeightScale}))`,
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
    transitionStyle: {
      slideFromRightIOS: {},
      fadeFromBottomAndroid: {},
      fadeIn: {},
    },
    tone: {
      layer: {
        root: {
          color: vars.toneLayer.rest.title.color,
        },
        title: {
          color: vars.toneLayer.rest.title.color,
        },
        subtitle: {
          color: vars.toneLayer.rest.subtitle.color,
        },
      },
      transparent: {
        root: {
          color: vars.toneTransparent.rest.title.color,
        },
        title: {
          color: vars.toneTransparent.rest.title.color,
        },
        subtitle: {
          color: vars.toneTransparent.rest.subtitle.color,
        },
      },
    },
  },
  defaultVariants: {
    layout: "titleOnly",
    theme: "cupertino",
    transitionStyle: "slideFromRightIOS",
    tone: "layer",
  },
});

export const appBar = defineSlotRecipe({
  name: "app-bar",
  slots: ["root", "background", "left", "right", "iconButton", "icon", "custom"],
  base: {
    root: {
      zIndex: "var(--z-index-app-bar)",
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
          height: `calc(${vars.themeIos.rest.root.height} + var(--seed-safe-area-top))`,
          paddingInline: vars.themeIos.rest.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        iconButton: {
          width: iconButtonVars.base.rest.root.size,
          height: iconButtonVars.base.rest.root.size,

          // cursor: "pointer"; // we might need this later

          "&:first-child": {
            marginLeft: `calc(-1 * (${iconButtonVars.base.rest.root.size} - ${iconButtonVars.base.rest.icon.size}) / 2)`,
          },
          "&:last-child": {
            marginRight: `calc(-1 * (${iconButtonVars.base.rest.root.size} - ${iconButtonVars.base.rest.icon.size}) / 2)`,
          },
        },
        // Instead of making another `icon` slot, defining the icon style using ...onlyIcon({}) inside the `iconButton` slot sounds better
        // if we decide to do so, we should require users to wrap the icon with the <Icon /> component. (currently it's optional)
        icon: {
          width: `var(--seed-icon-size, ${iconButtonVars.base.rest.icon.size})`,
          height: `var(--seed-icon-size, ${iconButtonVars.base.rest.icon.size})`,
        },
      },
      // TODO: most of these can be shared with cupertino, we can just override the necessary styles
      android: {
        root: {
          height: `calc(${vars.themeAndroid.rest.root.height} + var(--seed-safe-area-top))`,
          paddingInline: vars.themeAndroid.rest.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        iconButton: {
          width: iconButtonVars.base.rest.root.size,
          height: iconButtonVars.base.rest.root.size,

          "&:first-child": {
            marginLeft: `calc(-1 * (${iconButtonVars.base.rest.root.size} - ${iconButtonVars.base.rest.icon.size}) / 2)`,
          },
          "&:last-child": {
            marginRight: `calc(-1 * (${iconButtonVars.base.rest.root.size} - ${iconButtonVars.base.rest.icon.size}) / 2)`,
          },
        },
        icon: {
          width: `var(--seed-icon-size, ${iconButtonVars.base.rest.icon.size})`,
          height: `var(--seed-icon-size, ${iconButtonVars.base.rest.icon.size})`,
        },
        left: {
          paddingRight: vars.themeAndroid.rest.main.paddingLeft,
        },
      },
    },
    transitionStyle: {
      slideFromRightIOS: {},
      fadeFromBottomAndroid: {},
      fadeIn: {},
    },
    tone: {
      layer: {
        background: {
          background: `var(--seed-box-background, ${vars.toneLayer.rest.root.color})`,
        },
        icon: {
          color: `var(--seed-icon-color, ${iconButtonVars.toneLayer.rest.icon.color})`,
        },
      },
      transparent: {
        root: {
          // gradient is handled in app-screen.ts
          backgroundColor: vars.toneTransparentGradientFalse.rest.root.color,
        },
        icon: {
          color: `var(--seed-icon-color, ${iconButtonVars.toneTransparent.rest.icon.color})`,
        },
      },
    },
  },
  defaultVariants: {
    theme: "cupertino",
    transitionStyle: "slideFromRightIOS",
    tone: "layer",
  },
});
