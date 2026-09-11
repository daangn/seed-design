import { identityPlaceholder as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

const identityPlaceholder = defineSlotRecipe({
  name: "identity-placeholder",
  slots: ["root", "image"],
  base: {
    root: {
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: vars.base.enabled.root.color,
    },
    image: {
      display: "block",
      width: "100%",
      height: "100%",
    },
  },
  variants: {
    identity: {
      person: {},
      business: {},
    },
  },
  defaultVariants: {
    identity: "person",
  },
});

export default identityPlaceholder;
