---
"@seed-design/react-floating": minor
---

`usePositionedFloating`에 가용 높이 계산과 open 변경 상세 정보 전달을 추가합니다.

- floating element에 `--seed-popover-available-height`를 함께 설정합니다. 기존 `--seed-popover-available-width`와 같은 방식으로 사용할 수 있습니다.
- 두 번째 인자로 `getChangeDetails`를 받습니다. floating-ui가 전달하는 `(event, reason)`을 원하는 형태로 변환해 `onOpenChange`의 두 번째 인자로 받을 수 있습니다.

```tsx
const floating = usePositionedFloating<ReferenceType, MyDetails>(
  { onOpenChange: (open, details) => { ... } },
  (event, reason) => (reason === "click" ? { reason: "trigger", event } : undefined),
);
```
