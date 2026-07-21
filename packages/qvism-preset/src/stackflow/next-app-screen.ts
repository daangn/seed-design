import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineSlotRecipe } from "../utils/define";
import { vars } from "../vars";
import { topNavigation as navVars } from "../vars/component";

// ─── Transition timings (legacy parity) ─────────────────────────────────────

// approximates iOS spring animation
const HORIZONTAL = { duration: "350ms", timingFunction: "cubic-bezier(0.2, 0.1, 0.21, 0.99)" };

// approximates Easing.out(Easing.poly(5))
const VERTICAL_ENTER = { duration: "300ms", timingFunction: "cubic-bezier(0.23, 0.1, 0.32, 1)" };
const VERTICAL_EXIT = { duration: "150ms", timingFunction: "linear" };

const FADE_IN_ENTER = { duration: "300ms", timingFunction: "ease-out" };
const FADE_IN_EXIT = { duration: "150ms", timingFunction: "ease-in" };

/** Behind layer park position while a horizontalSlide top covers it. */
const BEHIND_TRANSLATE_X = "-30%";

// ─── State selectors ─────────────────────────────────────────────────────────
//
// `data-screen-state` and `data-swipe-back-state` live on the screen root
// (data-part="screen"); every animated slot is a direct child of the root, so
// `[state] > &` scopes each rule to its own screen.
//
// `idle` / `idle-behind` intentionally have NO animation rules: the resting
// state must be plain CSS defaults (never animation-fill-mode), so re-showing
// a screen from `display: none` (e.g. future React <Activity>) cannot replay
// a transition.

const push = '[data-screen-state="push"] > &';
const pop = '[data-screen-state="pop"] > &';
const pushBehind = '[data-screen-state="push-behind"] > &';
const popBehind = '[data-screen-state="pop-behind"] > &';
const idleBehind = '[data-screen-state="idle-behind"] > &';

// Swipe rules must beat the state animation rules regardless of source order
// (e.g. `completing` keeps suppressing the `pop` animation after the consumer
// pops), so force specificity with :not(#\#).
const isTopScreen = ':not([data-screen-state$="-behind"])';
const isBehindScreen = '[data-screen-state$="-behind"]';
const swiping = `[data-swipe-back-state="swiping"]${isTopScreen}:not(#\\#) > &`;
const swipingBehind = `[data-swipe-back-state="swiping"]${isBehindScreen}:not(#\\#) > &`;
const canceling = `[data-swipe-back-state="canceling"]${isTopScreen}:not(#\\#) > &`;
const cancelingBehind = `[data-swipe-back-state="canceling"]${isBehindScreen}:not(#\\#) > &`;
const completing = `[data-swipe-back-state="completing"]${isTopScreen}:not(#\\#) > &`;
const completingBehind = `[data-swipe-back-state="completing"]${isBehindScreen}:not(#\\#) > &`;

const transitioning =
  '[data-screen-state]:not([data-screen-state="idle"]):not([data-screen-state="idle-behind"]) > &';
const swipeBackActive = "[data-swipe-back-state] > &";

// ─── Swipe-driven values ─────────────────────────────────────────────────────
//
// During the gesture the transform is pure CSS, driven by variables written
// directly on the consuming elements (top layer, behind layer, dim) — never on
// the stack root.

const SWIPE_TOP_TRANSFORM = "translate3d(var(--seed-swipe-back-displacement, 0px), 0, 0)";
const SWIPE_BEHIND_TRANSFORM = `translate3d(calc(${BEHIND_TRANSLATE_X} + var(--seed-swipe-back-displacement-ratio, 0) * 30%), 0, 0)`;
const SWIPE_DIM_OPACITY = "calc(1 - var(--seed-swipe-back-displacement-ratio, 0))";

const RELEASE_TRANSFORM_TRANSITION = `transform ${HORIZONTAL.duration} ${HORIZONTAL.timingFunction}`;
const RELEASE_OPACITY_TRANSITION = `opacity ${HORIZONTAL.duration} ${HORIZONTAL.timingFunction}`;

// clip-path over border-radius + overflow: no scroll-container or
// containing-block side effects on the layer, and it degrades further back
// than `overflow: clip` (Chrome 90+/Safari 16+).
const CLIP_STYLES = {
  clipPath: "inset(0 round var(--seed-next-app-screen-clip-radius, 0px))",
};

export const nextAppScreen = defineSlotRecipe({
  name: "next-app-screen",
  slots: ["root", "dim", "layer", "content", "edge"],
  base: {
    root: {
      position: "absolute",
      width: "100%",
      height: "100%",
      insetInline: 0,
      overflow: "hidden",

      "--app-bar-offset": "calc(var(--app-bar-height) + var(--seed-safe-area-top))",
      "--z-index-dim": "calc(var(--z-index-base) + 0)",
      "--z-index-layer": "calc(var(--z-index-base) + 1)",
      "--z-index-edge": "calc(var(--z-index-base) + 2)",
    },
    dim: {
      zIndex: "var(--z-index-dim)",
      position: "absolute",
      width: "100%",
      top: 0,
      insetInline: 0,
    },
    // NOTE: no transform / will-change at rest — position: fixed descendants of
    // the content must anchor to the viewport while the screen is idle.
    layer: {
      zIndex: "var(--z-index-layer)",
      boxSizing: "border-box",
      position: "absolute",
      width: "100%",
      height: "100%",
      insetInline: 0,

      backgroundColor: vars.$color.bg.layerDefault,

      "&:focus": {
        outline: "none",
      },

      // iOS 26-style clip: applies only while a transition or swipe is
      // running. At rest there is no clip at all.
      [transitioning]: CLIP_STYLES,
      [swipeBackActive]: CLIP_STYLES,
    },
    content: {
      boxSizing: "border-box",
      position: "absolute",
      inset: 0,
      overflowY: "scroll",
      WebkitOverflowScrolling: "touch",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    edge: {
      zIndex: "var(--z-index-edge)",
      position: "absolute",
      width: "20px",
      height: "100%",
      insetInline: 0,
    },
  },
  variants: {
    theme: {
      cupertino: {
        root: {
          "--app-bar-height": navVars.themeIos.enabled.root.height,
        },
      },
      android: {
        root: {
          "--app-bar-height": navVars.themeAndroid.enabled.root.height,
        },
      },
    },
    transitionStyle: {
      horizontalSlide: {
        dim: {
          height: "100%",
          background: vars.$color.palette.staticBlackAlpha400,

          [push]: enterAnimation({ ...HORIZONTAL, opacity: "0" }),
          [pop]: exitAnimation({ ...HORIZONTAL, opacity: "0" }),

          [swiping]: {
            animation: "none",
            transition: "none",
            opacity: SWIPE_DIM_OPACITY,
          },
          [canceling]: {
            animation: "none",
            opacity: "1",
            transition: RELEASE_OPACITY_TRANSITION,
          },
          [completing]: {
            animation: "none",
            opacity: "0",
            transition: RELEASE_OPACITY_TRANSITION,
          },
        },
        layer: {
          // top
          [push]: enterAnimation({ ...HORIZONTAL, translateX: "100%" }),
          [pop]: exitAnimation({ ...HORIZONTAL, translateX: "100%" }),

          // behind
          [pushBehind]: exitAnimation({ ...HORIZONTAL, translateX: BEHIND_TRANSLATE_X }),
          [popBehind]: enterAnimation({ ...HORIZONTAL, translateX: BEHIND_TRANSLATE_X }),
          [idleBehind]: {
            transform: `translate3d(${BEHIND_TRANSLATE_X}, 0, 0)`,
          },

          // swipe interaction (vars written imperatively on the elements)
          [swiping]: {
            animation: "none",
            transition: "none",
            transform: SWIPE_TOP_TRANSFORM,
          },
          [swipingBehind]: {
            animation: "none",
            transition: "none",
            transform: SWIPE_BEHIND_TRANSFORM,
          },

          // swipe release — plain CSS transition from the current var-driven
          // computed value to the target position
          [canceling]: {
            animation: "none",
            transform: "translate3d(0, 0, 0)",
            transition: RELEASE_TRANSFORM_TRANSITION,
          },
          [cancelingBehind]: {
            animation: "none",
            transform: `translate3d(${BEHIND_TRANSLATE_X}, 0, 0)`,
            transition: RELEASE_TRANSFORM_TRANSITION,
          },
          [completing]: {
            animation: "none",
            transform: "translate3d(100%, 0, 0)",
            transition: RELEASE_TRANSFORM_TRANSITION,
          },
          [completingBehind]: {
            animation: "none",
            transform: "translate3d(0, 0, 0)",
            transition: RELEASE_TRANSFORM_TRANSITION,
          },
        },
      },
      verticalSlide: {
        dim: {
          height: "100%",
          background: vars.$color.palette.staticBlackAlpha400,

          [push]: enterAnimation({ ...VERTICAL_ENTER, opacity: "0", translateY: "-8vh" }),
          [pop]: exitAnimation({ ...VERTICAL_EXIT, opacity: "0", translateY: "-8vh" }),
        },
        layer: {
          [push]: enterAnimation({ ...VERTICAL_ENTER, opacity: "0", translateY: "8vh" }),
          [pop]: exitAnimation({ ...VERTICAL_EXIT, opacity: "0", translateY: "8vh" }),
        },
        edge: {
          display: "none",
        },
      },
      fadeIn: {
        dim: {
          display: "none",
        },
        layer: {
          [push]: enterAnimation({ ...FADE_IN_ENTER, opacity: "0" }),
          [pop]: exitAnimation({ ...FADE_IN_EXIT, opacity: "0" }),
        },
        edge: {
          display: "none",
        },
      },
    },
    contentOffsetTop: {
      none: {},
      safeArea: {
        content: {
          paddingTop: "var(--seed-safe-area-top)",
        },
      },
      appBar: {
        content: {
          paddingTop: "var(--app-bar-offset)",
        },
      },
    },
    contentOffsetBottom: {
      none: {},
      safeArea: {
        content: {
          paddingBottom: "var(--seed-safe-area-bottom)",
        },
      },
    },
    // tone/gradient are consumed by next-app-bar; declared here so the styled
    // layer can split and forward them via context.
    tone: {
      layer: {},
      transparent: {},
    },
    gradient: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    theme: "cupertino",
    transitionStyle: "horizontalSlide",
    contentOffsetTop: "appBar",
    contentOffsetBottom: "none",
    tone: "layer",
    gradient: true,
  },
});
