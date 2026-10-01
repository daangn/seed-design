---
"@seed-design/lynx-react": patch
---

`TagGroupRoot`의 구분자를 스크린 리더가 읽던 문제를 수정합니다. 구분자는 `accessibility-elements-hidden`으로 접근성 트리에서 제외됩니다. 조건부 렌더링으로 생긴 `""`·`0` 같은 falsy child 앞에 구분자가 추가되던 문제도 수정합니다.
