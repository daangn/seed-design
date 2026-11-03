---
"@seed-design/lynx-react": minor
"@seed-design/lynx-css": minor
---

주민등록번호·카드번호처럼 여러 구간으로 나눠 입력받는 `SegmentedTextInput`을 추가합니다. API는 `@seed-design/react`의 `SegmentedTextInput`을 따릅니다.

- `SegmentedTextInput.Root`는 입력 Segment 순서대로 값을 `string[]`(`value`·`defaultValue`·`onValueChange`)로 다루고, `Field` 안에서는 Field의 상태와 focus를 따릅니다.
- `SegmentedTextInput.Segment`는 Segment마다 native `<input>`을 두고 `length`만큼 입력받습니다. 끝에서 채우면 다음 Segment로 이동하고, 한 번에 여러 글자가 들어오면 붙여넣기로 보고 나눠 채웁니다(`masked`·`readOnly` Segment 앞에서 정지). `masked`, `readOnly`, `type`, `autoComplete="bday"` 정규화, `staticPrefix`·`staticSuffix`·`staticText`, `sizing`, `align`을 지원합니다.
- 빈 Segment의 Backspace 이동과 방향키 이동은 지원하지 않습니다. 빈 native 입력의 지우기에는 입력 이벤트가 오지 않습니다.
- `masked` Segment는 native 글자를 숨기고 자리 수만큼 점과 caret을 직접 그립니다. caret은 값 끝에 고정되고, `type`의 키보드가 그대로 열립니다.
- `SegmentedTextInput.Separator`, `SegmentedTextInput.Suffix`, 7×7 점을 그리는 `SegmentedTextInput.Dots`(`staticText`·`staticPrefix`·`staticSuffix`·`placeholder`에 넣음)를 함께 제공합니다.
