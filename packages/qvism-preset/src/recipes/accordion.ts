import { accordion as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
import { suffixIcon } from "../utils/icon";
import { disabled, engaged, focusVisible, not, open, pseudo } from "../utils/pseudo";
import {
  FOCUS_RING_TRANSITION,
  createFocusRingRestStyles,
  createFocusRingStyles,
} from "../utils/focus-ring";

const accordion = defineSlotRecipe({
  name: "accordion",
  slots: [
    "root",
    "item",
    "trigger",
    "prefix",
    "body",
    "title",
    "description",
    "suffixIcon",
    "content",
    "contentInner",
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
      paddingLeft: vars.base.enabled.trigger.paddingX,
      paddingRight: vars.base.enabled.trigger.paddingX,

      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      // engaged 배경 pseudo element (list-item 패턴)
      [pseudo("::before")]: {
        content: "''",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
        transitionProperty: "background-color, left, right, border-radius",
        transitionDuration: vars.base.enabled.item.colorDuration,
        transitionTimingFunction: vars.base.enabled.item.colorTimingFunction,
      },

      [pseudo(not(disabled), engaged, "::before")]: {
        backgroundColor: vars.base.pressed.trigger.color,
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    prefix: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
    },
    body: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      gap: vars.base.enabled.body.gap,
      minWidth: 0,
    },
    title: {
      color: vars.base.enabled.title.color,
      fontWeight: vars.base.enabled.title.fontWeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.title.color,
      },
    },
    description: {
      display: "flex",
      flexDirection: "column",
      gap: vars.base.enabled.description.gap,
      color: vars.base.enabled.description.color,
      fontWeight: vars.base.enabled.description.fontWeight,

      [pseudo(disabled)]: {
        color: vars.base.disabled.description.color,
      },
    },
    suffixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      marginLeft: "auto",
      color: vars.base.enabled.suffixIcon.color,

      transform: "rotate(0deg)",
      transition: `transform ${vars.base.enabled.suffixIcon.rotateDuration} ${vars.base.enabled.suffixIcon.rotateTimingFunction}`,

      [pseudo(open)]: {
        transform: "rotate(180deg)",
      },

      [pseudo(disabled)]: {
        color: vars.base.disabled.suffixIcon.color,
      },
    },
    content: {
      overflow: "hidden",
      height: 0,
      opacity: 0,

      // when closing
      transition: `height ${vars.base.enabled.content.collapseHeightDuration} ${vars.base.enabled.content.collapseHeightTimingFunction}, opacity ${vars.base.enabled.content.collapseHeightDuration} ${vars.base.enabled.content.collapseHeightTimingFunction}`,

      [pseudo(open)]: {
        height: "var(--collapsible-content-height)",
        opacity: 1,

        // when opening
        transition: `height ${vars.base.enabled.content.expandHeightDuration} ${vars.base.enabled.content.expandHeightTimingFunction}, opacity ${vars.base.enabled.content.expandHeightDuration} ${vars.base.enabled.content.expandHeightTimingFunction}`,
      },
    },
    contentInner: {
      paddingLeft: vars.base.enabled.content.paddingX,
      paddingRight: vars.base.enabled.content.paddingX,
      fontSize: vars.base.enabled.contentInner.fontSize,
      lineHeight: vars.base.enabled.contentInner.lineHeight,
      fontWeight: vars.base.enabled.contentInner.fontWeight,
      color: vars.base.enabled.contentInner.color,
    },
  },
  variants: {
    variant: {
      inline: {
        item: {
          "&:not(:last-child)": {
            boxShadow: `inset 0 -1px 0 0 ${vars.variantInline.enabled.item.dividerColor}`,
          },
        },
        trigger: {
          [pseudo(not(disabled), engaged, "::before")]: {
            left: vars.base.pressed.trigger.marginX,
            right: vars.base.pressed.trigger.marginX,
            borderRadius: vars.base.pressed.trigger.cornerRadius,
          },
        },
      },
      separated: {
        item: {
          boxShadow: `inset 0 0 0 1px ${vars.variantSeparated.enabled.item.borderColor}`,
          borderRadius: vars.variantSeparated.enabled.item.cornerRadius,
          overflow: "hidden",
        },
      },
    },
    size: {
      medium: {
        trigger: {
          paddingTop: vars.sizeMedium.enabled.trigger.paddingY,
          paddingBottom: vars.sizeMedium.enabled.trigger.paddingY,
        },
        prefix: {
          marginRight: vars.sizeMedium.enabled.prefix.paddingRight,
        },
        title: {
          fontSize: vars.sizeMedium.enabled.title.fontSize,
          lineHeight: vars.sizeMedium.enabled.title.lineHeight,
        },
        description: {
          fontSize: vars.sizeMedium.enabled.description.fontSize,
          lineHeight: vars.sizeMedium.enabled.description.lineHeight,
        },
        suffixIcon: {
          ...suffixIcon({
            size: vars.sizeMedium.enabled.suffixIcon.size,
            marginLeft: vars.sizeMedium.enabled.suffixIcon.paddingLeft,
          }),
        },
        contentInner: {
          paddingTop: vars.sizeMedium.enabled.content.paddingTop,
          paddingBottom: vars.sizeMedium.enabled.content.paddingBottom,
        },
      },
      large: {
        trigger: {
          paddingTop: vars.sizeLarge.enabled.trigger.paddingY,
          paddingBottom: vars.sizeLarge.enabled.trigger.paddingY,
        },
        prefix: {
          marginRight: vars.sizeLarge.enabled.prefix.paddingRight,
        },
        title: {
          fontSize: vars.sizeLarge.enabled.title.fontSize,
          lineHeight: vars.sizeLarge.enabled.title.lineHeight,
        },
        description: {
          fontSize: vars.sizeLarge.enabled.description.fontSize,
          lineHeight: vars.sizeLarge.enabled.description.lineHeight,
        },
        suffixIcon: {
          ...suffixIcon({
            size: vars.sizeLarge.enabled.suffixIcon.size,
            marginLeft: vars.sizeLarge.enabled.suffixIcon.paddingLeft,
          }),
        },
        contentInner: {
          paddingTop: vars.sizeLarge.enabled.content.paddingTop,
          paddingBottom: vars.sizeLarge.enabled.content.paddingBottom,
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
});

export default accordion;
