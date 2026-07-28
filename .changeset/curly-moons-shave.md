---
"@seed-design/css": minor
"@seed-design/dom-utils": minor
"@seed-design/lynx-css": minor
"@seed-design/react": minor
"@seed-design/react-select": major
"@seed-design/rootage-artifacts": minor
---

트리거를 눌러 열리는 목록에서 값을 선택하는 Select 컴포넌트를 추가합니다.

- `multiple`로 다중 선택을, `SelectGroup`으로 옵션 그룹과 그룹 라벨을 지원합니다.
- 키보드 탐색을 지원하며, `size`·`disabled`·`readOnly`·`invalid` 상태를 제공합니다.
- `label`, `description`, `errorMessage`로 Field와 연동되고, `name`으로 폼 제출 값의 키를 지정합니다.

```tsx
<SelectRoot label="과일" defaultValue={["apple"]} name="fruit">
  <SelectTrigger placeholder="과일을 선택하세요" />
  <SelectContent>
    <SelectGroup>
      <SelectItem value="apple" label="사과" />
      <SelectItem value="banana" label="바나나" />
    </SelectGroup>
  </SelectContent>
</SelectRoot>
```
