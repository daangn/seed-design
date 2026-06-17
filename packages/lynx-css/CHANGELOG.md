# @seed-design/lynx-css

## 0.2.1

### Patch Changes

- 234e8c7: deprecated 항목의 제거 예정 버전 안내를 1.3.0에서 2.0.0으로 변경합니다.

  - `ImageFrame`의 `rounded` 옵션, `Switch`/`Checkbox`/`ChipTabs`의 deprecated 옵션, 유틸리티 스타일 prop(`display`, `flexDirection`, `justifyContent`, `alignItems`)의 deprecated 값의 제거 예정 버전을 2.0.0으로 안내합니다.
  - `$color.bg.layer-fill`, `$gradient.fade-layer-floating`, `$gradient.fade-layer-default` 토큰의 제거 예정 버전을 2.0.0으로 안내합니다.
  - 2.0.0부터 deprecated 항목 제거를 포함한 breaking change는 메이저 릴리스에서만 수행됩니다.

## 0.2.0

### Minor Changes

- c8d4c26: Lynx AppBar 컴포넌트를 추가합니다.

  - `AppBar.Root`, `AppBar.Left`, `AppBar.Main`, `AppBar.Right`, `AppBar.IconButton` 등 compound API를 제공합니다.
  - `SystemInfo.platform`에 따라 Android에서는 `android`, 그 외 플랫폼에서는 `cupertino` theme을 기본으로 적용합니다.
  - `theme` prop으로 platform 기본값을 수동 override할 수 있습니다.

- 26d3517: Lynx Badge 컴포넌트를 추가합니다.

  - `@seed-design/lynx-react`에서 `Badge`를 직접 import해 사용할 수 있습니다.
  - `@seed-design/lynx-css/recipes/badge`에서 Badge recipe 스타일을 제공합니다.

  ```tsx
  import { Badge } from "@seed-design/lynx-react";

  <Badge tone="positive" variant="weak">
    거래 가능
  </Badge>;
  ```

### Patch Changes

- 4e2ee69: Lynx BottomSheet가 앱 셸 위에 안정적으로 표시되고, 본문 스크롤 제스처를 내부에서 처리하도록 개선합니다.

  - BottomSheet overlay의 기본 `z-index`를 높여 앱바 같은 상단 영역까지 backdrop이 덮이도록 수정합니다.
  - `BottomSheetBody`가 세로 스크롤 영역으로 렌더링되어 본문을 스크롤할 때 뒤쪽 화면이 함께 스크롤되는 문제를 방지합니다.
  - 스크롤 가능한 BottomSheet에서는 `BottomSheetRoot`의 `handleOnly`를 함께 사용할 수 있습니다.
  - BottomSheet handle의 드래그 target size를 보이는 handle보다 크게 보장합니다.

- 8dc8f4f: Menu Sheet의 디자인 스펙에서 핸들 여백 확보를 위해 `content` 상단 패딩을 `x4` → `x6`으로 늘리고 `header.paddingTop`을 제거합니다 (핸들 여백 확보). React/CSS `MenuSheet`의 경우 핸들이 존재하지 않으므로 변경사항이 없습니다.
- 0fa9a1f: Lynx에서 테마(라이트/다크) 전환 시 텍스트 색상이 갱신되지 않던 문제를 수정합니다.

## 0.1.0

### Minor Changes

- 699af2c: SEED Design Lynx의 첫 stable 버전을 릴리즈합니다.

  - `@seed-design/lynx-css`: Lynx 환경에서 사용할 수 있는 SEED 디자인 토큰, base CSS, component recipe CSS를 제공합니다.
  - `@seed-design/lynx-react`: Lynx용 SEED React 컴포넌트와 hook을 제공합니다.
    - 컴포넌트: `ActionButton`, `BottomSheet`, `Box`, `Checkbox`, `HStack`, `ProgressCircle`, `RadioGroup`, `Switch`, `TagGroup`, `Text`, `VStack`
    - Hook: `useControllableState`, `useIconColor`, `usePressTap`, `useSafeArea`
    - Safe Area: `useSafeArea` API로 `env(safe-area-inset-*)`와 host 앱의 `lynx.__globalProps` fallback을 함께 지원합니다.
  - `@seed-design/cli`: Lynx framework 감지, registry snippet 추가, compatibility check, docs lookup 흐름을 지원합니다.
