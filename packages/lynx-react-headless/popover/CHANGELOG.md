# @seed-design/lynx-react-popover

## 1.1.1

### Patch Changes

- 989f038: `HelpBubble`·headless Popover가 열린 동안 기준 요소의 layout이 다시 보고될 때마다 다시 렌더링해 빈 Main Thread commit을 보내던 문제를 수정합니다. 이제 다시 렌더링하지 않고 다음 frame 측정에서 위치를 갱신합니다. `@lynx-js/react` 0.125.0에서 열린 HelpBubble의 Trigger layout이 같은 값으로 다시 보고될 때 commit이 6회에서 0회로, 열고 위치를 잡을 때까지의 commit이 23회에서 17회로 줄어듭니다. 이에 따라 `usePopover`의 `positionRevision`은 항상 `0`이며 사용 중단됩니다. 측정 요청 횟수는 `positionRevisionRef`로 읽습니다.

## 1.1.0

### Minor Changes

- 1a3af35: `SeedProvider`의 `safeAreaInsets`나 `SafeAreaProvider`가 있으면 Select·Menu·Popover가 숫자 inset으로 위치 경계를 계산합니다. 측정용 probe view를 그리지 않습니다.
  
  - `@seed-design/lynx-react-floating`에 `measureRootRect`와 `getSafeAreaBoundary`를 추가합니다.
  - `SafeAreaProbe`, `measureFloatingBoundary`와 관련 타입, `useSelect`·`useMenu`·`usePopover`가 반환하는 `safeAreaRef`는 deprecated입니다. 다음 메이저 버전에서 제거합니다.
  - Provider가 없는 앱은 지금처럼 동작합니다.
- e77272e: `SeedProvider`에 화면 전체(window) 기준 Safe Area를 넘기는 `windowSafeAreaInsets`를 추가합니다.
  
  - `container`를 지정해 native overlay에 그리는 Bottom Sheet·Menu Sheet·Dialog·Alert Dialog·Menu·Select·Help Bubble은 `windowSafeAreaInsets`로 여백과 위치 경계를 정합니다. LynxView가 탭이나 채팅 화면 상단에 임베드되어 `safeAreaInsets`가 `0`이어도 시트가 home indicator 영역과 겹치지 않습니다.
  - `windowSafeAreaInsets`를 넘기지 않거나 `container`가 없는 레이어는 지금처럼 `safeAreaInsets`를 씁니다.
  - `useSeedContext()`가 `windowSafeAreaInsets`를 반환합니다.

### Patch Changes

- Updated dependencies [1a3af35]
- Updated dependencies [e77272e]
  - @seed-design/lynx-react-floating@1.1.0
  - @seed-design/lynx-react-use-safe-area@1.2.0

## 1.0.2

### Patch Changes

- 6c1fa1f: Lynx 컴포넌트에서 같은 props와 측정값으로 반복하던 main-thread 전송과 하위 파트 렌더링을 줄입니다.
- Updated dependencies [6c1fa1f]
  - @seed-design/lynx-react-use-press-tap@1.0.2

## 1.0.1

### Patch Changes

- 6ec5b80: `globalPropsMode: "event"`에서 host가 `safeAreaInset*` global props를 바꿔도 `useSafeArea`가 이전 값을 반환하던 문제를 수정합니다. 이제 `useGlobalProps()`로 값을 구독해 화면 회전이나 폴더블 기기의 inset 변경을 반영합니다.
  
  - `useGlobalProps()`를 사용하므로 `useSafeArea`를 직접·간접으로 쓰는 headless 패키지의 `@lynx-js/react` peer dependency 하한을 `>=0.117.0`으로 올립니다. `@seed-design/lynx-react`는 이미 `>=0.117.0`을 요구합니다.
- Updated dependencies [6ec5b80]
  - @seed-design/lynx-react-floating@1.0.1

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- 6faa8c1: SEED 스타일 없이 말풍선을 조합하는 `@seed-design/lynx-react-popover`를 추가합니다.
  
  - `Root`·`Anchor`·`Trigger`·`Positioner`·`Content`·`Arrow`·`CloseButton`과 `usePopover`으로 기준 요소에 맞춘 배치, 화살표, 바깥 탭 닫기를 지원합니다.
  - `open`·`defaultOpen`·`onOpenChange`로 열림 상태를 제어하고, `Positioner`의 `container`로 native overlay를 선택할 수 있습니다.

### Patch Changes

- 7dae990: Lynx `HelpBubble`·Popover를 좌우로 배치했을 때 좁은 화면에서 말풍선이 트리거를 덮던 문제를 수정하여, 남은 옆 공간에 맞춰 줄바꿈합니다.
- Updated dependencies [6faa8c1]
- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-floating@1.0.0
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0
