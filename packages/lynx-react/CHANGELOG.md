# @seed-design/lynx-react

## 0.5.2

### Patch Changes

- 844d91c: `TextField.Input`과 `TextField.Textarea`의 native 값이 blur 시 controlled value와 달라지는 문제를 수정합니다.
- 55103a6: Lynx `Radio Group`에서 라디오 표시와 라벨의 상단 여백이 적용되지 않아 수직 정렬이 어긋나던 문제를 수정합니다.
- f446304: Lynx Tabs가 초기 렌더링 시 선택된 탭으로 이동하면서 Label 색상과 Indicator 위치·크기를 전환하던 문제를 수정합니다.

## 0.5.1

### Patch Changes

- f3755b4: Lynx Tabs의 Indicator 위치를 수정합니다.

  - Android에서 선택한 탭으로 Indicator가 이동하지 않는 문제를 수정합니다.
  - `triggerLayout="hug"`에서 Indicator가 List의 좌측 gutter와 어긋나는 문제를 수정합니다.

## 0.5.0

### Minor Changes

- 6af8a34: Lynx에서 Divider를 사용할 수 있도록 컴포넌트와 공개 API를 추가합니다.
- ff225ee: Lynx에 `Callout` 컴포넌트를 추가합니다.

  - `neutral`, `informative`, `positive`, `warning`, `critical`, `magic` tone을 지원합니다.
  - actionable 및 controlled/uncontrolled dismiss 동작을 지원합니다.
  - `npx @seed-design/cli@latest add ui:callout`로 Registry 컴포넌트를 설치할 수 있습니다.

- bd5cd3b: Lynx용 Accordion 컴포넌트를 추가합니다.

  - controlled 및 uncontrolled 상태와 단일·다중 펼치기를 지원합니다.
  - 콘텐츠 높이를 측정해 펼치고 접을 때 height transition을 적용합니다.
  - `inline`, `separated` variant와 `medium`, `large` size를 제공합니다.
  - Trigger에 펼침 상태와 비활성 상태를 전달하는 Lynx 접근성 속성을 제공합니다.

- 6f6c626: Lynx용 Tabs 컴포넌트를 추가합니다.

  - 탭 선택과 콘텐츠 좌우 스와이프를 지원합니다.
  - 제어형·비제어형 상태, disabled 탭, 균등·콘텐츠 기반 너비, 이동하는 Indicator를 제공합니다.
  - `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`, `Tabs.Carousel` API로 구성할 수 있습니다.

- ca0931b: Lynx Checkbox의 ghost 상태 전환을 안정화합니다.

  - 선택 해제 시 배경이 순간적으로 어두워지는 현상을 수정합니다.
  - 선택 상태가 변경될 때 아이콘 색상이 즉시 반영되도록 개선합니다.
  - `@seed-design/lynx-react`와 `@seed-design/lynx-css`를 함께 업데이트해야 합니다.

- aef119e: Bottom Sheet의 content 최대 너비를 480px로 맞춥니다.

  - 넓은 뷰포트에서 시트가 화면 폭 전체로 늘어나지 않고 480px에서 멈추며 가운데 정렬됩니다. 480px보다 좁은 화면에서는 기존과 동일하게 화면을 채웁니다.
  - `BottomSheetContent`가 시트를 왼쪽에 고정하던 인라인 `left` 값을 풀어, 폭이 제한됐을 때 좌우 여백이 같게 배치됩니다. `style`로 `left`를 직접 지정하면 그 값이 우선합니다.

## 0.4.1

### Patch Changes

- 598cd3a: iOS에서 `TextFieldTextarea`의 첫 입력 시 자동 높이가 세로 여백만큼 불필요하게 늘어나는 문제를 수정합니다.
- fdf4575: Lynx `TagGroup`의 문자열 구분자 앞뒤 공백을 제거해 브라우저 프리뷰와 네이티브 Lynx에서 항목 간격이 다르게 보이는 문제를 수정합니다.
- 5a7ca99: iOS에서 `TextFieldTextarea`의 자동 높이 영역을 눌렀을 때 포커스가 해제되어 키를 입력할 수 없는 문제를 수정합니다.
- 554cca0: iOS에서 `VStack`과 `HStack`의 `gap`에 SEED 간격 토큰을 사용하면 간격이 사라지는 문제를 수정합니다.
- 21aa395: Lynx `ProgressCircle`의 indeterminate 상태가 첫 화면부터 표시되도록 수정합니다.

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
