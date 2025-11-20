import { tablist as vars, tab as triggerVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { disabled, not, pseudo, selected } from "../utils/pseudo";

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
      left: "var(--indicator-left, 0px)",
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
    },
  },
  variants: {
    triggerLayout: {
      fill: {
        list: {
          paddingLeft: vars.layoutFill.enabled.root.paddingX,
          paddingRight: vars.layoutFill.enabled.root.paddingX,
          justifyContent: "space-around",
        },
        indicator: {
          left: `calc(var(--indicator-left, 0px) + ${vars.layoutFill.enabled.indicator.insetX})`,
          width: `calc(var(--indicator-width, 0px) - 2 * ${vars.layoutFill.enabled.indicator.insetX})`,
        },
        trigger: {
          flex: 1,

          [pseudo(selected, "[data-ssr]:after")]: {
            left: vars.layoutFill.enabled.indicator.insetX,
            right: vars.layoutFill.enabled.indicator.insetX,
          },
        },
      },
      hug: {
        list: {
          paddingLeft: vars.layoutHug.enabled.root.paddingX,
          paddingRight: vars.layoutHug.enabled.root.paddingX,
          justifyContent: "flex-start",
        },
        indicator: {
          left: `calc(var(--indicator-left, 0px) + ${vars.layoutHug.enabled.indicator.insetX})`,
          width: `calc(var(--indicator-width, 0px) - 2 * ${vars.layoutHug.enabled.indicator.insetX})`,
        },
        trigger: {
          [pseudo(selected, "[data-ssr]:after")]: {
            left: 0,
            right: 0,
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
          paddingLeft: triggerVars.sizeSmall.enabled.root.paddingX,
          paddingRight: triggerVars.sizeSmall.enabled.root.paddingX,
          paddingTop: triggerVars.sizeSmall.enabled.root.paddingY,
          paddingBottom: triggerVars.sizeSmall.enabled.root.paddingY,

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
          paddingLeft: triggerVars.sizeMedium.enabled.root.paddingX,
          paddingRight: triggerVars.sizeMedium.enabled.root.paddingX,
          paddingTop: triggerVars.sizeMedium.enabled.root.paddingY,
          paddingBottom: triggerVars.sizeMedium.enabled.root.paddingY,

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
  },
  defaultVariants: {
    triggerLayout: "fill",
    contentLayout: "hug",
    size: "small",
    stickyList: false,
  },
});

export default tabs;
