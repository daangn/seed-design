---
"@seed-design/react-tabs": patch
"@seed-design/react": patch
"@seed-design/css": patch
---

- Tabs.Carousel을 사용하는 경우 Hydration 이후 스크롤 애니매이션이 발생하는 문제를 수정합니다.
- Tabs.Carousel의 드래그 제스처를 방지하는 영역을 선언할 수 있는 `Tabs.carouselPreventDrag` api를 추가합니다.
- layout=hug일 때 Indicator에서 발생하는 Layout Shift를 수정합니다.
- lazyMount 옵션이 의도와 다르게 모든 탭이 한꺼번에 마운트되는 문제를 수정합니다.
