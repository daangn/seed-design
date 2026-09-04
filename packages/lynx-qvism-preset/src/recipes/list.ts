import { defineRecipe } from "../utils/define";

const list = defineRecipe({
  name: "list",
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  variants: {},
  defaultVariants: {},
});

export default list;
