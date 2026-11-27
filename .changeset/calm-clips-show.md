---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

Attachment Field·Attachment Display Field의 항목에 동영상 재생시간을 표시할 수 있습니다.

- `npx @seed-design/cli@latest add ui:attachment-field`(또는 `ui:attachment-display-field`)로 Registry 컴포넌트를 다시 설치하면 `AttachmentInputItemDurationBadge`·`AttachmentDisplayItemDurationBadge`를 사용할 수 있습니다.
- `seconds`에 재생시간(초)을 넘기면 항목의 왼쪽 위에 `2:05`, `1:02:05` 형식으로 표시하고, 스크린리더에는 "재생시간 1시간 2분 5초" 같은 `accessibility-label`을 제공합니다.
- 표시 문구를 직접 정하려면 `AttachmentInput.ItemDurationBadge`·`AttachmentDisplay.ItemDurationBadge`에 children으로 넘깁니다.
