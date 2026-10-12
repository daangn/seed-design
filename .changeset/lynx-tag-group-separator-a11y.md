---
"@seed-design/lynx-react": patch
---

`TagGroup.Root`가 구분자를 스크린 리더에 노출하거나 `""`·`0` 같은 falsy child 앞에 구분자를 추가하던 문제를 수정해, falsy child를 항목에서 제외하고 구분자는 접근성 트리에서 숨깁니다.
