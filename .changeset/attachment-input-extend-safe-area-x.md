---
"@seed-design/css": minor
"@seed-design/react": minor
---

Attachment Input과 Attachment Display에 `extendSafeAreaX` 속성을 추가합니다. 지정하면 항목 목록이 `--seed-attachment-input-extend-x`에 좌우 safe area inset을 더한 만큼 넓어져 화면 끝까지 스크롤되고, 첫 항목과 마지막 항목은 safe area 안에 남습니다.

- `npx @seed-design/cli@latest add ui:attachment-display-field`로 Registry 컴포넌트를 최신화하면 `AttachmentDisplayField`에서도 `extendSafeAreaX`를 사용할 수 있습니다.
