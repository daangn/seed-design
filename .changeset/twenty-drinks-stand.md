---
"@seed-design/figma": minor
"@seed-design/react": minor
"@seed-design/css": minor
---

[Menu Sheet](/react/components/menu-sheet) 관련 컴포넌트를 업데이트합니다.

- `MenuSheetContent`에 설명을 추가할 수 있는 `description` prop이 추가되었습니다.
- `MenuSheetItem`에 설명을 추가할 수 있는 `description` prop이 추가되었습니다.
- **1.1 → 1.2 업그레이드 시 변경 필요**: snippet을 다시 내려받고, `MenuSheetItem`을 사용하는 코드를 아래와 같이 변경하세요.

  - `npx @seed-design/cli@latest add ui:menu-sheet`
  - `children` 대신 `label` prop을 사용합니다.
  - `description`, `prefixIcon` prop이 추가되었습니다.

  ```tsx
  // 전
  <MenuSheetItem>
    <PrefixIcon svg={<IconHouseLine />} />
    메뉴 항목
  </MenuSheetItem>

  // 후
  <MenuSheetItem
    prefixIcon={<IconHouseLine />}
    label="메뉴 항목"
    description="이제 설명도 추가할 수 있어요"
  />
  ```
