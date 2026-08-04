---
"@seed-design/react-floating": minor
---

`usePositionedFloating`에 safe-area 대응과 open 변경 상세 정보 전달을 추가합니다.

- `safeAreaAware` 옵션(기본 `false`)을 추가합니다. 켜면 flip/shift/size가 뷰포트 가장자리 대신 safe-area 안쪽을 충돌 경계로 삼아, 노치와 홈 인디케이터를 피해 배치됩니다.
- floating element에 `--seed-popover-available-height`를 함께 설정합니다. 기존 `--seed-popover-available-width`와 같은 방식으로 사용할 수 있습니다.
- 두 번째 인자로 `getChangeDetails`를 받습니다. floating-ui가 전달하는 `(event, reason)`을 원하는 형태로 변환해 `onOpenChange`의 두 번째 인자로 받을 수 있습니다.
- 닫히는 애니메이션이 끝날 때까지 `autoUpdate`를 유지하도록 수정합니다. 퇴장 중에도 앵커링이 유지되며, 스크롤할 때마다 리스너가 다시 붙던 문제도 함께 해소됩니다.

```tsx
const floating = usePositionedFloating<ReferenceType, MyDetails>(
  { safeAreaAware: true, onOpenChange: (open, details) => { ... } },
  (event, reason) => (reason === "click" ? { reason: "trigger", event } : undefined),
);
```
