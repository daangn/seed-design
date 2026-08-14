import { tablist as vars, tab as triggerVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { disabled, focusVisible, not, pseudo, selected } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";

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

      overflowX: "auto",
      msOverflowStyle: "none",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },

      background: vars.base.rest.root.color,
      // use inset boxShadow instead of border to avoid layout shift
      boxShadow: `inset 0 -${vars.base.rest.root.strokeBottomWidth} ${vars.base.rest.root.strokeColor}`,
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
      transitionDuration: vars.base.rest.indicator.transformDuration,
      transitionTimingFunction: vars.base.rest.indicator.transformTimingFunction,
      left: "var(--indicator-left, 0px)",
      width: "var(--indicator-width, 0px)",
      color: vars.base.rest.indicator.color,
      borderBottom: `${vars.base.rest.indicator.height} solid ${vars.base.rest.indicator.color}`,
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

      color: triggerVars.base.rest.label.color,

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
        height: vars.base.rest.indicator.height,
        backgroundColor: vars.base.rest.indicator.color,
      },

      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles({ position: "inside" }),
      [pseudo(focusVisible)]: createFocusRingStyles({ position: "inside" }),
    },
  },
  variants: {
    triggerLayout: {
      fill: {
        list: {
          paddingInline: vars.layoutFill.rest.root.paddingX,
          justifyContent: "space-around",
        },
        indicator: {
          left: `calc(var(--indicator-left, 0px) + ${vars.layoutFill.rest.indicator.insetX})`,
          width: `calc(var(--indicator-width, 0px) - 2 * ${vars.layoutFill.rest.indicator.insetX})`,
        },
        trigger: {
          flex: 1,

          [pseudo(selected, "[data-ssr]:after")]: {
            insetInline: vars.layoutFill.rest.indicator.insetX,
          },
        },
      },
      hug: {
        list: {
          paddingInline: vars.layoutHug.rest.root.paddingX,
          justifyContent: "flex-start",
        },
        indicator: {
          left: `calc(var(--indicator-left, 0px) + ${vars.layoutHug.rest.indicator.insetX})`,
          width: `calc(var(--indicator-width, 0px) - 2 * ${vars.layoutHug.rest.indicator.insetX})`,
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
          "--tabs-list-height": vars.sizeSmall.rest.root.height,
        },
        list: {
          minHeight: vars.sizeSmall.rest.root.height,
        },
        trigger: {
          minHeight: triggerVars.sizeSmall.rest.root.minHeight,
          paddingInline: triggerVars.sizeSmall.rest.root.paddingX,
          paddingBlock: triggerVars.sizeSmall.rest.root.paddingY,

          fontSize: triggerVars.sizeSmall.rest.label.fontSize,
          lineHeight: triggerVars.sizeSmall.rest.label.lineHeight,
          fontWeight: triggerVars.sizeSmall.rest.label.fontWeight,
        },
      },
      medium: {
        root: {
          "--tabs-list-height": vars.sizeMedium.rest.root.height,
        },
        list: {
          minHeight: vars.sizeMedium.rest.root.height,
        },
        trigger: {
          minHeight: triggerVars.sizeMedium.rest.root.minHeight,
          paddingInline: triggerVars.sizeMedium.rest.root.paddingX,
          paddingBlock: triggerVars.sizeMedium.rest.root.paddingY,

          fontSize: triggerVars.sizeMedium.rest.label.fontSize,
          lineHeight: triggerVars.sizeMedium.rest.label.lineHeight,
          fontWeight: triggerVars.sizeMedium.rest.label.fontWeight,
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
  },
  defaultVariants: {
    triggerLayout: "fill",
    contentLayout: "hug",
    size: "small",
    stickyList: false,
  },
});

export default tabs;
