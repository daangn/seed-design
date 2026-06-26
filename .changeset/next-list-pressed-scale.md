---
"@seed-design/css": minor
"@seed-design/react": minor
---

`NextList` 컴포넌트를 추가합니다. 기존 `List`의 후속 컴포넌트로, "이 행이 어떻게 동작하는지(버튼/링크/폼 컨트롤)"를 결정하는 책임을 스니펫이 아닌 라이브러리로 옮겼습니다.

- `NextList.Root`, `NextList.Item`, `NextList.ButtonItem`, `NextList.AnchorItem`, `NextList.CheckboxItem`, `NextList.RadioItem`, `NextList.SwitchItem`, `NextList.Content`, `NextList.Prefix`, `NextList.Suffix`, `NextList.Title`, `NextList.Detail`를 제공합니다.
- 누를 수 있는 모든 행에 행 전체가 축소되는 pressed scale 피드백이 적용됩니다(배경 레이어와 레이아웃 레이어가 독립적으로 동작). `suffix`/`prefix`의 보조 버튼을 누를 때는 해당 요소만 반응하고 행은 축소되지 않습니다.
- scale 값은 토큰으로 관리되어 `prefers-reduced-motion` 설정 시 비활성화됩니다.
- `@seed-design/css`에 `next-list-item` recipe가 추가됩니다.

기존 `List`는 변경 없이 유지됩니다.
