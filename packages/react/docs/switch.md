file: components/switch.mdx

# Switch

특정 설정 및 상태를 즉시 켜거나 끌 수 있도록 하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { Switch } from "seed-design/ui/switch";

export default function SwitchPreview() {
  return <Switch defaultChecked />;
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:switch
- pnpm: pnpm dlx @seed-design/cli@latest add ui:switch
- yarn: yarn dlx @seed-design/cli@latest add ui:switch
- bun: bun x @seed-design/cli@latest add ui:switch

<ManualInstallation name="switch" />

## Props \[#props]

### `Switch` \[#switch]

- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `label`
  - type: `React.ReactNode`
- `size`
  - type: `"16" | "24" | "32" | undefined`
  - default: `32`
- `tone`
  - type: `"neutral" | "brand" | undefined`
  - default: `"brand"`
- `disabled`
  - type: `boolean | undefined`
- `invalid`
  - type: `boolean | undefined`
- `required`
  - type: `boolean | undefined`
- `checked`
  - type: `boolean | undefined`
- `defaultChecked`
  - type: `boolean | undefined`
- `onCheckedChange`
  - type: `((checked: boolean) => void) | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `Switchmark` \[#switchmark]

- `tone`
  - type: `"neutral" | "brand" | undefined`
  - default: `"brand"`
- `size`
  - type: `"16" | "24" | "32" | undefined`
  - default: `32`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Sizes \[#sizes]

<Callout title="Deprecated Props" type="warning">
  `size="medium"`과 `size="small"`은 더 이상 사용되지 않습니다. 대신 `size="32"`와 `size="16"`을 사용하세요.
</Callout>

```tsx
import { VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchSizes() {
  return (
    <VStack align="center" gap="spacingY.componentDefault">
      <Switch size="32" label="32 (default)" defaultChecked />
      <Switch size="24" label="24" defaultChecked />
      <Switch size="16" label="16" defaultChecked />
    </VStack>
  );
}
```

### Tones \[#tones]

#### Brand \[#brand]

```tsx
import { Switch } from "seed-design/ui/switch";

export default function SwitchBrand() {
  return <Switch tone="brand" label="Brand" defaultChecked />;
}
```

#### Neutral \[#neutral]

```tsx
import { Switch } from "seed-design/ui/switch";

export default function SwitchNeutral() {
  return <Switch tone="neutral" label="Neutral" defaultChecked />;
}
```

### Long Label \[#long-label]

```tsx
import { VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchLongLabel() {
  return (
    <VStack gap="spacingY.componentDefault">
      <Switch
        size="32"
        label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
      />
      <Switch
        size="24"
        label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
      />
      <Switch
        size="16"
        label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
      />
    </VStack>
  );
}
```

### Disabled \[#disabled]

```tsx
import { VStack } from "@seed-design/react";
import { useState } from "react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchDisabled() {
  const [disabled, setDisabled] = useState(true);

  return (
    <VStack gap="x8" align="center">
      <VStack align="flex-start" gap="spacingY.componentDefault">
        <Switch disabled={disabled} label="Not Checked (Brand)" />
        <Switch disabled={disabled} defaultChecked label="Checked (Brand)" />
        <Switch disabled={disabled} label="Not Checked (Neutral)" tone="neutral" />
        <Switch disabled={disabled} defaultChecked label="Checked (Neutral)" tone="neutral" />
      </VStack>
      <Switch
        size="16"
        checked={disabled}
        onCheckedChange={setDisabled}
        label="Disable switches"
        tone="neutral"
      />
    </VStack>
  );
}
```

### Listening to Value Changes \[#listening-to-value-changes]

`onCheckedChange`를 사용하여 스위치의 선택 상태 변경을 감지할 수 있습니다.

이벤트를 활용해야 하는 경우 `inputProps`를 통해 내부 `<input>` 요소에 직접 이벤트 핸들러를 추가할 수 있습니다.

```tsx
import { VStack, Text } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";
import { useState } from "react";

export default function SwitchValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);

  return (
    <VStack gap="x4" align="center">
      <Switch
        label="Click me"
        onCheckedChange={(checked) => {
          setCount((prev) => prev + 1);
          setLastValue(checked);
        }}
      />
      <Text>
        onCheckedChange called: {count} times, last value: {`${lastValue ?? "-"}`}
      </Text>
    </VStack>
  );
}
```

### Use Cases \[#use-cases]

#### Using `Switchmark` \[#using-switchmark]

`Switchmark`는 레이블을 제외한 스위치 컴포넌트로, 커스텀 레이아웃을 위해 사용할 수 있습니다.

```tsx
import { HStack, Text, VStack } from "@seed-design/react";
import { Switch } from "@seed-design/react/primitive";
import { Switchmark } from "seed-design/ui/switch";

function CustomSwitch({ children, ...props }: Switch.RootProps) {
  return (
    <VStack asChild gap="x2" align="center">
      <Switch.Root {...props}>
        <Switchmark />
        <Switch.HiddenInput />
        {children}
      </Switch.Root>
    </VStack>
  );
}

export default function () {
  return (
    <HStack gap="x6">
      <CustomSwitch>
        <Text textStyle="t7Regular">regular</Text>
      </CustomSwitch>
      <CustomSwitch defaultChecked>
        <Text textStyle="t7Medium">medium</Text>
      </CustomSwitch>
      <CustomSwitch>
        <Text textStyle="t7Bold">bold</Text>
      </CustomSwitch>
    </HStack>
  );
}
```