---
"@seed-design/react-dismissible-layer": major
"@seed-design/react-presence": major
"@seed-design/react-menu": major
"@seed-design/rootage-artifacts": minor
"@seed-design/react-dialog": minor
"@seed-design/react-drawer": minor
"@seed-design/css": minor
"@seed-design/react": minor
---

Menu 컴포넌트를 추가합니다.

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
