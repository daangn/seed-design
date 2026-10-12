---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `AttachmentDisplay.Root`·`useAttachmentDisplay`의 `onTriggerTap`을 제거하고, 파일 선택 함수를 `AttachmentDisplay.Trigger`의 `bindtap`에 연결해야 합니다.)

`AttachmentDisplay`의 파일 선택 동작을 Root의 callback에서 Trigger의 tap handler로 옮깁니다.

- 이전에는 Trigger를 누르면 Root에 전달한 `onTriggerTap`을 호출하며 `addEntries`·`updateEntryStatus`를 인자로 제공했습니다. 이제 Trigger는 자신의 `bindtap`을 호출합니다.
- 선택한 항목과 업로드 상태는 `AttachmentDisplay.Context` 또는 `useAttachmentDisplayContext`의 `addEntries`·`updateEntryStatus`로 갱신합니다.
- Registry `ui:attachment-display-field`의 `AttachmentDisplay.onTriggerTap`은 유지합니다. 이 변경은 `@seed-design/lynx-react`에서 가져온 컴포넌트와 훅에만 적용합니다.
