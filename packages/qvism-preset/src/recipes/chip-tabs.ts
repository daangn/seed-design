import { chipTablist as vars, chipTab as triggerVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { active, disabled, not, pseudo, selected } from "../utils/pseudo";

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

      borderRadius: triggerVars.base.enabled.root.cornerRadius,
      paddingTop: triggerVars.base.enabled.root.paddingY,
      paddingBottom: triggerVars.base.enabled.root.paddingY,
      fontWeight: triggerVars.base.enabled.label.fontWeight,

      transition: `background-color ${triggerVars.base.enabled.root.colorDuration} ${triggerVars.base.enabled.root.colorTimingFunction}`,
    },
  },
  variants: {
    size: {
      medium: {
        list: {
          gap: vars.base.enabled.root.gap,
        },
        trigger: {
          minHeight: triggerVars.sizeMedium.enabled.root.minHeight,
          fontSize: triggerVars.sizeMedium.enabled.label.fontSize,
          paddingLeft: triggerVars.sizeMedium.enabled.root.paddingX,
          paddingRight: triggerVars.sizeMedium.enabled.root.paddingX,
        },
      },
      large: {
        list: {
          gap: vars.base.enabled.root.gap,
        },
        trigger: {
          minHeight: triggerVars.sizeLarge.enabled.root.minHeight,
          fontSize: triggerVars.sizeLarge.enabled.label.fontSize,
          paddingLeft: triggerVars.sizeLarge.enabled.root.paddingX,
          paddingRight: triggerVars.sizeLarge.enabled.root.paddingX,
        },
      },
    },
    variant: {
      neutralSolid: {
        trigger: {
          backgroundColor: triggerVars.variantNeutralSolid.enabled.root.color,

          color: triggerVars.variantNeutralSolid.enabled.label.color,

          [pseudo(selected)]: {
            backgroundColor: triggerVars.variantNeutralSolid.selected.root.color,
            color: triggerVars.variantNeutralSolid.selected.label.color,
          },

          [pseudo(active)]: {
            backgroundColor: triggerVars.variantNeutralSolid.enabledPressed.root.color,
          },

          [pseudo(selected, active)]: {
            backgroundColor: triggerVars.variantNeutralSolid.selectedPressed.root.color,
          },

          [pseudo(disabled)]: {
            cursor: "not-allowed",
            backgroundColor: undefined,
            color: triggerVars.variantNeutralSolid.disabled.label.color,
          },

          [pseudo(disabled, selected)]: {
            backgroundColor: triggerVars.variantNeutralSolid.selectedDisabled.root.color,
            color: triggerVars.variantNeutralSolid.selectedDisabled.label.color,
          },
        },
      },
      neutralOutline: {
        trigger: {
          backgroundColor: triggerVars.variantNeutralOutline.enabled.root.color,
          border: `${triggerVars.variantNeutralOutline.enabled.root.strokeWidth} solid ${triggerVars.variantNeutralOutline.enabled.root.strokeColor}`,

          color: triggerVars.variantNeutralOutline.enabled.label.color,

          [pseudo(selected)]: {
            backgroundColor: triggerVars.variantNeutralOutline.selected.root.color,
            borderColor: "transparent",
            color: triggerVars.variantNeutralOutline.selected.label.color,
          },

          [pseudo(active)]: {
            backgroundColor: triggerVars.variantNeutralOutline.enabledPressed.root.color,
          },

          [pseudo(selected, active)]: {
            backgroundColor: triggerVars.variantNeutralOutline.selectedPressed.root.color,
          },

          [pseudo(disabled)]: {
            cursor: "not-allowed",
            backgroundColor: undefined,
            color: triggerVars.variantNeutralOutline.disabled.label.color,
          },

          [pseudo(disabled, selected)]: {
            backgroundColor: triggerVars.variantNeutralOutline.selectedDisabled.root.color,
            color: triggerVars.variantNeutralOutline.selectedDisabled.label.color,
          },
        },
      },
      brandSolid: {
        trigger: {
          backgroundColor: triggerVars.variantBrandSolid.enabled.root.color,

          color: triggerVars.variantBrandSolid.enabled.label.color,

          [pseudo(selected)]: {
            backgroundColor: triggerVars.variantBrandSolid.selected.root.color,
            color: triggerVars.variantBrandSolid.selected.label.color,
          },

          [pseudo(active)]: {
            backgroundColor: triggerVars.variantBrandSolid.enabledPressed.root.color,
          },

          [pseudo(selected, active)]: {
            backgroundColor: triggerVars.variantBrandSolid.selectedPressed.root.color,
          },

          [pseudo(disabled)]: {
            cursor: "not-allowed",
            backgroundColor: triggerVars.variantBrandSolid.disabled.root.color,
            color: triggerVars.variantBrandSolid.disabled.label.color,
          },

          [pseudo(disabled, selected)]: {
            backgroundColor: triggerVars.variantBrandSolid.selectedDisabled.root.color,
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
