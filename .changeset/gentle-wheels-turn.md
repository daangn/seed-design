---
"@seed-design/react": minor
"@seed-design/css": minor
---

Wheel Picker 컴포넌트를 추가합니다.

- `WheelPicker.Root`와 `WheelPicker.Column`을 조합해 여러 선택 열을 구성할 수 있습니다.
- 항목 높이는 44px, 표시 항목 수는 5개를 기본값으로 사용합니다.
- `npx @seed-design/cli@latest add ui:wheel-picker`로 배열 기반 편의 API를 설치할 수 있습니다.

```tsx
<WheelPicker.Root>
  <WheelPicker.Column
    aria-label="연도"
    value={year}
    onValueChange={setYear}
    options={yearOptions}
  />
</WheelPicker.Root>
```
