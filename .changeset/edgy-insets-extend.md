---
"@seed-design/css": minor
"@seed-design/react": minor
"@seed-design/react-tabs": patch
---

Tabs, Chip Tabs, Page Banner, Attachment Input, Attachment Display에 `extendSafeAreaX` 속성을 추가합니다. 지정하면 배경과 스크롤 영역이 좌우 safe area inset까지 화면 끝으로 넓어지고, 탭, chip, 항목, 글자 같은 내용은 safe area 안에 남습니다.

- 선택하거나 포커스한 탭, chip, 항목을 화면 안으로 스크롤할 때 safe area inset 아래에 멈추지 않습니다.
- Image Frame에 `bleedX="safeArea"`를 지정하면 `ImageFrameFloater`도 safe area 안에 놓입니다.
- `npx @seed-design/cli@latest add ui:attachment-display-field`로 Registry 컴포넌트를 최신화하면 `AttachmentDisplayField`의 `controlProps`로 `extendSafeAreaX`를 지정할 수 있습니다.
