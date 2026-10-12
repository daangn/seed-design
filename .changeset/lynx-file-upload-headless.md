---
"@seed-design/lynx-react-file-upload": minor
---

SEED 스타일 없이 파일 첨부 UI를 조합할 수 있는 `@seed-design/lynx-react-file-upload`를 추가합니다.

- `FileUpload.Root`·`Trigger`와 `useFileUpload`로 첨부 목록과 업로드 상태를 관리합니다.
- `useFileUploadItem`의 결과를 `FileUploadItemProvider`로 전달해 `ItemName`·`ItemSize`·`ItemImage`·`ItemBackdrop`·`ItemRemoveButton`을 조합합니다.
- `onSelectFiles`에 앱의 파일 선택 함수를 연결하고, `accept`·`minFileSize`·`maxFileSize`·`maxFiles`·`validate`로 첨부 조건을 지정할 수 있습니다.
- 실제 업로드는 앱에서 `onFileAccept`로 시작하고, `updateFileEntryStatus`로 상태를 갱신합니다.
