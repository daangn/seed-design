# @seed-design/lynx-react-segmented-text-input

## 1.0.1

### Patch Changes

- 4b1d559: `@lynx-js/react` peer dependency 하한을 `>=0.100.0`에서 `>=0.117.0`으로 올려 Lynx 패키지 전체와 맞춥니다.
- Updated dependencies [4b1d559]
  - @seed-design/lynx-react-field@1.0.1
  - @seed-design/lynx-react-text-field@1.2.1
  - @seed-design/lynx-react-use-controllable-state@1.0.1

## 1.0.0

### Major Changes

- b23bf93: Lynx SegmentedTextInput을 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-segmented-text-input`을 추가합니다.
  
  - `SegmentedTextInput.Root`(`useSegmentedTextInput`)는 입력 Segment 순서대로 값을 `string[]`로 다루고, `Field` 안에서는 Field의 상태와 focus를 따릅니다. Context는 `SegmentedTextInputProvider`·`useSegmentedTextInputContext({ strict })`로 공개합니다.
  - `SegmentedTextInput.Segment`(`useSegmentedTextInputSegment`·`useSegmentedTextInputSegmentInput`)는 `@seed-design/lynx-react-text-field` 위에서 Segment마다 native `<input>`을 연결합니다. 끝에서 채우면 다음 Segment로 이동하고, 한 번에 여러 글자가 들어오면 붙여넣기로 보고 나눠 채웁니다(`masked`·`readOnly` Segment 앞에서 정지). `masked` caret 고정, `autoComplete="bday"` 정규화, IME 조합 판단을 처리합니다.
  - `@seed-design/lynx-react`의 `SegmentedTextInput`은 사용법과 렌더링 결과를 유지하며 이 패키지 위에 Recipe·stroke·점·정적 내용을 조립합니다.

### Patch Changes

- Updated dependencies [eac5adc]
  - @seed-design/lynx-react-text-field@1.2.0
