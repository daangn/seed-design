# @seed-design/lynx-react-text-field

## 1.2.1

### Patch Changes

- 4b1d559: `@lynx-js/react` peer dependency 하한을 `>=0.100.0`에서 `>=0.117.0`으로 올려 Lynx 패키지 전체와 맞춥니다.
- Updated dependencies [4b1d559]
  - @seed-design/lynx-react-field@1.0.1
  - @seed-design/lynx-react-keyboard-avoiding-scroll-view@1.0.2

## 1.2.0

### Minor Changes

- eac5adc: `KeyboardAvoidingScrollView` 안의 `TextField.Input`·`TextField.Textarea`·`SegmentedTextInput.Segment`는 `android-set-soft-input-mode`를 생략하면 `"nothing"`을 적용합니다. Android에서 window와 스크롤 영역이 함께 키보드를 피하지 않도록 직접 지정하던 값을 지정하지 않아도 됩니다. 그 밖의 위치에서는 기존처럼 `"unspecified"`를 적용하고, 직접 지정한 값을 그대로 따릅니다.

## 1.1.0

### Minor Changes

- d4ec62d: `useTextFieldInput`이 native 입력의 `blur` UI method를 호출하는 `blur`를 함께 반환합니다. 제출 뒤 키보드를 내릴 때 사용합니다.

## 1.0.0

### Major Changes

- a684488: (BREAKING CHANGE: `@seed-design/lynx-react`, `@seed-design/lynx-css`, 직접 설치한 모든 `@seed-design/lynx-react-*` 패키지를 함께 `^1.0.0`으로 올리고 [SEED Lynx 1 업그레이드 가이드](https://seed-design.io/lynx/updates/upgrade/v1)에 따라 코드를 수정해야 합니다.)
  
  SEED Lynx 패키지를 `1.0.0`으로 출시하고, 이후 버전부터 semver에 따라 호환성을 안내합니다.
  
  - 기존 코드의 수정이 필요한 변경은 major 버전으로, 기존 사용법을 유지하는 기능 추가는 minor 버전으로, 오류 수정은 patch 버전으로 배포합니다.

### Minor Changes

- cbbb6fe: SEED 스타일 없이 텍스트 입력을 조합할 수 있는 `@seed-design/lynx-react-text-field`를 추가합니다.
  
  - `TextField.Root`·`Input`·`Textarea`와 `useTextField`·`useTextFieldInput`으로 제어·비제어 입력과 `disabled`·`readOnly`·`invalid` 상태를 지원합니다.
  - `Field.Root`의 상태와 포커스를 연동합니다.
  - `useTextFieldWithGraphemes`로 사용자에게 보이는 글자 단위의 길이를 세고, `maxGraphemeCount`로 제한한 값을 `onValueChange`의 `slicedValue`로 받을 수 있습니다.

### Patch Changes

- Updated dependencies [caf429b]
- Updated dependencies [575cdfe]
- Updated dependencies [a684488]
  - @seed-design/lynx-react-field@1.0.0
  - @seed-design/lynx-react-keyboard-avoiding-scroll-view@1.0.0
