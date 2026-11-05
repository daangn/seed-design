import { vars } from "../vars";
import { defineSlotRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";

/**
 * The indicator box hugs its content: the progress circle plus the breathing
 * room above and below it. `--ptr-size` spells that composition out instead of
 * a bare number, because the same value also drives the indicator's negative
 * margin, its resting offset, and the gap held open while refreshing.
 */
const PTR_SIZE = `calc(${vars.$dimension.x6} + ${vars.$dimension.x8} * 2)`;

const pullToRefresh = defineSlotRecipe({
  name: "pull-to-refresh",
  slots: ["root", "indicator"],
  base: {
    root: {
      "--ptr-size": PTR_SIZE,
      "--ptr-transition-duration": vars.$duration.d6,

      height: "100%",
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      transform: "translateY(min(calc(var(--ptr-displacement, 0) - var(--ptr-size)), 0px))",
      transition: `transform ${vars.$duration.d6}`,

      [pseudo("[data-ptr-dragging]")]: {
        transition: "none",
      },
    },
  },
  variants: {},
  defaultVariants: {},
});

export default pullToRefresh;
