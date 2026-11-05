---
"@seed-design/lynx-react-text-field": minor
"@seed-design/lynx-react": minor
---

`KeyboardAvoidingScrollView` 안의 `TextField.Input`·`TextField.Textarea`·`SegmentedTextInput.Segment`는 `android-set-soft-input-mode`를 생략하면 `"nothing"`을 적용합니다. Android에서 window와 스크롤 영역이 함께 키보드를 피하지 않도록 직접 지정하던 값을 지정하지 않아도 됩니다. 그 밖의 위치에서는 기존처럼 `"unspecified"`를 적용하고, 직접 지정한 값을 그대로 따릅니다.
