---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": patch
---

Lynx `SegmentedControl.Indicator`가 처음 표시될 때 서서히 나타나던 문제를 수정해, 초기 선택 위치에 바로 표시하고 이후 선택 변경에만 전환 효과를 적용합니다.

- 직접 조합한 `Indicator`는 새 `transitionEnabled` variant로 전환 효과를 켜고 끌 수 있습니다. 초기 배치에는 `false`를 사용하고 이후 선택 변경부터 `true`로 전환할 수 있습니다.
