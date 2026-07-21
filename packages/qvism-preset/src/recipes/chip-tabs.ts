import { chipTablist as vars, chip as chipVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { engaged, disabled, focusVisible, not, pseudo, selected } from "../utils/pseudo";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { createPressScaleStyles } from "../utils/press-scale";

const chipTabs = defineSlotRecipe({
  name: "chip-tabs",
  slots: ["root", "list", "carousel", "carouselCamera", "content", "trigger"],
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

      padding: `0px ${vars.base.enabled.root.paddingX}`,

      "&::-webkit-scrollbar": {
        display: "none",
      },
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

      [pseudo(not("[data-carousel]"), not(selected))]: {
        display: "none",
      },
    },

    trigger: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      border: "none",
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      fontFamily: "inherit",

      // Keep chips at their natural width when the list overflows.
      // Each size variant sets an explicit `minWidth`, which overrides the flex
      // `min-width: auto` (min-content) floor. Without `flexShrink: 0`, that lets
      // chips shrink past their text + padding, so the label bleeds into the padding.
      flexShrink: 0,

      borderRadius: chipVars.base.enabled.root.cornerRadius,
      fontWeight: chipVars.base.enabled.label.fontWeight,

      ...createPressScaleStyles(),

      transition: [
        `background-color ${chipVars.base.enabled.root.colorDuration} ${chipVars.base.enabled.root.colorTimingFunction}`,
        `scale ${chipVars.base.enabled.root.scaleDuration} ${chipVars.base.enabled.root.scaleTimingFunction}`,
        FOCUS_RING_TRANSITION,
      ].join(", "),

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),
    },
  },
  variants: {
    size: {
      medium: {
        list: {
          gap: vars.base.enabled.root.gap,
        },
        trigger: {
          // NOTE: chip uses `height`, but chip-tab keeps `minHeight` to preserve existing behavior
          minHeight: chipVars.sizeMedium.enabled.root.height,
          minWidth: chipVars.sizeMediumLayoutWithText.enabled.root.minWidth,
          fontSize: chipVars.sizeMedium.enabled.label.fontSize,
          paddingInline: `calc(${chipVars.sizeMedium.enabled.root.paddingX} + ${chipVars.base.enabled.label.paddingX})`,
        },
      },
      large: {
        list: {
          gap: vars.base.enabled.root.gap,
        },
        trigger: {
          // NOTE: chip uses `height`, but chip-tab keeps `minHeight` to preserve existing behavior
          minHeight: chipVars.sizeLarge.enabled.root.height,
          minWidth: chipVars.sizeLargeLayoutWithText.enabled.root.minWidth,
          fontSize: chipVars.sizeLarge.enabled.label.fontSize,
          paddingInline: `calc(${chipVars.sizeLarge.enabled.root.paddingX} + ${chipVars.base.enabled.label.paddingX})`,
        },
      },
    },
    variant: {
      neutralSolid: {
        trigger: {
          backgroundColor: chipVars.variantSolid.enabled.root.color,

          color: chipVars.variantSolid.enabled.label.color,

          [pseudo(selected)]: {
            backgroundColor: chipVars.variantSolid.selected.root.color,
            color: chipVars.variantSolid.selected.label.color,
          },

          [pseudo(engaged)]: {
            backgroundColor: chipVars.variantSolid.pressed.root.color,
          },

          [pseudo(selected, engaged)]: {
            backgroundColor: chipVars.variantSolid.selectedPressed.root.color,
          },

          [pseudo(disabled)]: {
            cursor: "not-allowed",
            opacity: chipVars.variantSolid.disabled.root.opacity,
          },
        },
      },
      neutralOutline: {
        trigger: {
          backgroundColor: chipVars.variantOutlineStrong.enabled.root.color,
          border: `${chipVars.variantOutlineStrong.enabled.root.strokeWidth} solid ${chipVars.variantOutlineStrong.enabled.root.strokeColor}`,

          color: chipVars.variantOutlineStrong.enabled.label.color,

          [pseudo(selected)]: {
            backgroundColor: chipVars.variantOutlineStrong.selected.root.color,
            borderColor: "transparent",
            color: chipVars.variantOutlineStrong.selected.label.color,
          },

          [pseudo(engaged)]: {
            backgroundColor: chipVars.variantOutlineStrong.pressed.root.color,
          },

          [pseudo(selected, engaged)]: {
            backgroundColor: chipVars.variantOutlineStrong.selectedPressed.root.color,
          },

          [pseudo(disabled)]: {
            cursor: "not-allowed",
            opacity: chipVars.variantOutlineStrong.disabled.root.opacity,
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
    size: "medium",
    variant: "neutralSolid",
    contentLayout: "hug",
    stickyList: false,
  },
});

export default chipTabs;
