# @seed-design/lynx-react

## 0.4.0

### Minor Changes

- ebb4eae: Lynx 입력 폼 컴포넌트를 추가합니다.

  - `Field`, `TextField`, `KeyboardAvoidingScrollView`를 제공합니다.
  - `TextField.Input`과 `TextField.Textarea`에서 native 입력, controlled value, grapheme 단위 글자 수 제한을 지원합니다.
  - `TextField.Textarea`는 내용에 따른 자동 높이 조절을 지원합니다.
  - `KeyboardAvoidingScrollView`는 focus된 입력과 Field footer가 키보드에 가려지지 않도록 스크롤합니다.
  - `npx @seed-design/cli@latest add ui:text-field`로 조합된 snippet을 설치할 수 있습니다.

  ```tsx
  <KeyboardAvoidingScrollView>
    <TextField label="소개" maxGraphemeCount={80}>
      <TextFieldTextarea accessibility-label="소개" />
    </TextField>
  </KeyboardAvoidingScrollView>
  ```

## 0.3.1

### Patch Changes

- 270c93d: 라이선스를 Apache-2.0으로 명시했습니다. 기존에는 `license` 필드가 비어 있어 저장소 루트의 Apache License 2.0과 일치하지 않았고, 배포물에 `LICENSE`와 `NOTICE`가 포함되지 않아 이용 조건을 확인할 수 없었습니다.

  당근 로고를 비롯한 브랜드 리소스는 별도 가이드라인을 따르며, 당근을 사칭하거나 당근 서비스와 관련이 있는 것처럼 오인하게 하는 사용은 허용되지 않습니다. 자세한 내용은 `NOTICE` 파일을 참고해주세요.

## 0.3.0

### Minor Changes

- 2ad8e8c: (BREAKING CHANGE: `@lynx-js/react`를 `0.117.0` 이상으로 업그레이드해야 합니다.) 테마 변경에 반응하는 `useSeedClassName` 훅을 추가합니다.

  - root `<page>`에서 `getSeedClassName()` 대신 `useSeedClassName()`을 사용하면, host가 `lynx.__globalProps.theme`을 변경할 때 자동으로 리렌더되어 테마가 즉시 반영됩니다.
  - `getSeedClassName()` 순수 함수는 그대로 유지됩니다. 테마 변경에 반응할 필요가 없는 정적 컨텍스트에서 계속 사용할 수 있습니다.
  - `useGlobalProps()`에 의존하므로 `@lynx-js/react` `0.117.0` 이상이 필요합니다.

  ```tsx
  import { useSeedClassName } from "@seed-design/lynx-react";

  function Root() {
    const seedClassName = useSeedClassName({ colorMode: "system" });
    return (
      <page className={seedClassName}>
        <App />
      </page>
    );
  }
  ```

## 0.2.0

### Minor Changes

- c8d4c26: Lynx AppBar 컴포넌트를 추가합니다.

  - `AppBar.Root`, `AppBar.Left`, `AppBar.Main`, `AppBar.Right`, `AppBar.IconButton` 등 compound API를 제공합니다.
  - `SystemInfo.platform`에 따라 Android에서는 `android`, 그 외 플랫폼에서는 `cupertino` theme을 기본으로 적용합니다.
  - `theme` prop으로 platform 기본값을 수동 override할 수 있습니다.

- f039fb3: native element의 접근성 속성을 표준화한 `LynxAccessibilityProps` 타입을 추가했습니다. 컴포넌트가 이 타입을 확장해 `accessibility-label`/`accessibility-role-description`/`accessibility-value`/`accessibility-elements-hidden` 등을 받아 native element에 전달할 수 있습니다.
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

## 0.1.0

### Minor Changes

- 699af2c: SEED Design Lynx의 첫 stable 버전을 릴리즈합니다.

  - `@seed-design/lynx-css`: Lynx 환경에서 사용할 수 있는 SEED 디자인 토큰, base CSS, component recipe CSS를 제공합니다.
  - `@seed-design/lynx-react`: Lynx용 SEED React 컴포넌트와 hook을 제공합니다.
    - 컴포넌트: `ActionButton`, `BottomSheet`, `Box`, `Checkbox`, `HStack`, `ProgressCircle`, `RadioGroup`, `Switch`, `TagGroup`, `Text`, `VStack`
    - Hook: `useControllableState`, `useIconColor`, `usePressTap`, `useSafeArea`
    - Safe Area: `useSafeArea` API로 `env(safe-area-inset-*)`와 host 앱의 `lynx.__globalProps` fallback을 함께 지원합니다.
  - `@seed-design/cli`: Lynx framework 감지, registry snippet 추가, compatibility check, docs lookup 흐름을 지원합니다.
