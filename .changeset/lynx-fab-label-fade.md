---
"@seed-design/lynx-css": patch
"@seed-design/lynx-react": patch
---

Lynx `FloatingActionButton.Label`의 축소·확장 전환에서 Label이 사라지거나 줄바꿈·잘림이 발생하던 문제를 수정합니다.

- 이전에는 `extended={false}`일 때 Label을 제거했습니다. 이제 Label을 유지하고 opacity로 숨기거나 표시합니다.
- Label은 전환 중에도 한 줄을 유지하며, 기존처럼 접근성 트리에서 숨깁니다.
