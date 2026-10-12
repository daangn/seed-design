---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: 스크린 리더가 읽어야 하는 `Icon`·`PrefixIcon`·`SuffixIcon`·`TextField.PrefixIcon`·`TextField.SuffixIcon`·`AttachmentInput.TriggerIcon`에는 `accessibility-elements-hidden={false}`를 지정해야 합니다.)

장식용 아이콘을 기본적으로 접근성 트리에서 숨깁니다.

- 이전에는 위 아이콘에 숨김 기본값이 없어 접근성 트리에 포함될 수 있었습니다. 이제 `accessibility-elements-hidden`의 기본값이 `true`이므로 스크린 리더가 별도로 읽지 않습니다.
- 아이콘의 의미를 감싼 컴포넌트에서 안내한다면 해당 컴포넌트의 `accessibility-label`로 설명합니다.
