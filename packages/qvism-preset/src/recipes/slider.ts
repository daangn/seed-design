// import { slider as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
// import { active, checked, disabled, not, pseudo } from "../utils/pseudo";

const slider = defineSlotRecipe({
  name: "slider",
  slots: ["root", "track", "range", "thumb"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: "200px",
      height: "24px",

      // touchAction: "none",
    },
    track: {
      backgroundColor: "red",
      position: "relative",
      flexGrow: 1,
      height: "4px",
    },
    range: {
      position: "absolute",
      backgroundColor: "blue",
      height: "100%",
    },
    thumb: {
      backgroundColor: "green",
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default slider;
