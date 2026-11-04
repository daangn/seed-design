---
"@seed-design/lynx-react": minor
"@seed-design/lynx-react-use-safe-area": minor
"@seed-design/lynx-react-scale-feedback": minor
---

호스트 앱 값을 명시적으로 전달하는 `SeedProvider`와 `useSeedContext`를 추가합니다.

- `SeedProvider`에 `preferredColorScheme`, `preferredMotion`, `safeAreaInsets`를 넘기면 `useSeedClassName`, 아이콘 색상, Scale Feedback, `useSafeArea`가 이 값을 사용합니다.
- overlay처럼 영역마다 다른 safe area가 필요하면 `SafeAreaProvider`를 중첩합니다.
- `getSeedClassName`과 `useSeedClassName`에 `colorScheme` 옵션을 추가합니다.
- `lynx.__globalProps`의 `theme`, `motion`, `safeAreaInset*`를 직접 읽는 동작은 다음 메이저 버전에서 제거될 예정입니다. 값이 쓰이면 개발 빌드에서 키마다 한 번 경고합니다. 기존 앱은 변경 없이 동작합니다.
- `@seed-design/lynx-react-use-safe-area`가 `@lynx-js/types`의 `GlobalProps`에 `safeAreaInset*` 타입을 더하지 않습니다. 앱에서 이 키를 읽는다면 타입을 직접 선언하세요.
- reorderable attachment Registry 컴포넌트가 `SeedProvider`의 `preferredMotion`을 따릅니다. `npx @seed-design/cli@latest add ui:attachment-field-reorderable` 또는 `ui:attachment-display-field-reorderable`로 다시 설치할 수 있습니다.
