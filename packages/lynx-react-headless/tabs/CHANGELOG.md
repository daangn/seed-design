# @seed-design/lynx-react-tabs

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- eb01c01: SEED 스타일 없이 탭 목록과 콘텐츠를 조합할 수 있는 `@seed-design/lynx-react-tabs`를 추가합니다.
  
  - `Tabs.Root`·`Tabs.List`·`Tabs.Trigger`·`Tabs.Content`·`Tabs.Indicator`·`Tabs.Carousel`·`Tabs.CarouselCamera`를 제공합니다.
  - `value`·`defaultValue`·`onValueChange`로 선택값을 관리하고, `Tabs.Trigger`의 `disabled`로 해당 탭 선택을 막을 수 있습니다.
  - `Tabs.List`의 `scrollAlign`으로 선택된 탭의 스크롤 정렬을 지정하며, `Indicator` 위치와 carousel 페이지를 선택값에 맞춰 동기화합니다.
  - `useTabs`·`useTabsContext`·`useTabsTriggerContext`·`useTabsCarouselContext` 등 상태 hook을 제공합니다.

### Patch Changes

- 7dae990: Lynx `Tabs`를 스와이프할 때 Android logcat에 `illegal css key` 오류가 반복되던 문제를 수정합니다.
  
  - Headless `Tabs.Indicator`는 `--tabs-indicator-x`·`--tabs-indicator-width` 변수 대신 inline `transform`·`width`(px)로 위치와 폭을 지정합니다.
- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0
