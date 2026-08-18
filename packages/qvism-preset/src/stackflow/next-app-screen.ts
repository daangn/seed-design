import { defineSlotRecipe } from "../utils/define";
import { vars } from "../vars";
import { topNavigation as navVars } from "../vars/component";

/**
 * Behind layer park position while a horizontalSlide top covers it.
 *
 * Mirrored by the WAAPI keyframes in
 * `packages/stackflow/src/primitive/NextAppScreen/animation.ts`.
 */
const BEHIND_TRANSLATE_X = "-30%";

// ─── State selectors ─────────────────────────────────────────────────────────
//
// `data-screen-state` and `data-swipe-back-state` live on the screen root
// (data-part="screen"); every animated slot is a direct child of the root, so
// `[state] > &` scopes each rule to its own screen.
//
// These rules declare where each state RESTS, never how it travels there. The
// travel is played with WAAPI from
// `packages/stackflow/src/primitive/NextAppScreen/animation.ts`, whose
// keyframes end exactly on the values below. Holding the resting positions in
// CSS is what makes the states self-healing: an animation that is cancelled,
// times out, or never runs at all leaves the screen wherever its current state
// says it belongs, with no inline style anyone has to clean up.
//
// `push` matches only until `data-screen-ready` lands (one frame after
// mount): it pins the enter start offset so a paint that beats the animation
// onto the screen still shows the offset rather than the resting position.
// States whose resting position IS the default (`push` after ready, `idle`,
// `pop-behind`) need no rule at all, so re-showing a screen from
// `display: none` (e.g. future React <Activity>) cannot leave it displaced.

const pushStart = '[data-screen-state="push"]:not([data-screen-ready]) > &';
const pop = '[data-screen-state="pop"] > &';
const pushBehind = '[data-screen-state="push-behind"] > &';
const idleBehind = '[data-screen-state="idle-behind"] > &';

// Swipe rules must beat the state rules regardless of source order (e.g.
// `swiping` must pin the var-driven transform over the `pop` target while the
// consumer pops mid-gesture), so force specificity with :not(#\#).
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

          [pushStart]: { opacity: "0" },
          [pop]: { opacity: "0" },

          [swiping]: { opacity: SWIPE_DIM_OPACITY },
          [canceling]: { opacity: "1" },
          [completing]: { opacity: "0" },
        },
        layer: {
          // top
          [pushStart]: { transform: "translate3d(100%, 0, 0)" },
          [pop]: { transform: "translate3d(100%, 0, 0)" },

          // behind (`pop-behind` rests at the default position — no rule)
          [pushBehind]: {
            transform: `translate3d(${BEHIND_TRANSLATE_X}, 0, 0)`,
          },
          [idleBehind]: {
            transform: `translate3d(${BEHIND_TRANSLATE_X}, 0, 0)`,
          },

          // swipe interaction (vars written imperatively on the elements)
          [swiping]: { transform: SWIPE_TOP_TRANSFORM },
          [swipingBehind]: { transform: SWIPE_BEHIND_TRANSFORM },

          // swipe release — the WAAPI animation departs from the displacement
          // the drag left behind and lands on these
          [canceling]: { transform: "translate3d(0, 0, 0)" },
          [cancelingBehind]: {
            transform: `translate3d(${BEHIND_TRANSLATE_X}, 0, 0)`,
          },
          [completing]: { transform: "translate3d(100%, 0, 0)" },
          [completingBehind]: { transform: "translate3d(0, 0, 0)" },
        },
      },
      verticalSlide: {
        dim: {
          height: "100%",
          background: vars.$color.palette.staticBlackAlpha400,

          [pushStart]: { opacity: "0", transform: "translate3d(0, -8vh, 0)" },
          [pop]: { opacity: "0", transform: "translate3d(0, -8vh, 0)" },
        },
        layer: {
          [pushStart]: { opacity: "0", transform: "translate3d(0, 8vh, 0)" },
          [pop]: { opacity: "0", transform: "translate3d(0, 8vh, 0)" },
        },
        edge: {
          display: "none",
        },
      },
      crossfade: {
        dim: {
          display: "none",
        },
        layer: {
          [pushStart]: { opacity: "0" },
          [pop]: { opacity: "0" },
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
