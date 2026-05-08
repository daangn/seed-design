---
"@seed-design/lynx-react": patch
"@seed-design/lynx-css": patch
---

Lynx `ActionButton`의 `loading` 상태에서 버튼 너비가 spinner 크기로 줄어드는 문제를 수정합니다.

- `loading` 상태에서도 기존 label/icon 영역의 너비를 유지한 채 spinner를 표시합니다.
