---
"@seed-design/react-file-upload": minor
"@seed-design/react": minor
---

이미지 미리보기를 Root의 `accept`가 아니라 항목의 레이아웃 기준으로 만듭니다.

- `useFileUploadItem(fileEntry, { imagePreview })`로 미리보기(`imageProps`)를 만들지 정할 수 있습니다. 기본값은 지금처럼 Root의 `accept`가 이미지 전용일 때 `true`입니다.
- `AttachmentInput.Item`에 `type="image"`를 넘기면 `accept="image/*,video/*"`처럼 이미지가 아닌 형식이 섞여 있어도 `AttachmentInput.ItemImage`가 미리보기를 렌더링합니다.
