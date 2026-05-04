import spec from "@seed-design/rootage-artifacts/components/menu-item.json" with {
  type: "json",
};
import { menu as menuVars, menuItem as menuItemVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import {
  disabled,
  engaged,
  focus,
  focusVisible,
  not,
  open,
  pseudo,
  before,
  hidden,
} from "../utils/pseudo";
import { enterAnimation, exitAnimation } from "../utils/animation";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { prefixIcon, suffixIcon } from "../utils/icon";

// implement when submenu is needed
// const highlighted = "[data-highlighted]";

const MENU_TRANSFORM_ORIGIN = "--seed-menu-transform-origin";
const MENU_AVAILABLE_HEIGHT = "--seed-menu-available-height";
const MENU_REFERENCE_WIDTH = "--seed-menu-reference-width";

export const menu = defineSlotRecipe({
  name: "menu",
  slots: ["positioner", "content", "scrollArea", "group", "groupLabel"],
  base: {
    positioner: {
      // helps menu to be open at the top of the stackflow stack; it won't have any AppScreen on top of it
      "--menu-z-index": "99999",
      zIndex: "calc(var(--menu-z-index) + var(--z-index-offset, 0))",
      outline: "none",
    },
    content: {
      borderRadius: menuVars.base.enabled.root.cornerRadius,
      background: menuVars.base.enabled.root.color,
      boxShadow: menuVars.base.enabled.root.shadow,
      transformOrigin: `var(${MENU_TRANSFORM_ORIGIN})`,

      overflow: "hidden",

      [pseudo(open)]: {
        ...enterAnimation({
          scale: menuVars.base.enabled.root.enterScale,
          opacity: menuVars.base.enabled.root.enterOpacity,
          duration: menuVars.base.enabled.root.enterDuration,
          timingFunction: menuVars.base.enabled.root.enterTimingFunction,
        }),
      },

      [pseudo(not(open))]: {
        ...exitAnimation({
          scale: menuVars.base.enabled.root.exitScale,
          opacity: menuVars.base.enabled.root.exitOpacity,
          duration: menuVars.base.enabled.root.exitDuration,
          timingFunction: menuVars.base.enabled.root.exitTimingFunction,
        }),
      },

      [pseudo(hidden)]: {
        display: "none !important",
      },

      [pseudo(focus)]: {
        outline: "none",
      },
    },
    scrollArea: {
      overflowY: "auto",
      maxHeight: `min(${menuVars.base.enabled.root.maxHeight}, var(${MENU_AVAILABLE_HEIGHT}, ${menuVars.base.enabled.root.maxHeight}))`,
      boxSizing: "border-box",

      paddingTop: menuVars.base.enabled.root.paddingY,
      paddingBottom: menuVars.base.enabled.root.paddingY,

      display: "flex",
      flexDirection: "column",
      gap: menuVars.base.enabled.root.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",

      "& + &::before": {
        content: '""',
        display: "block",
        marginLeft: menuVars.base.enabled.divider.marginX,
        marginRight: menuVars.base.enabled.divider.marginX,
        marginBottom: menuVars.base.enabled.root.gap,
        height: menuVars.base.enabled.divider.height,
        flexShrink: 0,
        backgroundColor: menuVars.base.enabled.divider.color,
      },
    },
    groupLabel: {
      color: menuVars.base.enabled.groupLabel.color,
    },
  },
  variants: {
    size: {
      medium: {
        content: {
          width: `var(${MENU_REFERENCE_WIDTH}, ${menuVars.sizeMedium.enabled.root.width})`,
        },
        groupLabel: {
          paddingTop: menuVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingBottom: menuVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingLeft: menuVars.sizeMedium.enabled.groupLabel.paddingX,
          paddingRight: menuVars.sizeMedium.enabled.groupLabel.paddingX,

          fontSize: menuVars.sizeMedium.enabled.groupLabel.fontSize,
          lineHeight: menuVars.sizeMedium.enabled.groupLabel.lineHeight,
          fontWeight: menuVars.sizeMedium.enabled.groupLabel.fontWeight,
        },
      },
      small: {
        content: {
          width: `var(${MENU_REFERENCE_WIDTH}, ${menuVars.sizeSmall.enabled.root.width})`,
        },
        groupLabel: {
          paddingTop: menuVars.sizeSmall.enabled.groupLabel.paddingY,
          paddingBottom: menuVars.sizeSmall.enabled.groupLabel.paddingY,
          paddingLeft: menuVars.sizeSmall.enabled.groupLabel.paddingX,
          paddingRight: menuVars.sizeSmall.enabled.groupLabel.paddingX,

          fontSize: menuVars.sizeSmall.enabled.groupLabel.fontSize,
          lineHeight: menuVars.sizeSmall.enabled.groupLabel.lineHeight,
          fontWeight: menuVars.sizeSmall.enabled.groupLabel.fontWeight,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export const menuItem = defineSlotRecipe({
  name: "menu-item",
  slots: ["root", "body", "label", "description"],
  base: {
    root: {
      position: "relative",
      scrollMarginTop: menuVars.base.enabled.root.paddingY,
      scrollMarginBottom: menuVars.base.enabled.root.paddingY,

      display: "flex",
      alignItems: "center",

      outline: "none",
      cursor: "default",
      userSelect: "none",
      border: "none",
      fontFamily: "inherit",
      margin: 0,
      textAlign: "start",

      isolation: "isolate",

      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,

        transitionProperty: "background-color, left, right, border-radius",
        transitionDuration: menuItemVars.base.enabled.root.colorDuration,
        transitionTimingFunction: menuItemVars.base.enabled.root.colorTimingFunction,
      },

      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        right: menuItemVars.base.pressed.root.marginX,
        bottom: 0,
        left: menuItemVars.base.pressed.root.marginX,
        borderRadius: menuItemVars.base.pressed.root.cornerRadius,
        ...createFocusRingRestStyles({ position: "inside" }),
        transition: FOCUS_RING_TRANSITION,
      },

      [pseudo(not(disabled), engaged, before)]: {
        backgroundColor: menuItemVars.base.pressed.root.color,
        left: menuItemVars.base.pressed.root.marginX,
        right: menuItemVars.base.pressed.root.marginX,
        borderRadius: menuItemVars.base.pressed.root.cornerRadius,
      },

      [pseudo(focusVisible)]: {
        "&::after": createFocusRingStyles({ position: "inside" }),
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",

        ...prefixIcon({
          color: menuItemVars.base.disabled.prefixIcon.color,
        }),

        ...suffixIcon({
          color: menuItemVars.base.disabled.suffixIcon.color,
        }),
      },
    },
    body: {
      display: "flex",
      flexDirection: "column",

      flexGrow: 1,
      gap: menuItemVars.base.enabled.body.gap,
    },
    label: {
      fontWeight: menuItemVars.base.enabled.label.fontWeight,

      [pseudo(disabled)]: {
        color: menuItemVars.base.disabled.label.color,
      },
    },
    description: {
      fontWeight: menuItemVars.base.enabled.description.fontWeight,
      color: menuItemVars.base.enabled.description.color,

      [pseudo(disabled)]: {
        color: menuItemVars.base.disabled.description.color,
      },
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          paddingTop: menuItemVars.sizeMedium.enabled.root.paddingY,
          paddingBottom: menuItemVars.sizeMedium.enabled.root.paddingY,
          paddingLeft: menuItemVars.sizeMedium.enabled.root.paddingX,
          paddingRight: menuItemVars.sizeMedium.enabled.root.paddingX,

          gap: menuItemVars.sizeMedium.enabled.root.gap,

          ...prefixIcon({
            size: menuItemVars.sizeMedium.enabled.prefixIcon.size,
          }),

          ...suffixIcon({
            size: menuItemVars.sizeMedium.enabled.suffixIcon.size,
          }),
        },
        label: {
          fontSize: menuItemVars.sizeMedium.enabled.label.fontSize,
          lineHeight: menuItemVars.sizeMedium.enabled.label.lineHeight,
        },
        description: {
          fontSize: menuItemVars.sizeMedium.enabled.description.fontSize,
          lineHeight: menuItemVars.sizeMedium.enabled.description.lineHeight,
        },
      },
      small: {
        root: {
          paddingTop: menuItemVars.sizeSmall.enabled.root.paddingY,
          paddingBottom: menuItemVars.sizeSmall.enabled.root.paddingY,
          paddingLeft: menuItemVars.sizeSmall.enabled.root.paddingX,
          paddingRight: menuItemVars.sizeSmall.enabled.root.paddingX,

          gap: menuItemVars.sizeSmall.enabled.root.gap,

          ...prefixIcon({
            size: menuItemVars.sizeSmall.enabled.prefixIcon.size,
          }),

          ...suffixIcon({
            size: menuItemVars.sizeSmall.enabled.suffixIcon.size,
          }),
        },
        label: {
          fontSize: menuItemVars.sizeSmall.enabled.label.fontSize,
          lineHeight: menuItemVars.sizeSmall.enabled.label.lineHeight,
        },
        description: {
          fontSize: menuItemVars.sizeSmall.enabled.description.fontSize,
          lineHeight: menuItemVars.sizeSmall.enabled.description.lineHeight,
        },
      },
    },
    tone: {
      neutral: {
        root: {
          ...prefixIcon({
            color: menuItemVars.toneNeutral.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: menuItemVars.toneNeutral.enabled.suffixIcon.color,
          }),
        },
        label: {
          color: menuItemVars.toneNeutral.enabled.label.color,
        },
      },
      critical: {
        root: {
          ...prefixIcon({
            color: menuItemVars.toneCritical.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: menuItemVars.toneCritical.enabled.suffixIcon.color,
          }),
        },
        label: {
          color: menuItemVars.toneCritical.enabled.label.color,
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
    tone: "neutral",
  },
  metadata: {
    variants: {
      tone: spec.data.schema.variants.tone,
    },
  },
});
