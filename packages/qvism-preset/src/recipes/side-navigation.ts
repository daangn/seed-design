import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { open, pseudo } from "../utils/pseudo";

// TODO: replace hardcoded values with rootage vars once DES-1374 is done

export const sideNavigation = defineSlotRecipe({
  name: "side-navigation",
  slots: ["root", "header", "content", "footer", "group", "groupLabel", "trigger"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    header: {
      flexShrink: 0,
    },
    content: {
      flex: 1,
      overflowY: "auto",
    },
    footer: {
      flexShrink: 0,
    },
    group: {
      display: "flex",
      flexDirection: "column",
    },
    groupLabel: {},
    trigger: {},
  },
  variants: {},
  defaultVariants: {},
});

export const sideNavigationInset = defineRecipe({
  name: "side-navigation-inset",
  base: {},
  variants: {},
  defaultVariants: {},
});

export const sideNavigationMenuItem = defineSlotRecipe({
  name: "side-navigation-menu-item",
  slots: ["item", "collapsibleContent", "chevron"],
  base: {
    item: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      cursor: "pointer",
      textAlign: "left",
      background: "none",
      border: "none",
    },
    collapsibleContent: {
      [pseudo("[data-collapsible]")]: {
        overflow: "hidden",
        height: 0,
        opacity: 0,

        transition: "height 200ms ease-out, opacity 200ms ease-out",
      },

      [pseudo("[data-collapsible]", open)]: {
        height: "var(--collapsible-content-height)",
        opacity: 1,

        transition: "height 250ms ease-out, opacity 250ms ease-out",
      },
    },
    chevron: {
      flexShrink: 0,
      transition: "transform 200ms ease-out",

      [pseudo(open)]: {
        transform: "rotate(180deg)",
      },
    },
  },
  variants: {},
  defaultVariants: {},
});
