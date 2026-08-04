file: components/progress-circle.mdx

# Progress Circle

작업이 진행 중임을 알리거나 작업 시간을 시각적으로 나타내는 데 사용됩니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCirclePreview() {
  return <ProgressCircle tone="neutral" size="40" />;
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:progress-circle
- pnpm: pnpm dlx @seed-design/cli@latest add ui:progress-circle
- yarn: yarn dlx @seed-design/cli@latest add ui:progress-circle
- bun: bun x @seed-design/cli@latest add ui:progress-circle

<ManualInstallation name="progress-circle" />

## Props \[#props]

- `value`
  - type: `number | undefined`
  - description: The current value of the progress. if undefined, it will be indeterminate.
- `minValue`
  - type: `number | undefined`
  - default: `0`
  - description: The minimum value allowed of the progress.
- `maxValue`
  - type: `number | undefined`
  - default: `100`
  - description: The maximum value allowed of the progress.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `tone`
  - type: `"neutral" | "inherit" | "brand" | "staticWhite" | undefined`
  - default: `"neutral"`
  - description: - \`neutral\`: 가장 보편적으로 사용되며 스타일보다는 로딩 상태의 인식이 더 중요한 경우 사용합니다. - \`brand\`: 사용자 경험의 초기 단계에서 브랜드 컬러를 통해 주요 전환점을 강조할 때 사용합니다. - \`staticWhite\`: 화면 전체를 어둡게 덮는 오버레이(Overlay) 위에 로딩 상태를 표시할 때 사용합니다.
- `size`
  - type: `"inherit" | "24" | "40" | undefined`
  - default: `40`
  - description: - \`24\`: 특정 요소 안에서 사용하는 경우 사용합니다. - \`40\`: 주로 전체 페이지 로딩에 사용합니다.

## Examples \[#examples]

### Neutral \[#neutral]

```tsx
import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCircleNeutral() {
  return <ProgressCircle tone="neutral" />;
}
```

### Brand \[#brand]

```tsx
import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCircleBrand() {
  return <ProgressCircle tone="brand" />;
}
```

### Static White \[#static-white]

```tsx
import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCircleStaticWhite() {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100vw",
        height: "300px",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
      }}
    >
      <ProgressCircle tone="staticWhite" />
    </div>
  );
}
```

### Size=40 \[#size40]

```tsx
import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCircle40() {
  return <ProgressCircle size="40" />;
}
```

### Size=24 \[#size24]

```tsx
import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCircle24() {
  return <ProgressCircle size="24" />;
}
```

### Determinate \[#determinate]

```tsx
import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCircleDeterminate() {
  return <ProgressCircle minValue={0} maxValue={100} value={40} />;
}
```

### Indeterminate \[#indeterminate]

```tsx
import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCirclePreview() {
  // if you want to show an indeterminate progress circle, you can pass `undefined` or omit the `value` prop
  return <ProgressCircle value={undefined} />;
}
```