import IconPictureFill from "@karrotmarket/lynx-monochrome-icon/IconPictureFill";

import { ContentPlaceholder } from "../seed-design/ui/content-placeholder";

/**
 * ContentPlaceholder PoC
 *
 * 검증 포인트:
 * 1. Root 배경 + Asset(아이콘) 중앙 정렬이 recipe대로 렌더되는지
 * 2. style로 준 width/height가 native aspectRatio/크기와 함께 동작하는지
 * 3. asset slot의 color가 children 아이콘(monochrome)에 반영되는지
 */
export function ContentPlaceholderPage() {
  return (
    <view className="flex flex-col pb-x10">
      <text className="t6-bold mb-x4 text-fg-neutral">ContentPlaceholder</text>

      <text className="t4-bold text-fg-neutral-subtle mb-x2">정사각형 (160 × 160)</text>
      <ContentPlaceholder style={{ width: "160px", height: "160px" }}>
        <IconPictureFill />
      </ContentPlaceholder>

      <text className="t4-bold text-fg-neutral-subtle mt-x4 mb-x2">가로형 (full × 120)</text>
      <ContentPlaceholder style={{ width: "100%", height: "120px" }}>
        <IconPictureFill />
      </ContentPlaceholder>
    </view>
  );
}
