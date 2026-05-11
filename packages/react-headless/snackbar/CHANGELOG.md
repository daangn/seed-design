# @seed-design/react-snackbar

## 0.0.0-alpha-20260511052324

### Patch Changes

- Updated dependencies [0cb4cf3]
  - @seed-design/react-primitive@0.0.0-alpha-20260511052324

## 1.0.2

### Patch Changes

- 840f5d5: Snackbar가 표시된 상태에서 새 Snackbar를 create할 때의 동작을 정의하는 `strategy` 옵션을 추가합니다. 기본값은 `immediate`로, 새 Snackbar가 기존 Snackbar를 즉시 교체합니다.

  - 기존 스낵바에 할당된 시간이 모두 지난 뒤 새 Snackbar가 표시되는 이전 버전의 기존 동작을 선호하는 경우 `SnackbarProvider` 또는 `useSnackbarAdapter` 옵션으로 `queued`를 사용할 수 있습니다.
  - `immediate` 옵션을 모방하기 위해 `dismiss()` 후 `setTimeout(() => create(...), 0)`하던 workaround와 함께 사용해도 정상 동작하지만, 동작이 동일하므로 workaround는 제거하는 것을 권장합니다.

- 934a0ba: Snackbar의 `timeout` 기본값을 5초에서 4초로 변경합니다. `timeout`을 명시적으로 지정한 경우에는 기존 동작이 유지됩니다.

## 1.0.1

### Patch Changes

- acae645: Snackbar 타이머가 멈추는 기준을 `focus`에서 `focus-visible`로 수정하여 `pauseOnInteraction={true}`인 경우 Snackbar가 닫히지 않는 문제를 수정합니다.

## 1.0.0

### Major Changes

- 34f92f2: 🌱 SEED Design 패키지의 첫 메이저 버전을 출시합니다.

### Patch Changes

- Updated dependencies [34f92f2]
  - @seed-design/react-primitive@1.0.0
  - @seed-design/dom-utils@1.0.0

## 0.0.7

### Patch Changes

- 11f5e76: Snackbar 헤드리스에서 닫기 버튼에 하드코딩된 `aria-label` 속성을 제거합니다.

## 0.0.6

### Patch Changes

- 8299ba9: Snackbar 컴포넌트를 업데이트합니다.

  - root 영역에 maxWidth 스펙을 추가합니다.
  - `pauseOnInteraction`의 기본값을 `false`에서 `true`로 변경합니다.

## 0.0.5

### Patch Changes

- Updated dependencies [29ec9f0]
  - @seed-design/react-primitive@0.0.3

## 0.0.4

### Patch Changes

- 7851a31: RSC 지원을 위한 "use client" directive를 추가합니다.

## 0.0.3

### Patch Changes

- e368c69: 패키지 의존성을 최신화합니다.
- Updated dependencies [e368c69]
  - @seed-design/react-primitive@0.0.2
  - @seed-design/dom-utils@0.0.2

## 0.0.2

### Patch Changes

- 09fecb9: 누락된 seed-design/react-primitive 의존성 추가 및 불필요한 의존성 제거

## 0.0.1

### Patch Changes

- b64023c: Initial release of the next version of Seed Design.
- Updated dependencies [b64023c]
  - @seed-design/react-primitive@0.0.1
  - @seed-design/dom-utils@0.0.1

## 0.0.1-rc.0

### Patch Changes

- Seed Design V3 release candidate
- Updated dependencies
  - @seed-design/react-primitive@0.0.1-rc.0
  - @seed-design/dom-utils@0.0.1-rc.0
