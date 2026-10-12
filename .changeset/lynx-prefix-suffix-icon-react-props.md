---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `PrefixIcon`·`SuffixIcon`·`Chip.PrefixIcon`·`Chip.SuffixIcon`의 `size`·`color`를 제거해야 합니다. 의도적으로 크기나 색상을 덮어쓰려면 `style`을 사용하고, 독립 아이콘은 `Icon`의 `size`·`color`를 사용해야 합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:attachment-field`와 `npx @seed-design/cli@latest add ui:attachment-display-field`로 다시 설치해야 합니다.)

Prefix·Suffix 아이콘에서 개별 크기와 색상을 지정하던 `size`·`color` prop을 제거하고, 아이콘을 감싼 컴포넌트의 recipe 스타일을 따르도록 변경합니다.
