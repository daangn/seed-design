---
"@seed-design/css": minor
"@seed-design/react": minor
---

`NextList` 컴포넌트를 추가합니다. "이 행이 어떻게 동작하는지(버튼/링크/폼 컨트롤)"를 결정하는 책임을 스니펫이 아닌 라이브러리가 맡는 List 컴포넌트입니다.

- `NextList.Root`, `NextList.RadioRoot`, `NextList.Item`, `NextList.ButtonItem`, `NextList.AnchorItem`, `NextList.CheckboxItem`, `NextList.RadioItem`, `NextList.SwitchItem`, `NextList.Content`, `NextList.Prefix`, `NextList.Suffix`, `NextList.Title`, `NextList.Detail`, `NextListHeader`를 제공합니다.
- 누를 수 있는 모든 행에 행 전체가 축소되는 pressed scale 피드백이 적용됩니다(배경 레이어와 레이아웃 레이어가 독립적으로 동작). `suffix`/`prefix`의 보조 버튼을 누를 때는 해당 요소만 반응하고 행은 축소되지 않습니다.
- `@seed-design/css`에 `next-list-item` recipe가 추가됩니다.

기존 `List`(`List.*`)와 `ListHeader`를 deprecated 처리하고 `NextList`, `NextListHeader`로 안내합니다. `@seed-design/react@4.0.0`에서 제거될 예정입니다. 동작은 그대로이며, `List.Root`, `List.RadioRoot`, `ListHeader`는 각각 `NextList.Root`, `NextList.RadioRoot`, `NextListHeader`와 같은 컴포넌트입니다.
