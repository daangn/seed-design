---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: `PrefixIcon`·`SuffixIcon`·`Chip.PrefixIcon`·`Chip.SuffixIcon`의 `size`·`color`를 제거해야 합니다. 의도적으로 크기나 색상을 덮어쓰려면 `style`을 사용하고, 독립 아이콘은 `Icon`의 `size`·`color`를 사용해야 합니다. Registry 컴포넌트는 `npx @seed-design/cli@latest add ui:attachment-field`와 `npx @seed-design/cli@latest add ui:attachment-display-field`로 다시 설치해야 합니다.) Prefix·Suffix 아이콘의 크기와 색상은 아이콘을 감싼 컴포넌트의 recipe가 결정합니다.
