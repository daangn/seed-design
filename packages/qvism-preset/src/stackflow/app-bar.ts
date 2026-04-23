import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { pseudo, focusVisible } from "../utils/pseudo";
import { topNavigation as vars } from "../vars/component";
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          top: "var(--seed-safe-area-top)",
          bottom: 0,
          left: 0,
          right: 0,
          paddingLeft: "var(--centered-title-padding-x, 0)",
          paddingRight: "var(--centered-title-padding-x, 0)",
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
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
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
          height: `calc(${vars.themeCupertino.enabled.root.minHeight} + var(--seed-safe-area-top))`,
          paddingLeft: vars.themeCupertino.enabled.root.paddingX,
          paddingRight: vars.themeCupertino.enabled.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        iconButton: {
          width: vars.themeCupertino.enabled.icon.targetSize,
          height: vars.themeCupertino.enabled.icon.targetSize,

          // cursor: "pointer"; // we might need this later

          "&:first-child": {
            marginLeft: `calc(-1 * (${vars.themeCupertino.enabled.icon.targetSize} - ${vars.themeCupertino.enabled.icon.size}) / 2)`,
          },
          "&:last-child": {
            marginRight: `calc(-1 * (${vars.themeCupertino.enabled.icon.targetSize} - ${vars.themeCupertino.enabled.icon.size}) / 2)`,
          },
        },
        // Instead of making another `icon` slot, defining the icon style using ...onlyIcon({}) inside the `iconButton` slot sounds better
        // if we decide to do so, we should require users to wrap the icon with the <Icon /> component. (currently it's optional)
        icon: {
          width: `var(--seed-icon-size, ${vars.themeCupertino.enabled.icon.size})`,
          height: `var(--seed-icon-size, ${vars.themeCupertino.enabled.icon.size})`,
        },
      },
      android: {
        root: {
          height: `calc(${vars.themeAndroid.enabled.root.minHeight} + var(--seed-safe-area-top))`,
          paddingLeft: vars.themeAndroid.enabled.root.paddingX,
          paddingRight: vars.themeAndroid.enabled.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        iconButton: {
          width: vars.themeAndroid.enabled.icon.targetSize,
          height: vars.themeAndroid.enabled.icon.targetSize,

          "&:first-child": {
            marginLeft: `calc(-1 * (${vars.themeAndroid.enabled.icon.targetSize} - ${vars.themeAndroid.enabled.icon.size}) / 2)`,
          },
          "&:last-child": {
            marginRight: `calc(-1 * (${vars.themeAndroid.enabled.icon.targetSize} - ${vars.themeAndroid.enabled.icon.size}) / 2)`,
          },
        },
        icon: {
          width: `var(--seed-icon-size, ${vars.themeAndroid.enabled.icon.size})`,
          height: `var(--seed-icon-size, ${vars.themeAndroid.enabled.icon.size})`,
        },
        left: {
          paddingRight: "16px",
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
          color: `var(--seed-icon-color, ${vars.toneLayer.enabled.icon.color})`,
        },
      },
      transparent: {
        root: {
          backgroundColor: vars.toneTransparent.enabled.root.color,
        },
        icon: {
          color: `var(--seed-icon-color, ${vars.toneTransparent.enabled.icon.color})`,
        },
      },
    },
    divider: {
      true: {
        background: {
          boxShadow: `inset 0px calc(-1 * ${vars.dividerTrue.enabled.root.strokeWidth}) 0 ${vars.dividerTrue.enabled.root.strokeColor}`,
        },
      },
    },
  },
  defaultVariants: {
    theme: "cupertino",
    transitionStyle: "slideFromRightIOS",
    tone: "layer",
    divider: false,
  },
});
