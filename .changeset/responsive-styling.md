---
"@seed-design/css": minor
"@seed-design/react": minor
---

Breakpoint 기반 반응형 스타일링을 지원합니다.

- Box, Flex, Grid, VStack 등 유틸리티 컴포넌트의 레이아웃 관련 프로퍼티에 breakpoint 기반 반응형 객체를 사용할 수 있습니다.

```tsx
<Box padding={{ base: "x3", md: "x6" }} />
<Grid columns={{ base: 1, md: 2, lg: 4 }} gap="x4" />
```

- `@seed-design/react`에서 `useBreakpoint` 훅과 `useBreakpointValue` 훅을 제공합니다.
  - `useBreakpoint()` — 현재 활성 breakpoint 이름을 반환합니다. (`"base"` | `"sm"` | `"md"` | `"lg"` | `"xl"`)
  - `useBreakpointValue(values)` — 반응형 객체에서 현재 breakpoint에 해당하는 값을 반환합니다.

```tsx
const actionButtonProps = useBreakpointValue<ActionButtonProps>({
  base: { variant: "neutralWeak" },
  lg: { variant: "brandSolid" },
});
```

- `<Grid display="none">`으로 Grid를 숨길 수 없던 문제를 수정합니다.
