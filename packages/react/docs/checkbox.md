file: components/checkbox.mdx

# Checkbox

사용자가 하나 이상의 옵션을 선택할 수 있게 해주는 컴포넌트입니다. 목록에서 여러 항목을 선택하거나 약관 동의와 같은 선택적 작업에 사용됩니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxPreview() {
  return (
    <VStack p="x6">
      <CheckboxGroup
        label="관심 분야"
        description="관심 있는 분야를 모두 선택해 주세요."
        indicator="선택"
      >
        <Checkbox label="디자인" tone="neutral" size="large" />
        <Checkbox label="개발" tone="neutral" size="large" defaultChecked />
        <Checkbox label="마케팅" tone="neutral" size="large" />
      </CheckboxGroup>
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:checkbox
- pnpm: pnpm dlx @seed-design/cli@latest add ui:checkbox
- yarn: yarn dlx @seed-design/cli@latest add ui:checkbox
- bun: bun x @seed-design/cli@latest add ui:checkbox

<ManualInstallation name="checkbox" />

## Props \[#props]

### `CheckboxGroup` \[#checkboxgroup]

- `label`
  - type: `React.ReactNode`
- `labelWeight`
  - type: `"medium" | "bold" | undefined`
  - default: `"medium"`
- `indicator`
  - type: `React.ReactNode`
- `showRequiredIndicator`
  - type: `boolean | undefined`
- `description`
  - type: `React.ReactNode`
- `errorMessage`
  - type: `React.ReactNode`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `Checkbox` \[#checkbox]

- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `label`
  - type: `React.ReactNode`
- `weight`
  - type: `"bold" | "regular" | undefined`
  - default: `"regular"`
- `size`
  - type: `"medium" | "large" | undefined`
  - default: `"medium"`
- `variant`
  - type: `"square" | "ghost" | undefined`
  - default: `"square"`
  - description: - \`square\`: 필수 선택 항목이고 사용자가 해당 내용을 인지해야 하는 경우 사용합니다. - \`ghost\`: 필수 선택 항목이 아니고, 3개 이하 항목으로 구성되는 경우 사용하는 것을 권장합니다.
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
- `indeterminate`
  - type: `boolean | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `Checkmark` \[#checkmark]

- `variant`
  - type: `"square" | "ghost" | undefined`
  - default: `"square"`
  - description: - \`square\`: 필수 선택 항목이고 사용자가 해당 내용을 인지해야 하는 경우 사용합니다. - \`ghost\`: 필수 선택 항목이 아니고, 3개 이하 항목으로 구성되는 경우 사용하는 것을 권장합니다.
- `tone`
  - type: `"neutral" | "brand" | undefined`
  - default: `"brand"`
- `size`
  - type: `"medium" | "large" | undefined`
  - default: `"medium"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Sizes \[#sizes]

```tsx
import { HStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxSize() {
  return (
    <HStack gap="x8" p="x6">
      <CheckboxGroup aria-label="Square size examples">
        <Checkbox label="Medium (default)" size="medium" defaultChecked tone="neutral" />
        <Checkbox label="Large" size="large" defaultChecked tone="neutral" />
      </CheckboxGroup>
      <CheckboxGroup aria-label="Ghost size examples">
        <Checkbox
          label="Medium (default)"
          size="medium"
          variant="ghost"
          defaultChecked
          tone="neutral"
        />
        <Checkbox label="Large" size="large" variant="ghost" defaultChecked tone="neutral" />
      </CheckboxGroup>
    </HStack>
  );
}
```

### Tones and Variants \[#tones-and-variants]

#### Brand \[#brand]

```tsx
import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxBrand() {
  return (
    <VStack p="x6">
      <CheckboxGroup aria-label="Brand tone examples">
        <Checkbox
          label="Square (default)"
          variant="square"
          tone="brand"
          size="large"
          defaultChecked
        />
        <Checkbox label="Ghost" variant="ghost" tone="brand" size="large" defaultChecked />
      </CheckboxGroup>
    </VStack>
  );
}
```

#### Neutral \[#neutral]

```tsx
import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxNeutral() {
  return (
    <VStack p="x6">
      <CheckboxGroup aria-label="Neutral tone examples">
        <Checkbox
          label="Square (default)"
          variant="square"
          tone="neutral"
          size="large"
          defaultChecked
        />
        <Checkbox label="Ghost" variant="ghost" tone="neutral" size="large" defaultChecked />
      </CheckboxGroup>
    </VStack>
  );
}
```

### Indeterminate \[#indeterminate]

```tsx
import { VStack } from "@seed-design/react";
import { Checkbox } from "seed-design/ui/checkbox";

export default function CheckboxIndeterminate() {
  return (
    <VStack p="x6">
      <Checkbox defaultChecked label="indeterminate" indeterminate tone="neutral" size="large" />
    </VStack>
  );
}
```

### Weights \[#weights]

<Callout title="Deprecated Props" type="warning">
  `weight="default"`와 `weight="stronger"`는 더 이상 사용되지 않습니다. 대신
  `weight="regular"`와 `weight="bold"`를 사용하세요.
</Callout>

```tsx
import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxWeights() {
  return (
    <VStack p="x6">
      <CheckboxGroup aria-label="Weight examples">
        <Checkbox label="Regular Label Text" weight="regular" tone="neutral" size="large" />
        <Checkbox label="Bold Label Text" weight="bold" tone="neutral" size="large" />
      </CheckboxGroup>
    </VStack>
  );
}
```

### Long Label \[#long-label]

```tsx
import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxLongLabel() {
  return (
    <VStack p="x6">
      <CheckboxGroup aria-label="Long label examples">
        <Checkbox
          size="medium"
          tone="neutral"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
        <Checkbox
          size="large"
          tone="neutral"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
      </CheckboxGroup>
    </VStack>
  );
}
```

### Disabled \[#disabled]

```tsx
import { VStack } from "@seed-design/react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxDisabled() {
  return (
    <VStack p="x6">
      <CheckboxGroup aria-label="Disabled examples">
        <Checkbox
          defaultChecked
          label="Disabled Checked, Square"
          disabled
          tone="neutral"
          size="large"
        />
        <Checkbox
          checked={false}
          label="Disabled without Checked, Square"
          disabled
          tone="neutral"
          size="large"
        />
        <Checkbox
          variant="ghost"
          defaultChecked
          label="Disabled Checked, Ghost"
          disabled
          tone="neutral"
          size="large"
        />
        <Checkbox
          variant="ghost"
          checked={false}
          label="Disabled without Checked, Ghost"
          disabled
          tone="neutral"
          size="large"
        />
      </CheckboxGroup>
    </VStack>
  );
}
```

### Listening to Value Changes \[#listening-to-value-changes]

`onCheckedChange`를 사용하여 체크박스의 선택 상태 변경을 감지할 수 있습니다.

이벤트를 활용해야 하는 경우 `inputProps`를 통해 내부 `<input>` 요소에 직접 이벤트 핸들러를 추가할 수 있습니다.

```tsx
import { VStack, Text } from "@seed-design/react";
import { Checkbox } from "seed-design/ui/checkbox";
import { useState } from "react";

export default function CheckboxValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<boolean | null>(null);

  return (
    <VStack gap="x4" align="center" p="x6">
      <Checkbox
        label="Click me"
        tone="neutral"
        size="large"
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

#### React Hook Form \[#react-hook-form]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm, type Control } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

const POSSIBLE_FRUIT_VALUES = ["apple", "melon", "mango"] as const;

type FormValues = Record<(typeof POSSIBLE_FRUIT_VALUES)[number], boolean>;

export default function CheckboxReactHookForm() {
  const { handleSubmit, reset, setValue, control } = useForm<FormValues>({
    defaultValues: {
      apple: false,
      melon: true,
      mango: false,
    },
  });

  const onValid = useCallback((data: FormValues) => {
    window.alert(JSON.stringify(data, null, 2));
  }, []);

  const onReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      reset();
    },
    [reset],
  );

  return (
    <VStack gap="x3" p="x6" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <CheckboxGroup aria-label="Fruit selection">
        {POSSIBLE_FRUIT_VALUES.map((name) => (
          <CheckboxItem key={name} name={name} control={control} />
        ))}
      </CheckboxGroup>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton
          type="button"
          variant="neutralWeak"
          flexGrow={1}
          onClick={() => setValue("mango", true)}
        >
          mango 선택
        </ActionButton>
        <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}

interface CheckboxItemProps {
  name: keyof FormValues;
  control: Control<FormValues>;
}

function CheckboxItem({ name, control }: CheckboxItemProps) {
  const {
    field: { value, ...restProps },
    fieldState: { invalid },
  } = useController({ name, control });

  return (
    <Checkbox
      key={name}
      label={name}
      checked={value}
      inputProps={restProps}
      invalid={invalid}
      tone="neutral"
      size="large"
    />
  );
}
```

#### Using `Checkmark` \[#using-checkmark]

`Checkmark`는 독립적인 체크 마크 컴포넌트로, Checkbox Primitive 컴포넌트와 조합하여 커스텀 레이아웃을 위해 사용할 수 있습니다.

```tsx
import { HStack, Text, VStack } from "@seed-design/react";
import { Checkbox } from "@seed-design/react/primitive";
import { Checkmark } from "seed-design/ui/checkbox";

function CustomCheckbox({ children, ...props }: Checkbox.RootProps) {
  return (
    <VStack asChild gap="x2" align="center">
      <Checkbox.Root {...props}>
        <Checkmark tone="neutral" />
        <Checkbox.HiddenInput />
        {children}
      </Checkbox.Root>
    </VStack>
  );
}

export default function CheckboxCheckmark() {
  return (
    <HStack gap="x6" p="x6">
      <CustomCheckbox>
        <Text textStyle="t7Regular">regular</Text>
      </CustomCheckbox>
      <CustomCheckbox defaultChecked>
        <Text textStyle="t7Medium">medium</Text>
      </CustomCheckbox>
      <CustomCheckbox>
        <Text textStyle="t7Bold">bold</Text>
      </CustomCheckbox>
    </HStack>
  );
}
```

### Fieldset Integration \[#fieldset-integration]

`CheckboxGroup`을 사용하여 여러 체크박스를 그룹화하고 `label`, `description`, `errorMessage` 등의 Fieldset 관련 prop을 사용할 수 있습니다.

```tsx
import { ActionButton, HStack, VStack } from "@seed-design/react";
import { useState } from "react";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";

export default function CheckboxFieldset() {
  const [firstErrors, setFirstErrors] = useState<Record<string, string | undefined>>({});
  const [secondErrors, setSecondErrors] = useState<Record<string, string | undefined>>({});

  const handleFirstSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const fruits = formData.getAll("fruit");

    if (fruits.includes("apple")) {
      setFirstErrors({ apple: "Apple은 선택할 수 없습니다." });

      return;
    }

    setFirstErrors({});

    alert(JSON.stringify(fruits, null, 2));
  };

  const handleSecondSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const agreements = formData.getAll("agreement");

    const hasTerms = agreements.includes("terms");
    const hasPrivacy = agreements.includes("privacy");

    if (!hasTerms || !hasPrivacy) {
      setSecondErrors({
        ...(!hasTerms && { terms: "필수 항목에 동의해 주세요." }),
        ...(!hasPrivacy && { privacy: "필수 항목에 동의해 주세요." }),
      });
      return;
    }

    setSecondErrors({});
    alert(JSON.stringify(agreements, null, 2));
  };

  return (
    <HStack width="full" gap="x8" align="flex-start" p="x6">
      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleFirstSubmit}>
          <CheckboxGroup
            label="좋아하는 과일"
            indicator="선택"
            description="Apple을 선택하고 제출해보세요."
            errorMessage={Object.values(firstErrors).filter(Boolean).join(", ")}
          >
            <Checkbox
              label="Apple"
              tone="neutral"
              size="large"
              defaultChecked
              invalid={!!firstErrors.apple}
              inputProps={{ name: "fruit", value: "apple" }}
            />
            <Checkbox
              label="Banana"
              tone="neutral"
              size="large"
              invalid={!!firstErrors.banana}
              inputProps={{ name: "fruit", value: "banana" }}
            />
            <Checkbox
              label="Orange"
              tone="neutral"
              size="large"
              invalid={!!firstErrors.orange}
              inputProps={{ name: "fruit", value: "orange" }}
            />
          </CheckboxGroup>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>

      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleSecondSubmit}>
          <CheckboxGroup
            label="약관 동의"
            labelWeight="bold"
            showRequiredIndicator
            description="이용약관을 선택하지 않고 제출해보세요."
            errorMessage={Object.values(secondErrors).filter(Boolean).join(", ")}
          >
            <Checkbox
              label="이용약관 동의 (필수)"
              tone="neutral"
              size="large"
              invalid={!!secondErrors.terms}
              inputProps={{ name: "agreement", value: "terms" }}
            />
            <Checkbox
              label="개인정보 처리방침 동의 (필수)"
              tone="neutral"
              size="large"
              defaultChecked
              invalid={!!secondErrors.privacy}
              inputProps={{ name: "agreement", value: "privacy" }}
            />
            <Checkbox
              label="마케팅 수신 동의 (선택)"
              tone="neutral"
              size="large"
              invalid={!!secondErrors.marketing}
              inputProps={{ name: "agreement", value: "marketing" }}
            />
          </CheckboxGroup>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>
    </HStack>
  );
}
```