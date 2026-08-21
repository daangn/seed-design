# @seed-design/react-prevent-scroll

## 1.0.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

## 1.0.0

### Major Changes

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
