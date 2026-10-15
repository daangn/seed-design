# @seed-design/lynx-react-use-safe-area

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- e91d2d9: 화면 가장자리의 콘텐츠가 시스템 영역과 겹치지 않도록 inset을 읽는 `@seed-design/lynx-react-use-safe-area`를 추가합니다. `useSafeArea`는 `safeAreaInsetTop`·`safeAreaInsetRight`·`safeAreaInsetBottom`·`safeAreaInsetLeft`를 스타일에 쓸 수 있는 문자열로 반환합니다.
  
  - host가 제공한 값은 `px` 문자열로 반환하고, 값이 없거나 유효하지 않으면 CSS `env(safe-area-inset-*)`를 반환합니다. 위·아래 inset은 host 값이 `0`이어도 `env()`를 사용합니다.
