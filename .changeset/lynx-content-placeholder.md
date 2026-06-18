---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

Lynx `ContentPlaceholder` 컴포넌트를 추가했습니다. 이미지나 콘텐츠가 없거나 로딩되기 전인 영역을 채우는 플레이스홀더로, 배경 박스(`Root`)와 중앙 정렬된 asset 박스(`Asset`)로 구성됩니다.

웹과 달리 `type` 프리셋(전용 일러스트)을 제공하지 않으며, 표시할 아이콘이나 이미지를 children으로 직접 주입합니다.

```tsx
import { ContentPlaceholder } from "@/components/ui/content-placeholder";
import IconPictureFill from "@karrotmarket/lynx-monochrome-icon/IconPictureFill";

export function App() {
  return (
    <ContentPlaceholder style={{ width: 160, height: 160 }}>
      <IconPictureFill />
    </ContentPlaceholder>
  );
}
```
