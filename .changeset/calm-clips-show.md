---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

Attachment Input과 Attachment Display 항목에 동영상 재생시간을 표시하는 `AttachmentInput.ItemDurationBadge`와 `AttachmentDisplay.ItemDurationBadge`를 추가합니다.

- children으로 넘긴 재생시간 문자열을 항목의 왼쪽 위에 표시합니다. `ItemBadge`와 함께 사용할 수 있습니다.
- `npx @seed-design/cli@latest add ui:attachment-field` 또는 `ui:attachment-display-field`로 최신 Registry 컴포넌트를 설치하면 `seconds`만 넘기는 `AttachmentInputItemDurationBadge`·`AttachmentDisplayItemDurationBadge`를 사용할 수 있습니다. 재생시간을 `2:05`, `1:02:05` 형식으로 표시하고, 스크린리더에는 "재생시간 1시간 2분 5초" 같은 `accessibility-label`을 제공합니다.
