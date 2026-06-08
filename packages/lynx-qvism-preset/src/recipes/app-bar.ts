import { defineSlotRecipe } from "../utils/define";
import {
  topNavigation as vars,
  topNavigationIconButton as iconButtonVars,
} from "../vars/component";

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
          paddingLeft: "var(--centered-title-padding-x, 0)",
          paddingRight: "var(--centered-title-padding-x, 0)",
        },
      },
      android: {
        root: {
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          height: vars.themeAndroid.enabled.root.height,
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
  compoundVariants: [
    {
      layout: "titleOnly",
      theme: "cupertino",
      css: {
        root: {
          transform: "translateY(-12px)",
        },
      },
    },
  ],
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
          height: `calc(${vars.themeIos.enabled.root.height} + var(--seed-safe-area-top))`,
          paddingLeft: vars.themeIos.enabled.root.paddingX,
          paddingRight: vars.themeIos.enabled.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        left: {
          height: vars.themeIos.enabled.root.height,
        },
        right: {
          height: vars.themeIos.enabled.root.height,
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
          height: `calc(${vars.themeAndroid.enabled.root.height} + var(--seed-safe-area-top))`,
          paddingLeft: vars.themeAndroid.enabled.root.paddingX,
          paddingRight: vars.themeAndroid.enabled.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        left: {
          height: vars.themeAndroid.enabled.root.height,
          paddingRight: vars.themeAndroid.enabled.main.paddingLeft,
        },
        right: {
          height: vars.themeAndroid.enabled.root.height,
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
