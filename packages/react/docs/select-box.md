file: components/select-box.mdx

# Select Box

명확한 테두리를 가진 컨테이너를 활용하여, 정의된 목록 중 하나 이상의 옵션을 선택하는 UI 요소입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { HStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxPreview() {
  return (
    <HStack gap="x6" align="flex-start">
      <CheckSelectBoxGroup aria-label="Fruit">
        <CheckSelectBox label="Apple" defaultChecked suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox
          label="Melon"
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox label="Mango" suffix={<CheckSelectBoxCheckmark />} />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot defaultValue="apple" aria-label="Fruit">
        <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
        <RadioSelectBoxItem
          value="melon"
          label="Melon"
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem value="mango" label="Mango" suffix={<RadioSelectBoxRadiomark />} />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:select-box
- pnpm: pnpm dlx @seed-design/cli@latest add ui:select-box
- yarn: yarn dlx @seed-design/cli@latest add ui:select-box
- bun: bun x @seed-design/cli@latest add ui:select-box

<ManualInstallation name="select-box" />

## Props \[#props]

### Check Select Box \[#check-select-box]

#### `CheckSelectBoxGroup` \[#checkselectboxgroup]

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
- `columns`
  - type: `number | undefined`
  - default: `1`
  - description: Number of columns in the grid layout.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

#### `CheckSelectBox` \[#checkselectbox]

- `label`
  - type: `React.ReactNode`
  - required: `true`
- `description`
  - type: `React.ReactNode`
- `prefixIcon`
  - type: `React.ReactNode`
- `suffix`
  - type: `React.ReactNode`
- `footer`
  - type: `React.ReactNode`
- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `layout`
  - type: `"horizontal" | "vertical" | undefined`
  - default: `"horizontal"`
- `footerVisibility`
  - type: `"when-selected" | "when-not-selected" | "always" | undefined`
  - default: `"when-selected"`
  - description: Controls when the footer is visible.
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

#### `CheckSelectBoxCheckmark` \[#checkselectboxcheckmark]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### Radio Select Box \[#radio-select-box]

#### `RadioSelectBoxRoot` \[#radioselectboxroot]

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
- `columns`
  - type: `number | undefined`
  - default: `1`
  - description: Number of columns in the grid layout.
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

#### `RadioSelectBoxItem` \[#radioselectboxitem]

- `label`
  - type: `React.ReactNode`
  - required: `true`
- `description`
  - type: `React.ReactNode`
- `prefixIcon`
  - type: `React.ReactNode`
- `suffix`
  - type: `React.ReactNode`
- `footer`
  - type: `React.ReactNode`
- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `rootRef`
  - type: `React.Ref<HTMLLabelElement> | undefined`
- `layout`
  - type: `"horizontal" | "vertical" | undefined`
  - default: `"horizontal"`
- `footerVisibility`
  - type: `"when-selected" | "when-not-selected" | "always" | undefined`
  - default: `"when-selected"`
  - description: Controls when the footer is visible.
- `disabled`
  - type: `boolean | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `value`
  - type: `string`
  - required: `true`

#### `RadioSelectBoxRadiomark` \[#radioselectboxradiomark]

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

### React Hook Form \[#react-hook-form]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm, type Control } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

const POSSIBLE_FRUIT_VALUES = ["apple", "melon", "mango"] as const;

type CheckFormValues = Record<(typeof POSSIBLE_FRUIT_VALUES)[number], boolean>;

interface RadioFormValues {
  fruit: (typeof POSSIBLE_FRUIT_VALUES)[number];
}

export default function SelectBoxReactHookForm() {
  // CheckSelectBox Form
  const checkForm = useForm<CheckFormValues>({
    defaultValues: { apple: false, melon: true, mango: false },
  });

  // RadioSelectBox Form
  const radioForm = useForm<RadioFormValues>({
    defaultValues: { fruit: "melon" },
  });
  const { field: radioField } = useController({ name: "fruit", control: radioForm.control });

  const onCheckValid = useCallback((data: CheckFormValues) => {
    window.alert(`CheckSelectBox:\n${JSON.stringify(data, null, 2)}`);
  }, []);

  const onRadioValid = useCallback((data: RadioFormValues) => {
    window.alert(`RadioSelectBox:\n${JSON.stringify(data, null, 2)}`);
  }, []);

  const onCheckReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      checkForm.reset();
    },
    [checkForm],
  );

  const onRadioReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      radioForm.reset();
    },
    [radioForm],
  );

  return (
    <HStack gap="x8" p="x4" width="full" align="flex-start">
      <VStack
        grow
        gap="x3"
        as="form"
        onSubmit={checkForm.handleSubmit(onCheckValid)}
        onReset={onCheckReset}
      >
        <CheckSelectBoxGroup aria-label="Fruit">
          {POSSIBLE_FRUIT_VALUES.map((name) => (
            <CheckSelectBoxItem key={name} name={name} control={checkForm.control} />
          ))}
        </CheckSelectBoxGroup>
        <HStack gap="x2">
          <ActionButton type="reset" variant="neutralWeak">
            초기화
          </ActionButton>
          <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
            제출
          </ActionButton>
        </HStack>
      </VStack>

      <VStack
        grow
        gap="x3"
        as="form"
        onSubmit={radioForm.handleSubmit(onRadioValid)}
        onReset={onRadioReset}
      >
        <RadioSelectBoxRoot aria-label="Fruit" {...radioField}>
          {POSSIBLE_FRUIT_VALUES.map((value) => (
            <RadioSelectBoxItem
              key={value}
              value={value}
              label={value}
              suffix={<RadioSelectBoxRadiomark />}
            />
          ))}
        </RadioSelectBoxRoot>
        <HStack gap="x2">
          <ActionButton type="reset" variant="neutralWeak">
            초기화
          </ActionButton>
          <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
            제출
          </ActionButton>
        </HStack>
      </VStack>
    </HStack>
  );
}

interface CheckSelectBoxItemProps {
  name: keyof CheckFormValues;
  control: Control<CheckFormValues>;
}

function CheckSelectBoxItem({ name, control }: CheckSelectBoxItemProps) {
  const {
    field: { value, ...restProps },
    fieldState: { invalid },
  } = useController({ name, control });

  return (
    <CheckSelectBox
      key={name}
      label={name}
      checked={value}
      inputProps={restProps}
      invalid={invalid}
      suffix={<CheckSelectBoxCheckmark />}
    />
  );
}
```

### Customizing Label \[#customizing-label]

```tsx
import { Badge, HStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxCustomizingLabel() {
  return (
    <HStack gap="x8" align="flex-start" p="x4">
      <CheckSelectBoxGroup aria-label="Fruit">
        <CheckSelectBox label="Apple" defaultChecked suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox
          label={
            <>
              Melon
              <Badge tone="brand" variant="solid">
                New
              </Badge>
            </>
          }
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          label="Mango"
          description="Aliqua ad aute eiusmod eiusmod nulla adipisicing proident ullamco in."
          suffix={<CheckSelectBoxCheckmark />}
        />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot defaultValue="apple" aria-label="Fruit">
        <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
        <RadioSelectBoxItem
          value="melon"
          label={
            <>
              Melon
              <Badge tone="brand" variant="solid">
                New
              </Badge>
            </>
          }
          description="Elit cupidatat dolore fugiat enim veniam culpa."
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="mango"
          label="Mango"
          description="Aliqua ad aute eiusmod eiusmod nulla adipisicing proident ullamco in."
          suffix={<RadioSelectBoxRadiomark />}
        />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
```

### Listening to Value Changes \[#listening-to-value-changes]

`CheckSelectBox`는 `onCheckedChange`를 사용하여 체크박스의 선택 상태 변경을 감지할 수 있습니다.

`RadioSelectBoxRoot`는 `onValueChange`를 사용하여 라디오 버튼의 선택 값 변경을 감지할 수 있습니다.

```tsx
import { HStack, Text, VStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";
import { useState } from "react";

export default function SelectBoxValueChanges() {
  const [checkCount, setCheckCount] = useState(0);
  const [checkLastValue, setCheckLastValue] = useState<boolean | null>(null);

  const [radioCount, setRadioCount] = useState(0);
  const [radioLastValue, setRadioLastValue] = useState<string | null>(null);

  return (
    <HStack gap="x8" align="center" width="full" p="x4">
      <VStack gap="x4" align="center" style={{ flex: 1 }}>
        <CheckSelectBoxGroup aria-label="Fruit">
          <CheckSelectBox
            label="Apple"
            suffix={<CheckSelectBoxCheckmark />}
            onCheckedChange={(checked) => {
              setCheckCount((prev) => prev + 1);
              setCheckLastValue(checked);
            }}
          />
        </CheckSelectBoxGroup>
        <Text align="center">
          onCheckedChange called: {checkCount} times, last value: {`${checkLastValue ?? "-"}`}
        </Text>
      </VStack>

      <VStack gap="x4" align="center" style={{ flex: 1 }}>
        <RadioSelectBoxRoot
          defaultValue="apple"
          aria-label="Fruit"
          onValueChange={(value) => {
            setRadioCount((prev) => prev + 1);
            setRadioLastValue(value);
          }}
        >
          <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadiomark />} />
          <RadioSelectBoxItem value="banana" label="Banana" suffix={<RadioSelectBoxRadiomark />} />
        </RadioSelectBoxRoot>
        <Text align="center">
          onValueChange called: {radioCount} times, last value: {radioLastValue ?? "-"}
        </Text>
      </VStack>
    </HStack>
  );
}
```

### Grid Layout (Columns) \[#grid-layout-columns]

`columns` prop을 사용하여 여러 열로 배치할 수 있습니다. `columns`가 1보다 크면 하위 요소의 `layout`이 자동으로 `"vertical"`로 설정됩니다.

필요한 경우 `layout` prop을 직접 설정하여 개별 항목의 레이아웃을 오버라이드할 수 있습니다.

```tsx
import { IconDiamond, IconIcecreamcone } from "@karrotmarket/react-multicolor-icon";
import { VStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxColumns() {
  return (
    <VStack gap="x8" p="x4">
      <CheckSelectBoxGroup columns={2} aria-label="Grid 레이아웃 예제">
        <CheckSelectBox
          prefixIcon={<IconIcecreamcone />}
          label="옵션 1"
          description="layout=vertical"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          prefixIcon={<IconIcecreamcone />}
          label="옵션 2"
          description="layout=vertical"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          prefixIcon={<IconIcecreamcone />}
          defaultChecked
          layout="horizontal"
          label="layout=horizontal"
          description="layout을 horizontal로 오버라이드"
          suffix={<CheckSelectBoxCheckmark />}
        />
        <CheckSelectBox
          prefixIcon={<IconIcecreamcone />}
          label="옵션 4"
          description="layout=vertical"
          suffix={<CheckSelectBoxCheckmark />}
        />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot columns={3} defaultValue="option3" aria-label="Grid 레이아웃 예제">
        <RadioSelectBoxItem
          value="option1"
          prefixIcon={<IconDiamond />}
          label="옵션 1"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option2"
          prefixIcon={<IconDiamond />}
          label="옵션 2"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option3"
          prefixIcon={<IconDiamond />}
          label="layout=horizontal"
          description="layout을 horizontal로 오버라이드"
          layout="horizontal"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option4"
          prefixIcon={<IconDiamond />}
          label="옵션 4"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option5"
          prefixIcon={<IconDiamond />}
          label="옵션 5"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="option6"
          prefixIcon={<IconDiamond />}
          label="옵션 6"
          suffix={<RadioSelectBoxRadiomark />}
        />
      </RadioSelectBoxRoot>
    </VStack>
  );
}
```

### With Suffix \[#with-suffix]

`suffix` prop을 사용하여 체크마크, 라디오 마크, 또는 커스텀 요소를 표시할 수 있습니다. `CheckSelectBoxCheckmark`와 `RadioSelectBoxRadiomark`를 사용하거나, 아이콘이나 텍스트 등 자유로운 요소를 전달할 수 있습니다.

```tsx
import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Text, HStack, Box } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxWithSuffix() {
  return (
    <HStack gap="x8">
      <CheckSelectBoxGroup aria-label="Suffix 예제">
        <CheckSelectBox label="체크마크" suffix={<CheckSelectBoxCheckmark />} />
        <CheckSelectBox
          label="텍스트 suffix"
          suffix={
            <Box flexShrink={0}>
              <Text textStyle="t4Medium" color="fg.neutral">
                +1,000원
              </Text>
            </Box>
          }
        />
        <CheckSelectBox
          label="suffix 없음"
          description="Commodo aliquip fugiat aute irure."
          prefixIcon={<IconPersonCircleLine />}
        />
      </CheckSelectBoxGroup>
      <RadioSelectBoxRoot defaultValue="radiomark" aria-label="Radiomark 예제">
        <RadioSelectBoxItem
          value="radiomark"
          label="라디오 마크"
          suffix={<RadioSelectBoxRadiomark />}
        />
        <RadioSelectBoxItem
          value="text"
          label="텍스트 suffix"
          description="Commodo aliquip fugiat aute irure."
          suffix={
            <Box flexShrink={0}>
              <Text textStyle="t4Medium" color="fg.neutral">
                +1,000원
              </Text>
            </Box>
          }
        />
        <RadioSelectBoxItem
          value="none"
          label="suffix 없음"
          suffix={undefined}
          prefixIcon={<IconPersonCircleLine />}
        />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
```

### Collapsible Footer \[#collapsible-footer]

`footer` prop으로 추가 콘텐츠를 표시할 수 있습니다. `footerVisibility` prop으로 footer의 표시 조건을 제어할 수 있습니다.

- `"when-selected"` (기본값): 항목이 선택되었을 때만 표시
- `"when-not-selected"`: 항목이 선택되지 않았을 때만 표시
- `"always"`: 항상 표시

```tsx
import { Box, HStack, Text } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxCollapsibleFooter() {
  return (
    <HStack gap="x8" p="x4" align="flex-start" height="400px">
      <CheckSelectBoxGroup aria-label="Footer 예제">
        <CheckSelectBox
          label="선택 시에만 표시 (기본값)"
          description="footerVisibility='when-selected'"
          suffix={<CheckSelectBoxCheckmark />}
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">선택되었을 때만 보입니다.</Text>
            </Box>
          }
        />
        <CheckSelectBox
          label="항상 표시"
          description="footerVisibility='always'"
          suffix={<CheckSelectBoxCheckmark />}
          footerVisibility="always"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">항상 보입니다.</Text>
            </Box>
          }
        />
        <CheckSelectBox
          label="미선택 시에만 표시"
          description="footerVisibility='when-not-selected'"
          suffix={<CheckSelectBoxCheckmark />}
          footerVisibility="when-not-selected"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">선택되지 않았을 때만 보입니다.</Text>
            </Box>
          }
        />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot defaultValue="when-selected" aria-label="Footer 예제">
        <RadioSelectBoxItem
          value="when-selected"
          label="선택 시에만 표시 (기본값)"
          description="footerVisibility='when-selected'"
          suffix={<RadioSelectBoxRadiomark />}
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">선택되었을 때만 보입니다.</Text>
            </Box>
          }
        />
        <RadioSelectBoxItem
          value="always"
          label="항상 표시"
          description="footerVisibility='always'"
          suffix={<RadioSelectBoxRadiomark />}
          footerVisibility="always"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">항상 보입니다.</Text>
            </Box>
          }
        />
        <RadioSelectBoxItem
          value="when-not-selected"
          label="미선택 시에만 표시"
          description="footerVisibility='when-not-selected'"
          suffix={<RadioSelectBoxRadiomark />}
          footerVisibility="when-not-selected"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">선택되지 않았을 때만 보입니다.</Text>
            </Box>
          }
        />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
```

### Fieldset/RadioGroupField Integration \[#fieldsetradiogroupfield-integration]

Fieldset/RadioGroupField 관련 prop을 사용할 수 있습니다.

- `label` 및 `labelWeight`
- `indicator` 및 `showRequiredIndicator`
- `description` 및 `errorMessage`
- `disabled`, `invalid`, `name`, `form`: `RadioSelectBoxRoot`에만 지원됩니다.

```tsx
import { ActionButton, HStack, VStack, Box, Text } from "@seed-design/react";
import { useState } from "react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxFieldset() {
  const [checkErrors, setCheckErrors] = useState<Record<string, string | undefined>>({});
  const [radioErrorMessage, setRadioErrorMessage] = useState<string | undefined>();

  const handleCheckSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const fruits = formData.getAll("fruit");

    if (fruits.includes("apple")) {
      setCheckErrors({ apple: "Apple은 선택할 수 없습니다." });

      return;
    }

    setCheckErrors({});

    alert(JSON.stringify(fruits, null, 2));
  };

  const handleRadioSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const color = formData.get("color");

    if (color === "red") {
      setRadioErrorMessage("Red는 선택할 수 없습니다.");

      return;
    }

    setRadioErrorMessage(undefined);

    alert(JSON.stringify({ color }, null, 2));
  };

  return (
    <HStack width="full" gap="x8" p="x4" align="flex-start" height="400px">
      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleCheckSubmit}>
          <CheckSelectBoxGroup
            label="선호하는 과일을 선택하세요"
            indicator="선택"
            description="Apple을 선택하고 제출해보세요."
            errorMessage={Object.values(checkErrors).filter(Boolean).join(", ")}
          >
            <CheckSelectBox
              defaultChecked
              label="Apple"
              // formData를 위해 설정. controlled 사용 시 불필요
              inputProps={{ name: "fruit", value: "apple" }}
              invalid={!!checkErrors.apple}
              suffix={<CheckSelectBoxCheckmark />}
              footer={
                <Box px="x5" pb="x4">
                  <Text textStyle="t4Medium">
                    Apple을 선택하고 제출하면 에러 메시지가 표시됩니다.
                  </Text>
                </Box>
              }
            />
            <CheckSelectBox
              label="Melon"
              inputProps={{ name: "fruit", value: "melon" }}
              invalid={!!checkErrors.melon}
              suffix={<CheckSelectBoxCheckmark />}
            />
            <CheckSelectBox
              label="Mango"
              inputProps={{ name: "fruit", value: "mango" }}
              invalid={!!checkErrors.mango}
              suffix={<CheckSelectBoxCheckmark />}
            />
          </CheckSelectBoxGroup>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>

      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleRadioSubmit}>
          <RadioSelectBoxRoot
            label="선호하는 색상을 선택하세요"
            labelWeight="bold"
            showRequiredIndicator
            description="Red를 선택하고 제출해보세요."
            name="color"
            defaultValue="red"
            invalid={!!radioErrorMessage}
            errorMessage={radioErrorMessage}
          >
            <RadioSelectBoxItem
              value="red"
              label="Red"
              suffix={<RadioSelectBoxRadiomark />}
              footer={
                <Box px="x5" pb="x4">
                  <Text textStyle="t4Medium">
                    Red를 선택하고 제출하면 에러 메시지가 표시됩니다.
                  </Text>
                </Box>
              }
            />
            <RadioSelectBoxItem
              value="blue"
              label="Blue"
              suffix={<RadioSelectBoxRadiomark />}
              disabled
            />
            <RadioSelectBoxItem value="green" label="Green" suffix={<RadioSelectBoxRadiomark />} />
          </RadioSelectBoxRoot>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>
    </HStack>
  );
}
```