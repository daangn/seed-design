import { accordion as vars, accordionItem as itemVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const accordion = defineSlotRecipe({
  name: "accordion",
  slots: [
    "root",
    "item",
    "header",
    "trigger",
    "pressedOverlay",
    "prefix",
    "body",
    "title",
    "description",
    "suffixIcon",
    "content",
    "contentInner",
    "divider",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    item: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    header: {
      display: "flex",
      width: "100%",
    },
    trigger: {
      position: "relative",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      paddingLeft: itemVars.base.enabled.trigger.paddingX,
      paddingRight: itemVars.base.enabled.trigger.paddingX,
      backgroundColor: "transparent",
      border: "none",
    },
    pressedOverlay: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "transparent",
      transition: `background-color ${itemVars.base.enabled.root.colorDuration} ${itemVars.base.enabled.root.colorTimingFunction}`,
    },
    prefix: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      color: itemVars.base.enabled.prefixIcon.color,
    },
    body: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      gap: itemVars.base.enabled.body.gap,
      minWidth: 0,
    },
    title: {
      color: itemVars.base.enabled.title.color,
      fontWeight: itemVars.base.enabled.title.fontWeight,
    },
    description: {
      color: itemVars.base.enabled.description.color,
      fontWeight: itemVars.base.enabled.description.fontWeight,
    },
    suffixIcon: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      marginLeft: "auto",
      color: itemVars.base.enabled.suffixIcon.color,
      transform: "rotate(0deg)",
      transition: `transform ${itemVars.base.enabled.suffixIcon.rotateDuration} ${itemVars.base.enabled.suffixIcon.rotateTimingFunction}`,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: 0,
      opacity: 0,
      overflow: "hidden",
      transition: `height ${itemVars.base.enabled.content.collapseHeightDuration} ${itemVars.base.enabled.content.collapseHeightTimingFunction}, opacity ${itemVars.base.enabled.content.collapseHeightDuration} ${itemVars.base.enabled.content.collapseHeightTimingFunction}`,
    },
    contentInner: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      width: "100%",
      height: "max-content",
    },
    divider: {
      height: "1px",
      marginLeft: itemVars.variantInline.enabled.root.dividerPaddingX,
      marginRight: itemVars.variantInline.enabled.root.dividerPaddingX,
      backgroundColor: itemVars.variantInline.enabled.root.dividerColor,
    },
  },
  variants: {
    variant: {
      inline: {
        pressedOverlay: {
          right: itemVars.base.pressed.trigger.marginX,
          left: itemVars.base.pressed.trigger.marginX,
          borderRadius: itemVars.base.pressed.trigger.cornerRadius,
        },
      },
      separated: {
        root: {},
        item: {
          boxShadow: `inset 0 0 0 ${itemVars.variantSeparated.enabled.root.strokeWidth} ${itemVars.variantSeparated.enabled.root.strokeColor}`,
          borderRadius: itemVars.variantSeparated.enabled.root.cornerRadius,
          overflow: "hidden",
        },
        divider: {
          display: "none",
        },
      },
    },
    size: {
      medium: {
        trigger: {
          paddingTop: itemVars.sizeMedium.enabled.trigger.paddingY,
          paddingBottom: itemVars.sizeMedium.enabled.trigger.paddingY,
        },
        prefix: {
          width: itemVars.sizeMedium.enabled.prefixIcon.size,
          height: itemVars.sizeMedium.enabled.prefixIcon.size,
          marginRight: itemVars.sizeMedium.enabled.prefix.paddingRight,
        },
        title: {
          fontSize: itemVars.sizeMedium.enabled.title.fontSize,
          lineHeight: itemVars.sizeMedium.enabled.title.lineHeight,
        },
        description: {
          fontSize: itemVars.sizeMedium.enabled.description.fontSize,
          lineHeight: itemVars.sizeMedium.enabled.description.lineHeight,
        },
        suffixIcon: {
          width: itemVars.sizeLarge.enabled.suffixIcon.size,
          height: itemVars.sizeLarge.enabled.suffixIcon.size,
          marginLeft: itemVars.sizeMedium.enabled.suffixIcon.paddingLeft,
        },
      },
      large: {
        trigger: {
          paddingTop: itemVars.sizeLarge.enabled.trigger.paddingY,
          paddingBottom: itemVars.sizeLarge.enabled.trigger.paddingY,
        },
        prefix: {
          width: itemVars.sizeLarge.enabled.prefixIcon.size,
          height: itemVars.sizeLarge.enabled.prefixIcon.size,
          marginRight: itemVars.sizeLarge.enabled.prefix.paddingRight,
        },
        title: {
          fontSize: itemVars.sizeLarge.enabled.title.fontSize,
          lineHeight: itemVars.sizeLarge.enabled.title.lineHeight,
        },
        description: {
          fontSize: itemVars.sizeLarge.enabled.description.fontSize,
          lineHeight: itemVars.sizeLarge.enabled.description.lineHeight,
        },
        suffixIcon: {
          width: itemVars.sizeLarge.enabled.suffixIcon.size,
          height: itemVars.sizeLarge.enabled.suffixIcon.size,
          marginLeft: itemVars.sizeLarge.enabled.suffixIcon.paddingLeft,
        },
      },
    },
    open: {
      true: {
        suffixIcon: {
          transform: "rotate(180deg)",
        },
        content: {
          opacity: 1,
          transition: `height ${itemVars.base.enabled.content.expandHeightDuration} ${itemVars.base.enabled.content.expandHeightTimingFunction}, opacity ${itemVars.base.enabled.content.expandHeightDuration} ${itemVars.base.enabled.content.expandHeightTimingFunction}`,
        },
      },
      false: {},
    },
    pressed: {
      true: {
        pressedOverlay: {
          backgroundColor: itemVars.base.pressed.trigger.color,
        },
      },
      false: {},
    },
    disabled: {
      true: {
        title: {
          color: itemVars.base.disabled.title.color,
        },
        description: {
          color: itemVars.base.disabled.description.color,
        },
        prefix: {
          color: itemVars.base.disabled.prefixIcon.color,
        },
        suffixIcon: {
          color: itemVars.base.disabled.suffixIcon.color,
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "separated",
      size: "medium",
      css: {
        root: {
          gap: vars.variantSeparatedSizeMedium.enabled.root.gap,
        },
      },
    },
    {
      variant: "separated",
      size: "large",
      css: {
        root: {
          gap: vars.variantSeparatedSizeLarge.enabled.root.gap,
        },
      },
    },
  ],
  defaultVariants: {
    variant: "inline",
    size: "medium",
    open: false,
    pressed: false,
    disabled: false,
  },
});

export default accordion;
