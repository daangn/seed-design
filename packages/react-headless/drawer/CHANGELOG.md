# @seed-design/react-drawer

## 2.0.4

### Patch Changes

- 6375c7a: `@seed-design/react-dismissible-layer`의 최소 요구 버전을 올려 Chrome 92 / iOS Safari 15.4 이전 버전에서 시트나 다이얼로그를 열 때 발생하던 `TypeError: layers.at is not a function` 크래시 수정이 반드시 설치되도록 합니다.

## 2.0.3

### Patch Changes

- 3d5ecf4: 소프트웨어 키보드가 열릴 때 BottomSheet가 움직이는 방식을 개선합니다.

  - iOS에서 시트가 한 프레임에 점프하지 않고 새 위치까지 애니메이션합니다.
  - Android에서 입력 필드에 포커스하면 시트가 화면을 덮을 만큼 커지던 문제를 수정합니다.

## 2.0.2

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

- Updated dependencies [270c93d]
  - @seed-design/dom-utils@2.0.1
  - @seed-design/react-dismissible-layer@1.0.1
  - @seed-design/react-presence@1.0.1
  - @seed-design/react-prevent-scroll@1.0.1
  - @seed-design/react-primitive@2.0.1
  - @seed-design/react-use-controllable-state@2.0.1

## 2.0.1

### Patch Changes

- 1d3e8c6: Drawer의 active snap point가 특정 상황에서 `undefined`로 설정되던 문제를 수정합니다.

## 2.0.0

### Major Changes

- 69e3b97: Menu 컴포넌트를 추가합니다.

  Drawer를 연 뒤 Drawer 뒤 요소에 포커스가 남아 있는 문제를 수정합니다. Drawer가 열리는 경우 `Drawer.Content`에 자동으로 포커스가 이동합니다.

  - `Drawer.RootProps`의 `autoFocus` 기본값을 `false`에서 `true`로 변경합니다.
  - 스크린 리더가 `modal=true` (기본값)인 Dialog 및 Drawer 뒤 요소를 읽을 수 있는 문제를 수정합니다.

  Dialog(AlertDialog, MenuSheet)와 Drawer(BottomSheet)를 `@radix-ui/react-dismissable-layer`에서 자체 `useDismissibleLayer` 훅 기반으로 리팩터링하고 불필요하게 외부로 노출되던 내부 옵션들을 제거합니다.

  - `DialogRoot` 및 `DrawerRoot`의 `onOpenChange` 두 번째 인자 `details.reason`이 `interactOutside`인 경우 `details.event`의 타입을 `PointerEvent | FocusEvent`에서 `PointerEvent | TouchEvent | FocusEvent`로 변경합니다.
  - `DialogRoot` 및 `DrawerRoot` 두 번째 인자 `details`의 `reason`으로 `cascadeDismiss`를 추가합니다. 두 개 이상의 오버레이 컴포넌트를 표시한 상황에서 하위 컴포넌트가 dismiss되는 경우 상위 컴포넌트는 `cascadeDismiss`와 함께 `onOpenChange`가 호출됩니다.
  - `@seed-design/react` 패키지에서 `@radix-ui/react-dialog` 의존성을 제거합니다.

- 60d1a82: 1.2에서 deprecate된 옵션을 제거합니다.

  - 색상 토큰
    - `$color.bg.layer-fill`: 라이트 및 다크 모드에서 모두 테스트 후 `$color.bg.neutral-weak`으로 대체할 수 있습니다.
  - 그라디언트 토큰
    - `$gradient.fade-layer-floating`
    - `$gradient.fade-layer-default`
  - Chip Tabs의 `brandSolid` variant
  - AppBar의 `divider` 옵션
  - Image Frame의 `rounded` variant: `borderRadius` 옵션을 사용해주세요.
  - Switch의 `small` 및 `medium` size: 각각 `16`과 `32`를 사용해주세요.
  - Checkbox의 `default` 및 `stronger` weight: 각각 `regular`와 `bold`를 사용해주세요.
  - `<Box display="inlineFlex" />` 등 유틸리티 컴포넌트 레이아웃 프로퍼티의 camelCase 옵션: kebab-case 옵션을 사용해주세요.
    - `display`, `justifyContent`, `justify`, `alignItems`, `align`, `alignContent`, `alignSelf`, `flexDirection`, `direction`
  - `AppBar`의 `divider` 옵션
    - 하단 구분선이 더 이상 표시되지 않습니다.
  - `BottomSheetRoot` (`DrawerRoot`)의 `noBodyStyles` 옵션
    - 제거되어 기본값(true)처럼 동작합니다.
  - `BottomSheetRoot` (`DrawerRoot`)의 `preventScrollRestoration` 옵션
    - 제거되어 기본값(false)처럼 동작합니다.
  - `BottomSheetRoot`의 `direction` 옵션
    - BottomSheet는 항상 아래에서 올라오므로 `direction`을 받지 않습니다.
  - `BottomSheetBackdrop` (`DrawerBackdrop`)의 `forceMount` 옵션
    - 제거되어 `BottomSheetRoot` (`DrawerRoot`)의 `lazyMount`/`unmountOnExit` 옵션으로 대체할 수 있습니다.
  - `BottomSheetContent` (`DrawerContent`)의 `onPointerDownOutside`, `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onInteractOutside`, `forceMount`, `onFocusOutside` 옵션
    - 제거되어 `BottomSheetRoot` (`DrawerRoot`)의 `onOpenChange` 두 번째 인자 `details`를 통해 대체할 수 있습니다.

### Patch Changes

- Updated dependencies [69e3b97]
- Updated dependencies [60d1a82]
- Updated dependencies [ec33023]
  - @seed-design/react-dismissible-layer@1.0.0
  - @seed-design/react-presence@1.0.0
  - @seed-design/react-prevent-scroll@1.0.0
  - @seed-design/react-primitive@2.0.0

## 1.0.11

### Patch Changes

- 306673a: iOS 환경에서 Bottom Sheet(Drawer) 내부 버튼에서 시트 스와이프 동작을 수행하는 경우 의도하지 않은 버튼 클릭을 발생시키던 문제를 수정합니다.

## 1.0.10

### Patch Changes

- 59887b7: SEED React 2.0.0에서 제거될 예정인 Drawer/BottomSheet의 `noBodyStyles`, `preventScrollRestoration` 옵션을 deprecated 처리합니다. 2.0.0부터는 두 옵션 모두 기본값(`noBodyStyles=true`, `preventScrollRestoration=false`)처럼 동작합니다.

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
