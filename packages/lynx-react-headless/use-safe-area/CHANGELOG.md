# @seed-design/lynx-react-use-safe-area

## 1.1.0

### Minor Changes

- e4cbe8d: 호스트 앱 값을 명시적으로 전달하는 `SeedProvider`와 `useSeedContext`를 추가합니다.
  
  - `SeedProvider`에 `preferredColorScheme`, `preferredMotion`, `safeAreaInsets`를 넘기면 `useSeedClassName`, 아이콘 색상, Scale Feedback, `useSafeArea`가 이 값을 사용합니다.
  - overlay처럼 영역마다 다른 safe area가 필요하면 `SafeAreaProvider`를 중첩합니다.
  - `getSeedClassName`과 `useSeedClassName`에 `colorScheme` 옵션을 추가합니다.
  - `lynx.__globalProps`의 `theme`, `motion`, `safeAreaInset*`를 직접 읽는 동작은 다음 메이저 버전에서 제거될 예정입니다. 값이 쓰이면 개발 빌드에서 키마다 한 번 경고합니다. 기존 앱은 변경 없이 동작합니다.
  - reorderable attachment Registry 컴포넌트가 `SeedProvider`의 `preferredMotion`을 따릅니다. `npx @seed-design/cli@latest add ui:attachment-field-reorderable` 또는 `ui:attachment-display-field-reorderable`로 다시 설치할 수 있습니다.

### Patch Changes

- e4cbe8d: 기본 `globalPropsMode: "reactive"`에서 SEED 컴포넌트가 렌더될 때마다 개발 빌드에 `useGlobalProps` 경고가 반복되던 문제를 수정합니다. 이제 `"event"` 모드에서만 `useGlobalProps()`로 변경을 구독하고, `"reactive"` 모드에서는 `lynx.__globalProps`를 바로 읽습니다.

## 1.0.1

### Patch Changes

- 6ec5b80: `globalPropsMode: "event"`에서 host가 `safeAreaInset*` global props를 바꿔도 `useSafeArea`가 이전 값을 반환하던 문제를 수정합니다. 이제 `useGlobalProps()`로 값을 구독해 화면 회전이나 폴더블 기기의 inset 변경을 반영합니다.
  
  - `useGlobalProps()`를 사용하므로 `useSafeArea`를 직접·간접으로 쓰는 headless 패키지의 `@lynx-js/react` peer dependency 하한을 `>=0.117.0`으로 올립니다. `@seed-design/lynx-react`는 이미 `>=0.117.0`을 요구합니다.
- 755e0a0: host가 위·아래 inset을 `0`으로 제공해도 `useSafeArea`가 `env(safe-area-inset-*)`를 반환해 native가 이미 확보한 여백 위에 여백이 한 번 더 생기던 문제를 수정합니다. 이제 네 방향 모두 host가 제공한 `0` 이상의 유한한 숫자를 `px` 문자열로 반환하므로 `0`은 `"0px"`가 됩니다.

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- e91d2d9: 화면 가장자리의 콘텐츠가 시스템 영역과 겹치지 않도록 inset을 읽는 `@seed-design/lynx-react-use-safe-area`를 추가합니다. `useSafeArea`는 `safeAreaInsetTop`·`safeAreaInsetRight`·`safeAreaInsetBottom`·`safeAreaInsetLeft`를 스타일에 쓸 수 있는 문자열로 반환합니다.
  
  - host가 제공한 값은 `px` 문자열로 반환하고, 값이 없거나 유효하지 않으면 CSS `env(safe-area-inset-*)`를 반환합니다. 위·아래 inset은 host 값이 `0`이어도 `env()`를 사용합니다.
