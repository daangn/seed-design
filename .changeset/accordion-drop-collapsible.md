---
"@seed-design/react": minor
"@seed-design/react-accordion": minor
---

`Accordion`의 `collapsible` prop 제거 및 `RootProps` 타입 정리.

- 단일 확장 모드에서 `collapsible={false}`로 "항상 하나는 열려있게" 강제하던 동작은 controlled 패턴으로 동등하게 구현할 수 있어 prop을 제거합니다. `useState` + `onValuesChange` 가드(빈 배열일 때 setter를 호출하지 않음)로 대체하세요.
- `@seed-design/react-accordion`의 `UseAccordionProps`를 단일 `interface`로 통합하고, `@seed-design/react`/`@seed-design/react-accordion`의 `RootProps`를 다른 슬롯과 동일하게 `type` → `interface`로 정리합니다.
