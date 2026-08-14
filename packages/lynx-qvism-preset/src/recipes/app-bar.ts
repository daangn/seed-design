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
          fontSize: vars.titleLayoutTitleOnly.rest.title.fontSize,
          fontWeight: vars.titleLayoutTitleOnly.rest.title.fontWeight,
          lineHeight: vars.titleLayoutTitleOnly.rest.title.lineHeight,
        },
      },
      withSubtitle: {
        title: {
          fontSize: vars.titleLayoutWithSubtitle.rest.title.fontSize,
          fontWeight: vars.titleLayoutWithSubtitle.rest.title.fontWeight,
          lineHeight: vars.titleLayoutWithSubtitle.rest.title.lineHeight,
        },
        subtitle: {
          fontSize: vars.titleLayoutWithSubtitle.rest.subtitle.fontSize,
          fontWeight: vars.titleLayoutWithSubtitle.rest.subtitle.fontWeight,
          lineHeight: vars.titleLayoutWithSubtitle.rest.subtitle.lineHeight,
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
          height: vars.themeAndroid.rest.root.height,
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
          height: `calc(${vars.themeIos.rest.root.height} + var(--seed-safe-area-top))`,
          paddingLeft: vars.themeIos.rest.root.paddingX,
          paddingRight: vars.themeIos.rest.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        left: {
          height: vars.themeIos.rest.root.height,
        },
        right: {
          height: vars.themeIos.rest.root.height,
        },
        iconButton: {
          width: iconButtonVars.base.rest.root.size,
          height: iconButtonVars.base.rest.root.size,
        },
        icon: {
          width: iconButtonVars.base.rest.icon.size,
          height: iconButtonVars.base.rest.icon.size,
        },
      },
      android: {
        root: {
          height: `calc(${vars.themeAndroid.rest.root.height} + var(--seed-safe-area-top))`,
          paddingLeft: vars.themeAndroid.rest.root.paddingX,
          paddingRight: vars.themeAndroid.rest.root.paddingX,
          paddingTop: "var(--seed-safe-area-top)",
        },
        left: {
          height: vars.themeAndroid.rest.root.height,
          paddingRight: vars.themeAndroid.rest.main.paddingLeft,
        },
        right: {
          height: vars.themeAndroid.rest.root.height,
        },
        iconButton: {
          width: iconButtonVars.base.rest.root.size,
          height: iconButtonVars.base.rest.root.size,
        },
        icon: {
          width: iconButtonVars.base.rest.icon.size,
          height: iconButtonVars.base.rest.icon.size,
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
          background: vars.toneLayer.rest.root.color,
        },
        icon: {
          color: iconButtonVars.toneLayer.rest.icon.color,
        },
      },
      transparent: {
        background: {
          background: vars.toneTransparentGradientFalse.rest.root.color,
        },
        icon: {
          color: iconButtonVars.toneTransparent.rest.icon.color,
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
