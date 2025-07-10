import { defineSlotRecipe } from "../utils/define";
import { vars } from "../vars";
import { topNavigation as navVars } from "../vars/component";
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

export const appScreen = defineSlotRecipe({
  name: "app-screen",
  slots: ["root", "layer", "dim", "edge"],
  base: {
    root: {
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      right: 0,
      overflow: "hidden",

      "--app-bar-offset": "calc(var(--app-bar-height) + var(--seed-safe-area-top))",
    },
    dim: {
      zIndex: "var(--z-index-dim)",
      position: "absolute",
      width: "100%",
      top: 0,
      left: 0,
      right: 0,
    },
    layer: {
      zIndex: "var(--z-index-layer)",
      boxSizing: "border-box",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      right: 0,
      overflowY: "scroll",
      WebkitOverflowScrolling: "touch",
      "&::-webkit-scrollbar": {
        display: "none",
      },

      backgroundColor: vars.$color.bg.layerDefault,
    },
    edge: {
      zIndex: "var(--z-index-edge)",
      position: "absolute",
      width: "20px",
      height: "100%",
      left: 0,
      right: 0,
    },
  },
  variants: {
    theme: {
      cupertino: {
        root: {
          "--app-bar-height": navVars.themeCupertino.enabled.root.minHeight,
        },
        dim: {
          height: "100%",
          background: vars.$color.bg.overlay,
        },
      },
      android: {
        root: {
          "--app-bar-height": navVars.themeAndroid.enabled.root.minHeight,
        },
        edge: {
          display: "none",
        },
      },
    },
    transitionStyle: {
      slideFromRightIOS: {
        root: {
          "--z-index-dim": "calc(var(--z-index-base) + 0)",
          "--z-index-layer": "calc(var(--z-index-base) + 2)",
          "--z-index-edge": "calc(var(--z-index-base) + 4)",
          "--z-index-app-bar": "calc(var(--z-index-base) + 7)",
        },
        layer: {
          transform: "translate3d(0, 0, 0)",
          // top
          [push]: iOSAnimations.layer.push,
          [pop]: iOSAnimations.layer.pop,
          [idle]: iOSAnimations.layer.idle,
          [swipeBackSwiping]: iOSAnimations.layer.interaction,

          // behind
          [pushBehind]: iOSAnimations.layerBehind.push,
          [popBehind]: iOSAnimations.layerBehind.pop,
          [idleBehind]: iOSAnimations.layerBehind.idle,
          [swipeBackSwipingBehind]: iOSAnimations.layerBehind.interaction,
        },
        dim: {
          [push]: iOSAnimations.dim.push,
          [pop]: iOSAnimations.dim.pop,
          [idle]: iOSAnimations.dim.idle,
          [swipeBackSwiping]: iOSAnimations.dim.interaction,
        },
      },
      fadeFromBottomAndroid: {
        root: {
          "--z-index-dim": "calc(var(--z-index-base) + 0)",
          "--z-index-layer": "calc(var(--z-index-base) + 3)",
          "--z-index-edge": "calc(var(--z-index-base) + 4)",
          "--z-index-app-bar": "calc(var(--z-index-base) + 4)",
        },
        dim: {
          height: "160px",
          background: `linear-gradient(${vars.$color.bg.overlay}, rgba(0, 0, 0, 0))`,

          [push]: fadeFromBottomAndroidAnimations.dim.push,
          [pop]: fadeFromBottomAndroidAnimations.dim.pop,
        },
        layer: {
          transform: "translate3d(0, 0, 0)",

          [push]: fadeFromBottomAndroidAnimations.layer.push,
          [pop]: fadeFromBottomAndroidAnimations.layer.pop,
        },
      },
    },
    layerOffsetTop: {
      none: {},
      safeArea: {
        layer: {
          paddingTop: "var(--seed-safe-area-top)",
        },
      },
      appBar: {
        layer: {
          paddingTop: "var(--app-bar-offset)",
        },
      },
    },
    layerOffsetBottom: {
      none: {},
      safeArea: {
        layer: {
          paddingBottom: "var(--seed-safe-area-bottom)",
        },
      },
    },
  },
  defaultVariants: {
    theme: "cupertino",
    transitionStyle: "slideFromRightIOS",
    layerOffsetTop: "appBar",
    layerOffsetBottom: "none",
  },
});
