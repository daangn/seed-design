---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `@seed-design/lynx-react`에서 가져온 `<Badge>`와 `BadgeProps`를 `ui:badge` snippet의 `Badge`와 `BadgeProps`로 교체해야 합니다. `npx @seed-design/cli@latest add ui:badge`로 snippet을 설치한 뒤 import를 바꾸세요.) Badge에 아이콘을 표시하는 Prefix와 정보 아이콘 버튼을 표시하는 Action을 추가하고, 완성된 Badge를 snippet으로 제공합니다.

- `Badge`는 JSX 컴포넌트가 아니라 `Badge.Root`, `Badge.Prefix`, `Badge.Label`, `Badge.Action`으로 구성된 namespace로 바뀌며, `BadgeProps` export를 제거합니다.
- snippet의 `Badge`에는 라벨을 `children`으로 전달하며, 기존 `tone`, `variant`, `size`를 그대로 사용할 수 있습니다.
- `prefix`에 아이콘 요소를 바로 전달할 수 있습니다.
- `actionProps`를 전달하면 고정된 정보 아이콘 버튼을 표시합니다. `actionProps`에 `accessibility-label`과 `bindtap`을 전달해 동작을 연결할 수 있으며, `prefix`와 함께 사용할 수 있습니다.
- Badge에 기본으로 적용되던 최대 너비를 제거합니다. 한 줄 말줄임이 필요하다면 최대 너비를 직접 지정하세요.
