# @seed-design/lynx-css

## 0.5.0

### Minor Changes

- f523979: Action Button의 pressed 상태에 scale 모션을 추가합니다.

  pressed 상태에 적절한 모션 피드백을 제공하기 위해 사용하는 `$scale.s95`, `$scale.s97`, `$scale.s98` 토큰을 추가합니다.

  - `scale` 토큰은 플랫폼 별 동작 줄이기 설정에 따라 값이 `1`로 동작합니다.
  - 웹 CSS 환경에서는 `(prefers-reduced-motion: reduce)` 미디어 쿼리가 매치되는 환경에서 `1`로 동작합니다.
  - Tailwind 유틸리티 클래스 `scale-s*`를 통해 scale 토큰을 사용할 수 있습니다. 신규 토큰을 사용할 수 있도록 Tailwind 패키지의 `@seed-design/css` peerDependency 범위를 `^2.1.0`에서 `^2.2.0`으로 올립니다.

## 0.4.1

### Patch Changes

- 7224b94: ImageFrameReactionButton root에 반투명 배경색과 그림자를 추가하여 밝은 이미지 위에서의 가시성을 개선합니다.
- c4ce431: Side Panel Close Button 및 Side Panel Header의 스타일을 디자인 스펙에 맞게 수정하고, Side Panel body에 `box-sizing: border-box`를 적용하여, body에 지정한 `height`/`minHeight`/`maxHeight`가 padding을 포함해 계산되도록 수정합니다.

## 0.4.0

### Minor Changes

- f2b198d: `$color.bg.layer-fill` 토큰을 다시 추가합니다.

  `2.0.0`에서 제거했으나 마땅한 대체 토큰이 없어 deprecated 상태로 되살립니다. 값은 제거 이전과 동일합니다. 추후 동일한 값의 새 이름 토큰으로 대체된 뒤 `3.0.0`에서 제거될 예정입니다.

  `@seed-design/tailwind3-plugin`과 `@seed-design/tailwind4-theme`의 `@seed-design/css` peer dependency 버전 범위를 `^2.1.0`으로 올립니다.

## 0.3.0

### Minor Changes

- 555525a: Attachment Field 관련 컴포넌트를 추가합니다.

  - Attachment Field: 파일을 선택하거나 드래그 앤 드롭으로 직접 업로드할 때 사용합니다.
  - Attachment Display Field: 외부 소스에서 URL로 제공된 미디어를 표시·관리할 때 사용합니다.

- d1a8d7c: 신규 타이포그래피 토큰을 추가합니다.

  - **폰트 크기 토큰 (`$font-size`)**
    - `t11`, `t11-static`
    - `t12`, `t12-static`
    - `t13`, `t13-static`
    - `t14`, `t14-static`
  - **줄 간격 토큰 (`$line-height`)**
    - `t11`, `t11-static`
    - `t12`, `t12-static`
    - `t13`, `t13-static`
    - `t14`, `t14-static`
  - **텍스트 스타일 (`textStyle`)**
    - `t8Regular`, `t8Medium`, `t8StaticRegular`, `t8StaticMedium`
    - `t9Regular`, `t9Medium`, `t9StaticRegular`, `t9StaticMedium`
    - `t10Regular`, `t10Medium`, `t10StaticRegular`, `t10StaticMedium`
    - `t11Regular`, `t11Medium`, `t11Bold`, `t11StaticRegular`, `t11StaticMedium`, `t11StaticBold`
    - `t12Regular`, `t12Medium`, `t12Bold`, `t12StaticRegular`, `t12StaticMedium`, `t12StaticBold`
    - `t13Regular`, `t13Medium`, `t13Bold`, `t13StaticRegular`, `t13StaticMedium`, `t13StaticBold`
    - `t14Regular`, `t14Medium`, `t14Bold`, `t14StaticRegular`, `t14StaticMedium`, `t14StaticBold`

- 69e3b97: Menu 컴포넌트를 추가합니다.

  Drawer를 연 뒤 Drawer 뒤 요소에 포커스가 남아 있는 문제를 수정합니다. Drawer가 열리는 경우 `Drawer.Content`에 자동으로 포커스가 이동합니다.

  - `Drawer.RootProps`의 `autoFocus` 기본값을 `false`에서 `true`로 변경합니다.
  - 스크린 리더가 `modal=true` (기본값)인 Dialog 및 Drawer 뒤 요소를 읽을 수 있는 문제를 수정합니다.

  Dialog(AlertDialog, MenuSheet)와 Drawer(BottomSheet)를 `@radix-ui/react-dismissable-layer`에서 자체 `useDismissibleLayer` 훅 기반으로 리팩터링하고 불필요하게 외부로 노출되던 내부 옵션들을 제거합니다.

  - `DialogRoot` 및 `DrawerRoot`의 `onOpenChange` 두 번째 인자 `details.reason`이 `interactOutside`인 경우 `details.event`의 타입을 `PointerEvent | FocusEvent`에서 `PointerEvent | TouchEvent | FocusEvent`로 변경합니다.
  - `DialogRoot` 및 `DrawerRoot` 두 번째 인자 `details`의 `reason`으로 `cascadeDismiss`를 추가합니다. 두 개 이상의 오버레이 컴포넌트를 표시한 상황에서 하위 컴포넌트가 dismiss되는 경우 상위 컴포넌트는 `cascadeDismiss`와 함께 `onOpenChange`가 호출됩니다.
  - `@seed-design/react` 패키지에서 `@radix-ui/react-dialog` 의존성을 제거합니다.

- 57e4f1a: Chip Tabs Trigger가 disabled 상태일 때 opacity를 사용하여 스타일을 조절하도록 수정합니다.
- 270b277: 컴포넌트 및 파운데이션 전반에 JSDoc 주석을 강화합니다.

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
