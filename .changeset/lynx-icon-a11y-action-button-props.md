---
"@seed-design/lynx-react": major
---

(BREAKING CHANGE: Lynx `ActionButton`의 `icon`·`prefixIcon`·`suffixIcon` prop을 각각 children의 `<Icon icon={...} />`·`<PrefixIcon icon={...} />`·`<SuffixIcon icon={...} />`로 바꿔야 합니다.)

`ActionButton`의 아이콘 전달 방식을 React와 같이 children slot으로 통일합니다.

- 이전에는 `icon`·`prefixIcon`·`suffixIcon` prop으로 전달한 아이콘도 렌더링했습니다. 이제 이 prop을 제거하고 children에 배치한 `Icon`·`PrefixIcon`·`SuffixIcon`을 렌더링합니다.
