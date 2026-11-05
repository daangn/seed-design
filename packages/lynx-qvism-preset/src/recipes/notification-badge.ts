import spec from "@seed-design/rootage-artifacts/components/notification-badge";

import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { notificationBadge as vars } from "../vars/component";

export const notificationBadgePositioner = defineRecipe({
  name: "notification-badge-positioner",
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "max-content",
  },
  variants: {
    attach: {
      icon: {
        transform: "translate(100%, -100%)",
      },
      text: {
        transform: "translate(100%, 0%)",
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

export const notificationBadge = defineSlotRecipe({
  name: "notification-badge",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      backgroundColor: vars.base.enabled.root.color,
    },
    label: {
      textAlign: "center",
      color: vars.base.enabled.label.color,
      whiteSpace: "nowrap",
      flexShrink: 0,
    },
  },
  variants: {
    size: {
      small: {
        root: {
          width: vars.sizeSmall.enabled.root.size,
          height: vars.sizeSmall.enabled.root.size,
          borderRadius: vars.sizeSmall.enabled.root.cornerRadius,
        },
      },
      large: {
        root: {
          width: "max-content",
          minWidth: vars.sizeLarge.enabled.root.minWidth,
          minHeight: vars.sizeLarge.enabled.root.minHeight,
          paddingLeft: vars.sizeLarge.enabled.root.paddingX,
          paddingRight: vars.sizeLarge.enabled.root.paddingX,
          paddingTop: vars.sizeLarge.enabled.root.paddingY,
          paddingBottom: vars.sizeLarge.enabled.root.paddingY,
          borderRadius: vars.sizeLarge.enabled.root.cornerRadius,
        },
        label: {
          fontSize: vars.sizeLarge.enabled.label.fontSize,
          lineHeight: vars.sizeLarge.enabled.label.lineHeight,
          fontWeight: vars.sizeLarge.enabled.label.fontWeight,
        },
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
