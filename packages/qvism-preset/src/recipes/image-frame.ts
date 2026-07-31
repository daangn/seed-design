import { defineSlotRecipe } from "../utils/define";
import { hidden, not, pseudo } from "../utils/pseudo";
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
      isolation: "isolate",
    },
    content: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "inherit",
      [pseudo("[data-loading-state='error']")]: {
        display: "none",
      },
      // 이 slot의 display가 UA의 [hidden] 규칙을 이기므로 직접 선언해야 한다
      [pseudo(hidden)]: {
        display: "none",
      },
      // 로드 전에는 투명하므로 뒤에 깔린 fallback의 클릭·선택을 가로채지 않는다
      [pseudo(not("[data-loading-state='loaded']"))]: {
        pointerEvents: "none",
      },
    },
    fallback: {
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
