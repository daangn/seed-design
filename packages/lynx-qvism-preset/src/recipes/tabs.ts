import { tablist as vars, tab as triggerVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const tabs = defineSlotRecipe({
  name: "tabs",
  slots: [
    "root",
    "list",
    "listContent",
    "carousel",
    "carouselCamera",
    "content",
    "indicator",
    "trigger",
    "triggerLabel",
  ],
  base: {
    root: {
      position: "relative",
    },
    list: {
      position: "relative",
      backgroundColor: vars.base.enabled.root.color,
      borderBottomWidth: vars.base.enabled.root.strokeBottomWidth,
      borderBottomStyle: "solid",
      borderBottomColor: vars.base.enabled.root.strokeColor,
    },
    listContent: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      flexWrap: "nowrap",
      alignItems: "stretch",
      width: "max-content",
      minWidth: "100%",
    },
    carousel: {
      display: "flex",
      overflow: "hidden",
    },
    carouselCamera: {
      width: "100%",
    },
    content: {
      width: "100%",
      minWidth: "0px",
      overflow: "hidden",
    },
    indicator: {
      position: "absolute",
      left: "0px",
      bottom: "0px",
      height: vars.base.enabled.indicator.height,
      width: "var(--tabs-indicator-width, 0px)",
      backgroundColor: vars.base.enabled.indicator.color,
      transform: "translateX(var(--tabs-indicator-x, 0px))",
      transitionProperty: "transform, width",
      transitionDuration: vars.base.enabled.indicator.transformDuration,
      transitionTimingFunction: vars.base.enabled.indicator.transformTimingFunction,
    },
    trigger: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },
    triggerLabel: {
      whiteSpace: "nowrap",
      color: triggerVars.base.enabled.label.color,
      transitionProperty: "color",
      transitionDuration: vars.base.enabled.indicator.transformDuration,
      transitionTimingFunction: vars.base.enabled.indicator.transformTimingFunction,
    },
  },
  variants: {
    triggerLayout: {
      fill: {
        listContent: {
          width: "100%",
          paddingLeft: vars.layoutFill.enabled.root.paddingX,
          paddingRight: vars.layoutFill.enabled.root.paddingX,
        },
        indicator: {
          transform: `translateX(calc(var(--tabs-indicator-x, 0px) + ${vars.layoutFill.enabled.indicator.insetX}))`,
          width: `calc(var(--tabs-indicator-width, 0px) - 2 * ${vars.layoutFill.enabled.indicator.insetX})`,
        },
        trigger: {
          flex: 1,
        },
      },
      hug: {
        listContent: {
          paddingLeft: vars.layoutHug.enabled.root.paddingX,
          paddingRight: vars.layoutHug.enabled.root.paddingX,
        },
        indicator: {
          transform: `translateX(calc(var(--tabs-indicator-x, 0px) + ${vars.layoutHug.enabled.root.paddingX} + ${vars.layoutHug.enabled.indicator.insetX}))`,
          width: `calc(var(--tabs-indicator-width, 0px) - 2 * ${vars.layoutHug.enabled.indicator.insetX})`,
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
        },
        content: {
          height: "100%",
        },
      },
      hug: {},
    },
    size: {
      small: {
        list: {
          minHeight: vars.sizeSmall.enabled.root.height,
        },
        trigger: {
          minHeight: triggerVars.sizeSmall.enabled.root.minHeight,
          paddingLeft: triggerVars.sizeSmall.enabled.root.paddingX,
          paddingRight: triggerVars.sizeSmall.enabled.root.paddingX,
          paddingTop: triggerVars.sizeSmall.enabled.root.paddingY,
          paddingBottom: triggerVars.sizeSmall.enabled.root.paddingY,
        },
        triggerLabel: {
          fontSize: triggerVars.sizeSmall.enabled.label.fontSize,
          lineHeight: triggerVars.sizeSmall.enabled.label.lineHeight,
          fontWeight: triggerVars.sizeSmall.enabled.label.fontWeight,
        },
      },
      medium: {
        list: {
          minHeight: vars.sizeMedium.enabled.root.height,
        },
        trigger: {
          minHeight: triggerVars.sizeMedium.enabled.root.minHeight,
          paddingLeft: triggerVars.sizeMedium.enabled.root.paddingX,
          paddingRight: triggerVars.sizeMedium.enabled.root.paddingX,
          paddingTop: triggerVars.sizeMedium.enabled.root.paddingY,
          paddingBottom: triggerVars.sizeMedium.enabled.root.paddingY,
        },
        triggerLabel: {
          fontSize: triggerVars.sizeMedium.enabled.label.fontSize,
          lineHeight: triggerVars.sizeMedium.enabled.label.lineHeight,
          fontWeight: triggerVars.sizeMedium.enabled.label.fontWeight,
        },
      },
    },
    stickyList: {
      true: {
        list: {
          position: "sticky",
          top: "0px",
          zIndex: 1,
        },
      },
      false: {},
    },
    transitionEnabled: {
      true: {},
      false: {
        indicator: {
          transitionDuration: "0s",
        },
        triggerLabel: {
          transitionDuration: "0s",
        },
      },
    },
    selected: {
      true: {
        triggerLabel: {
          color: triggerVars.base.selected.label.color,
        },
      },
      false: {
        content: {
          display: "none",
        },
      },
    },
    disabled: {
      true: {
        triggerLabel: {
          color: triggerVars.base.disabled.label.color,
        },
      },
      false: {},
    },
    inCarousel: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      selected: false,
      inCarousel: true,
      css: {
        content: {
          display: "flex",
        },
      },
    },
  ],
  defaultVariants: {
    triggerLayout: "fill",
    contentLayout: "hug",
    size: "small",
    stickyList: false,
    transitionEnabled: true,
  },
});

export default tabs;
