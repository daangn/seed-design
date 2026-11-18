import { defineRecipe } from "../utils/define";

export default defineRecipe({
  name: "float",
  base: { position: "absolute", display: "flex" },
  variants: {
    placement: {
      "top-start": {
        top: "var(--seed-float-offset-y)",
        left: "var(--seed-float-offset-x)",
      },
      "top-center": {
        top: "var(--seed-float-offset-y)",
        left: "calc(50% + var(--seed-float-offset-x))",
        transform: "translateX(-50%)",
      },
      "top-end": {
        top: "var(--seed-float-offset-y)",
        right: "var(--seed-float-offset-x)",
      },
      "middle-start": {
        top: "calc(50% + var(--seed-float-offset-y))",
        left: "var(--seed-float-offset-x)",
        transform: "translateY(-50%)",
      },
      "middle-center": {
        top: "calc(50% + var(--seed-float-offset-y))",
        left: "calc(50% + var(--seed-float-offset-x))",
        transform: "translate(-50%, -50%)",
      },
      "middle-end": {
        top: "calc(50% + var(--seed-float-offset-y))",
        right: "var(--seed-float-offset-x)",
        transform: "translateY(-50%)",
      },
      "bottom-start": {
        bottom: "var(--seed-float-offset-y)",
        left: "var(--seed-float-offset-x)",
      },
      "bottom-center": {
        bottom: "var(--seed-float-offset-y)",
        left: "calc(50% + var(--seed-float-offset-x))",
        transform: "translateX(-50%)",
      },
      "bottom-end": {
        bottom: "var(--seed-float-offset-y)",
        right: "var(--seed-float-offset-x)",
      },
    },
  },
  defaultVariants: {},
});
