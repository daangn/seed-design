import { defineSlotRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";
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
      // fallback의 음수 z-index를 이 안에 가둔다
      isolation: "isolate",
    },
    content: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "inherit",
      // 로딩 중에는 숨기지 않는다. 숨기면 lazy 로드가 막히고 LCP가 밀린다 (#1791)
      [pseudo("[data-loading-state='error']")]: {
        display: "none",
      },
    },
    fallback: {
      // content 뒤에 깐다. content를 올리면 z-index 없는 Float 오버레이가 가려진다 (#1791)
      position: "absolute",
      inset: 0,
      zIndex: -1,
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
            inset: 0,
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
