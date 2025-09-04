import { defineSlotRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { active, disabled, not, pseudo } from "../utils/pseudo";
import { listItem as vars } from "../vars/component";

const listItem = defineSlotRecipe({
  name: "list-item",
  slots: ["root", "content", "title", "detail", "prefix", "suffix"],
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
      zIndex: 0,

      paddingInline: vars.base.enabled.root.paddingX,
      paddingBlock: vars.base.enabled.root.paddingY,

      "--seed-box-align-items": "center",
      alignItems: "var(--seed-box-align-items)",
    },
    prefix: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,

      "--seed-box-padding-right": vars.base.enabled.prefix.paddingRight,
      paddingRight: "var(--seed-box-padding-right)",

      ...onlyIcon({
        color: vars.base.enabled.prefixIcon.color,
        size: vars.base.enabled.prefixIcon.size,
        // marginTop: `calc(${prefixIconVerticalAdjustMargin})`,
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
      "--seed-box-gap": vars.base.enabled.suffix.gap,
      gap: "var(--seed-box-gap)",

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

      "--seed-box-gap": vars.base.enabled.content.gap,
      gap: "var(--seed-box-gap)",
      "--seed-box-padding-right": vars.base.enabled.content.paddingRight,
      paddingRight: "var(--seed-box-padding-right)",

      // this ensures the touch size of the content to be the size of the root
      "&:after": {
        content: "''",
        position: "absolute",
        inset: 0,
      },

      // this is for showing the active state
      [pseudo(":before")]: {
        content: "''",
        position: "absolute",
        inset: 0,
        zIndex: -1,
        transitionProperty: "background-color",
        transitionDuration: vars.base.enabled.root.colorDuration,
        transitionTimingFunction: vars.base.enabled.root.colorTimingFunction,
      },

      // :active pseudoselector is only allowed when the item is a button or an anchor
      [pseudo(":is(button, a)", not(disabled), active, ":before")]: {
        backgroundColor: vars.base.pressed.root.color,
      },

      // otherwise, see if it has [data-active]. e.g. ListItemCheck
      // this restriction prevents noninteractive(static/presentation/decorative) list items from having an active style
      [pseudo(not(disabled), "[data-active]", ":before")]: {
        backgroundColor: vars.base.pressed.root.color,
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
          backgroundColor: vars.base.highlighted.root.color,
        },
      },
    },
  },
  defaultVariants: {
    highlighted: false,
  },
});

export default listItem;
