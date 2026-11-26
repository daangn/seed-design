---
"@seed-design/react-file-upload": minor
"@seed-design/react": minor
---

Attachment Field의 이미지 미리보기를 Root의 `accept`가 아니라 항목의 레이아웃 기준으로 만듭니다. Registry 컴포넌트는 다시 설치하지 않아도 됩니다.

- `AttachmentInputItem`에 `type="image"`를 넘기면 `accept="image/*,video/*"`처럼 이미지가 아닌 형식이 섞여 있어도 이미지 미리보기를 렌더링합니다.
- 이미지 전용 `accept`에서 `AttachmentInputItem`에 `type="general"`을 넘기면 파일 레이아웃 안에 미리보기 이미지가 함께 그려지던 문제를 고칩니다.
- `useFileUploadItem(fileEntry, { imagePreview })`로 미리보기(`imageProps`)를 만들지 직접 정할 수 있습니다. 기본값은 지금처럼 Root의 `accept`가 이미지 전용일 때 `true`입니다.
