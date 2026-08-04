file: components/contextual-floating-button.mdx

# Contextual Floating Button

화면 위에 떠 있으며 특정 상황에서만 나타나는 보조적인 동작을 위한 버튼입니다.

사용 가능 버전: @seed-design/react@0.0.30, @seed-design/css@0.0.30

## Preview

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonPreview() {
  return (
    <ContextualFloatingButton>
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ContextualFloatingButton>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:contextual-floating-button
- pnpm: pnpm dlx @seed-design/cli@latest add ui:contextual-floating-button
- yarn: yarn dlx @seed-design/cli@latest add ui:contextual-floating-button
- bun: bun x @seed-design/cli@latest add ui:contextual-floating-button

<ManualInstallation name="contextual-floating-button" />

## Props \[#props]

- `variant`
  - type: `"solid" | "layer" | undefined`
  - default: `"solid"`
  - description: - \`solid\`: 배경과 대비되는 강조된 보조 액션으로 중요도 높은 행동 유도 시 적합합니다. - \`layer\`: 시각적 부담 없이 부드럽게 액션을 유도합니다.
- `layout`
  - type: `"withText" | "iconOnly" | undefined`
  - default: `"withText"`
  - description: - \`withText\`: label과 prefixIcon을 함께 표시합니다. - \`iconOnly\`: icon만 표시합니다. 아이콘만으로 의미를 전달하기 때문에 접근성 레이블과 함께 사용해야 합니다.
- `loading`
  - type: `boolean | undefined`
  - default: `false`
  - description: 버튼에 등록된 비동기 작업이 진행 중임을 사용자에게 알립니다.
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
  - description: 버튼의 비활성화 여부를 나타냅니다.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Float Composition \[#float-composition]

Contextual Floating Button은 `<Float>` 컴포넌트와 함께 사용하면 편리합니다.

```tsx
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Float, PrefixIcon } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonFloatComposition() {
  return (
    <Box
      position="relative"
      width="300px"
      height="500px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="bottom-center" offsetY="x4">
        <ContextualFloatingButton>
          <PrefixIcon svg={<IconBellFill />} />
          알림 설정
        </ContextualFloatingButton>
      </Float>
    </Box>
  );
}
```

### Solid Variant \[#solid-variant]

```tsx
import { IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonSolid() {
  return (
    <ContextualFloatingButton variant="solid">
      <PrefixIcon svg={<IconPlusLine />} />
      Solid Variant
    </ContextualFloatingButton>
  );
}
```

### Layer Variant \[#layer-variant]

```tsx
import { IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonLayer() {
  return (
    <ContextualFloatingButton variant="layer">
      <PrefixIcon svg={<IconPlusLine />} />
      Layer Variant
    </ContextualFloatingButton>
  );
}
```

### Icon Only \[#icon-only]

```tsx
import { IconPlusFill } from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonIconOnly() {
  return (
    <ContextualFloatingButton layout="iconOnly" aria-label="추가">
      <Icon svg={<IconPlusFill />} />
    </ContextualFloatingButton>
  );
}
```

### Loading \[#loading]

```tsx
import { IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { useState } from "react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonLoading() {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  // 이벤트 핸들링이 필요할 수 있으므로 loading은 disabled를 포함하지 않습니다. 이벤트 발생을 원하지 않는 경우, disabled 속성을 추가해주세요.
  return (
    <ContextualFloatingButton loading={loading} onClick={handleClick}>
      <PrefixIcon svg={<IconPlusLine />} />
      시간이 걸리는 액션
    </ContextualFloatingButton>
  );
}
```