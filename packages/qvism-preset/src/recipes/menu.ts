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

      // bottom scroll fog: fades content into padding at the bottom
      maskImage: `linear-gradient(to top, transparent 0, black ${menuVars.base.enabled.root.paddingY})`,
      WebkitMaskImage: `linear-gradient(to top, transparent 0, black ${menuVars.base.enabled.root.paddingY})`,
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
      cursor: "default", // 결정, 다른 practice 참고
      userSelect: "none", // 결정
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
        left: menuItemVars.base.enabled.root.highlightInset,
        right: menuItemVars.base.enabled.root.highlightInset,
        borderRadius: menuItemVars.base.enabled.root.highlightCornerRadius,
        zIndex: -1,

        transition: `${FOCUS_RING_TRANSITION}, background-color ${menuItemVars.base.enabled.root.colorTransitionDuration} ${menuItemVars.base.enabled.root.colorTransitionTimingFunction}`,
        ...createFocusRingRestStyles({ position: "inside" }),
      },

      // highlight 조건 확인
      // [pseudo(highlighted, before)]: {
      //   // nested menu에서 highlight되는 거라면, 별도 디자인 스펙이 필요할 수도 있겠음
      //   backgroundColor: menuItemVars.base.pressed.root.pressedColor,
      // },

      // transition이 필요한지 확인
      [pseudo(not(disabled), engaged, before)]: {
        backgroundColor: menuItemVars.base.pressed.root.pressedColor,
      },

      [pseudo(focusVisible, before)]: createFocusRingStyles({ position: "inside" }),

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
});
