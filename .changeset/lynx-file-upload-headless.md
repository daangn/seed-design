---
"@seed-design/lynx-react-file-upload": minor
"@seed-design/lynx-react": minor
---

Lynx AttachmentInput을 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-file-upload`를 추가합니다. `NativeFile` 첨부 목록의 controlled·uncontrolled 상태, `onSelectFiles` picker의 취소·실패·unmount 처리, `accept`·`minFileSize`·`maxFileSize`·`validate`·`maxFiles` 검증과 거부 코드, 상태 갱신·삭제·정리·순서 변경 guard, `Root`·`Trigger`·`ItemName`·`ItemSize`·`ItemImage`·`ItemBackdrop`·`ItemRemoveButton`·`Context` 파트를 제공합니다. Context는 React `@seed-design/react-file-upload`와 같이 `FileUploadProvider`·`useFileUploadContext({ strict })`, item은 `FileUploadItemProvider`·`useFileUploadItemContext({ strict })`로 공개합니다. Field 상태 fallback은 포함하지 않습니다.

`@seed-design/lynx-react` AttachmentInput은 사용법을 유지하며 이 패키지 위에 Recipe와 Field 상태 fallback을 조립합니다. `useAttachmentInputContext`·`useAttachmentInputItemContext`가 `{ strict: false }`를 받아 Provider 밖에서 `null`을 반환할 수 있고, Trigger·ItemRemoveButton native view에 불필요한 `pressed` 속성을 더 이상 붙이지 않습니다.
