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
      // fallback의 음수 z-index가 조상 스택 컨텍스트로 새어나가지 않도록 가둡니다.
      isolation: "isolate",
    },
    content: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "inherit",
      // NOTE: 로딩 중에는 숨기지 않습니다. display:none인 이미지는 레이아웃 박스가 없어
      // IntersectionObserver가 교차를 감지하지 못하므로 loading="lazy" 이미지가 영원히 로드되지 않고,
      // 페인트되지 않아 LCP 후보에서도 제외됩니다. 로드 전 이미지는 투명하므로 뒤에 깔린 fallback이 비쳐 보이고,
      // 디코드되는 순간 브라우저가 그 위에 덮어 그립니다.
      [pseudo("[data-loading-state='error']")]: {
        display: "none",
      },
    },
    fallback: {
      // content 뒤에 깔리는 레이어입니다. content에 양수 z-index를 주는 방식은
      // z-index 없이 position:absolute만 쓰는 Float 계열 오버레이(Floater, Badge 등)를
      // 이미지 뒤로 밀어버리므로 fallback을 내리는 방향을 택했습니다.
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
