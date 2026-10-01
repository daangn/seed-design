---
"@seed-design/lynx-react-segmented-control": minor
"@seed-design/lynx-react": patch
---

Lynx SegmentedControl을 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-segmented-control`을 추가합니다. `value`·`defaultValue`·`onValueChange`, Root·Item `disabled`, Item 등록 순서, 눌림 상태, 접근성 기본값, Root·Item ref와 Indicator 배치용 `--segment-count`·`--segment-index` style을 제공합니다. Context는 React `@seed-design/react-segmented-control`과 같이 `SegmentedControlProvider`·`useSegmentedControlContext({ strict })`, `SegmentedControlItemProvider`·`useSegmentedControlItemContext({ strict })`로 공개합니다. `@seed-design/lynx-react` SegmentedControl은 사용법을 유지하며 이 패키지 위에 Recipe·Scale Feedback·label·notification·Indicator를 조립합니다.
