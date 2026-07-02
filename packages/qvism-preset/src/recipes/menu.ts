import menuSpec from "@seed-design/rootage-artifacts/components/menu.json" with { type: "json" };
import menuItemSpec from "@seed-design/rootage-artifacts/components/menu-item.json" with {
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
      maxHeight: `min(${menuVars.base.enabled.root.maxHeight}, var(${MENU_AVAILABLE_HEIGHT}, ${menuVars.base.enabled.root.maxHeight}))`,
      boxSizing: "border-box",

      paddingBlock: menuVars.base.enabled.root.paddingY,

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
        marginInline: menuVars.base.enabled.divider.marginX,
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
          paddingBlock: menuVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingInline: menuVars.sizeMedium.enabled.groupLabel.paddingX,

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
          paddingBlock: menuVars.sizeSmall.enabled.groupLabel.paddingY,
          paddingInline: menuVars.sizeSmall.enabled.groupLabel.paddingX,

          fontSize: menuVars.sizeSmall.enabled.groupLabel.fontSize,
          lineHeight: menuVars.sizeSmall.enabled.groupLabel.lineHeight,
          fontWeight: menuVars.sizeSmall.enabled.groupLabel.fontWeight,
        },
      },
      responsive: {
        content: {
          width: `var(${MENU_REFERENCE_WIDTH}, ${menuVars.sizeMedium.enabled.root.width})`,

          [breakpoints.up("lg")]: {
            width: `var(${MENU_REFERENCE_WIDTH}, ${menuVars.sizeSmall.enabled.root.width})`,
          },
        },
        groupLabel: {
          paddingBlock: menuVars.sizeMedium.enabled.groupLabel.paddingY,
          paddingInline: menuVars.sizeMedium.enabled.groupLabel.paddingX,

          fontSize: menuVars.sizeMedium.enabled.groupLabel.fontSize,
          lineHeight: menuVars.sizeMedium.enabled.groupLabel.lineHeight,
          fontWeight: menuVars.sizeMedium.enabled.groupLabel.fontWeight,

          [breakpoints.up("lg")]: {
            paddingBlock: menuVars.sizeSmall.enabled.groupLabel.paddingY,
            paddingInline: menuVars.sizeSmall.enabled.groupLabel.paddingX,

            fontSize: menuVars.sizeSmall.enabled.groupLabel.fontSize,
            lineHeight: menuVars.sizeSmall.enabled.groupLabel.lineHeight,
            fontWeight: menuVars.sizeSmall.enabled.groupLabel.fontWeight,
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
      scrollMarginTop: menuVars.base.enabled.root.paddingY,
      scrollMarginBottom: menuVars.base.enabled.root.paddingY,

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
        transitionDuration: menuItemVars.base.enabled.root.colorDuration,
        transitionTimingFunction: menuItemVars.base.enabled.root.colorTimingFunction,
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
          paddingBlock: menuItemVars.sizeMedium.enabled.root.paddingY,
          paddingInline: menuItemVars.sizeMedium.enabled.root.paddingX,

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
          paddingBlock: menuItemVars.sizeSmall.enabled.root.paddingY,
          paddingInline: menuItemVars.sizeSmall.enabled.root.paddingX,

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
      responsive: {
        root: {
          paddingBlock: menuItemVars.sizeMedium.enabled.root.paddingY,
          paddingInline: menuItemVars.sizeMedium.enabled.root.paddingX,

          gap: menuItemVars.sizeMedium.enabled.root.gap,

          ...prefixIcon({
            size: menuItemVars.sizeMedium.enabled.prefixIcon.size,
          }),

          ...suffixIcon({
            size: menuItemVars.sizeMedium.enabled.suffixIcon.size,
          }),

          [breakpoints.up("lg")]: {
            paddingBlock: menuItemVars.sizeSmall.enabled.root.paddingY,
            paddingInline: menuItemVars.sizeSmall.enabled.root.paddingX,

            gap: menuItemVars.sizeSmall.enabled.root.gap,

            ...prefixIcon({
              size: menuItemVars.sizeSmall.enabled.prefixIcon.size,
            }),

            ...suffixIcon({
              size: menuItemVars.sizeSmall.enabled.suffixIcon.size,
            }),
          },
        },
        label: {
          fontSize: menuItemVars.sizeMedium.enabled.label.fontSize,
          lineHeight: menuItemVars.sizeMedium.enabled.label.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: menuItemVars.sizeSmall.enabled.label.fontSize,
            lineHeight: menuItemVars.sizeSmall.enabled.label.lineHeight,
          },
        },
        description: {
          fontSize: menuItemVars.sizeMedium.enabled.description.fontSize,
          lineHeight: menuItemVars.sizeMedium.enabled.description.lineHeight,

          [breakpoints.up("lg")]: {
            fontSize: menuItemVars.sizeSmall.enabled.description.fontSize,
            lineHeight: menuItemVars.sizeSmall.enabled.description.lineHeight,
          },
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
