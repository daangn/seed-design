---
"@seed-design/react": minor
"@seed-design/css": minor
---

Wheel Picker 컴포넌트를 추가합니다.

- `@seed-design/react`에서 `WheelPicker.Root`와 `WheelPicker.Column`을 가져와 여러 선택 열을 직접 구성할 수 있습니다.
- 항목 높이는 44px, 표시 항목 수는 5개를 기본값으로 사용합니다.

```tsx
import { WheelPicker } from "@seed-design/react";

<WheelPicker.Root>
  <WheelPicker.Column
    aria-label="연도"
    value={year}
    onValueChange={setYear}
    options={yearOptions}
  />
</WheelPicker.Root>
```

`npx @seed-design/cli@latest add ui:wheel-picker`로 배열 기반 Registry API를 설치할 수 있습니다.

```tsx
import { WheelPicker } from "seed-design/ui/wheel-picker";

<WheelPicker aria-label="날짜 선택" columns={columns} />;
```
