---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `Chip.Root`를 `Chip.Button`으로, `ChipRoot`를 `ChipButton`으로, `Chip.RootProps`·`ChipRootProps`를 `Chip.ButtonProps`·`ChipButtonProps`로 변경해야 합니다.)

일반 Chip의 공개 이름을 React와 같이 `Chip.Button`으로 통일합니다.

- 이전에는 `Chip.Root`·`ChipRoot`도 같은 버튼을 렌더링하는 별칭으로 제공했지만, 이제 이 별칭과 해당 Props 타입을 제거하고 `Chip.Button`·`ChipButton`만 제공합니다.
