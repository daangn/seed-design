import { defineRecipe } from "../utils/define";
import { notificationBadge as vars } from "../vars/component";

export const notificationBadgePositioner = defineRecipe({
  name: "notification-badge-positioner",
  base: {
    display: "inline-flex",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  variants: {
    attach: {
      icon: {
        translate: "100% -100%",
        insetBlockEnd: "auto",
        insetInlineStart: "auto",
      },
      text: {
        translate: "100% 0%",
        insetBlockEnd: "auto",
        insetInlineStart: "auto",
      },
    },
    size: {
      small: {},
      large: {},
    },
  },
  compoundVariants: [
    {
      size: "large",
      attach: "icon",
      css: {
        insetBlockStart: vars.sizeLarge.enabled.root.iconAttachedInsetTop,
        insetInlineEnd: vars.sizeLarge.enabled.root.iconAttachedInsetEnd,
      },
    },
    {
      size: "small",
      attach: "icon",
      css: {
        insetBlockStart: vars.sizeSmall.enabled.root.iconAttachedInsetTop,
        insetInlineEnd: vars.sizeSmall.enabled.root.iconAttachedInsetEnd,
      },
    },
    {
      size: "large",
      attach: "text",
      css: {
        insetInlineEnd: `calc(-1 * ${vars.sizeLarge.enabled.root.textAttachedGap})`,
      },
    },
    {
      size: "small",
      attach: "text",
      css: {
        insetInlineEnd: `calc(-1 * ${vars.sizeSmall.enabled.root.textAttachedGap})`,
      },
    },
  ],
  defaultVariants: {
    size: "large",
    attach: "icon",
  },
});

export const notificationBadge = defineRecipe({
  name: "notification-badge",
  base: {
    display: "inline-flex",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",

    textTransform: "none",
    textAlign: "start",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textDecoration: "none",

    backgroundColor: vars.base.enabled.root.color,
    color: vars.base.enabled.label.color,
  },
  variants: {
    size: {
      small: {
        width: vars.sizeSmall.enabled.root.size,
        height: vars.sizeSmall.enabled.root.size,
        borderRadius: vars.sizeSmall.enabled.root.cornerRadius,
      },
      large: {
        minHeight: vars.sizeLarge.enabled.root.minHeight,
        borderRadius: vars.sizeLarge.enabled.root.cornerRadius,

        paddingInline: vars.sizeLarge.enabled.root.paddingX,
        paddingBlock: vars.sizeLarge.enabled.root.paddingY,

        fontSize: vars.sizeLarge.enabled.label.fontSize,
        lineHeight: vars.sizeLarge.enabled.label.lineHeight,
        fontWeight: vars.sizeLarge.enabled.label.fontWeight,
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
});
