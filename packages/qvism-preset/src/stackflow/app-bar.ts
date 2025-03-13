import { topNavigation as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { fadeFromBottomAndroidAnimations, iOSAnimations } from "./animation";
import {
  idle,
  idleBehind,
  pop,
  popBehind,
  push,
  pushBehind,
  swipeBackSwiping,
  swipeBackSwipingBehind,
} from "./pseudo";

export const appBarMain = defineSlotRecipe({
  name: "app-bar-main",
  slots: ["root", "title", "subtitle"],
  base: {
    root: {
      flex: 1,
      height: "100%",
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
        },
      },
      withSubtitle: {
        title: {
          fontSize: vars.titleLayoutWithSubtitle.enabled.title.fontSize,
          fontWeight: vars.titleLayoutWithSubtitle.enabled.title.fontWeight,
        },
        subtitle: {
          fontSize: vars.titleLayoutWithSubtitle.enabled.subtitle.fontSize,
          fontWeight: vars.titleLayoutWithSubtitle.enabled.subtitle.fontWeight,
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
          height: "100%",
          left: 0,
          right: 0,
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
        },
      },
    },
    transitionStyle: {
      slideFromRightIOS: {
        root: {
          // top
          [push]: iOSAnimations.title.push,
          [pop]: iOSAnimations.title.pop,
          [idle]: iOSAnimations.title.idle,
          [swipeBackSwiping]: iOSAnimations.title.interaction,

          // behind
          [pushBehind]: iOSAnimations.titleBehind.push,
          [popBehind]: iOSAnimations.titleBehind.pop,
          [idleBehind]: iOSAnimations.titleBehind.idle,
          [swipeBackSwipingBehind]: iOSAnimations.titleBehind.interaction,
        },
      },
      fadeFromBottomAndroid: {},
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
  slots: ["root", "left", "right", "iconButton", "icon"],
  base: {
    root: {
      zIndex: "var(--z-index-app-bar)",
      top: "var(--seed-safe-area-top)",

      position: "absolute",
      boxSizing: "border-box",
      width: "100%",
      display: "flex",
      alignItems: "flex-end",

      "&:before": {
        content: '""',
        position: "absolute",
        pointerEvents: "none",
        inset: 0,
        zIndex: -1,
      },
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
          height: vars.themeCupertino.enabled.root.minHeight,
          paddingInline: vars.themeCupertino.enabled.root.paddingX,
        },
        iconButton: {
          width: vars.themeCupertino.enabled.icon.targetSize,
          height: vars.themeCupertino.enabled.icon.targetSize,

          "&:first-child": {
            marginLeft: `calc(-1 * (${vars.themeCupertino.enabled.icon.targetSize} - ${vars.themeCupertino.enabled.icon.size}) / 2)`,
          },
          "&:last-child": {
            marginRight: `calc(-1 * (${vars.themeCupertino.enabled.icon.targetSize} - ${vars.themeCupertino.enabled.icon.size}) / 2)`,
          },
        },
        icon: {
          width: vars.themeCupertino.enabled.icon.size,
          height: vars.themeCupertino.enabled.icon.size,
        },
      },
      android: {
        root: {
          height: vars.themeAndroid.enabled.root.minHeight,
          paddingInline: vars.themeAndroid.enabled.root.paddingX,
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
          width: vars.themeAndroid.enabled.icon.size,
          height: vars.themeAndroid.enabled.icon.size,
        },
        left: {
          paddingRight: "16px",
        },
      },
    },
    transitionStyle: {
      slideFromRightIOS: {
        root: {
          [`${push}:before`]: iOSAnimations.appBarBackground.push,
          [`${pop}:before`]: iOSAnimations.appBarBackground.pop,
          [`${idle}:before`]: iOSAnimations.appBarBackground.idle,
        },
        icon: {
          // top
          [push]: iOSAnimations.icon.push,
          [pop]: iOSAnimations.icon.pop,
          [idle]: iOSAnimations.icon.idle,
          [swipeBackSwiping]: iOSAnimations.icon.interaction,

          // behind
          [pushBehind]: iOSAnimations.iconBehind.push,
          [popBehind]: iOSAnimations.iconBehind.pop,
          [idleBehind]: iOSAnimations.iconBehind.idle,
          [swipeBackSwipingBehind]: iOSAnimations.iconBehind.interaction,
        },
      },
      fadeFromBottomAndroid: {
        root: {
          [push]: fadeFromBottomAndroidAnimations.appBar.push,
          [pop]: fadeFromBottomAndroidAnimations.appBar.pop,
        },
      },
    },
    tone: {
      layer: {
        root: {
          "&:before": {
            backgroundColor: vars.toneLayer.enabled.root.color,
          },
        },
        icon: {
          color: vars.toneLayer.enabled.icon.color,
        },
      },
      transparent: {
        root: {
          "&:before": {
            backgroundColor: vars.toneTransparent.enabled.root.color,
          },
        },
        icon: {
          color: vars.toneTransparent.enabled.icon.color,
        },
      },
    },
    divider: {
      true: {
        root: {
          "&:before": {
            boxShadow: `inset 0px calc(-1 * ${vars.dividerTrue.enabled.root.strokeWidth}) 0 ${vars.dividerTrue.enabled.root.strokeColor}`,
          },
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
