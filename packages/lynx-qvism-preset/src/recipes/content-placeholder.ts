import { contentPlaceholder as vars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";

/**
 * Lynx ContentPlaceholder recipe.
 *
 * 웹(`packages/qvism-preset/src/recipes/content-placeholder.ts`)과의 차이:
 * - Lynx 미지원 CSS 제거: `boxSizing`, `verticalAlign`, asset의 `fill`/`stroke`/`objectFit`.
 * - `type` variant 제거: 웹은 type별 프리셋 일러스트를 제공하지만, Lynx는 전용 일러스트 SVG를
 *   포팅하지 않고 소비자가 아이콘/이미지를 children으로 주입한다. (docs에 parity 차이 명시)
 */
const contentPlaceholder = defineSlotRecipe({
  name: "content-placeholder",
  slots: ["root", "asset"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      backgroundColor: vars.base.enabled.root.color,
    },
    asset: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // root 높이의 heightFraction(0.5) 비율
      height: `calc(${vars.base.enabled.asset.heightFraction} * 100%)`,
      minWidth: vars.base.enabled.asset.minWidth,
      maxWidth: vars.base.enabled.asset.maxWidth,
      aspectRatio: "1 / 1",
      color: vars.base.enabled.asset.color,
    },
  },
  // 웹과 달리 type 프리셋이 없으므로 variant는 없다. qvism core가 Object.entries를
  // 호출하므로 빈 객체를 명시한다.
  variants: {},
});

export default contentPlaceholder;
