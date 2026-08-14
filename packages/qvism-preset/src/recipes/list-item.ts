import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { engaged, disabled, focus, focusVisible, media, not, pseudo } from "../utils/pseudo";
import { listItem as vars } from "../vars/component";

const listItem = defineSlotRecipe({
  name: "list-item",
  slots: [
    "root",
    // TODO: consider renaming this slot to 'body' following rootage
    "content",
    "title",
    "detail",
    "prefix",
    "suffix",
  ],
  base: {
    root: {
      boxSizing: "border-box",
      border: "none",
      fontFamily: "inherit",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",

      position: "relative",
      display: "flex",
      width: "100%",
      isolation: "isolate",

      paddingInline: vars.base.rest.root.paddingX,
      paddingBlock: vars.base.rest.root.paddingY,

      "--seed-box-align-items": "center",
      alignItems: "var(--seed-box-align-items)",
    },
    prefix: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,

      "--seed-box-padding-right--responsive": vars.base.rest.prefix.paddingRight,
      paddingRight: "var(--seed-box-padding-right)",

      "--seed-focus-ring": "none",

      ...onlyIcon({
        color: vars.base.rest.prefixIcon.color,
        size: vars.base.rest.prefixIcon.size,
      }),

      [pseudo(disabled)]: {
        ...onlyIcon({
          color: vars.base.disabled.prefixIcon.color,
        }),
      },
    },
    suffix: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,

      "--seed-box-position": "initial",
      position: "var(--seed-box-position)",
      "--seed-box-gap--responsive": vars.base.rest.suffix.gap,
      gap: "var(--seed-box-gap)",

      "--seed-focus-ring": "none",

      fontSize: vars.base.rest.suffixText.fontSize,
      lineHeight: vars.base.rest.suffixText.lineHeight,
      fontWeight: vars.base.rest.suffixText.fontWeight,
      color: vars.base.rest.suffixText.color,

      ...onlyIcon({
        color: vars.base.rest.suffixIcon.color,
        size: vars.base.rest.suffixIcon.size,
      }),

      [pseudo(disabled)]: {
        ...onlyIcon({
          color: vars.base.disabled.suffixIcon.color,
        }),
      },
    },
    content: {
      display: "inline-flex",
      boxSizing: "border-box",
      textAlign: "start",

      flexDirection: "column",
      alignItems: "flex-start",
      flexGrow: 1,

      backgroundColor: "transparent",
      border: "none",
      fontFamily: "inherit",
      "--seed-box-gap--responsive": vars.base.rest.body.gap,
      gap: "var(--seed-box-gap)",
      "--seed-box-padding-right--responsive": vars.base.rest.body.paddingRight,
      padding: "0 var(--seed-box-padding-right) 0 0",

      textDecoration: "none",

      // this ensures the touch size of the content to be the size of the root
      "&::after": {
        content: "''",
        position: "absolute",
        inset: 0,
        ...createFocusRingRestStyles({ position: "inside" }),
        transition: FOCUS_RING_TRANSITION,
      },

      [pseudo(focus)]: {
        outline: "none",
      },

      [pseudo(focusVisible)]: {
        "&::after": createFocusRingStyles({ position: "inside" }),
      },

      // this is for showing the engaged state
      [pseudo("::before")]: {
        content: "''",
        position: "absolute",
        inset: 0,
        zIndex: -1,

        transitionProperty: "background-color, inset-inline, border-radius",
        transitionDuration: vars.base.rest.root.colorDuration,
        transitionTimingFunction: vars.base.rest.root.colorTimingFunction,
      },

      // engaged(:active/:hover) custom selector is only attached when the item is a button or an anchor
      [pseudo(":is(button, a)", not(disabled), engaged, "::before")]: {
        backgroundColor: vars.base.pressed.root.color,

        insetInline: vars.base.pressed.root.marginX,

        borderRadius: `var(--list-item-border-radius, ${vars.base.pressed.root.cornerRadius})`,
      },

      // otherwise, see if it has [data-active] or [data-hover]. e.g. ListCheckItem
      // this restriction prevents noninteractive(static/presentation/decorative) list items from having an active style
      // split by device capability just like engaged does
      [media.isHoverableInputDevice]: {
        [pseudo(not(disabled), "[data-hover]", "::before")]: {
          backgroundColor: vars.base.pressed.root.color,

          insetInline: vars.base.pressed.root.marginX,

          borderRadius: `var(--list-item-border-radius, ${vars.base.pressed.root.cornerRadius})`,
        },
      },
      [media.isNotHoverableInputDevice]: {
        [pseudo(not(disabled), "[data-active]", "::before")]: {
          backgroundColor: vars.base.pressed.root.color,

          insetInline: vars.base.pressed.root.marginX,

          borderRadius: `var(--list-item-border-radius, ${vars.base.pressed.root.cornerRadius})`,
        },
      },
    },
    title: {
      flexShrink: 0,

      fontSize: vars.base.rest.title.fontSize,
      lineHeight: vars.base.rest.title.lineHeight,
      fontWeight: vars.base.rest.title.fontWeight,
      color: vars.base.rest.title.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.title.color,
      },
    },
    detail: {
      fontSize: vars.base.rest.detail.fontSize,
      lineHeight: vars.base.rest.detail.lineHeight,
      fontWeight: vars.base.rest.detail.fontWeight,
      color: vars.base.rest.detail.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.detail.color,
      },
    },
  },
  variants: {
    highlighted: {
      false: {},
      true: {
        content: {
          // we define highlighted style (not engaged) in content::before rather than root
          // because it should transition into engaged style smoothly
          [pseudo("::before")]: {
            backgroundColor: vars.base.highlighted.root.color,
          },

          [pseudo(":is(button, a)", not(disabled), engaged, "::before")]: {
            backgroundColor: vars.base.pressedHighlighted.root.color,
          },

          [media.isHoverableInputDevice]: {
            [pseudo(not(disabled), "[data-hover]", "::before")]: {
              backgroundColor: vars.base.pressedHighlighted.root.color,
            },
          },
          [media.isNotHoverableInputDevice]: {
            [pseudo(not(disabled), "[data-active]", "::before")]: {
              backgroundColor: vars.base.pressedHighlighted.root.color,
            },
          },
        },
      },
    },
  },
  defaultVariants: {
    highlighted: false,
  },
});

export default listItem;
