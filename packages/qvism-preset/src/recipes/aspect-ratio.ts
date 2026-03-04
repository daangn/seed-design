import { defineRecipe } from "../utils/define";
import { pseudo, before, directChild } from "../utils/pseudo";

const aspectRatio = defineRecipe({
  name: "aspect-ratio",
  base: {
    // NOTE: AspectRatio is supposed to be a subset of `Box`
    // currently position & overflow properties are set through the Box props

    "--seed-aspect-ratio-padding": "75%",

    [pseudo(before)]: {
      content: "''",
      display: "block",
      height: 0,
      paddingBottom: "var(--seed-aspect-ratio-padding)",
    },

    [pseudo(directChild)]: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    "& > img, & > video": {
      objectFit: "cover",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default aspectRatio;
