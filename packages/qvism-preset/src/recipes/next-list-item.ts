import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon } from "../utils/icon";
import { disabled, focus, focusVisible, media, not, pseudo } from "../utils/pseudo";
import { listItem as vars } from "../vars/component";

// NextList shares the list-item rootage tokens (no duplicate rootage spec).
//
// Differences from the `list-item` recipe:
//  - Two independent layers per rootage spec: the background layer (root::before,
//    shrinks horizontally by marginX) and the layout layer (`layout` slot, shrinks
//    via `transform: scale`). They must not be the same element, so the pressed
//    background moves from the `content` slot to `root`, and a new `layout` slot
//    wraps prefix/content/suffix.
//  - Pressable detection is unified on `[data-active]`/`[data-hover]`. The library
//    forwards these to root + layout for every variant (headless context for
//    checkbox/radio/switch, a press context for button/anchor), so the old
//    `:is(button, a)` + `:active` branch is no longer needed. Native `:active` is
//    deliberately avoided: it would also match a plain (non-pressable) item.
//  - prefers-reduced-motion is handled at the token layer (contentScale resolves to
//    1), so there is no media query here.
const nextListItem = defineSlotRecipe({
  name: "next-list-item",
  slots: ["root", "layout", "content", "title", "detail", "prefix", "suffix"],
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

      paddingLeft: vars.base.enabled.root.paddingX,
      paddingRight: vars.base.enabled.root.paddingX,
      paddingTop: vars.base.enabled.root.paddingY,
      paddingBottom: vars.base.enabled.root.paddingY,

      // background layer — covers the whole padding box, inset horizontally by marginX
      // when pressed. lives on root so it does not scale with the layout layer.
      [pseudo("::before")]: {
        content: "''",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,

        transitionProperty: "background-color, left, right, border-radius",
        transitionDuration: vars.base.enabled.root.colorDuration,
        transitionTimingFunction: vars.base.enabled.root.colorTimingFunction,
      },

      // hoverable devices show the engaged background on hover, others on active.
      // data-active/data-hover are forwarded to root for every pressable variant.
      [media.isHoverableInputDevice]: {
        [pseudo(not(disabled), "[data-hover]", "::before")]: {
          backgroundColor: vars.base.pressed.root.color,

          left: vars.base.pressed.root.marginX,
          right: vars.base.pressed.root.marginX,

          borderRadius: `var(--list-item-border-radius, ${vars.base.pressed.root.cornerRadius})`,
        },
      },
      [media.isNotHoverableInputDevice]: {
        [pseudo(not(disabled), "[data-active]", "::before")]: {
          backgroundColor: vars.base.pressed.root.color,

          left: vars.base.pressed.root.marginX,
          right: vars.base.pressed.root.marginX,

          borderRadius: `var(--list-item-border-radius, ${vars.base.pressed.root.cornerRadius})`,
        },
      },
    },
    // layout layer — flex row holding prefix/content/suffix; scales as a whole on press.
    layout: {
      display: "flex",
      width: "100%",
      minWidth: 0,

      "--seed-box-align-items": "center",
      alignItems: "var(--seed-box-align-items)",

      transitionProperty: "transform",
      transitionDuration: vars.base.enabled.root.contentScaleDuration,
      transitionTimingFunction: vars.base.enabled.root.contentScaleTimingFunction,

      [pseudo(not(disabled), "[data-active]")]: {
        transform: `scale(${vars.base.pressed.root.contentScale})`,
      },
    },
    prefix: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,

      "--seed-box-padding-right--responsive": vars.base.enabled.prefix.paddingRight,
      paddingRight: "var(--seed-box-padding-right)",

      "--seed-focus-ring": "none",

      ...onlyIcon({
        color: vars.base.enabled.prefixIcon.color,
        size: vars.base.enabled.prefixIcon.size,
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
      "--seed-box-gap--responsive": vars.base.enabled.suffix.gap,
      gap: "var(--seed-box-gap)",

      "--seed-focus-ring": "none",

      fontSize: vars.base.enabled.suffixText.fontSize,
      lineHeight: vars.base.enabled.suffixText.lineHeight,
      fontWeight: vars.base.enabled.suffixText.fontWeight,
      color: vars.base.enabled.suffixText.color,

      ...onlyIcon({
        color: vars.base.enabled.suffixIcon.color,
        size: vars.base.enabled.suffixIcon.size,
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
      minWidth: 0,

      backgroundColor: "transparent",
      border: "none",
      fontFamily: "inherit",
      "--seed-box-gap--responsive": vars.base.enabled.body.gap,
      gap: "var(--seed-box-gap)",
      "--seed-box-padding-right--responsive": vars.base.enabled.body.paddingRight,
      padding: "0 var(--seed-box-padding-right) 0 0",

      textDecoration: "none",

      // this ensures the touch size of the content to be the size of the row
      "&::after": {
        content: "''",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...createFocusRingRestStyles({ position: "inside" }),
        transition: FOCUS_RING_TRANSITION,
      },

      [pseudo(focus)]: {
        outline: "none",
      },

      [pseudo(focusVisible)]: {
        "&::after": createFocusRingStyles({ position: "inside" }),
      },
    },
    title: {
      flexShrink: 0,

      fontSize: vars.base.enabled.title.fontSize,
      lineHeight: vars.base.enabled.title.lineHeight,
      fontWeight: vars.base.enabled.title.fontWeight,
      color: vars.base.enabled.title.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.title.color,
      },
    },
    detail: {
      fontSize: vars.base.enabled.detail.fontSize,
      lineHeight: vars.base.enabled.detail.lineHeight,
      fontWeight: vars.base.enabled.detail.fontWeight,
      color: vars.base.enabled.detail.color,

      [pseudo(disabled)]: {
        color: vars.base.disabled.detail.color,
      },
    },
  },
  variants: {
    highlighted: {
      false: {},
      true: {
        root: {
          // base highlight lives on root::before so it transitions into the engaged
          // (pressed) highlight smoothly, same as the list-item recipe.
          [pseudo("::before")]: {
            backgroundColor: vars.base.highlighted.root.color,
          },

          [media.isHoverableInputDevice]: {
            [pseudo(not(disabled), "[data-hover]", "::before")]: {
              backgroundColor: vars.base.highlightedPressed.root.color,
            },
          },
          [media.isNotHoverableInputDevice]: {
            [pseudo(not(disabled), "[data-active]", "::before")]: {
              backgroundColor: vars.base.highlightedPressed.root.color,
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

export default nextListItem;
