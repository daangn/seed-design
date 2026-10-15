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
    },
    listContent: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      flexWrap: "nowrap",
      alignItems: "stretch",
      width: "max-content",
      minWidth: "100%",
      // 하단 stroke를 list(scroll-view) border 대신 content 안쪽에 그린다. Android scroll-view는
      // border 영역으로 나간 Indicator를 잘라 두께가 절반만 보였다. padding으로 기존 높이를 유지한다.
      paddingBottom: vars.base.enabled.root.strokeBottomWidth,
      boxShadow: `inset 0 -${vars.base.enabled.root.strokeBottomWidth} 0 0 ${vars.base.enabled.root.strokeColor}`,
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
      // React처럼 하단 stroke와 겹친다. stroke는 listContent 하단 padding 안에 그려진다.
      bottom: "0px",
      height: vars.base.enabled.indicator.height,
      backgroundColor: vars.base.enabled.indicator.color,
      // inline style은 trigger 측정값(px)만 담는다. 좌우 inset은 padding으로 빼고 배경을 content box에만 칠한다.
      boxSizing: "border-box",
      backgroundClip: "content-box",
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
          paddingLeft: vars.layoutFill.enabled.indicator.insetX,
          paddingRight: vars.layoutFill.enabled.indicator.insetX,
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
          left: vars.layoutHug.enabled.root.paddingX,
          paddingLeft: vars.layoutHug.enabled.indicator.insetX,
          paddingRight: vars.layoutHug.enabled.indicator.insetX,
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
