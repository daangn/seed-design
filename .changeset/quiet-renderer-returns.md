---
"@seed-design/react-snackbar": patch
"@seed-design/react-attachment-display": patch
"@seed-design/react-file-upload": patch
"@seed-design/react": patch
---

TypeScript 5.0 이하나 `@types/react` 18.2.7 이하에서 `Snackbar.Renderer`, `AttachmentDisplay.Context`, `AttachmentInput.Context`를 JSX 컴포넌트로 쓸 수 없다는 TS2786 오류가 나던 문제를 수정합니다.
