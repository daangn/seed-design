import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { before, disabled, engaged, focusVisible, not, open, pseudo } from "../utils/pseudo";
import * as tokens from "../vars/vars";

const collapsed = "[data-side-navigation-state=collapsed]";

const duration = "200ms";

export const sideNavigation = defineSlotRecipe({
  name: "side-navigation",
  slots: ["root", "header", "content", "footer", "group", "groupLabel", "trigger"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",

      position: "relative",
      overflowX: "hidden",

      width: "240px",
      height: "100%",

      transition: `width ${duration}`,

      [pseudo(collapsed)]: {
        width: "56px",
      },
    },
    header: {
      boxSizing: "border-box",

      padding: "8px",
      minHeight: "64px", // enough height for the trigger button

      flexShrink: 0,
    },
    content: {
      paddingTop: "8px",
      paddingLeft: "8px",
      paddingRight: "8px",
      paddingBottom: "16px",

      flex: 1,
      overflowY: "auto",

      display: "flex",
      flexDirection: "column",

      gap: "8px",

      // top divider: appears when scrolled away from top (background-attachment local/scroll trick)
      background: [
        "linear-gradient(var(--side-navigation-bg, transparent), var(--side-navigation-bg, transparent)) center top / 100% 1px no-repeat local",
        `linear-gradient(${tokens.$color.stroke.neutralMuted}, ${tokens.$color.stroke.neutralMuted}) center top / 100% 1px no-repeat scroll`,
      ].join(", "),

      // bottom scroll fog: fades content into padding at the bottom
      maskImage: "linear-gradient(to top, transparent 0, black 16px)",
      WebkitMaskImage: "linear-gradient(to top, transparent 0, black 16px)",

      transition: `gap ${duration}`,

      [pseudo(collapsed)]: {
        gap: 0,
        scrollbarWidth: "none",
      },
    },
    footer: {
      padding: "8px",
      flexShrink: 0,

      [pseudo(":empty")]: {
        display: "none",
      },
    },
    group: {
      display: "flex",
      flexDirection: "column",
    },
    groupLabel: {
      // can have a badge inside
      // display: "flex",
      // alignItems: "center",

      padding: "6px",

      fontSize: tokens.$fontSize.t4,
      lineHeight: tokens.$lineHeight.t4,
      fontWeight: tokens.$fontWeight.bold,

      color: tokens.$color.fg.neutralMuted,

      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",

      opacity: 1,
      pointerEvents: "none", // prevent interaction when collapsed
      transition: `margin ${duration}, opacity ${duration}`,

      [pseudo(collapsed)]: {
        marginTop: "calc(-1 * (1lh + 6px * 2))", // hide groupLabel by negative margin (groupLabel height + vertical padding)
        opacity: 0,
      },
    },
    // we define trigger here instead of using ActionButton again since the stylesheets doesn't have much in common
    trigger: {
      minWidth: "40px",
      minHeight: "40px",

      padding: "10px",
      borderRadius: "8px",

      cursor: "pointer",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",

      background: "transparent",

      position: "absolute",
      top: "12px",
      right: "12px",

      ...createFocusRingRestStyles(),
      transition: `right ${duration}, background-color ${duration}, ${FOCUS_RING_TRANSITION}`,

      [pseudo(focusVisible)]: createFocusRingStyles(),

      ...onlyIcon({
        size: "18px",
        color: tokens.$color.fg.neutralSubtle,
      }),

      [pseudo(engaged)]: {
        background: tokens.$color.bg.transparentPressed,
      },

      [pseudo(collapsed)]: {
        right: "8px",
      },
    },
  },
  variants: {
    variant: {
      neutral: {
        root: {
          "--side-navigation-bg": tokens.$color.palette.gray100,
          backgroundColor: tokens.$color.palette.gray100,

          boxShadow: `inset -1px 0 0 0 ${tokens.$color.stroke.neutralMuted}`,
        },
      },
      transparent: {},
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export const sideNavigationInset = defineRecipe({
  name: "side-navigation-inset",
  base: {},
  variants: {},
  defaultVariants: {},
});

export const sideNavigationMenuItem = defineSlotRecipe({
  name: "side-navigation-menu-item",
  slots: ["root", "prefixIcon", "label", "suffixIcon", "panel"],
  base: {
    root: {
      position: "relative",

      display: "flex",
      alignItems: "center",

      gap: "12px",

      height: "44px",
      paddingLeft: "8px",
      paddingRight: "8px",

      width: "100%",
      overflow: "hidden",

      textAlign: "left",
      background: "none",
      border: "none",
      borderRadius: "10px",
      outline: "none",

      transition: `padding ${duration}, background-color ${duration}`,

      [pseudo(before)]: {
        content: '""',
        position: "absolute",

        top: 0,
        right: 0,
        bottom: 0,
        left: 0,

        borderRadius: "10px",

        ...createFocusRingRestStyles({ position: "inside" }),
        transition: `background-color ${duration}, ${FOCUS_RING_TRANSITION}`,
      },

      [pseudo(focusVisible, before)]: createFocusRingStyles({ position: "inside" }),

      [pseudo(collapsed, before)]: {
        right: "unset",

        width: "calc(56px - 8px * 2)", // full width of the collapsed sidebar - horizontal padding
      },

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },

      [pseudo(not(disabled))]: {
        cursor: "pointer",
      },

      [pseudo(not(disabled), engaged, before)]: {
        backgroundColor: tokens.$color.bg.transparentPressed,
      },

      [pseudo("[data-current]")]: {
        backgroundColor: tokens.$color.palette.staticBlackAlpha200,
      },

      [pseudo("[data-current]", not(disabled), engaged)]: {
        backgroundColor: tokens.$color.palette.staticBlackAlpha300,
      },

      [pseudo(collapsed)]: {
        paddingLeft: "10px",
        paddingRight: "10px",
      },
    },
    prefixIcon: {
      width: "20px",
      height: "20px",
      flexShrink: 0,

      color: tokens.$color.palette.gray600,

      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      transition: `color ${duration}`,

      [pseudo("[data-current]")]: {
        color: tokens.$color.fg.neutral,
      },

      [pseudo(disabled)]: {
        color: tokens.$color.fg.disabled,
      },
    },
    label: {
      // can have a badge inside
      // display: "flex",
      // alignItems: "center",

      padding: "6px",

      flexGrow: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",

      color: tokens.$color.fg.neutralMuted,

      fontSize: tokens.$fontSize.t4,
      lineHeight: tokens.$lineHeight.t4,
      fontWeight: tokens.$fontWeight.medium,

      paddingLeft: "calc(20px + 12px)", // prefixIcon width + root gap

      transition: `opacity ${duration}, color ${duration}`,

      [pseudo(collapsed)]: {
        opacity: 0,
      },

      [pseudo("[data-current]")]: {
        color: tokens.$color.fg.neutral,
      },

      [pseudo(disabled)]: {
        color: tokens.$color.fg.disabled,
      },
    },
    suffixIcon: {
      width: "16px",
      height: "16px",
      flexShrink: 0,

      color: tokens.$color.fg.neutralSubtle,

      transition: `transform ${duration}, opacity ${duration}`,

      [pseudo(not(open))]: {
        transform: "rotate(180deg)",
      },

      [pseudo(collapsed)]: {
        opacity: 0,
      },
    },
    panel: {
      [pseudo("[data-collapsible]")]: {
        overflow: "hidden",
        height: 0,
        opacity: 0,

        transition: `height ${duration}, opacity ${duration}`,
      },

      [pseudo("[data-collapsible]", open)]: {
        height: "var(--collapsible-content-height)",
        opacity: 1,

        transition: `height ${duration}, opacity ${duration}`,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});
