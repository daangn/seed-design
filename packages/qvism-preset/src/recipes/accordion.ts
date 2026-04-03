import { accordion as vars } from "../vars/component";

import { defineSlotRecipe } from "../utils/define";
import { prefixIcon, suffixIcon } from "../utils/icon";
import { disabled, focusVisible, open, pseudo } from "../utils/pseudo";
import { createFocusRingRestStyles, createFocusRingStyles } from "../utils/focus-ring";

const accordion = defineSlotRecipe({
  name: "accordion",
  slots: [
    "root",
    "item",
    "trigger",
    "prefixIcon",
    "prefixAvatar",
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
    trigger: {
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

      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    prefixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
    },
    prefixAvatar: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
    },
    title: {
      flex: 1,
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

      paddingLeft: vars.base.enabled.content.paddingX,
      paddingRight: vars.base.enabled.content.paddingX,

      // when closing
      transition: `height ${vars.base.enabled.content.collapseHeightDuration} ${vars.base.enabled.content.collapseHeightTimingFunction}`,

      [pseudo(open)]: {
        height: "var(--collapsible-content-height)",

        // when opening
        transition: `height ${vars.base.enabled.content.expandHeightDuration} ${vars.base.enabled.content.expandHeightTimingFunction}`,
      },
    },
  },
  variants: {
    variant: {
      inline: {},
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
        prefixIcon: {
          ...prefixIcon({
            size: vars.sizeMedium.enabled.prefixIcon.size,
            marginRight: vars.sizeMedium.enabled.prefixIcon.paddingRight,
          }),
        },
        prefixAvatar: {
          ...prefixIcon({
            size: vars.sizeMedium.enabled.prefixAvatar.size,
            marginRight: vars.sizeMedium.enabled.prefixAvatar.paddingRight,
          }),
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
        content: {
          paddingTop: vars.sizeMedium.enabled.content.paddingTop,
          paddingBottom: vars.sizeMedium.enabled.content.paddingBottom,
        },
      },
      large: {
        trigger: {
          paddingTop: vars.sizeLarge.enabled.trigger.paddingY,
          paddingBottom: vars.sizeLarge.enabled.trigger.paddingY,
        },
        prefixIcon: {
          ...prefixIcon({
            size: vars.sizeLarge.enabled.prefixIcon.size,
            marginRight: vars.sizeLarge.enabled.prefixIcon.paddingRight,
          }),
        },
        prefixAvatar: {
          ...prefixIcon({
            size: vars.sizeLarge.enabled.prefixAvatar.size,
            marginRight: vars.sizeLarge.enabled.prefixAvatar.paddingRight,
          }),
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
        content: {
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
