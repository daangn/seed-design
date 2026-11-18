---
"@seed-design/lynx-react-floating": minor
"@seed-design/lynx-react-select": minor
"@seed-design/lynx-react-menu": minor
"@seed-design/lynx-react-popover": minor
---

`SeedProvider`의 `safeAreaInsets`나 `SafeAreaProvider`가 있으면 Select·Menu·Popover가 숫자 inset으로 위치 경계를 계산합니다. 측정용 probe view를 그리지 않습니다.

- `@seed-design/lynx-react-floating`에 `measureRootRect`와 `getSafeAreaBoundary`를 추가합니다.
- `SafeAreaProbe`, `measureFloatingBoundary`와 관련 타입, `useSelect`·`useMenu`·`usePopover`가 반환하는 `safeAreaRef`는 deprecated입니다. 다음 메이저 버전에서 제거합니다.
- Provider가 없는 앱은 지금처럼 동작합니다.
