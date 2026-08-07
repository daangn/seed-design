# @seed-design/react-menu

## 2.0.2

### Patch Changes

- 6375c7a: `@seed-design/react-dismissible-layer`의 최소 요구 버전을 올려 Chrome 92 / iOS Safari 15.4 이전 버전에서 시트나 다이얼로그를 열 때 발생하던 `TypeError: layers.at is not a function` 크래시 수정이 반드시 설치되도록 합니다.

## 2.0.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

- fb6f9c4: 메뉴가 닫힐 때 목록이 맨 위로 튀는 문제를 수정합니다.

  - `MenuContent`가 열림/닫힘이 바뀔 때마다 리마운트되어, 스크롤한 메뉴를 닫으면 닫힘 애니메이션이 맨 위로 되돌아간 상태로 재생됐습니다.
  - 이제 열고 닫아도 content의 DOM이 그대로 유지되어 스크롤 위치가 보존되고, 메뉴를 여닫을 때마다 항목 전체를 다시 만들지 않습니다.

- Updated dependencies [270c93d]
  - @seed-design/dom-utils@2.0.1
  - @seed-design/react-dismissible-layer@1.0.1
  - @seed-design/react-primitive@2.0.1
  - @seed-design/react-use-controllable-state@2.0.1

## 2.0.0

### Major Changes

- 73cd380: `MenuGroupLabel`이 실제로 렌더된 경우에만 `MenuGroup`이 `aria-labelledby`를 노출하도록 수정합니다.

## 1.0.0

### Major Changes

- 69e3b97: Menu 컴포넌트를 추가합니다.

  Drawer를 연 뒤 Drawer 뒤 요소에 포커스가 남아 있는 문제를 수정합니다. Drawer가 열리는 경우 `Drawer.Content`에 자동으로 포커스가 이동합니다.

  - `Drawer.RootProps`의 `autoFocus` 기본값을 `false`에서 `true`로 변경합니다.
  - 스크린 리더가 `modal=true` (기본값)인 Dialog 및 Drawer 뒤 요소를 읽을 수 있는 문제를 수정합니다.

  Dialog(AlertDialog, MenuSheet)와 Drawer(BottomSheet)를 `@radix-ui/react-dismissable-layer`에서 자체 `useDismissibleLayer` 훅 기반으로 리팩터링하고 불필요하게 외부로 노출되던 내부 옵션들을 제거합니다.

  - `DialogRoot` 및 `DrawerRoot`의 `onOpenChange` 두 번째 인자 `details.reason`이 `interactOutside`인 경우 `details.event`의 타입을 `PointerEvent | FocusEvent`에서 `PointerEvent | TouchEvent | FocusEvent`로 변경합니다.
  - `DialogRoot` 및 `DrawerRoot` 두 번째 인자 `details`의 `reason`으로 `cascadeDismiss`를 추가합니다. 두 개 이상의 오버레이 컴포넌트를 표시한 상황에서 하위 컴포넌트가 dismiss되는 경우 상위 컴포넌트는 `cascadeDismiss`와 함께 `onOpenChange`가 호출됩니다.
  - `@seed-design/react` 패키지에서 `@radix-ui/react-dialog` 의존성을 제거합니다.

### Patch Changes

- Updated dependencies [69e3b97]
- Updated dependencies [60d1a82]
- Updated dependencies [ec33023]
  - @seed-design/react-dismissible-layer@1.0.0
  - @seed-design/react-primitive@2.0.0
