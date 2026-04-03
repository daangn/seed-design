import { vars as tokens } from "../vars";
import * as shadow from "../vars/shadow";
import { defineSlotRecipe } from "../utils/define";
import {
  disabled,
  engaged,
  focus,
  focusVisible,
  not,
  open,
  pseudo,
  before,
  hidden,
} from "../utils/pseudo";
import { enterAnimation, exitAnimation } from "../utils/animation";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { prefixIcon, suffixIcon } from "../utils/icon";

// const highlighted = "[data-highlighted]";

export const menu = defineSlotRecipe({
  name: "menu",
  slots: ["positioner", "content", "scrollArea", "group", "groupLabel", "divider"],
  base: {
    positioner: {
      // helps menu to be open at the top of the stackflow stack; it won't have any AppScreen on top of it
      "--menu-z-index": "99999",
      zIndex: "calc(var(--menu-z-index) + var(--z-index-offset, 0))",
      outline: "none",
    },
    content: {
      borderRadius: tokens.$radius.r5,
      background: tokens.$color.bg.layerFloating,
      boxShadow: shadow.s3,
      transformOrigin: "var(--transform-origin)",

      overflow: "hidden",

      [pseudo(open)]: {
        ...enterAnimation({
          scale: "0.95",
          opacity: "0",
          duration: tokens.$duration.d3,
          timingFunction: tokens.$timingFunction.enter,
        }),
      },

      [pseudo(not(open))]: {
        ...exitAnimation({
          scale: "0.95",
          opacity: "0",
          duration: tokens.$duration.d2,
          timingFunction: tokens.$timingFunction.exit,
        }),
      },

      [pseudo(hidden)]: {
        display: "none !important",
      },

      [pseudo(focus)]: {
        outline: "none",
      },
    },
    scrollArea: {
      overflowY: "auto",
      maxHeight: "min(480px, var(--seed-menu-available-height, 480px))",
      boxSizing: "border-box",

      paddingTop: tokens.$dimension.x2,
      paddingBottom: tokens.$dimension.x2,

      display: "flex",
      flexDirection: "column",
      gap: tokens.$dimension.x2,

      // bottom scroll fog: fades content into padding at the bottom
      maskImage: `linear-gradient(to top, transparent 0, black ${tokens.$dimension.x2})`,
      WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${tokens.$dimension.x2})`,
    },
    group: {
      display: "flex",
      flexDirection: "column",
    },
    groupLabel: {
      color: tokens.$color.fg.neutralSubtle,
    },
    divider: {
      marginLeft: tokens.$dimension.x4,
      marginRight: tokens.$dimension.x4,
      height: "1px",
      flexShrink: 0,
      backgroundColor: tokens.$color.stroke.neutralMuted,
    },
  },
  variants: {
    size: {
      medium: {
        content: {
          width: "var(--seed-menu-reference-width, 240px)",
        },
        groupLabel: {
          paddingTop: tokens.$dimension.x2_5,
          paddingBottom: tokens.$dimension.x2_5,
          paddingLeft: tokens.$dimension.x4,
          paddingRight: tokens.$dimension.x4,

          fontSize: tokens.$fontSize.t4,
          lineHeight: tokens.$lineHeight.t4,
          fontWeight: tokens.$fontWeight.medium,
        },
      },
      small: {
        content: {
          width: "var(--seed-menu-reference-width, 200px)",
        },
        groupLabel: {
          paddingTop: tokens.$dimension.x2,
          paddingBottom: tokens.$dimension.x2,
          paddingLeft: tokens.$dimension.x4,
          paddingRight: tokens.$dimension.x4,

          fontSize: tokens.$fontSize.t3,
          lineHeight: tokens.$lineHeight.t3,
          fontWeight: tokens.$fontWeight.regular,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const menuItem = defineSlotRecipe({
  name: "menu-item",
  slots: ["root", "body", "label", "description"],
  base: {
    root: {
      position: "relative",
      scrollMarginTop: tokens.$dimension.x2, // same as scrollArea paddingTop
      scrollMarginBottom: tokens.$dimension.x2, // same as scrollArea paddingBottom

      display: "flex",
      alignItems: "center",

      outline: "none",
      cursor: "default", // 결정, 다른 practice 참고
      userSelect: "none", // 결정
      border: "none",
      fontFamily: "inherit",
      margin: 0,
      textAlign: "start",

      isolation: "isolate",

      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: tokens.$dimension.x2,
        right: tokens.$dimension.x2,
        borderRadius: tokens.$radius.r3,
        zIndex: -1,

        transition: `${FOCUS_RING_TRANSITION}, background-color ${tokens.$duration.colorTransition} ${tokens.$timingFunction.easing}`,
        ...createFocusRingRestStyles({ position: "inside" }),
      },

      // highlight 조건 확인
      // [pseudo(highlighted, before)]: {
      //   // nested menu에서 highlight되는 거라면, 별도 디자인 스펙이 필요할 수도 있겠음
      //   backgroundColor: tokens.$color.bg.transparentPressed,
      // },

      // transition이 필요한지 확인
      [pseudo(not(disabled), engaged, before)]: {
        backgroundColor: tokens.$color.bg.transparentPressed,
      },

      [pseudo(focusVisible, before)]: createFocusRingStyles({ position: "inside" }),

      [pseudo(disabled)]: {
        cursor: "not-allowed",

        ...prefixIcon({
          color: tokens.$color.fg.disabled,
        }),

        ...suffixIcon({
          color: tokens.$color.fg.disabled,
        }),
      },
    },
    body: {
      display: "flex",
      flexDirection: "column",

      flexGrow: 1,
      gap: tokens.$dimension.x0_5,
    },
    label: {
      fontWeight: tokens.$fontWeight.regular,

      [pseudo(disabled)]: {
        color: tokens.$color.fg.disabled,
      },
    },
    description: {
      fontWeight: tokens.$fontWeight.regular,
      color: tokens.$color.fg.neutralSubtle,

      [pseudo(disabled)]: {
        color: tokens.$color.fg.disabled, // 확인
      },
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          paddingTop: tokens.$dimension.x3,
          paddingBottom: tokens.$dimension.x3,
          paddingLeft: tokens.$dimension.x4,
          paddingRight: tokens.$dimension.x4,

          gap: tokens.$dimension.x3, // 확인

          ...prefixIcon({
            size: "22px",
          }),

          ...suffixIcon({
            size: "18px",
          }),
        },
        label: {
          fontSize: tokens.$fontSize.t5,
          lineHeight: tokens.$lineHeight.t5,
        },
        description: {
          fontSize: tokens.$fontSize.t3,
          lineHeight: tokens.$lineHeight.t3,
        },
      },
      small: {
        root: {
          paddingTop: tokens.$dimension.x2_5,
          paddingBottom: tokens.$dimension.x2_5,
          paddingLeft: tokens.$dimension.x4,
          paddingRight: tokens.$dimension.x4,

          gap: tokens.$dimension.x2, // 확인

          ...prefixIcon({
            size: "18px",
          }),

          ...suffixIcon({
            size: "16px",
          }),
        },
        label: {
          fontSize: tokens.$fontSize.t4,
          lineHeight: tokens.$lineHeight.t4,
        },
        description: {
          fontSize: tokens.$fontSize.t2,
          lineHeight: tokens.$lineHeight.t2,
        },
      },
    },
    tone: {
      neutral: {
        root: {
          ...prefixIcon({
            color: tokens.$color.fg.neutral,
          }),
          ...suffixIcon({
            color: tokens.$color.fg.neutral,
          }),
        },
        label: {
          color: tokens.$color.fg.neutral,
        },
      },
      critical: {
        root: {
          ...prefixIcon({
            color: tokens.$color.fg.critical,
          }),
          ...suffixIcon({
            color: tokens.$color.fg.critical,
          }),
        },
        label: {
          color: tokens.$color.fg.critical,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
    tone: "neutral",
  },
});
