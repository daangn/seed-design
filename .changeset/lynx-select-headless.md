---
"@seed-design/lynx-react-select": minor
---

SEED 스타일 없이 Lynx Select를 조합하는 `@seed-design/lynx-react-select`를 추가합니다. React `@seed-design/react-select`와 같은 `Root`·`Trigger`·`Value`·`Placeholder`·`Positioner`·`Content`·`Group`·`GroupLabel`·`Item` 파트와 Lynx 목록 viewport인 `ScrollArea`, `useSelect`·`useSelectTrigger`·`useSelectItem`·`useSelectScrollArea`로 controlled·uncontrolled 값·열림 상태, 단일·다중 선택, 항목 등록과 표시 값(`formatValue`) 해석, `disabled`·`readOnly`, `onOpenChange` reason(`trigger`·`interactOutside`·`itemSelect`·`dismiss`), 접근성과 ref, 위치 계산과 선택 항목 스크롤을 제공합니다. Field 상태는 읽지 않으므로 `disabled`·`readOnly`·`invalid`·`required`는 호출자가 넘깁니다. Context는 `SelectProvider`·`useSelectContext({ strict })`, `SelectItemProvider`·`useSelectItemContext({ strict })`로 공개합니다. `Positioner`는 lynx-ui `OverlayView`를 사용하며 `container`를 지정하면 native overlay에 렌더링하고, 닫힌 동안에도 mount해 `defaultValue`의 label·icon을 열기 전에 해석합니다.
