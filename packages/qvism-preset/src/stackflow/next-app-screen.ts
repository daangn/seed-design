import { defineSlotRecipe } from "../utils/define";
import { SQUIRCLE_CORNER_SPAN_RATIO, SQUIRCLE_MASK_IMAGE, SQUIRCLE_SLICE } from "../utils/squircle";
import { vars } from "../vars";
import { topNavigation as navVars } from "../vars/component";

/**
 * Behind layer park position while a horizontalSlide top covers it.
 *
 * Mirrored by the WAAPI keyframes in
 * `packages/stackflow/src/primitive/NextAppScreen/animation.ts`.
 */
const BEHIND_TRANSLATE_X = "-30%";

/**
 * verticalSlide enter/exit offset. Mirrored by the same WAAPI keyframes.
 *
 * The layer alone travels: the dim is a full-viewport scrim, so translating it
 * would carry its edge into the screen and leave the strip beyond it undimmed.
 */
const VERTICAL_LAYER_TRANSLATE_Y = "8vh";

/**
 * experimental_scaleSlide shrinks the screen's CONTENT, not its layer — the
 * layer carries the background, and shrinking that would open a gap around the
 * screen and show whatever busy thing sits behind it.
 *
 * The three parts run over deliberately overlapping stretches of the gesture,
 * so none of them ever waits at a standstill for the one before it. The scale
 * is spelled out rather than derived from the span, because in binary floating
 * point `1 - 0.9` is 0.09999999999999998 and that would land verbatim in the
 * generated CSS.
 *
 * Mirrored by the same WAAPI keyframes as the constants above.
 */
const SCALE_SLIDE_SCALE = 0.9;
const SCALE_SLIDE_SHRINK_SPAN = 0.1;

const SCALE_SLIDE_SHRINK = [0, 0.4] as const;
const SCALE_SLIDE_TRAVEL = [0.3, 1] as const;
const SCALE_SLIDE_FADE = [0.4, 1] as const;

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

// Clipping follows movement, so the swiping screen always qualifies but the one
// behind only does under horizontalSlide — the other styles leave it parked,
// and rounding the corners of a screen that isn't going anywhere would show.
const swipeBackActive = `[data-swipe-back-state]${isTopScreen} > &`;
const swipeBackActiveBehind = `[data-swipe-back-state]${isBehindScreen} > &`;

// ─── Swipe-driven values ─────────────────────────────────────────────────────
//
// During the gesture the position is pure CSS, driven by variables written
// directly on the consuming elements (top layer, behind layer, dim) — never on
// the stack root. Every style reads the same ratio, each into its own exit:
// horizontalSlide travels with the finger 1:1 in px, the rest interpolate the
// offset and opacity their `pop` rests at.

const SWIPE_RATIO = "var(--seed-swipe-back-displacement-ratio, 0)";

const SWIPE_TOP_TRANSFORM = "translate3d(var(--seed-swipe-back-displacement, 0px), 0, 0)";
const SWIPE_BEHIND_TRANSFORM = `translate3d(calc(${BEHIND_TRANSLATE_X} + ${SWIPE_RATIO} * 30%), 0, 0)`;
const SWIPE_FADE_OPACITY = `calc(1 - ${SWIPE_RATIO})`;
const SWIPE_VERTICAL_LAYER_TRANSFORM = `translate3d(0, calc(${SWIPE_RATIO} * ${VERTICAL_LAYER_TRANSLATE_Y}), 0)`;

// experimental_scaleSlide reads the same ratio three times, once per span, so
// the drag traces the shape the transition does.
const swipeSpanProgress = ([from, to]: readonly [number, number]) =>
  `clamp(0, (${SWIPE_RATIO} - ${from}) / ${to - from}, 1)`;

const SWIPE_SCALE_SLIDE_TOP_TRANSLATE = `calc(${swipeSpanProgress(SCALE_SLIDE_TRAVEL)} * 100%) 0 0`;
const SWIPE_SCALE_SLIDE_FADE_OPACITY = `calc(1 - ${swipeSpanProgress(SCALE_SLIDE_FADE)})`;
const SWIPE_SCALE_SLIDE_SCALE = `calc(1 - ${swipeSpanProgress(SCALE_SLIDE_SHRINK)} * ${SCALE_SLIDE_SHRINK_SPAN})`;

// A mask rather than border-radius + overflow: no scroll-container or
// containing-block side effects on the layer, and no dependence on
// `overflow: clip` (Chrome 90+/Safari 16+). A squircle rather than a circular
// arc, because the radius being matched is a physical display corner, which on
// iOS is a continuous curve — and the transition is exactly when that shows,
// since a sliding screen carries its corners off the bezel and into the middle
// of the display.
//
// `-webkit-mask-box-image` is written unguarded because it is the only spelling
// any engine takes: neither WebKit (back to iOS 15) nor Blink accepts the
// standard `mask-border` today, and Gecko implements neither, so there is no
// second spelling to pair it with and nothing for an `@supports` to switch
// between. Firefox therefore runs these transitions unclipped — it is outside
// the preset's targets, and `clipRadius` is a native-shell affordance.
//
// The radius var is read WITHOUT a fallback, so a stack that sets no
// `clipRadius` leaves the whole shorthand invalid at computed-value time —
// mask-border falls back to `none` and no full-screen mask layer is
// rasterized. Giving it a `0px` fallback would mask every transition on every
// stack instead.
const CLIP_STYLES = {
  WebkitMaskBoxImage: `${SQUIRCLE_MASK_IMAGE} ${SQUIRCLE_SLICE} fill / calc(var(--seed-next-app-screen-clip-radius) * ${SQUIRCLE_CORNER_SPAN_RATIO}) stretch`,
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

      // The screen takes ONE slot of the activity's 5-wide z-index band, and
      // the z-index makes it a stacking context so every part below is ordered
      // locally — nothing inside can reach into a neighbouring activity.
      //
      // The offset has to thread a stack that also holds legacy AppScreens,
      // which spread their parts across `base + 0..7`: it must clear the screen
      // below (`app-bar` at base - 5 + 7 = base + 2) and stay under the screen
      // above (`dim` at base + 5 + 0 = base + 5). Only 3 and 4 satisfy both.
      zIndex: "calc(var(--z-index-base) + 3)",
    },
    dim: {
      zIndex: 0,
      position: "absolute",
      width: "100%",
      top: 0,
      insetInline: 0,
    },
    // NOTE: no transform / will-change at rest — position: fixed descendants of
    // the content must anchor to the viewport while the screen is idle.
    layer: {
      zIndex: 1,
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
      zIndex: 2,
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

          [swiping]: { opacity: SWIPE_FADE_OPACITY },
          [canceling]: { opacity: "1" },
          [completing]: { opacity: "0" },
        },
        layer: {
          [swipeBackActiveBehind]: CLIP_STYLES,

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
      // The swipe rules below scrub the exit above: `swiping` interpolates
      // towards the `pop` position by the gesture ratio, and `completing` is
      // that same position reached. The screen behind stays parked in both
      // styles, so it gets no rule of its own.
      verticalSlide: {
        dim: {
          height: "100%",
          background: vars.$color.palette.staticBlackAlpha400,

          [pushStart]: { opacity: "0" },
          [pop]: { opacity: "0" },

          [swiping]: { opacity: SWIPE_FADE_OPACITY },
          [canceling]: { opacity: "1" },
          [completing]: { opacity: "0" },
        },
        layer: {
          [pushStart]: {
            opacity: "0",
            transform: `translate3d(0, ${VERTICAL_LAYER_TRANSLATE_Y}, 0)`,
          },
          [pop]: { opacity: "0", transform: `translate3d(0, ${VERTICAL_LAYER_TRANSLATE_Y}, 0)` },

          [swiping]: { opacity: SWIPE_FADE_OPACITY, transform: SWIPE_VERTICAL_LAYER_TRANSFORM },
          [canceling]: { opacity: "1", transform: "translate3d(0, 0, 0)" },
          [completing]: {
            opacity: "0",
            transform: `translate3d(0, ${VERTICAL_LAYER_TRANSLATE_Y}, 0)`,
          },
        },
      },
      crossfade: {
        dim: {
          display: "none",
        },
        layer: {
          [pushStart]: { opacity: "0" },
          [pop]: { opacity: "0" },

          [swiping]: { opacity: SWIPE_FADE_OPACITY },
          [canceling]: { opacity: "1" },
          [completing]: { opacity: "0" },
        },
      },
      // horizontalSlide's layer and behind screen, with the top card shrinking
      // ahead of the travel and fading behind it.
      experimental_scaleSlide: {
        dim: {
          height: "100%",
          background: vars.$color.palette.staticBlackAlpha400,

          [pushStart]: { opacity: "0" },
          [pop]: { opacity: "0" },

          [swiping]: { opacity: SWIPE_FADE_OPACITY },
          [canceling]: { opacity: "1" },
          [completing]: { opacity: "0" },
        },
        // The top screen rests on `translate`/`scale` rather than `transform`,
        // so the WAAPI legs that travel here can hold schedules of their own
        // while sharing this one element — see the same note in animation.ts.
        // The behind rules stay on `transform`, because a top screen of any
        // style drives them and every other style writes them there.
        //
        // The layer's box is the screen's, so the default origin already scales
        // the card about the middle of the display.
        layer: {
          [swipeBackActiveBehind]: CLIP_STYLES,

          // top
          [pushStart]: { opacity: "0", translate: "100% 0 0", scale: `${SCALE_SLIDE_SCALE}` },
          [pop]: { opacity: "0", translate: "100% 0 0", scale: `${SCALE_SLIDE_SCALE}` },

          // behind (`pop-behind` rests at the default position — no rule)
          [pushBehind]: {
            transform: `translate3d(${BEHIND_TRANSLATE_X}, 0, 0)`,
          },
          [idleBehind]: {
            transform: `translate3d(${BEHIND_TRANSLATE_X}, 0, 0)`,
          },

          [swiping]: {
            opacity: SWIPE_SCALE_SLIDE_FADE_OPACITY,
            translate: SWIPE_SCALE_SLIDE_TOP_TRANSLATE,
            scale: SWIPE_SCALE_SLIDE_SCALE,
          },
          [swipingBehind]: { transform: SWIPE_BEHIND_TRANSFORM },

          [canceling]: { opacity: "1", translate: "0% 0 0", scale: "1" },
          [cancelingBehind]: {
            transform: `translate3d(${BEHIND_TRANSLATE_X}, 0, 0)`,
          },
          [completing]: { opacity: "0", translate: "100% 0 0", scale: `${SCALE_SLIDE_SCALE}` },
          [completingBehind]: { transform: "translate3d(0, 0, 0)" },
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
