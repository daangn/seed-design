file: components/toggle-button.mdx

# Toggle Button

사용자가 특정 상태를 켜거나 끌 수 있게 해주는 버튼 형태의 컴포넌트입니다. 필터링이나 뷰 전환과 같은 즉각적인 상태 변경에 사용됩니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { useState } from "react";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ToggleButtonPreview() {
  const [pressed, setPressed] = useState(false);

  return (
    <ToggleButton pressed={pressed} onPressedChange={setPressed}>
      {pressed ? "선택됨" : "미선택"}
    </ToggleButton>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:toggle-button
- pnpm: pnpm dlx @seed-design/cli@latest add ui:toggle-button
- yarn: yarn dlx @seed-design/cli@latest add ui:toggle-button
- bun: bun x @seed-design/cli@latest add ui:toggle-button

<ManualInstallation name="toggle-button" />

## Props \[#props]

- `variant`
  - type: `"brandSolid" | "neutralWeak" | undefined`
  - default: `"brandSolid"`
  - description: - \`brandSolid\`: 브랜드 컬러로 강조된 스타일입니다. - \`neutralWeak\`: 기본적인 토글 스타일입니다.
- `size`
  - type: `"xsmall" | "small" | undefined`
  - default: `"small"`
- `loading`
  - type: `boolean | undefined`
  - default: `false`
  - description: 버튼에 등록된 비동기 작업이 진행 중임을 사용자에게 알립니다.
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
  - description: 버튼의 비활성화 여부를 나타냅니다.
- `pressed`
  - type: `boolean | undefined`
- `defaultPressed`
  - type: `boolean | undefined`
- `onPressedChange`
  - type: `((pressed: boolean) => void) | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Brand Solid \[#brand-solid]

```tsx
import { useState } from "react";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ToggleButtonBrandSolid() {
  const [pressed, setPressed] = useState(false);

  return (
    <ToggleButton variant="brandSolid" pressed={pressed} onPressedChange={setPressed}>
      {pressed ? "선택됨" : "미선택"}
    </ToggleButton>
  );
}
```

### Neutral Weak \[#neutral-weak]

```tsx
import { useState } from "react";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ToggleButtonBrandSolid() {
  const [pressed, setPressed] = useState(false);

  return (
    <ToggleButton variant="neutralWeak" pressed={pressed} onPressedChange={setPressed}>
      {pressed ? "선택됨" : "미선택"}
    </ToggleButton>
  );
}
```

### Small \[#small]

```tsx
import { useState } from "react";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ToggleButtonSmall() {
  const [pressed, setPressed] = useState(false);

  return (
    <ToggleButton size="small" pressed={pressed} onPressedChange={setPressed}>
      {pressed ? "선택됨" : "미선택"}
    </ToggleButton>
  );
}
```

### Xsmall \[#xsmall]

```tsx
import { useState } from "react";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ToggleButtonXsmall() {
  const [pressed, setPressed] = useState(false);

  return (
    <ToggleButton size="xsmall" pressed={pressed} onPressedChange={setPressed}>
      {pressed ? "선택됨" : "미선택"}
    </ToggleButton>
  );
}
```

### Prefix Icon \[#prefix-icon]

```tsx
import { IconCheckmarkLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { useState } from "react";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ToggleButtonPrefixIcon() {
  const [pressed, setPressed] = useState(false);

  return (
    <ToggleButton pressed={pressed} onPressedChange={setPressed}>
      <PrefixIcon svg={pressed ? <IconPlusLine /> : <IconCheckmarkLine />} />
      {pressed ? "선택됨" : "미선택"}
    </ToggleButton>
  );
}
```

### Disabled \[#disabled]

```tsx
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ToggleButtonDisabled() {
  return <ToggleButton disabled>비활성</ToggleButton>;
}
```

### Loading \[#loading]

```tsx
import { useState } from "react";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ToggleButtonLoading() {
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleToggle() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPressed((prev) => !prev);
    }, 2000);
  }

  // 이벤트 핸들링이 필요할 수 있으므로 loading은 disabled를 포함하지 않습니다. 이벤트 발생을 원하지 않는 경우, disabled 속성을 추가해주세요.
  return (
    <ToggleButton loading={loading} pressed={pressed} onPressedChange={handleToggle}>
      시간이 걸리는 토글
    </ToggleButton>
  );
}
```