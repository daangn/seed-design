import { chipTablist as vars, chip as chipVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const chipTabs = defineSlotRecipe({
  name: "chip-tabs",
  slots: [
    "root",
    "list",
    "listContent",
    "trigger",
    "triggerLabel",
    "content",
    "carousel",
    "carouselCamera",
  ],
  base: {
    root: {
      position: "relative",
    },
    list: {
      position: "relative",
    },
    listContent: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      width: "max-content",
      minWidth: "100%",
      gap: vars.base.enabled.root.gap,
      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
    },
    trigger: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
      gap: chipVars.base.enabled.label.paddingX,
      borderRadius: chipVars.base.enabled.root.cornerRadius,
      transition: `background-color ${chipVars.base.enabled.root.colorDuration} ${chipVars.base.enabled.root.colorTimingFunction}, box-shadow ${chipVars.base.enabled.root.colorDuration} ${chipVars.base.enabled.root.colorTimingFunction}`,
    },
    triggerLabel: {
      display: "flex",
      flexShrink: 0,
      fontWeight: chipVars.base.enabled.label.fontWeight,
      transitionProperty: "color",
      transitionDuration: chipVars.base.enabled.root.colorDuration,
      transitionTimingFunction: chipVars.base.enabled.root.colorTimingFunction,
    },
    content: {
      width: "100%",
      minWidth: "0px",
      overflow: "hidden",
    },
    carousel: {
      display: "flex",
      overflow: "hidden",
    },
    carouselCamera: {
      width: "100%",
    },
  },
  variants: {
    size: {
      medium: {
        trigger: {
          minHeight: chipVars.sizeMedium.enabled.root.height,
          minWidth: chipVars.sizeMediumLayoutWithText.enabled.root.minWidth,
          paddingLeft: `calc(${chipVars.sizeMedium.enabled.root.paddingX} + ${chipVars.base.enabled.label.paddingX})`,
          paddingRight: `calc(${chipVars.sizeMedium.enabled.root.paddingX} + ${chipVars.base.enabled.label.paddingX})`,
        },
        triggerLabel: {
          fontSize: chipVars.sizeMedium.enabled.label.fontSize,
          lineHeight: chipVars.sizeMedium.enabled.label.lineHeight,
        },
      },
      large: {
        trigger: {
          minHeight: chipVars.sizeLarge.enabled.root.height,
          minWidth: chipVars.sizeLargeLayoutWithText.enabled.root.minWidth,
          paddingLeft: `calc(${chipVars.sizeLarge.enabled.root.paddingX} + ${chipVars.base.enabled.label.paddingX})`,
          paddingRight: `calc(${chipVars.sizeLarge.enabled.root.paddingX} + ${chipVars.base.enabled.label.paddingX})`,
        },
        triggerLabel: {
          fontSize: chipVars.sizeLarge.enabled.label.fontSize,
          lineHeight: chipVars.sizeLarge.enabled.label.lineHeight,
        },
      },
    },
    variant: {
      neutralSolid: {
        trigger: {
          backgroundColor: chipVars.variantSolid.enabled.root.color,
        },
        triggerLabel: {
          color: chipVars.variantSolid.enabled.label.color,
        },
      },
      neutralOutline: {
        trigger: {
          backgroundColor: chipVars.variantOutlineStrong.enabled.root.color,
          boxShadow: `inset 0 0 0 ${chipVars.variantOutlineStrong.enabled.root.strokeWidth} ${chipVars.variantOutlineStrong.enabled.root.strokeColor}`,
        },
        triggerLabel: {
          color: chipVars.variantOutlineStrong.enabled.label.color,
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
    selected: {
      true: {},
      false: {
        content: {
          display: "none",
        },
      },
    },
    pressed: {
      true: {},
      false: {},
    },
    disabled: {
      true: {},
      false: {},
    },
    inCarousel: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "neutralSolid",
      selected: true,
      css: {
        trigger: {
          backgroundColor: chipVars.variantSolid.selected.root.color,
        },
        triggerLabel: {
          color: chipVars.variantSolid.selected.label.color,
        },
      },
    },
    {
      variant: "neutralOutline",
      selected: true,
      css: {
        trigger: {
          backgroundColor: chipVars.variantOutlineStrong.selected.root.color,
          boxShadow: `inset 0 0 0 ${chipVars.variantOutlineStrong.enabled.root.strokeWidth} transparent`,
        },
        triggerLabel: {
          color: chipVars.variantOutlineStrong.selected.label.color,
        },
      },
    },
    {
      variant: "neutralSolid",
      selected: false,
      pressed: true,
      disabled: false,
      css: {
        trigger: {
          backgroundColor: chipVars.variantSolid.pressed.root.color,
        },
      },
    },
    {
      variant: "neutralOutline",
      selected: false,
      pressed: true,
      disabled: false,
      css: {
        trigger: {
          backgroundColor: chipVars.variantOutlineStrong.pressed.root.color,
        },
      },
    },
    {
      variant: "neutralSolid",
      selected: true,
      pressed: true,
      disabled: false,
      css: {
        trigger: {
          backgroundColor: chipVars.variantSolid.selectedPressed.root.color,
        },
      },
    },
    {
      variant: "neutralOutline",
      selected: true,
      pressed: true,
      disabled: false,
      css: {
        trigger: {
          backgroundColor: chipVars.variantOutlineStrong.selectedPressed.root.color,
        },
      },
    },
    {
      variant: "neutralSolid",
      disabled: true,
      css: {
        trigger: {
          opacity: chipVars.variantSolid.disabled.root.opacity,
        },
      },
    },
    {
      variant: "neutralOutline",
      disabled: true,
      css: {
        trigger: {
          opacity: chipVars.variantOutlineStrong.disabled.root.opacity,
        },
      },
    },
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
    size: "medium",
    variant: "neutralSolid",
    contentLayout: "hug",
    stickyList: false,
    selected: false,
    pressed: false,
    disabled: false,
    inCarousel: false,
  },
});

export default chipTabs;
