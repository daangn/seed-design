import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { before, engaged, not, open, pseudo, selected } from "../utils/pseudo";
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

      width: "240px",
      height: "100%",

      transition: `width ${duration}`,

      [pseudo(collapsed)]: {
        width: "56px",
      },
    },
    header: {
      padding: "8px",

      flexShrink: 0,

      // minHeight: "56px", // some height
    },
    content: {
      padding: "8px",

      flex: 1,
      overflowY: "auto",
      // overflowX: "hidden",
      // scrollbarGutter: "stable",

      display: "flex",
      flexDirection: "column",

      gap: "8px",

      transition: `gap ${duration}`,

      [pseudo(collapsed)]: {
        gap: 0,

        // this isn't good actually, but i don't expect a scrollbar in the collapsed state
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
      display: "flex",
      alignItems: "center",

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
    trigger: {},
  },
  variants: {
    variant: {
      neutral: {
        root: {
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

      cursor: "pointer",

      textAlign: "left",
      background: "none",
      border: "none",

      transition: `padding ${duration}`,

      [pseudo(before)]: {
        content: '""',
        position: "absolute",

        top: 0,
        right: 0,
        bottom: 0,
        left: 0,

        borderRadius: "10px",

        transition: `background-color ${duration}`,
      },

      [pseudo(collapsed, before)]: {
        right: "unset",

        width: "calc(56px - 8px * 2)", // full width of the collapsed sidebar - horizontal padding
      },

      [pseudo(engaged, before)]: {
        backgroundColor: tokens.$color.bg.transparentPressed,
      },

      [pseudo(selected)]: {
        backgroundColor: tokens.$color.palette.staticBlackAlpha200,
      },

      [pseudo(selected, engaged)]: {
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

      [pseudo(selected)]: {
        color: tokens.$color.fg.neutral,
      },
    },
    label: {
      // can have a badge inside
      display: "flex",
      alignItems: "center",

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

      transition: `opacity ${duration}`,

      [pseudo(collapsed)]: {
        opacity: 0,
      },
    },
    suffixIcon: {
      width: "16px",
      height: "16px",
      flexShrink: 0,

      color: tokens.$color.fg.neutralSubtle,

      transition: `transform ${duration}`,

      [pseudo(not(open))]: {
        transform: "rotate(180deg)",
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

        transition: "height 250ms, opacity 250ms",
      },

      // visually collapse open panels when sidebar is collapsed, without changing their open state
      [pseudo(collapsed, "[data-collapsible]", open)]: {
        overflow: "hidden",
        height: 0,
        opacity: 0,
      },
    },
  },
  variants: {},
  defaultVariants: {},
});
