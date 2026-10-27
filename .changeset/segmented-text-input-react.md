---
"@seed-design/react": minor
"@seed-design/css": minor
---

주민등록번호·카드번호처럼 여러 구간으로 나눠 입력받는 `SegmentedTextInput`을 추가합니다.

- `SegmentedTextInput.Root`는 입력 Segment 순서대로 값을 `string[]`(`value`·`defaultValue`·`onValueChange`)로 다루고, `Field` 안에서는 Field label을 group 이름으로 씁니다.
- `SegmentedTextInput.Segment`는 `length`만큼 입력받고 끝에서 채우면 다음 Segment로 이동합니다. 빈 Segment의 Backspace, 가장자리의 ←·→ 키, 붙여넣기 분배(`masked` Segment 앞에서 정지), `autoComplete="bday"` 날짜 정규화를 처리합니다. `masked`, `staticPrefix`·`staticSuffix`·`staticText`, `sizing`, `align`을 지원합니다.
- `SegmentedTextInput.Separator`와 `SegmentedTextInput.Suffix`를 함께 제공합니다.
