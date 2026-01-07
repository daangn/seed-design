import { defineSlotRecipe } from "../utils/define";
import { vars } from "../vars";
import { topNavigation as navVars } from "../vars/component";
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

const OVERSCROLL_GRADIENT_OFFSET = "400px";

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
          [swipeBackCanceling]: iOSAnimations.layer.cancel,
          [swipeBackCompleting]: iOSAnimations.layer.complete,

          // behind
          [pushBehind]: iOSAnimations.layerBehind.push,
          [popBehind]: iOSAnimations.layerBehind.pop,
          [idleBehind]: iOSAnimations.layerBehind.idle,
          [swipeBackSwipingBehind]: iOSAnimations.layerBehind.interaction,
          [swipeBackCancelingBehind]: iOSAnimations.layerBehind.cancel,
          [swipeBackCompletingBehind]: iOSAnimations.layerBehind.complete,
        },
        dim: {
          height: "100%",
          background: vars.$color.bg.overlay,

          [push]: iOSAnimations.dim.push,
          [pop]: iOSAnimations.dim.pop,
          [idle]: iOSAnimations.dim.idle,
          [swipeBackSwiping]: iOSAnimations.dim.interaction,
          [swipeBackCanceling]: iOSAnimations.dim.cancel,
          [swipeBackCompleting]: iOSAnimations.dim.complete,
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
      // NOTE: this is currently named as fadeIn for consistency with other transitionStyles
      // (top activity slides in from bottom or slides in from right so it "fades in")
      // but the actual animation is a pair of enter and exit fade animations.
      // might want to rename later to crossfade to prevent confusion
      fadeIn: {
        root: {
          "--z-index-dim": "calc(var(--z-index-base) + 0)",
          "--z-index-layer": "calc(var(--z-index-base) + 3)",
          "--z-index-edge": "calc(var(--z-index-base) + 4)",
          "--z-index-app-bar": "calc(var(--z-index-base) + 4)",
        },
        dim: {
          display: "none",
        },
        layer: {
          [push]: fadeInAnimations.layer.push,
          [pop]: fadeInAnimations.layer.pop,
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
    tone: {
      layer: {},
      transparent: {},
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
        layer: {
          "&::before": {
            content: "''",
            display: "block",
            position: "sticky",
            left: 0,
            right: 0,
            top: 0,
            marginBottom: `calc(-1 * (66px + ${OVERSCROLL_GRADIENT_OFFSET} + var(--seed-safe-area-top)))`,
            height: `calc(66px + ${OVERSCROLL_GRADIENT_OFFSET} + var(--seed-safe-area-top))`,

            // since we're using sticky, when iOS overscroll happens the before pseudoelement will stick to the top of `layer` and won't show the gradient in the overscroll area.
            // so we extend the height of the gradient and use transform to move it up to the possible gradient area.
            // rgba(0, 0, 0, 0.2) is for a natural look; if we use rgba(0, 0, 0, 0.35) on 0% the gradient looks off
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.35) ${OVERSCROLL_GRADIENT_OFFSET}, rgba(0, 0, 0, 0.00) 100%)`,
            pointerEvents: "none",
            zIndex: 1,
          },
        },
      },
    },
    {
      tone: "transparent",
      gradient: true,
      layerOffsetBottom: "none",
      css: {
        layer: {
          "&::before": {
            transform: `translateY(-${OVERSCROLL_GRADIENT_OFFSET})`,
          },
        },
      },
    },
    {
      tone: "transparent",
      gradient: true,
      layerOffsetTop: "safeArea",
      css: {
        layer: {
          "&::before": {
            transform: `translateY(calc(-${OVERSCROLL_GRADIENT_OFFSET} - var(--seed-safe-area-top)))`,
          },
        },
      },
    },
    {
      tone: "transparent",
      gradient: true,
      layerOffsetTop: "appBar",
      css: {
        layer: {
          "&::before": {
            transform: `translateY(calc(-${OVERSCROLL_GRADIENT_OFFSET} - var(--app-bar-offset)))`,
          },
        },
      },
    },
  ],
  defaultVariants: {
    theme: "cupertino",
    transitionStyle: "slideFromRightIOS",
    layerOffsetTop: "appBar",
    layerOffsetBottom: "none",
    tone: "layer",
    gradient: true,
  },
});
