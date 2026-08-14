import menuSpec from "@seed-design/rootage-artifacts/components/menu";
import menuItemSpec from "@seed-design/rootage-artifacts/components/menu-item";
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
import { breakpoints } from "../utils/breakpoint";

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
      borderRadius: menuVars.base.rest.root.cornerRadius,
      background: menuVars.base.rest.root.color,
      boxShadow: menuVars.base.rest.root.shadow,
      transformOrigin: `var(${MENU_TRANSFORM_ORIGIN})`,

      overflow: "hidden",

      [pseudo(open)]: {
        ...enterAnimation({
          scale: menuVars.base.rest.root.enterScale,
          opacity: menuVars.base.rest.root.enterOpacity,
          duration: menuVars.base.rest.root.enterDuration,
          timingFunction: menuVars.base.rest.root.enterTimingFunction,
        }),
      },

      [pseudo(not(open))]: {
        ...exitAnimation({
          scale: menuVars.base.rest.root.exitScale,
          opacity: menuVars.base.rest.root.exitOpacity,
          duration: menuVars.base.rest.root.exitDuration,
          timingFunction: menuVars.base.rest.root.exitTimingFunction,
        }),
      },

      // Skip the enter/exit animation while the `NavigationMenuRoot` delay group
      // is switching between flyouts, so the swap reads as instant.
      [pseudo("[data-instant]")]: {
        animationDuration: "0s",
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
      maxHeight: `min(${menuVars.base.rest.root.maxHeight}, var(${MENU_AVAILABLE_HEIGHT}, ${menuVars.base.rest.root.maxHeight}))`,
      boxSizing: "border-box",

      paddingBlock: menuVars.base.rest.root.paddingY,

      display: "flex",
      flexDirection: "column",
      gap: menuVars.base.rest.root.gap,
    },
    group: {
      display: "flex",
      flexDirection: "column",

      "& + &::before": {
        content: '""',
        display: "block",
        marginInline: menuVars.base.rest.divider.marginX,
        marginBottom: menuVars.base.rest.root.gap,
        height: menuVars.base.rest.divider.height,
        flexShrink: 0,
        backgroundColor: menuVars.base.rest.divider.color,
      },
    },
    groupLabel: {
      color: menuVars.base.rest.groupLabel.color,
    },
  },
  variants: {
    size: {
      medium: {
        content: {
          width: `var(${MENU_REFERENCE_WIDTH}, ${menuVars.sizeMedium.rest.root.width})`,
        },
        groupLabel: {
          paddingBlock: menuVars.sizeMedium.rest.groupLabel.paddingY,
          paddingInline: menuVars.sizeMedium.rest.groupLabel.paddingX,

          fontSize: menuVars.sizeMedium.rest.groupLabel.fontSize,
          lineHeight: menuVars.sizeMedium.rest.groupLabel.lineHeight,
          fontWeight: menuVars.sizeMedium.rest.groupLabel.fontWeight,
        },
      },
      small: {
        content: {
          width: `var(${MENU_REFERENCE_WIDTH}, ${menuVars.sizeSmall.rest.root.width})`,
        },
        groupLabel: {
          paddingBlock: menuVars.sizeSmall.rest.groupLabel.paddingY,
          paddingInline: menuVars.sizeSmall.rest.groupLabel.paddingX,

          fontSize: menuVars.sizeSmall.rest.groupLabel.fontSize,
          lineHeight: menuVars.sizeSmall.rest.groupLabel.lineHeight,
          fontWeight: menuVars.sizeSmall.rest.groupLabel.fontWeight,
        },
      },
      responsive: {
        content: {
          width: `var(${MENU_REFERENCE_WIDTH}, ${menuVars.sizeMedium.rest.root.width})`,

          [breakpoints.up("lg")]: {
            width: `var(${MENU_REFERENCE_WIDTH}, ${menuVars.sizeSmall.rest.root.width})`,
          },
        },
        groupLabel: {
          paddingBlock: menuVars.sizeMedium.rest.groupLabel.paddingY,
          paddingInline: menuVars.sizeMedium.rest.groupLabel.paddingX,

          fontSize: menuVars.sizeMedium.rest.groupLabel.fontSize,
          lineHeight: menuVars.sizeMedium.rest.groupLabel.lineHeight,
          fontWeight: menuVars.sizeMedium.rest.groupLabel.fontWeight,

          [breakpoints.up("lg")]: {
            paddingBlock: menuVars.sizeSmall.rest.groupLabel.paddingY,
            paddingInline: menuVars.sizeSmall.rest.groupLabel.paddingX,

            fontSize: menuVars.sizeSmall.rest.groupLabel.fontSize,
            lineHeight: menuVars.sizeSmall.rest.groupLabel.lineHeight,
            fontWeight: menuVars.sizeSmall.rest.groupLabel.fontWeight,
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
  metadata: {
    variants: {
      size: {
        ...menuSpec.data.schema.variants.size,
        values: {
          ...menuSpec.data.schema.variants.size.values,
          responsive: {
            description:
              "뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `medium`, `lg` 이상에서는 `small`로 적용됩니다.",
          },
        },
      },
    },
  },
});

export const menuItem = defineSlotRecipe({
  name: "menu-item",
  slots: ["root", "body", "label", "description"],
  base: {
    root: {
      position: "relative",
      scrollMarginTop: menuVars.base.rest.root.paddingY,
      scrollMarginBottom: menuVars.base.rest.root.paddingY,

      display: "flex",
      alignItems: "center",

      outline: "none",
      cursor: "default",
      userSelect: "none",
      background: "none",
      border: "none",
      fontFamily: "inherit",
      color: "inherit",
      textDecoration: "none",
      margin: 0,
      textAlign: "start",

      isolation: "isolate",

      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        zIndex: -1,

        transitionProperty: "background-color, inset-inline, border-radius",
        transitionDuration: menuItemVars.base.rest.root.colorDuration,
        transitionTimingFunction: menuItemVars.base.rest.root.colorTimingFunction,
      },

      "&::after": {
        content: '""',
        position: "absolute",
        insetBlock: 0,
        insetInline: menuItemVars.base.pressed.root.marginX,
        borderRadius: menuItemVars.base.pressed.root.cornerRadius,
        ...createFocusRingRestStyles({ position: "inside" }),
        transition: FOCUS_RING_TRANSITION,
      },

      [pseudo(not(disabled), engaged, before)]: {
        backgroundColor: menuItemVars.base.pressed.root.color,
        insetInline: menuItemVars.base.pressed.root.marginX,
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
      gap: menuItemVars.base.rest.body.gap,
    },
    label: {
      fontWeight: menuItemVars.base.rest.label.fontWeight,

      [pseudo(disabled)]: {
        color: menuItemVars.base.disabled.label.color,
      },
    },
    description: {
      fontWeight: menuItemVars.base.rest.description.fontWeight,
      color: menuItemVars.base.rest.description.color,

      [pseudo(disabled)]: {
        color: menuItemVars.base.disabled.description.color,
      },
    },
  },
  variants: {
    size: {
      medium: {
        root: {
          paddingBlock: menuItemVars.sizeMedium.rest.root.paddingY,
          paddingInline: menuItemVars.sizeMedium.rest.root.paddingX,

          gap: menuItemVars.sizeMedium.rest.root.gap,

          ...prefixIcon({
            size: menuItemVars.sizeMedium.rest.prefixIcon.size,
          }),

          ...suffixIcon({
            size: menuItemVars.sizeMedium.rest.suffixIcon.size,
          }),
        },
        label: {
          fontSize: menuItemVars.sizeMedium.rest.label.fontSize,
          lineHeight: menuItemVars.sizeMedium.rest.label.lineHeight,
        },
        description: {
          fontSize: menuItemVars.sizeMedium.rest.description.fontSize,
          lineHeight: menuItemVars.sizeMedium.rest.description.lineHeight,
        },
      },
      small: {
        root: {
          paddingBlock: menuItemVars.sizeSmall.rest.root.paddingY,
          paddingInline: menuItemVars.sizeSmall.rest.root.paddingX,

          gap: menuItemVars.sizeSmall.rest.root.gap,

          ...prefixIcon({
            size: menuItemVars.sizeSmall.rest.prefixIcon.size,
          }),

          ...suffixIcon({
            size: menuItemVars.sizeSmall.rest.suffixIcon.size,
          }),
        },
        label: {
          fontSize: menuItemVars.sizeSmall.rest.label.fontSize,
          lineHeight: menuItemVars.sizeSmall.rest.label.lineHeight,
        },
        description: {
          fontSize: menuItemVars.sizeSmall.rest.description.fontSize,
          lineHeight: menuItemVars.sizeSmall.rest.description.lineHeight,
        },
      },
      responsive: {
        root: {
          paddingBlock: menuItemVars.sizeMedium.rest.root.paddingY,
          paddingInline: menuItemVars.sizeMedium.rest.root.paddingX,

          gap: menuItemVars.sizeMedium.rest.root.gap,

          ...prefixIcon({
            size: menuItemVars.sizeMedium.rest.prefixIcon.size,
          }),

          ...suffixIcon({
            size: menuItemVars.sizeMedium.rest.suffixIcon.size,
          }),

          [breakpoints.up("lg")]: {
            paddingBlock: menuItemVars.sizeSmall.rest.root.paddingY,
            paddingInline: menuItemVars.sizeSmall.rest.root.paddingX,

            gap: menuItemVars.sizeSmall.rest.root.gap,

            ...prefixIcon({
              size: menuItemVars.sizeSmall.rest.prefixIcon.size,
            }),

            ...suffixIcon({
              size: menuItemVars.sizeSmall.rest.suffixIcon.size,
            }),
          },
        },
        label: {
          fontSize: menuItemVars.sizeMedium.rest.label.fontSize,
          lineHeight: menuItemVars.sizeMedium.rest.label.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: menuItemVars.sizeSmall.rest.label.fontSize,
            lineHeight: menuItemVars.sizeSmall.rest.label.lineHeight,
          },
        },
        description: {
          fontSize: menuItemVars.sizeMedium.rest.description.fontSize,
          lineHeight: menuItemVars.sizeMedium.rest.description.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: menuItemVars.sizeSmall.rest.description.fontSize,
            lineHeight: menuItemVars.sizeSmall.rest.description.lineHeight,
          },
        },
      },
    },
    tone: {
      neutral: {
        root: {
          ...prefixIcon({
            color: menuItemVars.toneNeutral.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: menuItemVars.toneNeutral.rest.suffixIcon.color,
          }),
        },
        label: {
          color: menuItemVars.toneNeutral.rest.label.color,
        },
      },
      critical: {
        root: {
          ...prefixIcon({
            color: menuItemVars.toneCritical.rest.prefixIcon.color,
          }),
          ...suffixIcon({
            color: menuItemVars.toneCritical.rest.suffixIcon.color,
          }),
        },
        label: {
          color: menuItemVars.toneCritical.rest.label.color,
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
      tone: menuItemSpec.data.schema.variants.tone,
      size: {
        ...menuItemSpec.data.schema.variants.size,
        values: {
          ...menuItemSpec.data.schema.variants.size.values,
          responsive: {
            description:
              "뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `lg` 미만에서는 `medium`, `lg` 이상에서는 `small`로 적용됩니다.",
          },
        },
      },
    },
  },
});
