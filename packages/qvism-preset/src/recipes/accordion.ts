import { accordion as vars, accordionItem as itemVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon, suffixIcon } from "../utils/icon";
import { disabled, engaged, focusVisible, not, open, pseudo } from "../utils/pseudo";
import spec from "@seed-design/rootage-artifacts/components/accordion.json" with { type: "json" };

const accordion = defineSlotRecipe({
  name: "accordion",
  slots: [
    "root",
    "item",
    "header",
    "trigger",
    "prefix",
    "body",
    "title",
    "description",
    "suffixIcon",
    "content",
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
      margin: 0,
      padding: 0,
      font: "inherit",
    },
    trigger: {
      position: "relative",
      isolation: "isolate",
      display: "flex",
      alignItems: "center",
      width: "100%",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      padding: 0,
      fontFamily: "inherit",
      textAlign: "start",
      paddingLeft: itemVars.base.enabled.trigger.paddingX,
      paddingRight: itemVars.base.enabled.trigger.paddingX,

      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    prefix: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,

      ...onlyIcon({
        color: itemVars.base.enabled.prefixIcon.color,
      }),

      [pseudo(disabled)]: {
        ...onlyIcon({
          color: itemVars.base.disabled.prefixIcon.color,
        }),
      },
    },
    body: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      gap: itemVars.base.enabled.body.gap,
      minWidth: 0,
    },
    title: {
      color: itemVars.base.enabled.title.color,
      fontWeight: itemVars.base.enabled.title.fontWeight,

      [pseudo(disabled)]: {
        color: itemVars.base.disabled.title.color,
      },
    },
    description: {
      color: itemVars.base.enabled.description.color,
      fontWeight: itemVars.base.enabled.description.fontWeight,

      [pseudo(disabled)]: {
        color: itemVars.base.disabled.description.color,
      },
    },
    suffixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      marginLeft: "auto",
      color: itemVars.base.enabled.suffixIcon.color,

      transform: "rotate(0deg)",
      transition: `transform ${itemVars.base.enabled.suffixIcon.rotateDuration} ${itemVars.base.enabled.suffixIcon.rotateTimingFunction}`,

      [pseudo(open)]: {
        transform: "rotate(180deg)",
      },

      [pseudo(disabled)]: {
        color: itemVars.base.disabled.suffixIcon.color,
      },
    },
    content: {
      overflow: "hidden",
      height: 0,
      opacity: 0,

      transition: `height ${itemVars.base.enabled.content.collapseHeightDuration} ${itemVars.base.enabled.content.collapseHeightTimingFunction}, opacity ${itemVars.base.enabled.content.collapseHeightDuration} ${itemVars.base.enabled.content.collapseHeightTimingFunction}`,

      [pseudo(open)]: {
        height: "var(--collapsible-content-height)",
        opacity: 1,
        transition: `height ${itemVars.base.enabled.content.expandHeightDuration} ${itemVars.base.enabled.content.expandHeightTimingFunction}, opacity ${itemVars.base.enabled.content.expandHeightDuration} ${itemVars.base.enabled.content.expandHeightTimingFunction}`,
      },
    },
  },
  variants: {
    variant: {
      inline: {
        item: {
          position: "relative",

          [pseudo(":not(:last-child)::after")]: {
            content: "''",
            position: "absolute",
            bottom: 0,
            left: itemVars.variantInline.enabled.root.dividerPaddingX,
            right: itemVars.variantInline.enabled.root.dividerPaddingX,
            height: "1px",
            backgroundColor: itemVars.variantInline.enabled.root.dividerColor,
          },
        },
        trigger: {
          [pseudo("::before")]: {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: -1,
            transitionProperty: "background-color, left, right, border-radius",
            transitionDuration: itemVars.base.enabled.root.colorDuration,
            transitionTimingFunction: itemVars.base.enabled.root.colorTimingFunction,
          },
          [pseudo(not(disabled), engaged, "::before")]: {
            backgroundColor: itemVars.base.pressed.trigger.color,
            left: itemVars.base.pressed.trigger.marginX,
            right: itemVars.base.pressed.trigger.marginX,
            borderRadius: itemVars.base.pressed.trigger.cornerRadius,
          },
        },
      },
      separated: {
        item: {
          boxShadow: `inset 0 0 0 ${itemVars.variantSeparated.enabled.root.strokeWidth} ${itemVars.variantSeparated.enabled.root.strokeColor}`,
          borderRadius: itemVars.variantSeparated.enabled.root.cornerRadius,
          overflow: "hidden",
        },
        trigger: {
          [pseudo("::before")]: {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: -1,
            transitionProperty: "background-color",
            transitionDuration: itemVars.base.enabled.root.colorDuration,
            transitionTimingFunction: itemVars.base.enabled.root.colorTimingFunction,
          },
          [pseudo(not(disabled), engaged, "::before")]: {
            backgroundColor: itemVars.base.pressed.trigger.color,
          },
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
          marginRight: itemVars.sizeMedium.enabled.prefix.paddingRight,
          ...onlyIcon({
            size: itemVars.sizeMedium.enabled.prefixIcon.size,
          }),
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
          ...suffixIcon({
            size: itemVars.sizeMedium.enabled.suffixIcon.size,
            marginLeft: itemVars.sizeMedium.enabled.suffixIcon.paddingLeft,
          }),
        },
      },
      large: {
        trigger: {
          paddingTop: itemVars.sizeLarge.enabled.trigger.paddingY,
          paddingBottom: itemVars.sizeLarge.enabled.trigger.paddingY,
        },
        prefix: {
          marginRight: itemVars.sizeLarge.enabled.prefix.paddingRight,
          ...onlyIcon({
            size: itemVars.sizeLarge.enabled.prefixIcon.size,
          }),
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
          ...suffixIcon({
            size: itemVars.sizeLarge.enabled.suffixIcon.size,
            marginLeft: itemVars.sizeLarge.enabled.suffixIcon.paddingLeft,
          }),
        },
      },
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
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default accordion;
