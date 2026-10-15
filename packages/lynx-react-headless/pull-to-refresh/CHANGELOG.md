# @seed-design/lynx-react-pull-to-refresh

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- b7cad68: Lynx `PullToRefresh` 컴포넌트를 추가합니다.
  
  - `PullToRefresh.Root`·`Indicator`·`Content`와 `onPtrRefresh`로 콘텐츠를 당겨 새로고침하고 당긴 정도를 표시할 수 있습니다.
  - 앱의 `pluginReactLynx` 설정에 `enableNewGesture: true`를 추가해야 합니다.
  - `npx @seed-design/cli@latest add ui:pull-to-refresh`로 Registry 컴포넌트를 설치할 수 있습니다.
  - 스타일 없이 조합하려면 `@seed-design/lynx-react-pull-to-refresh`를 사용합니다.
