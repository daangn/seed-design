import { defineSlotRecipe } from "../utils/define";
import { not, pseudo } from "../utils/pseudo";
import { imageFrame as vars } from "../vars/component";
import spec from "@seed-design/rootage-artifacts/components/image-frame.json" with { type: "json" };

const imageFrame = defineSlotRecipe({
  name: "image-frame",
  slots: ["root", "content", "fallback"],
  base: {
    root: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "inherit",
    },
    content: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "inherit",
      [pseudo(not("[data-loading-state='loaded']"))]: {
        display: "none",
      },
    },
    fallback: {
      width: "100%",
      height: "100%",
      [pseudo("[data-loading-state='loaded']")]: {
        display: "none",
      },
    },
  },
  variants: {
    stroke: {
      true: {
        root: {
          "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
            boxShadow: `inset 0 0 0 ${vars.strokeTrue.enabled.root.strokeWidth} ${vars.strokeTrue.enabled.root.strokeColor}`,
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    stroke: false,
  },
  metadata: {
    variants: spec.data.schema.variants,
  },
});

export default imageFrame;
