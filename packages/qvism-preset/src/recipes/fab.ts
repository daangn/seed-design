import { fab as vars } from "../vars/component";

import { defineRecipe } from "../utils/define";
import { onlyIcon } from "../utils/icon";
import { active, disabled, focus, pseudo } from "../utils/pseudo";

/**
 * @deprecated Use `contextual-floating-button` instead.
 */
const fab = defineRecipe({
  name: "fab",
  base: {
    display: "inline-flex",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    textTransform: "none",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textDecoration: "none",
    fontFamily: "inherit",
    [pseudo(focus)]: {
      outline: "none",
    },
    [pseudo(disabled)]: {
      cursor: "not-allowed",
    },

    background: vars.base.rest.root.color,
    borderRadius: vars.base.rest.root.cornerRadius,
    boxShadow: vars.base.rest.root.shadow,
    width: vars.base.rest.root.size,
    height: vars.base.rest.root.size,

    ...onlyIcon({
      color: vars.base.rest.icon.color,
      size: vars.base.rest.icon.size,
    }),

    [pseudo(active)]: {
      background: vars.base.pressed.root.color,
    },
  },
  variants: {},
  defaultVariants: {},
});

export default fab;
