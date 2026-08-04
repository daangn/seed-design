file: components/radio-group.mdx

# Radio Group

여러 옵션 중 하나를 선택할 수 있도록 할 때 사용하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.2.3, @seed-design/css@0.2.3

## Preview

```tsx
import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupPreview() {
  return (
    <VStack p="x6">
      <RadioGroup
        defaultValue="apple"
        label="좋아하는 과일"
        description="좋아하는 과일을 선택해 주세요."
        indicator="선택"
      >
        <RadioGroupItem value="apple" label="Apple" tone="neutral" size="large" />
        <RadioGroupItem value="banana" label="Banana" tone="neutral" size="large" />
        <RadioGroupItem value="orange" label="Orange" tone="neutral" size="large" />
      </RadioGroup>
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:radio-group
- pnpm: pnpm dlx @seed-design/cli@latest add ui:radio-group
- yarn: yarn dlx @seed-design/cli@latest add ui:radio-group
- bun: bun x @seed-design/cli@latest add ui:radio-group

<ManualInstallation name="radio-group" />

## Props \[#props]

### `RadioGroup` \[#radiogroup]

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
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
- `invalid`
  - type: `boolean | undefined`
  - default: `false`
- `name`
  - type: `string | undefined`
- `form`
  - type: `string | undefined`
- `value`
  - type: `string | undefined`
- `defaultValue`
  - type: `string | undefined`
- `onValueChange`
  - type: `((value: string) => void) | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `RadioGroupItem` \[#radiogroupitem]

- `label`
  - type: `React.ReactNode`
- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `weight`
  - type: `"bold" | "regular" | undefined`
  - default: `"regular"`
- `size`
  - type: `"medium" | "large" | undefined`
  - default: `"medium"`
- `tone`
  - type: `"neutral" | "brand" | undefined`
  - default: `"brand"`
- `value`
  - type: `string`
  - required: `true`
- `disabled`
  - type: `boolean | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `Radiomark` \[#radiomark]

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
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";
import { VStack } from "@seed-design/react";

export default function RadioGroupSize() {
  return (
    <VStack gap="x5" p="x6">
      <RadioGroup defaultValue="apple" aria-label="과일 선택">
        <RadioGroupItem value="apple" label="사과" size="medium" tone="neutral" />
        <RadioGroupItem value="banana" label="바나나" size="medium" tone="neutral" />
        <RadioGroupItem value="orange" label="오렌지" size="medium" tone="neutral" />
      </RadioGroup>
      <RadioGroup defaultValue="red" aria-label="색상 선택">
        <RadioGroupItem value="red" label="빨간색" size="large" tone="neutral" />
        <RadioGroupItem value="blue" label="파란색" size="large" tone="neutral" />
        <RadioGroupItem value="green" label="초록색" size="large" tone="neutral" />
      </RadioGroup>
    </VStack>
  );
}
```

### Tones \[#tones]

#### Brand \[#brand]

```tsx
import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupBrand() {
  return (
    <VStack p="x6">
      <RadioGroup defaultValue="apple" aria-label="과일 선택">
        <RadioGroupItem value="apple" label="사과" tone="brand" size="large" />
        <RadioGroupItem value="banana" label="바나나" tone="brand" size="large" />
        <RadioGroupItem value="orange" label="오렌지" tone="brand" size="large" />
      </RadioGroup>
    </VStack>
  );
}
```

#### Neutral \[#neutral]

```tsx
import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupNeutral() {
  return (
    <VStack p="x6">
      <RadioGroup defaultValue="apple" aria-label="과일 선택">
        <RadioGroupItem value="apple" label="사과" tone="neutral" size="large" />
        <RadioGroupItem value="banana" label="바나나" tone="neutral" size="large" />
        <RadioGroupItem value="orange" label="오렌지" tone="neutral" size="large" />
      </RadioGroup>
    </VStack>
  );
}
```

### Weights \[#weights]

```tsx
import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupWeights() {
  return (
    <VStack p="x6">
      <RadioGroup defaultValue="regular" aria-label="글꼴 굵기 선택">
        <RadioGroupItem
          value="regular"
          label="Regular"
          weight="regular"
          tone="neutral"
          size="large"
        />
        <RadioGroupItem value="bold" label="Bold" weight="bold" tone="neutral" size="large" />
      </RadioGroup>
    </VStack>
  );
}
```

### Long Label \[#long-label]

```tsx
import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupLongLabel() {
  return (
    <VStack p="x6">
      <RadioGroup defaultValue="medium" aria-label="Long label options">
        <RadioGroupItem
          value="medium"
          size="medium"
          tone="neutral"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
        <RadioGroupItem
          value="large"
          size="large"
          tone="neutral"
          label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
        />
      </RadioGroup>
    </VStack>
  );
}
```

### Disabled \[#disabled]

```tsx
import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupDisabled() {
  return (
    <VStack p="x6">
      <RadioGroup defaultValue="option1" aria-label="Options with disabled">
        <RadioGroupItem value="option1" label="Active option" tone="neutral" size="large" />
        <RadioGroupItem
          value="option2"
          label="Disabled option"
          tone="neutral"
          size="large"
          disabled
        />
        <RadioGroupItem value="option3" label="Another active option" tone="neutral" size="large" />
      </RadioGroup>
    </VStack>
  );
}
```

### Listening to Value Changes \[#listening-to-value-changes]

`RadioGroup`의 `onValueChange`를 사용하여 라디오 버튼의 선택 값 변경을 감지할 수 있습니다.

이벤트를 활용해야 하는 경우 `RadioGroupItem`의 `inputProps`를 통해 내부 `<input>` 요소에 직접 이벤트 핸들러를 추가할 수 있습니다.

```tsx
import { VStack, Text } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";
import { useState } from "react";

export default function RadioGroupValueChanges() {
  const [count, setCount] = useState(0);
  const [lastValue, setLastValue] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center" width="full" p="x6">
      <RadioGroup
        defaultValue="apple"
        aria-label="Fruit selection"
        onValueChange={(value) => {
          setCount((prev) => prev + 1);
          setLastValue(value);
        }}
      >
        <RadioGroupItem value="apple" label="Apple" tone="neutral" size="large" />
        <RadioGroupItem value="banana" label="Banana" tone="neutral" size="large" />
        <RadioGroupItem value="orange" label="Orange" tone="neutral" size="large" />
      </RadioGroup>
      <Text>
        onValueChange called: {count} times, last value: {lastValue ?? "-"}
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
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

const POSSIBLE_COLORS = ["red", "blue", "green"] as const;

interface FormValues {
  color: (typeof POSSIBLE_COLORS)[number];
}

export default function RadioGroupReactHookForm() {
  const { handleSubmit, reset, setValue, control } = useForm<FormValues>({
    defaultValues: {
      color: "blue",
    },
  });
  const { field } = useController({ name: "color", control });

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
    <VStack p="x6" as="form" onSubmit={handleSubmit(onValid)}>
      <VStack gap="x3">
        <RadioGroup
          value={field.value}
          onValueChange={(value) => setValue("color", value as FormValues["color"])}
          aria-label="Color selection"
        >
          {POSSIBLE_COLORS.map((color) => (
            <RadioGroupItem
              key={color}
              value={color}
              label={color.charAt(0).toUpperCase() + color.slice(1)}
              tone="neutral"
              size="large"
            />
          ))}
        </RadioGroup>

        <HStack gap="x3">
          <ActionButton type="submit" variant="neutralSolid">
            Submit
          </ActionButton>
          <ActionButton variant="neutralWeak" onClick={onReset}>
            Reset
          </ActionButton>
        </HStack>
      </VStack>
    </VStack>
  );
}
```

#### Using `Radiomark` \[#using-radiomark]

`Radiomark`는 독립적인 라디오 마크 컴포넌트로, Radio Group Primitive 컴포넌트와 조합하여 커스텀 레이아웃을 위해 사용할 수 있습니다.

```tsx
import { HStack, Text, VStack } from "@seed-design/react";
import { Radiomark } from "seed-design/ui/radio-group";
import { RadioGroup } from "@seed-design/react/primitive";

function CustomRadioGroupItem({ children, ...props }: RadioGroup.ItemProps) {
  return (
    <VStack asChild gap="x2" align="center">
      <RadioGroup.Item {...props}>
        <Radiomark tone="neutral" />
        <RadioGroup.ItemHiddenInput />
        {children}
      </RadioGroup.Item>
    </VStack>
  );
}

export default function RadioGroupRadiomark() {
  return (
    <VStack p="x6">
      <RadioGroup.Root defaultValue="medium" aria-label="Weight selection">
        <HStack gap="x6">
          <CustomRadioGroupItem value="regular">
            <Text textStyle="t7Regular">regular</Text>
          </CustomRadioGroupItem>
          <CustomRadioGroupItem value="medium">
            <Text textStyle="t7Medium">medium</Text>
          </CustomRadioGroupItem>
          <CustomRadioGroupItem value="bold">
            <Text textStyle="t7Bold">bold</Text>
          </CustomRadioGroupItem>
        </HStack>
      </RadioGroup.Root>
    </VStack>
  );
}
```

### RadioGroupField Integration \[#radiogroupfield-integration]

`label`, `description`, `errorMessage` 등의 RadioGroupField 관련 prop을 사용할 수 있습니다.

```tsx
import { ActionButton, HStack, VStack } from "@seed-design/react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupRadioGroupField() {
  const [firstErrorMessage, setFirstErrorMessage] = useState<string | undefined>();
  const [secondErrorMessage, setSecondErrorMessage] = useState<string | undefined>();

  const handleFirstSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const contact = formData.get("contact");

    if (contact === "email") {
      setFirstErrorMessage("이메일은 선택할 수 없습니다.");

      return;
    }

    setFirstErrorMessage(undefined);

    alert(JSON.stringify({ contact }, null, 2));
  };

  const handleSecondSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const option = formData.get("option");

    if (option === "option1") {
      setSecondErrorMessage("옵션 1은 선택할 수 없습니다.");

      return;
    }

    setSecondErrorMessage(undefined);

    alert(JSON.stringify({ option }, null, 2));
  };

  return (
    <HStack width="full" gap="x8" align="flex-start" p="x6">
      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleFirstSubmit}>
          <RadioGroup
            label="선호하는 연락 방법"
            indicator="필수"
            description="이메일을 선택하고 제출해보세요."
            name="contact"
            defaultValue="email"
            invalid={!!firstErrorMessage}
            errorMessage={firstErrorMessage}
          >
            <RadioGroupItem value="email" label="이메일" tone="neutral" size="large" />
            <RadioGroupItem value="phone" label="전화" tone="neutral" size="large" />
            <RadioGroupItem value="sms" label="문자" tone="neutral" size="large" />
          </RadioGroup>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>

      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleSecondSubmit}>
          <RadioGroup
            label="필수 선택"
            labelWeight="bold"
            showRequiredIndicator
            description="옵션 1을 선택하고 제출해보세요."
            name="option"
            defaultValue="option1"
            invalid={!!secondErrorMessage}
            errorMessage={secondErrorMessage}
          >
            <RadioGroupItem value="option1" label="옵션 1" tone="neutral" size="large" />
            <RadioGroupItem value="option2" label="옵션 2" tone="neutral" size="large" disabled />
            <RadioGroupItem value="option3" label="옵션 3" tone="neutral" size="large" />
          </RadioGroup>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>
    </HStack>
  );
}
```