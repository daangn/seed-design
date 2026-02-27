import { defineSlotRecipe } from "../utils/define";
import { topNavigation as vars } from "../vars/component";
import { fadeInAnimations, fadeFromBottomAndroidAnimations, iOSAnimations } from "./animation";
import {
  idle,
  idleBehind,
  pop,
  popBehind,
  push,
  pushBehind,
  swipeBackCanceling,
  swipeBackCancelingBehind,
  swipeBackCompleting,
  swipeBackCompletingBehind,
  swipeBackSwiping,
  swipeBackSwipingBehind,
} from "./pseudo";

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
      slideFromRightIOS: {
        root: {
          // top
          [push]: iOSAnimations.title.push,
          [pop]: iOSAnimations.title.pop,
          [idle]: iOSAnimations.title.idle,
          [swipeBackSwiping]: iOSAnimations.title.interaction,
          [swipeBackCanceling]: iOSAnimations.title.cancel,
          [swipeBackCompleting]: iOSAnimations.title.complete,

          // behind
          [pushBehind]: iOSAnimations.titleBehind.push,
          [popBehind]: iOSAnimations.titleBehind.pop,
          [idleBehind]: iOSAnimations.titleBehind.idle,
          [swipeBackSwipingBehind]: iOSAnimations.titleBehind.interaction,
          [swipeBackCancelingBehind]: iOSAnimations.titleBehind.cancel,
          [swipeBackCompletingBehind]: iOSAnimations.titleBehind.complete,
        },
      },
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
  slots: ["root", "left", "right", "iconButton", "icon"],
  base: {
    root: {
      zIndex: "var(--z-index-app-bar)",
      top: 0,

      position: "absolute",
      boxSizing: "border-box",
      width: "100%",
      display: "flex",
      alignItems: "flex-end",

      "&:before": {
        content: '""',
        position: "absolute",
        pointerEvents: "none",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
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

      border: "none",
      background: "none",
      fontFamily: "inherit",
      padding: 0,
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
      slideFromRightIOS: {
        root: {
          [`${push}:before`]: iOSAnimations.appBarBackground.push,
          [`${pop}:before`]: iOSAnimations.appBarBackground.pop,
          [`${idle}:before`]: iOSAnimations.appBarBackground.idle,
          [`${swipeBackSwiping}:before`]: iOSAnimations.appBarBackground.interaction,
          [`${swipeBackCanceling}:before`]: iOSAnimations.appBarBackground.cancel,
          [`${swipeBackCompleting}:before`]: iOSAnimations.appBarBackground.complete,
        },
        icon: {
          // top
          [push]: iOSAnimations.icon.push,
          [pop]: iOSAnimations.icon.pop,
          [idle]: iOSAnimations.icon.idle,
          [swipeBackSwiping]: iOSAnimations.icon.interaction,
          [swipeBackCanceling]: iOSAnimations.icon.cancel,
          [swipeBackCompleting]: iOSAnimations.icon.complete,

          // behind
          [pushBehind]: iOSAnimations.iconBehind.push,
          [popBehind]: iOSAnimations.iconBehind.pop,
          [idleBehind]: iOSAnimations.iconBehind.idle,
          [swipeBackSwipingBehind]: iOSAnimations.iconBehind.interaction,
          [swipeBackCancelingBehind]: iOSAnimations.iconBehind.cancel,
          [swipeBackCompletingBehind]: iOSAnimations.iconBehind.complete,
        },
      },
      fadeFromBottomAndroid: {
        root: {
          [push]: fadeFromBottomAndroidAnimations.appBar.push,
          [pop]: fadeFromBottomAndroidAnimations.appBar.pop,
        },
      },
      fadeIn: {
        root: {
          [push]: fadeInAnimations.appBar.push,
          [pop]: fadeInAnimations.appBar.pop,
        },
      },
    },
    tone: {
      layer: {
        root: {
          "&:before": {
            background: `var(--seed-box-background, ${vars.toneLayer.enabled.root.color})`,
          },
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
