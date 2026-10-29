---
"@seed-design/css": minor
"@seed-design/stackflow": minor
---

`AppBar.TextButton`을 추가합니다. "완료", "닫기"처럼 짧은 텍스트로 동작을 표시하는 App Bar 버튼입니다.

- `npx @seed-design/cli@latest add ui:app-screen`으로 Registry 컴포넌트를 다시 설치하면 `AppBarTextButton`을 사용할 수 있습니다. 갱신한 snippet은 `@seed-design/stackflow` 2.1.0 이상과 `@seed-design/css` 3.1.0 이상이 필요합니다.
- `theme="cupertino"`에서는 레이블이 최대 너비를 넘으면 말줄임표로 줄입니다.
- 누름 배경과 `disabled` 비활성 색상을 지원하고, `asChild`로 다른 요소를 버튼으로 렌더할 수 있습니다.
