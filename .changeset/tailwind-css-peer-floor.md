---
"@seed-design/tailwind3-plugin": minor
"@seed-design/tailwind4-theme": minor
---

`@seed-design/css` peerDependency의 floor를 `^2.1.0`에서 `^2.2.0`으로 올립니다.

두 플러그인이 내보내는 `scale-s*` 유틸리티가 `--seed-scale-*` CSS 변수를 참조하는데, 이 변수는 `@seed-design/css@2.2.0`부터 정의됩니다. floor를 올려두지 않으면 `css@2.1.x`와 조합될 때 유틸리티가 정의되지 않은 변수를 참조해 런타임에서 조용히 동작하지 않습니다.
