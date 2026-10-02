---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: Lynx `ActionButton`의 `icon`·`prefixIcon`·`suffixIcon` prop을 제거합니다. `<Icon icon={...} />`·`<PrefixIcon icon={...} />`·`<SuffixIcon icon={...} />`를 children으로 전달하세요.) `Icon`·`PrefixIcon`·`SuffixIcon`이 `accessibility-elements-hidden`으로 보조 기술에서 숨겨집니다. 아이콘의 의미는 감싼 컴포넌트의 `accessibility-label`로 전달하세요.
