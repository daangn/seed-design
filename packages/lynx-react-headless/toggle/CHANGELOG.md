# @seed-design/lynx-react-toggle

## 1.0.0

### Major Changes

- bc976a5: (BREAKING CHANGE: `ToggleContext.Provider`를 `ToggleProvider`로, `useToggleContext("호출자 이름")`을 `useToggleContext()`로 변경해야 합니다. Provider 밖에서 선택적으로 호출한다면 `useToggleContext({ strict: false })`를 사용하고 반환값이 `null`인 경우를 처리해야 합니다.)
  
  Toggle의 context API를 React와 같은 Provider와 strict 옵션 형태로 변경합니다.
  
  - 직접 사용하던 `ToggleContext` export를 제거하고 `ToggleProvider`를 제공합니다.
  - `useToggleContext`는 호출자 이름 문자열 대신 `{ strict }` 옵션을 받습니다. 기본 호출은 Provider가 필요하며, `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- b1a262d: (BREAKING CHANGE: `Accordion.Trigger`의 `accessibility-value`를 `expandedAccessibilityValue`·`collapsedAccessibilityValue`로 변경하고, `accessibility-traits` 사용을 제거해야 합니다. `accessibility-traits`를 직접 덮어쓰는 대체 API는 제공하지 않습니다.)
  
  Lynx 컴포넌트가 일부만 받던 native 속성을 각 파트가 렌더링하는 요소의 속성으로 확장하며, 상태를 알리는 일부 접근성 값은 컴포넌트 상태를 따르도록 변경합니다.
  
  - 각 파트의 native 요소에 맞는 `id`·`accessibility-*`·`bind*`·`main-thread:*`·`data-*`와 `ref`를 전달할 수 있습니다. `BottomSheet`·`MenuSheet`의 파트와 `AttachmentInput.Root`도 지원하며, `Box`의 터치 handler는 이벤트 인자를 받습니다.
  - 일반 속성은 사용자 값이 기본값보다 우선합니다. `className`은 합치고 `style`은 key 단위로 합치며, 이벤트 handler와 `ref`는 내부 값과 함께 실행합니다.
  - 이전에는 `Accordion.Trigger`의 `accessibility-value`·`accessibility-traits`를 직접 덮어쓸 수 있었습니다. 이제 열림·비활성 상태에 맞는 값을 유지하고, 열림 상태 문구만 `expandedAccessibilityValue`·`collapsedAccessibilityValue`로 지정합니다.
  - 비활성 또는 로딩 중 탭을 차단하는 컴포넌트의 `bindtap`·`main-thread:bindtap`은 기존처럼 호출하지 않습니다. `QuantityPicker.DecrementButton`의 삭제 상태 문구도 기존처럼 `Root.removeAccessibilityLabel`로 지정합니다.
- 8653a08: `useToggle`에 사용자 tap·touch handler를 지정해 커스텀 동작과 선택 상태 전환을 함께 처리할 수 있습니다.
  
  - `bindtap`·`main-thread:bindtap`·`main-thread:bindtouchstart`·`main-thread:bindtouchend`·`main-thread:bindtouchcancel`을 지원합니다.
  - `bindtap`은 선택 상태 변경 전에 호출하며, `disabled`이면 tap handler와 선택 변경을 막습니다.
  - 이전에는 이벤트 handler만 제공하던 `rootProps`에 toggle button의 접근성 역할과 `"pressed"`·`"not pressed"` 상태를 추가합니다.

### Patch Changes

- Updated dependencies [d8228c3]
- Updated dependencies [bc976a5]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-use-press-tap@1.0.0
  - @seed-design/lynx-react-use-controllable-state@1.0.0

## 0.1.0

### Minor Changes

- fa699aa: Lynx 요소의 선택 상태와 사용자 입력을 관리하는 headless `Toggle` 컴포넌트를 추가합니다.

  - `Toggle.Root`가 native `view` 요소에 tap·touch 이벤트와 접근성 속성을 연결하고, 하위 컴포넌트에 상태를 공유합니다.
  - `pressed`, `defaultPressed`, `onPressedChange`로 controlled/uncontrolled 선택 상태를 구성하고, `disabled`로 사용자 입력에 의한 토글을 막을 수 있습니다.
  - 선택 상태와 별도로 터치 중인 상태를 관리하며, 터치가 취소되거나 비활성화되면 터치 중인 상태를 해제합니다.
  - 직접 동작을 구성하는 `useToggle`과 하위 컴포넌트에서 상태를 읽는 `useToggleContext`를 함께 제공합니다. 시각적 스타일은 사용처에서 지정합니다.

### Patch Changes

- Updated dependencies [fa699aa]
  - @seed-design/lynx-react-use-controllable-state@0.1.0
  - @seed-design/lynx-react-use-press-tap@0.1.0
