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

// The spec moved Top Navigation to button-box-based spacing (`root.paddingX` and
// `main.paddingLeft` are now `$dimension.x1_5`). Following it here would render identically —
// the negative margins below exist only to undo the old icon-based basis — but it rewrites the
// emitted CSS, so both stay as they were until DES-2511 settles the platform difference.
const PINNED_ROOT_PADDING_X = tokens.$dimension.x4;
const PINNED_LEFT_PADDING_RIGHT = "16px";
const ICON_BASIS_OFFSET = `calc(-1 * (${iconButtonVars.base.enabled.root.size} - ${iconButtonVars.base.enabled.icon.size}) / 2)`;

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
          // NOTE: the spec's `root.titleMinGap` is not applied yet. `--centered-title-padding-x`
          // is measured from the left/right areas in `useAppBar` and has no floor, so consuming it
          // means `max(var(--centered-title-padding-x, 0), ${vars.base.enabled.root.titleMinGap})`.
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
          height: `calc(${vars.themeIos.enabled.root.height} + var(--seed-safe-area-top))`,
          paddingInline: PINNED_ROOT_PADDING_X,
          paddingTop: "var(--seed-safe-area-top)",
        },
        iconButton: {
          width: iconButtonVars.base.enabled.root.size,
          height: iconButtonVars.base.enabled.root.size,

          // cursor: "pointer"; // we might need this later

          "&:first-child": {
            marginLeft: ICON_BASIS_OFFSET,
          },
          "&:last-child": {
            marginRight: ICON_BASIS_OFFSET,
          },
        },
        // Instead of making another `icon` slot, defining the icon style using ...onlyIcon({}) inside the `iconButton` slot sounds better
        // if we decide to do so, we should require users to wrap the icon with the <Icon /> component. (currently it's optional)
        icon: {
          width: `var(--seed-icon-size, ${iconButtonVars.base.enabled.icon.size})`,
          height: `var(--seed-icon-size, ${iconButtonVars.base.enabled.icon.size})`,
        },
      },
      // TODO: most of these can be shared with cupertino, we can just override the necessary styles
      android: {
        root: {
          height: `calc(${vars.themeAndroid.enabled.root.height} + var(--seed-safe-area-top))`,
          paddingInline: PINNED_ROOT_PADDING_X,
          paddingTop: "var(--seed-safe-area-top)",
        },
        iconButton: {
          width: iconButtonVars.base.enabled.root.size,
          height: iconButtonVars.base.enabled.root.size,

          "&:first-child": {
            marginLeft: ICON_BASIS_OFFSET,
          },
          "&:last-child": {
            marginRight: ICON_BASIS_OFFSET,
          },
        },
        icon: {
          width: `var(--seed-icon-size, ${iconButtonVars.base.enabled.icon.size})`,
          height: `var(--seed-icon-size, ${iconButtonVars.base.enabled.icon.size})`,
        },
        left: {
          paddingRight: PINNED_LEFT_PADDING_RIGHT,
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
          background: `var(--seed-box-background, ${vars.toneLayer.enabled.root.color})`,
        },
        icon: {
          color: `var(--seed-icon-color, ${iconButtonVars.toneLayer.enabled.icon.color})`,
        },
      },
      transparent: {
        root: {
          // gradient is handled in app-screen.ts
          backgroundColor: vars.toneTransparentGradientFalse.enabled.root.color,
        },
        icon: {
          color: `var(--seed-icon-color, ${iconButtonVars.toneTransparent.enabled.icon.color})`,
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
