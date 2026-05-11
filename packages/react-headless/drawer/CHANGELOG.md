# @seed-design/react-drawer

## 0.0.0-alpha-20260511052324

### Minor Changes

- 1dd2eec: Menu 컴포넌트를 추가합니다.

  Dialog(AlertDialog, MenuSheet)와 Drawer(BottomSheet)를 `@radix-ui/react-dismissable-layer`에서 자체 `useDismissibleLayer` 훅 기반으로 리팩터링하고 불필요하게 외부로 노출되던 내부 옵션들을 제거합니다.

  - `Drawer.BackdropProps`의 `forceMount` 옵션을 제거합니다.
    - `Drawer.RootProps`의 `lazyMount`/`unmountOnExit` 옵션으로 대체할 수 있습니다.
  - `Drawer.ContentProps`에서 아래 옵션을 제거합니다.
    - `onPointerDownOutside`, `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onInteractOutside`, `forceMount`, `onFocusOutside`
    - `Drawer.RootProps`의 `onOpenChange` 두 번째 인자 `details`를 통해 대체할 수 있습니다.
  - `Dialog.RootProps` 및 `Drawer.RootProps`의 `onOpenChange` 두 번째 인자 `details.reason`이 `interactOutside`인 경우 `details.event`의 타입을 `PointerEvent | FocusEvent`에서 `PointerEvent | TouchEvent | FocusEvent`로 변경합니다.
  - `Dialog.RootProps` 및 `Drawer.RootProps` 두 번째 인자 `details`의 `reason`으로 `cascadeDismiss`를 추가합니다. 두 개 이상의 오버레이 컴포넌트를 표시한 상황에서 하위 컴포넌트가 dismiss되는 경우 상위 컴포넌트는 `cascadeDismiss`와 함께 `onOpenChange`가 호출됩니다.
  - @seed-design/react 패키지에서 @radix-ui/react-dialog 의존성을 제거합니다.

  Drawer를 연 뒤 Drawer 뒤 요소에 포커스가 남아 있는 문제를 수정합니다. Drawer가 열리는 경우 `Drawer.Content`에 자동으로 포커스가 이동합니다.

  - `Drawer.RootProps`의 `autoFocus` 기본값을 `false`에서 `true`로 변경합니다.

  스크린 리더가 `modal=true` (기본값)인 Dialog 및 Drawer 뒤 요소를 읽을 수 있는 문제를 수정합니다.

### Patch Changes

- Updated dependencies [1dd2eec]
- Updated dependencies [0cb4cf3]
  - @seed-design/react-dismissible-layer@0.0.0-alpha-20260511052324
  - @seed-design/react-presence@0.0.0-alpha-20260511052324
  - @seed-design/react-primitive@0.0.0-alpha-20260511052324

## 1.0.9

### Patch Changes

- 0420c89: Android 환경에서 온스크린 키보드가 닫힐 때 Drawer(Bottom Sheet) 높이가 정상적으로 복원되지 않는 문제를 수정합니다.

## 1.0.8

### Patch Changes

- 576c2e6: `AlertDialogRoot`, `MenuSheetRoot` 및 `BottomSheetRoot`의 `onOpenChange` 두 번째 인자로 `details`를 제공합니다. `details.reason`과 `details.event`를 사용할 수 있습니다.

  `DialogAction`을 `DialogPrimitive.CloseButton`으로 교체합니다. `AlertDialogAction` `onClick` 핸들러에서 `event.preventDefault()`를 호출하여 닫기 동작을 방지할 수 있습니다. [(예제)](https://seed-design.io/react/components/alert-dialog#prevent-close)

- Updated dependencies [576c2e6]
  - @seed-design/react-use-controllable-state@1.0.0

## 1.0.6

### Patch Changes

- 8188130: AlertDialog 닫힐 때 focus 복원으로 인해 BottomSheet가 즉시 닫히는 문제 수정

  - onFocusOutside에서 항상 preventDefault 호출
  - onInteractOutside에서 defaultPrevented 체크 추가

- 9cbeba0: BottomSheet `showCloseButton` variant 변경 및 animation 버그 수정

  - `showCloseButton` variant 변경: CloseButton 미사용 시 header padding 조정 가능
  - `hasEntered` 상태 추가: modal prop 변경 시 enter animation 재실행 방지

## 1.0.5

### Patch Changes

- 69ccc6e: Overlay 컴포넌트에 skipAnimation 옵션을 추가합니다

## 1.0.4

### Patch Changes

- e3806c1: BottomSheet에 handleOnly 옵션이 정상적으로 동작하지 않는 이슈를 수정합니다

## 1.0.3

### Patch Changes

- cc8864d: use-prevent-scroll 로직을 삭제합니다

## 1.0.2

### Patch Changes

- 4102a4b: BottomSheetContent에 style 객체가 전달되지 않는 버그를 수정합니다.
- e272ef8: Export 수정: `DialogProps` → `UseDrawerProps`
- fbc9cb0: uncontrolled 상태에서 onOpenChange가 두번 호출되는 버그를 수정합니다
- 4971dcc: body에 강제로 스타일을 주입하는 noBodyStyles 옵션의 기본값을 true로 변경합니다

## 1.0.1

### Patch Changes

- 68b5eab: @seed-design/react-drawer 패키지 배포

## 1.0.0

### Major Changes

- 33def2d: `@seed-design/react-drawer` 1.0.0
