import { defineSlotRecipe } from "../utils/define";
import { vars } from "../vars";
import { topNavigation as navVars } from "../vars/component";

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

          // 역할(role)/상태(state) 기반 위치 + CSS transition. root가 data-activity-is-top /
          // data-transition-state를 가지므로 descendant로 각 파트 위치를 정의하고, 아래 transition으로
          // push/pop을 CSS가 직접 트윈한다(WAAPI 없이 → 동시 pop에도 각 화면이 스스로 안전하게 애니).
          // behind=-30%, exit=off-screen, enter=off→0%. 값은 animation.ts의 IOS 상수와 일치시킨다.
          "&:not([data-activity-is-top]) [data-part='layer']": {
            transform: "translate3d(-30%, 0, 0)",
          },
          "&[data-transition-state^='exit'] [data-part='layer']": {
            transform: "translate3d(100%, 0, 0)",
          },
          "&[data-transition-state^='exit'] [data-part='dim']": {
            opacity: 0,
          },
          "&[data-transition-state^='exit'] [data-part='appBar']": {
            opacity: 0,
          },
          "&:not([data-activity-is-top]) [data-part='appBarMain']": {
            opacity: 0,
            transform: "translate3d(-25%, 0, 0)",
          },
          "&[data-transition-state^='exit'] [data-part='appBarMain']": {
            opacity: 0,
            transform: "translate3d(25%, 0, 0)",
          },
          "&:not([data-activity-is-top]) [data-part='appBarIcon']": {
            opacity: 0,
          },
          "&[data-transition-state^='exit'] [data-part='appBarIcon']": {
            opacity: 0,
            transform: "translate3d(25%, 0, 0)",
          },

          // 이산 전환을 CSS가 트윈 (push/pop). swipe 제스처 중엔 global.css에서 transition을 꺼
          // JS가 손가락을 직접 추적하게 한다.
          "& [data-part='layer'], & [data-part='dim'], & [data-part='appBar'], & [data-part='appBarMain'], & [data-part='appBarIcon']":
            {
              transition:
                "transform 350ms cubic-bezier(0.2, 0.1, 0.21, 0.99), opacity 350ms cubic-bezier(0.2, 0.1, 0.21, 0.99)",
            },
          // 들어오는 화면(enter-active)은 화면 밖에서 시작 → enter-done(0%)로 슬라이드인
          "&[data-transition-state='enter-active'] [data-part='layer']": {
            transform: "translate3d(100%, 0, 0)",
          },
          "&[data-transition-state='enter-active'] [data-part='appBarMain']": {
            opacity: 0,
            transform: "translate3d(25%, 0, 0)",
          },
          "&[data-transition-state='enter-active'] [data-part='appBarIcon']": {
            opacity: 0,
            transform: "translate3d(25%, 0, 0)",
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
