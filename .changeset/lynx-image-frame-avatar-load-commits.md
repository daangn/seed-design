---
"@seed-design/lynx-react": patch
---

Lynx 컴포넌트가 한 번의 갱신을 여러 Main Thread commit으로 나눠 보내던 문제를 수정합니다. 감싸는 부품이 바뀌지 않는 context만 구독해 그 아래 부품이 따로 다시 렌더링되던 경우입니다.

- `Avatar`는 mount와 이미지 load 때 commit을 한 번씩 덜 보냅니다.
- `Slider`는 mount와 drag frame마다 `Slider.Range`·`Slider.Thumb`·`Slider.ValueIndicatorRoot` 갱신을 한 commit으로 보냅니다. `@lynx-js/react` 0.126 이상에서 drag frame 하나의 commit이 4회에서 1회로 줄어듭니다.
- `Tabs`는 trigger 폭 반영과 선택 때 `Tabs.List` 아래 갱신을 `Tabs.Root`와 같은 commit으로 보냅니다. `@lynx-js/react` 0.126 이상에서 선택 한 번의 commit이 2회에서 1회로 줄어듭니다.
