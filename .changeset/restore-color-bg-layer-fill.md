---
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
"@seed-design/tailwind3-plugin": minor
"@seed-design/tailwind4-theme": minor
"@seed-design/lynx-css": minor
---

`$color.bg.layer-fill` 토큰을 다시 추가합니다.

`2.0.0`에서 제거했으나 마땅한 대체 토큰이 없어 deprecated 상태로 되살립니다. 값은 이전과 동일합니다(라이트 `gray-100`, 다크 `gray-200`). 추후 동일한 값의 새 이름 토큰으로 대체된 뒤 `3.0.0`에서 제거될 예정입니다.

`@seed-design/tailwind3-plugin`과 `@seed-design/tailwind4-theme`는 되살린 토큰을 참조하므로 `@seed-design/css` peer 범위를 `^2.1.0`으로 올립니다.
