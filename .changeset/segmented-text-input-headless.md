---
"@seed-design/react-segmented-text-input": major
---

여러 입력 Segment를 하나의 필드처럼 다루는 headless `SegmentedTextInput`을 추가합니다.

- `SegmentedTextInput.Root`(`useSegmentedTextInput`)는 입력 Segment 순서대로 값을 `string[]`로 다루고 `role="group"`과 focus·disabled·readOnly·invalid 상태를 제공합니다.
- `SegmentedTextInput.Segment`(`useSegmentedTextInputSegment`)는 `length`만큼 입력받고 끝에서 채우면 다음 Segment로 이동합니다. 빈 Segment의 Backspace, 가장자리의 ←·→ 키, 붙여넣기 분배(`masked` Segment 앞에서 정지), `autoComplete="bday"` 날짜 정규화, IME 조합 중 자동 이동 보류를 처리합니다.
- `SegmentedTextInput.Separator`와 `SegmentedTextInput.StaticText`는 보조기기에서 읽지 않는 장식 요소입니다.
