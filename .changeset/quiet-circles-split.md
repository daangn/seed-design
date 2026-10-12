---
"@seed-design/lynx-react-progress": minor
---

SEED 스타일 없이 원형 진행 상태를 조합할 수 있는 `@seed-design/lynx-react-progress`를 추가합니다. `ProgressCircle.Root`·`ProgressCircle.Track`·`ProgressCircle.Range`, `useProgress`, `ProgressCircleProvider`와 `useProgressCircleContext`를 제공합니다.

- `value`·`minValue`·`maxValue`로 진행률과 접근성 값을 계산하며, `value`를 생략하면 indeterminate 상태가 됩니다.
- `Track`은 전체 배경 링, `Range`는 완료된 구간을 위한 별도 파트입니다. 각 파트의 스타일은 직접 지정합니다.
