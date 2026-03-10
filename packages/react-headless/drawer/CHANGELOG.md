# @seed-design/react-drawer

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
