import * as dimension from "../vars/dimension";
import { defineSlotRecipe } from "../utils/define";
import {
  topNavigation as vars,
  topNavigationIconButton as iconButtonVars,
} from "../vars/component";

// The spec moved Top Navigation to button-box-based spacing (`root.paddingX` and
// `main.paddingLeft` are now `$dimension.x1_5`), but this recipe has no negative-margin
// compensation on the icon buttons the way the web one does, so following the spec would shift
// the icon gap from 26px to 16px. Pinned to the pre-change values until DES-2511 settles which
// of the two platforms is right.
const PINNED_ROOT_PADDING_X = dimension.x4;
const PINNED_LEFT_PADDING_RIGHT = "16px";

// The spec raised the iOS height to 56px, so the value now lives in `base` alongside Android's.
// That was decided for the native iOS navigation bar, and the legacy app bar keeps the height it
// has emitted so far on Lynx just as it does on the web.
const PINNED_IOS_ROOT_HEIGHT = "44px";

export const appBarMain = defineSlotRecipe({
  name: "app-bar-main",
  slots: ["root", "title", "subtitle"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minWidth: 0,
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
      titleOnly: {
        title: {
          fontSize: vars.titleLayoutTitleOnly.enabled.title.fontSize,
          fontWeight: vars.titleLayoutTitleOnly.enabled.title.fontWeight,
          lineHeight: vars.titleLayoutTitleOnly.enabled.title.lineHeight,
        },
      },
      withSubtitle: {
        title: {
          fontSize: vars.titleLayoutWithSubtitle.enabled.title.fontSize,
          fontWeight: vars.titleLayoutWithSubtitle.enabled.title.fontWeight,
          lineHeight: vars.titleLayoutWithSubtitle.enabled.title.lineHeight,
        },
        subtitle: {
          fontSize: vars.titleLayoutWithSubtitle.enabled.subtitle.fontSize,
          fontWeight: vars.titleLayoutWithSubtitle.enabled.subtitle.fontWeight,
          lineHeight: vars.titleLayoutWithSubtitle.enabled.subtitle.lineHeight,
        },
      },
    },
    theme: {
      cupertino: {
        root: {
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          top: "var(--seed-safe-area-top)",
          right: 0,
          bottom: 0,
          left: 0,
          // NOTE: the spec's `root.titleMinGap` is not applied yet. `--centered-title-padding-x`
          // is measured from the left/right areas and has no floor, so consuming it means
          // `max(var(--centered-title-padding-x, 0), ${vars.themeIos.enabled.root.titleMinGap})`.
          paddingLeft: "var(--centered-title-padding-x, 0)",
          paddingRight: "var(--centered-title-padding-x, 0)",
        },
      },
      android: {
        root: {
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          height: vars.base.enabled.root.height,
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
      position: "relative",
      zIndex: "var(--z-index-app-bar)",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
    },
    background: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: -1,
    },
    left: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: "100%",
      zIndex: 1,
    },
    right: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: "100%",
      marginLeft: "auto",
      zIndex: 1,
    },
    iconButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0,
      background: "#00000000",
      padding: 0,
      borderRadius: "var(--seed-radius-r1)",
    },
    icon: {
      flexShrink: 0,
    },
    custom: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
  },
  variants: {
    theme: {
      cupertino: {
        root: {
          height: `calc(${PINNED_IOS_ROOT_HEIGHT} + var(--seed-safe-area-top))`,
          paddingLeft: PINNED_ROOT_PADDING_X,
          paddingRight: PINNED_ROOT_PADDING_X,
          paddingTop: "var(--seed-safe-area-top)",
        },
        left: {
          height: PINNED_IOS_ROOT_HEIGHT,
        },
        right: {
          height: PINNED_IOS_ROOT_HEIGHT,
        },
        iconButton: {
          width: iconButtonVars.base.enabled.root.size,
          height: iconButtonVars.base.enabled.root.size,
        },
        icon: {
          width: iconButtonVars.base.enabled.icon.size,
          height: iconButtonVars.base.enabled.icon.size,
        },
      },
      android: {
        root: {
          height: `calc(${vars.base.enabled.root.height} + var(--seed-safe-area-top))`,
          paddingLeft: PINNED_ROOT_PADDING_X,
          paddingRight: PINNED_ROOT_PADDING_X,
          paddingTop: "var(--seed-safe-area-top)",
        },
        left: {
          height: vars.base.enabled.root.height,
          paddingRight: PINNED_LEFT_PADDING_RIGHT,
        },
        right: {
          height: vars.base.enabled.root.height,
        },
        iconButton: {
          width: iconButtonVars.base.enabled.root.size,
          height: iconButtonVars.base.enabled.root.size,
        },
        icon: {
          width: iconButtonVars.base.enabled.icon.size,
          height: iconButtonVars.base.enabled.icon.size,
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
          background: vars.toneLayer.enabled.root.color,
        },
        icon: {
          color: iconButtonVars.toneLayer.enabled.icon.color,
        },
      },
      transparent: {
        background: {
          background: vars.toneTransparentGradientFalse.enabled.root.color,
        },
        icon: {
          color: iconButtonVars.toneTransparent.enabled.icon.color,
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
