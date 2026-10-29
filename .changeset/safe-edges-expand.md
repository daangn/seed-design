---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
"@seed-design/lynx-react-tabs": minor
---

Lynx 컴포넌트가 콘텐츠의 안전 영역을 유지하면서 배경과 스크롤 영역을 화면 가장자리까지 확장할 수 있도록 지원합니다.

- `Tabs`, `ChipTabs`, `PageBanner`, `AttachmentInput`, `AttachmentDisplay`에 기본값이 `false`인 `extendSafeAreaX` 옵션을 추가합니다.
- `Tabs.List`의 `viewportInsets`로 선택한 탭을 안전 영역 안에 정렬할 수 있습니다.
- `ImageFrame`의 Safe Area bleed에 따라 Floater의 시작·끝·중앙 위치를 보정합니다.
- Attachment Display Field Registry snippet을 최신화하면 `controlProps.extendSafeAreaX`로 첨부 목록을 확장할 수 있습니다.
