import { defineRecipe } from "../utils/define";
import { notificationBadge as vars } from "../vars/component";
import spec from "@seed-design/rootage-artifacts/components/notification-badge";

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
        top: vars.sizeLarge.rest.root.iconAttachedInsetTop,
        right: vars.sizeLarge.rest.root.iconAttachedInsetEnd,
      },
    },
    {
      size: "small",
      attach: "icon",
      css: {
        top: vars.sizeSmall.rest.root.iconAttachedInsetTop,
        right: vars.sizeSmall.rest.root.iconAttachedInsetEnd,
      },
    },
    {
      size: "large",
      attach: "text",
      css: {
        right: `calc(-1 * ${vars.sizeLarge.rest.root.textAttachedGap})`,
      },
    },
    {
      size: "small",
      attach: "text",
      css: {
        right: `calc(-1 * ${vars.sizeSmall.rest.root.textAttachedGap})`,
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

    backgroundColor: vars.base.rest.root.color,
    color: vars.base.rest.label.color,
  },
  variants: {
    size: {
      small: {
        width: vars.sizeSmall.rest.root.size,
        height: vars.sizeSmall.rest.root.size,
        borderRadius: vars.sizeSmall.rest.root.cornerRadius,
      },
      large: {
        minWidth: vars.sizeLarge.rest.root.minWidth,
        minHeight: vars.sizeLarge.rest.root.minHeight,
        borderRadius: vars.sizeLarge.rest.root.cornerRadius,

        paddingInline: vars.sizeLarge.rest.root.paddingX,
        paddingBlock: vars.sizeLarge.rest.root.paddingY,

        fontSize: vars.sizeLarge.rest.label.fontSize,
        lineHeight: vars.sizeLarge.rest.label.lineHeight,
        fontWeight: vars.sizeLarge.rest.label.fontWeight,
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});
