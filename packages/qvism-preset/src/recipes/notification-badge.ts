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

        bottom: "auto",
        left: "auto",
      },
      text: {
        translate: "100% 0%",

        bottom: "auto",
        left: "auto",
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
        top: vars.sizeLarge.enabled.root.iconAttachedInsetTop,
        right: vars.sizeLarge.enabled.root.iconAttachedInsetEnd,
      },
    },
    {
      size: "small",
      attach: "icon",
      css: {
        top: vars.sizeSmall.enabled.root.iconAttachedInsetTop,
        right: vars.sizeSmall.enabled.root.iconAttachedInsetEnd,
      },
    },
    {
      size: "large",
      attach: "text",
      css: {
        right: `calc(-1 * ${vars.sizeLarge.enabled.root.textAttachedGap})`,
      },
    },
    {
      size: "small",
      attach: "text",
      css: {
        right: `calc(-1 * ${vars.sizeSmall.enabled.root.textAttachedGap})`,
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

        paddingLeft: vars.sizeLarge.enabled.root.paddingX,
        paddingRight: vars.sizeLarge.enabled.root.paddingX,
        paddingTop: vars.sizeLarge.enabled.root.paddingY,
        paddingBottom: vars.sizeLarge.enabled.root.paddingY,

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
