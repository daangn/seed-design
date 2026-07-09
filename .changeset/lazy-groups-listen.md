---
"@seed-design/react-menu": major
---

Menu Group이 `MenuGroupLabel`이 실제로 렌더된 경우에만 `aria-labelledby`를 노출하도록 수정합니다.

- 기존에는 `MenuGroupLabel` 없이 `MenuGroup`만 사용해도 group root의 `aria-labelledby`가 존재하지 않는 id를 가리켜 dangling 참조가 되는 접근성 문제가 있었습니다. 이제 `MenuGroupLabel`이 렌더된 동안에만 `aria-labelledby`가 부여됩니다.
- `useMenu()`/`useMenuContext()`에서 `getGroupProps`, `getGroupLabelProps`를 제거합니다. group 접근성 배선은 `MenuGroup`, `MenuGroupLabel` 컴포넌트가 담당하므로, 커스텀 구현에서 이 두 함수를 사용하고 있었다면 `MenuGroup`/`MenuGroupLabel` 컴포넌트로 교체하세요.
