---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

Bottom Sheet의 content 최대 너비를 480px로 맞춥니다.

- 넓은 뷰포트에서 시트가 화면 폭 전체로 늘어나지 않고 480px에서 멈추며 가운데 정렬됩니다. 480px보다 좁은 화면에서는 기존과 동일하게 화면을 채웁니다.
- `BottomSheetContent`가 시트를 왼쪽에 고정하던 인라인 `left` 값을 풀어, 폭이 제한됐을 때 좌우 여백이 같게 배치됩니다. `style`로 `left`를 직접 지정하면 그 값이 우선합니다.
