import { enterAnimation, exitAnimation } from "../utils/animation";
import { defineSlotRecipe } from "../utils/define";
import { vars } from "../vars";
import { topNavigation as navVars } from "../vars/component";

const OVERSCROLL_GRADIENT_OFFSET = "400px";

// iOS 전환 타이밍 (animation.ts의 TransitionIOS와 동일).
const IOS_TRANSITION = {
  duration: "350ms",
  timingFunction: "cubic-bezier(0.2, 0.1, 0.21, 0.99)",
};

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
          "--app-bar-height": navVars.themeIos.enabled.root.height,
        },
      },
      android: {
        root: {
          "--app-bar-height": navVars.themeAndroid.enabled.root.height,
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

          // 들어오는/나가는 top 화면: enter-active/exit-active 진입(t0)에 CSS animation으로 즉시 슬라이드.
          // transition은 enter-done(=t0+duration)까지 값이 안 변해 슬라이드가 늦게 시작 → push가 순차로
          // 보였다. seed-enter/exit keyframes는 from/to를 CSS 변수로 받아 상태 진입과 동시에 재생되므로 t0에 슬라이드한다.
          "&[data-transition-state='enter-active'] [data-part='layer']": enterAnimation({
            ...IOS_TRANSITION,
            translateX: "100%",
          }),
          "&[data-transition-state='exit-active'] [data-part='layer']": exitAnimation({
            ...IOS_TRANSITION,
            translateX: "100%",
          }),
          "&[data-transition-state='enter-active'] [data-part='appBarMain']": enterAnimation({
            ...IOS_TRANSITION,
            translateX: "25%",
            opacity: "0",
          }),
          "&[data-transition-state='exit-active'] [data-part='appBarMain']": exitAnimation({
            ...IOS_TRANSITION,
            translateX: "25%",
            opacity: "0",
          }),
          "&[data-transition-state='enter-active'] [data-part='appBarIcon']": enterAnimation({
            ...IOS_TRANSITION,
            translateX: "25%",
            opacity: "0",
          }),
          "&[data-transition-state='exit-active'] [data-part='appBarIcon']": exitAnimation({
            ...IOS_TRANSITION,
            translateX: "25%",
            opacity: "0",
          }),
          "&[data-transition-state='exit-active'] [data-part='dim']": exitAnimation({
            ...IOS_TRANSITION,
            opacity: "0",
          }),

          // 뒷 화면 패럴랙스: 다음 형제(=내 위 화면)가 들어오는/들어온(enter-*) 상태면 -30%로 깔린다.
          // is-top(전환 시작 즉시 토글)이 아니라 위 화면의 transition-state에 묶어, top 슬라이드와 같은 t0에
          // 동기화한다. pop 시(위 화면 exit-*) 셀렉터가 거짓이 되어 0%로 복귀 — 이 또한 top 슬라이드아웃과 동시.
          // 동시 pop(N→1)에서도 위 형제들이 전부 exit라 패럴랙스가 자동 해제 → 착지 화면이 깨끗하게 0%로 정착.
          "& [data-part='layer'], & [data-part='dim'], & [data-part='appBar'], & [data-part='appBarMain'], & [data-part='appBarIcon']":
            {
              transition:
                "transform 350ms cubic-bezier(0.2, 0.1, 0.21, 0.99), opacity 350ms cubic-bezier(0.2, 0.1, 0.21, 0.99)",
            },
          "&:has(+ [data-stackflow-component-name='AppScreen'][data-transition-state^='enter']) [data-part='layer']":
            {
              transform: "translate3d(-30%, 0, 0)",
            },
          "&:has(+ [data-stackflow-component-name='AppScreen'][data-transition-state^='enter']) [data-part='appBarMain']":
            {
              opacity: 0,
              transform: "translate3d(-25%, 0, 0)",
            },
          "&:has(+ [data-stackflow-component-name='AppScreen'][data-transition-state^='enter']) [data-part='appBarIcon']":
            {
              opacity: 0,
            },
        },
        layer: {
          // GPU layer hint for smooth animations driven by JS (WAAPI swipe)
          transform: "translate3d(0, 0, 0)",
        },
        dim: {
          height: "100%",
          background: vars.$color.bg.overlay,
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
        },
        layer: {
          transform: "translate3d(0, 0, 0)",
        },
      },
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
            // TODO: consume rootage variables
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
