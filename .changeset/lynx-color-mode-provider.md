---
"@seed-design/lynx-react": minor
---

`SeedProvider`에 `colorMode`를 추가하고 `ColorModeProvider`를 공개합니다. `useSeedClassName()`은 `colorMode` 옵션을 생략하면 `SeedProvider`의 값을 쓰고, 없으면 지금처럼 `"system"`입니다. 하위 트리에 `seed-color-mode-*-only` class로 테마를 덮어쓴 영역은 같은 값의 `ColorModeProvider`로 감싸면 Liquid Glass tint도 그 테마를 따릅니다. 기존 `useSeedClassName({ colorMode })`·`getSeedClassName()` 사용은 그대로 동작합니다.
