import { tablist as vars, tab as triggerVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, disabled, focusVisible, not, pseudo, selected } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { createScaleFeedbackStyles, FEEDBACK_SCALE_TRANSITION } from "../utils/scale-feedback";

const tabs = defineSlotRecipe({
  name: "tabs",
  slots: ["root", "list", "carousel", "carouselCamera", "content", "indicator", "trigger"],
  base: {
    root: {
      position: "relative",
    },
    list: {
      display: "flex",
      position: "relative",
      isolation: "isolate",
      flexWrap: "nowrap",
      alignItems: "stretch",
      alignContent: "stretch",

      paddingLeft: "var(--tabs-list-padding-left)",
      paddingRight: "var(--tabs-list-padding-right)",

      overflowX: "auto",
      msOverflowStyle: "none",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },

      background: vars.base.enabled.root.color,
      // use inset boxShadow instead of border to avoid layout shift
      boxShadow: `inset 0 -${vars.base.enabled.root.strokeBottomWidth} ${vars.base.enabled.root.strokeColor}`,
    },
    carousel: {
      display: "block",
      overflow: "hidden",
    },
    carouselCamera: {
      display: "flex",

      [pseudo("[data-auto-height]")]: {
        alignItems: "flex-start",
      },
    },
    content: {
      flex: "0 0 100%",
      minWidth: 0,
      transform: "translate3d(0, 0, 0)",
      overflowY: "auto",
      overflowX: "hidden",

      [pseudo("[data-ssr]", not(selected))]: {
        display: "none",
      },
      [pseudo(not("[data-carousel]"), not(selected))]: {
        display: "none",
      },
    },
    indicator: {
      position: "absolute",
      willChange: "left, width",
      transitionProperty: "left, width",
      transitionDuration: vars.base.enabled.indicator.transformDuration,
      transitionTimingFunction: vars.base.enabled.indicator.transformTimingFunction,
      // `--indicator-left` is measured from the list's content box, so a padding change such as
      // a safe area inset moves the indicator without a re-measure.
      left: "calc(var(--indicator-left, 0px) + var(--tabs-list-padding-left, 0px))",
      width: "var(--indicator-width, 0px)",
      color: vars.base.enabled.indicator.color,
      borderBottom: `${vars.base.enabled.indicator.height} solid ${vars.base.enabled.indicator.color}`,
      bottom: 0,

      [pseudo("[data-ssr]")]: {
        display: "none",
      },
    },

    trigger: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      cursor: "pointer",
      border: "none",
      boxSizing: "border-box",
      backgroundColor: "transparent",
      whiteSpace: "nowrap",
      scrollMarginInline: triggerVars.base.enabled.root.scrollMarginX,

      color: triggerVars.base.enabled.label.color,

      [pseudo(selected)]: {
        color: triggerVars.base.selected.label.color,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
        color: triggerVars.base.disabled.label.color,
      },

      [pseudo(selected, "[data-ssr]:after")]: {
        content: "''",
        position: "absolute",
        bottom: 0,
        height: vars.base.enabled.indicator.height,
        backgroundColor: vars.base.enabled.indicator.color,
      },

      [pseudo(not(disabled), active)]: { ...createScaleFeedbackStyles() },

      transition: `${FEEDBACK_SCALE_TRANSITION}, ${FOCUS_RING_TRANSITION}`,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),
    },
  },
  variants: {
    triggerLayout: {
      fill: {
        list: {
          "--tabs-list-padding-left": vars.layoutFill.enabled.root.paddingX,
          "--tabs-list-padding-right": vars.layoutFill.enabled.root.paddingX,
          justifyContent: "space-around",
        },
        indicator: {
          left: `calc(var(--indicator-left, 0px) + var(--tabs-list-padding-left, 0px) + ${vars.layoutFill.enabled.indicator.insetX})`,
          width: `calc(var(--indicator-width, 0px) - 2 * ${vars.layoutFill.enabled.indicator.insetX})`,
        },
        trigger: {
          flex: 1,

          [pseudo(selected, "[data-ssr]:after")]: {
            insetInline: vars.layoutFill.enabled.indicator.insetX,
          },
        },
      },
      hug: {
        list: {
          "--tabs-list-padding-left": vars.layoutHug.enabled.root.paddingX,
          "--tabs-list-padding-right": vars.layoutHug.enabled.root.paddingX,
          justifyContent: "flex-start",
        },
        indicator: {
          left: `calc(var(--indicator-left, 0px) + var(--tabs-list-padding-left, 0px) + ${vars.layoutHug.enabled.indicator.insetX})`,
          width: `calc(var(--indicator-width, 0px) - 2 * ${vars.layoutHug.enabled.indicator.insetX})`,
        },
        trigger: {
          [pseudo(selected, "[data-ssr]:after")]: {
            insetInline: 0,
          },
        },
      },
    },
    contentLayout: {
      fill: {
        root: {
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
        carousel: {
          flex: 1,
        },
        carouselCamera: {
          height: "100%",
          alignItems: "stretch",
        },
      },
      hug: {
        root: {
          display: "block",
        },
      },
    },
    size: {
      small: {
        root: {
          "--tabs-list-height": vars.sizeSmall.enabled.root.height,
        },
        list: {
          minHeight: vars.sizeSmall.enabled.root.height,
        },
        trigger: {
          minHeight: triggerVars.sizeSmall.enabled.root.minHeight,
          paddingInline: triggerVars.sizeSmall.enabled.root.paddingX,
          paddingBlock: triggerVars.sizeSmall.enabled.root.paddingY,

          fontSize: triggerVars.sizeSmall.enabled.label.fontSize,
          lineHeight: triggerVars.sizeSmall.enabled.label.lineHeight,
          fontWeight: triggerVars.sizeSmall.enabled.label.fontWeight,
        },
      },
      medium: {
        root: {
          "--tabs-list-height": vars.sizeMedium.enabled.root.height,
        },
        list: {
          minHeight: vars.sizeMedium.enabled.root.height,
        },
        trigger: {
          minHeight: triggerVars.sizeMedium.enabled.root.minHeight,
          paddingInline: triggerVars.sizeMedium.enabled.root.paddingX,
          paddingBlock: triggerVars.sizeMedium.enabled.root.paddingY,

          fontSize: triggerVars.sizeMedium.enabled.label.fontSize,
          lineHeight: triggerVars.sizeMedium.enabled.label.lineHeight,
          fontWeight: triggerVars.sizeMedium.enabled.label.fontWeight,
        },
      },
    },
    stickyList: {
      true: {
        root: {
          position: "relative",
        },
        list: {
          position: "sticky",
          top: 0,
          zIndex: 1,
        },
      },
      false: {},
    },
    extendSafeAreaX: {
      true: {
        root: {
          marginLeft: "calc(var(--seed-safe-area-left) * -1)",
          marginRight: "calc(var(--seed-safe-area-right) * -1)",
        },
        list: {
          // Keeps a selected or focused tab from stopping under the inset the list extends into
          scrollPaddingLeft: "var(--seed-safe-area-left)",
          scrollPaddingRight: "var(--seed-safe-area-right)",
        },
        content: {
          boxSizing: "border-box",
          paddingLeft: "var(--seed-safe-area-left)",
          paddingRight: "var(--seed-safe-area-right)",
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      triggerLayout: "fill",
      extendSafeAreaX: true,
      css: {
        list: {
          "--tabs-list-padding-left": `calc(${vars.layoutFill.enabled.root.paddingX} + var(--seed-safe-area-left))`,
          "--tabs-list-padding-right": `calc(${vars.layoutFill.enabled.root.paddingX} + var(--seed-safe-area-right))`,
        },
      },
    },
    {
      triggerLayout: "hug",
      extendSafeAreaX: true,
      css: {
        list: {
          "--tabs-list-padding-left": `calc(${vars.layoutHug.enabled.root.paddingX} + var(--seed-safe-area-left))`,
          "--tabs-list-padding-right": `calc(${vars.layoutHug.enabled.root.paddingX} + var(--seed-safe-area-right))`,
        },
      },
    },
  ],
  defaultVariants: {
    triggerLayout: "fill",
    contentLayout: "hug",
    size: "small",
    stickyList: false,
    extendSafeAreaX: false,
  },
});

export default tabs;
