---
"@seed-design/react": major
"@seed-design/css": major
"@seed-design/rootage-artifacts": major
"@seed-design/lynx-react": major
"@seed-design/lynx-css": major
---

(BREAKING CHANGE: 기존 package `<Badge>` 사용을 새 Registry `<Badge>`로 교체하고 snippet을 다시 설치해야 합니다.) Badge를 Prefix와 Action을 지원하는 Registry 컴포넌트로 변경합니다.

- 라벨은 `children`으로 전달합니다.
- `prefix`에 `<IconHeartFill />` 같은 아이콘 요소를 바로 전달할 수 있습니다.
- `action`은 고정 정보 아이콘과 Action 속성을 제공하며, `render`로 Help Bubble trigger를 연결할 수 있습니다.
- `prefix`와 `action`은 타입에서 동시에 사용할 수 없습니다.
- Badge가 기본적으로 적용하던 최대 너비를 제거합니다.
- `npx @seed-design/cli@latest add ui:badge`로 최신 Registry snippet을 설치합니다.
