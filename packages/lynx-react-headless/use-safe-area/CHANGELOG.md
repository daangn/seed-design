# @seed-design/lynx-react-use-safe-area

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
