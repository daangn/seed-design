---
"@seed-design/tailwind3-plugin": minor
"@seed-design/tailwind4-theme": minor
---

Tailwind 반응형 변형 `sm:`·`md:`·`lg:`·`xl:`에 SEED breakpoint를 선택해서 적용할 수 있습니다. 다음 major 버전부터는 기본으로 적용할 예정입니다.

- Tailwind CSS 3에서는 `seedPlugin({ breakpoints: true })`로 켭니다. 기존처럼 `seedPlugin`을 그대로 쓰면 Tailwind 기본 breakpoint가 유지됩니다.
- Tailwind CSS 4에서는 `@seed-design/tailwind4-theme` 뒤에 `@import "@seed-design/tailwind4-theme/breakpoints.css";`를 추가합니다.
- 켜면 Tailwind 기본 breakpoint를 `@seed-design/css/breakpoints`와 같은 SEED breakpoint로 대체합니다. `2xl:` 변형은 제공하지 않습니다.
- Tailwind 설정에 SEED breakpoint 값을 복제해 두었다면 지우세요.
