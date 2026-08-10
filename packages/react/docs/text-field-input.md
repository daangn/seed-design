file: components/text-field-input.mdx

# Text Field Input

한 줄 텍스트를 입력받는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@1.1.0, @seed-design/css@1.1.0

## Preview

```tsx
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldPreview() {
  return (
    <TextField label="라벨">
      <TextFieldInput autoFocus />
    </TextField>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:text-field
- pnpm: pnpm dlx @seed-design/cli@latest add ui:text-field
- yarn: yarn dlx @seed-design/cli@latest add ui:text-field
- bun: bun x @seed-design/cli@latest add ui:text-field

<ManualInstallation name="text-field" />

## Props \[#props]

### `TextField` \[#textfield]

- `label`
  - type: `React.ReactNode`
- `labelWeight`
  - type: `"medium" | "bold" | undefined`
  - default: `"medium"`
- `indicator`
  - type: `React.ReactNode`
- `prefixIcon`
  - type: `React.ReactNode`
- `prefix`
  - type: `React.ReactNode`
- `suffixIcon`
  - type: `React.ReactNode`
- `suffix`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `errorMessage`
  - type: `React.ReactNode`
- `hideCharacterCount`
  - type: `boolean | undefined`
- `maxGraphemeCount`
  - type: `number | undefined`
- `showRequiredIndicator`
  - type: `boolean | undefined`
- `fieldRef`
  - type: `React.Ref<HTMLDivElement> | undefined`
- `onValueChange`
  - type: `((values: { value: string; graphemes: string[]; slicedValue: string; slicedGraphemes: string[]; }) => void) | undefined`
- `variant`
  - type: `"outline" | "underline" | undefined`
  - default: `"outline"`
  - description: - \`outline\`: 기본 스타일입니다. - \`underline\`: 화면에 하나의 Input만 있는 경우 사용을 권장합니다.
- `size`
  - type: `"medium" | "large" | "responsive" | undefined`
  - default: `"large"`
  - description: - \`large\`: 뷰포트 너비와 관계없이 사용할 수 있습니다. - \`medium\`: Breakpoint \`lg\` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다. - \`responsive\`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint \`lg\` 미만에서는 \`large\`, \`lg\` 이상에서는 \`medium\`으로 적용됩니다.
- `defaultValue`
  - type: `string | undefined`
- `required`
  - type: `boolean | undefined`
  - default: `false`
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
- `readOnly`
  - type: `boolean | undefined`
  - default: `false`
- `invalid`
  - type: `boolean | undefined`
  - default: `false`
- `name`
  - type: `string | undefined`
- `value`
  - type: `string | undefined`

### `TextFieldInput` \[#textfieldinput]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### State \[#state]

#### Enabled \[#enabled]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputEnabled() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="라벨" description="설명을 써주세요">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField
          label="라벨"
          description="설명을 써주세요"
          invalid
          errorMessage="오류가 발생한 이유를 써주세요"
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="설명을 써주세요">
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField
          variant="underline"
          description="설명을 써주세요"
          invalid
          errorMessage="오류가 발생한 이유를 써주세요"
        >
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
```

#### Disabled \[#disabled]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputDisabled() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="라벨" description="설명을 써주세요" disabled>
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField
          label="라벨"
          description="설명을 써주세요"
          disabled
          invalid
          errorMessage="오류가 발생한 이유를 써주세요"
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="설명을 써주세요" disabled>
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField
          variant="underline"
          description="설명을 써주세요"
          disabled
          invalid
          errorMessage="오류가 발생한 이유를 써주세요"
        >
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
```

#### Read Only \[#read-only]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputReadOnly() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="라벨" description="설명을 써주세요" readOnly>
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField
          label="라벨"
          description="설명을 써주세요"
          readOnly
          invalid
          errorMessage="오류가 발생한 이유를 써주세요"
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="설명을 써주세요" readOnly>
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField
          variant="underline"
          description="설명을 써주세요"
          readOnly
          invalid
          errorMessage="오류가 발생한 이유를 써주세요"
        >
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
```

### Size \[#size]

`size`로 TextField의 크기를 정합니다. (default: `large`)

`responsive`는 화면 너비에 따라 size가 자동으로 전환되는 값입니다. 여러 화면 너비를 함께 지원하는 제품에서 `size=responsive`를 사용하여 대응합니다.

```tsx
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputSize() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="라벨" description="size=large (default)" size="large">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField label="라벨" description="size=medium" size="medium">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField label="라벨" description="size=responsive" size="responsive">
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="size=large (default)" size="large">
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField variant="underline" description="size=medium" size="medium">
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField variant="underline" description="size=responsive" size="responsive">
          <TextFieldInput aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
```

### Customizable Parts \[#customizable-parts]

아이콘만으로 맥락을 전달하려고 할 때 유의하세요. `description` 또는 `label`에 아이콘의 의미를 명확히 설명하는 텍스트를 포함하거나, 아이콘이 스크린 리더에 의해 읽히도록 설정하고 `aria-label`을 제공하세요.

#### Prefix \[#prefix]

```tsx
import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputPrefix() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField
          label="소셜 미디어 URL"
          description="프로필이나 페이지 URL을 입력해주세요."
          prefix="https://"
        >
          <TextFieldInput placeholder="example.com" />
        </TextField>
        <TextField
          label="검색"
          description="글 제목 또는 내용으로 검색할 수 있습니다."
          prefixIcon={<IconMagnifyingglassLine />}
        >
          <TextFieldInput placeholder="레모네이드 레시피" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField
          variant="underline"
          description="프로필이나 페이지 URL을 입력해주세요."
          prefix="https://"
        >
          <TextFieldInput aria-label="소셜 미디어 URL" placeholder="example.com" />
        </TextField>
        <TextField
          variant="underline"
          description="글 제목 또는 내용으로 검색할 수 있습니다."
          prefixIcon={<IconMagnifyingglassLine />}
        >
          <TextFieldInput aria-label="검색" placeholder="레모네이드 레시피" />
        </TextField>
      </HStack>
    </VStack>
  );
}
```

#### Suffix \[#suffix]

```tsx
import { IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputSuffix() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="너비" description="직접 측정 후 입력해주세요." suffix="cm">
          <TextFieldInput placeholder="200" />
        </TextField>
        <TextField label="금액" description="단위: 원" suffixIcon={<IconWonLine />}>
          <TextFieldInput placeholder="50,000" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="직접 측정 후 입력해주세요." suffix="cm">
          <TextFieldInput aria-label="너비" placeholder="200" />
        </TextField>
        <TextField variant="underline" description="단위: 원" suffixIcon={<IconWonLine />}>
          <TextFieldInput aria-label="금액" placeholder="50,000" />
        </TextField>
      </HStack>
    </VStack>
  );
}
```

#### Both Affixes \[#both-affixes]

```tsx
import { IconPlusCircleLine, IconWonLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputBothAffixes() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField
          label="나이"
          description="오늘 기준, 만 나이를 입력해주세요."
          prefix="만"
          suffix="세"
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
        <TextField
          label="금액"
          description="정산할 금액을 입력해주세요."
          prefixIcon={<IconPlusCircleLine />}
          suffixIcon={<IconWonLine aria-label="원" aria-hidden={false} />}
        >
          <TextFieldInput placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField
          variant="underline"
          description="오늘 기준, 만 나이를 입력해주세요."
          prefix="만"
          suffix="세"
        >
          <TextFieldInput aria-label="나이" placeholder="플레이스홀더" />
        </TextField>
        <TextField
          variant="underline"
          description="정산할 금액을 입력해주세요."
          prefixIcon={<IconPlusCircleLine />}
          suffixIcon={<IconWonLine aria-label="원" aria-hidden={false} />}
        >
          <TextFieldInput aria-label="금액" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
```

#### Indicator \[#indicator]

`indicator` 또는 `showRequiredIndicator` prop을 사용할 수 있습니다.

```tsx
import { HStack } from "@seed-design/react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputIndicator() {
  return (
    <HStack gap="x3" width="full">
      <TextField
        label="선택 필드"
        labelWeight="bold"
        description="설명을 써주세요"
        indicator="선택"
      >
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
      <TextField label="필수 필드" description="설명을 써주세요" required>
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
      <TextField label="필수 필드" description="설명을 써주세요" required showRequiredIndicator>
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
```

#### Grapheme Count \[#grapheme-count]

```tsx
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { HStack } from "@seed-design/react";

export default function TextFieldInputGraphemeCount() {
  return (
    <HStack gap="x3" width="full">
      <TextField label="라벨" description="설명을 써주세요" maxGraphemeCount={8}>
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
      <TextField
        label="라벨"
        description="설명을 써주세요"
        maxGraphemeCount={8}
        invalid
        errorMessage="에러 메시지"
      >
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
```

자소 단위로 쪼개진 `value`에 관한 정보를 `onValueChange` 콜백에서 `graphemes`와 `slicedGraphemes`로 제공합니다.

자소 분리는 [unicode-segmenter](https://github.com/cometkim/unicode-segmenter)를 통해 이루어집니다.

```tsx
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useState } from "react";
import { Text, VStack } from "@seed-design/react";

export default function TextFieldInputGraphemeControlled() {
  const [value, setValue] = useState("");
  const [graphemes, setGraphemes] = useState<string[]>([]);

  return (
    <VStack gap="x4" width="full" align="center">
      <TextField
        label="라벨"
        description="국기 이모지 🇰🇷 를 추가해보세요."
        maxGraphemeCount={100}
        value={value}
        onValueChange={({ slicedValue, slicedGraphemes }) => {
          setValue(slicedValue);
          setGraphemes(slicedGraphemes);
        }}
      >
        <TextFieldInput placeholder="플레이스홀더" />
      </TextField>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: "16px",
          columnGap: "32px",
          padding: "16px",
        }}
      >
        <Text textStyle="t3Medium">
          <code>graphemes.length</code>: {graphemes.length}
        </Text>
        <Text textStyle="t3Medium">
          <code>value.length</code>: {value.length}
        </Text>
        <Text textStyle="t3Medium">
          <code>graphemes</code>: {JSON.stringify(graphemes)}
        </Text>
        <Text textStyle="t3Medium">
          <code>value</code>: {value}
        </Text>
      </div>
    </VStack>
  );
}
```

### Use Cases \[#use-cases]

#### Form (Uncontrolled) \[#form-uncontrolled]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { useCallback, useState, type FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

type FieldErrors = {
  name?: string;
  address?: string;
};

export default function TextFieldInputForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name")?.toString();
    const address = formData.get("address")?.toString();

    const newFieldErrors: FieldErrors = {};

    if (!name) {
      newFieldErrors.name = "필수 입력 항목입니다";
    }

    if (!address) {
      newFieldErrors.address = "필수 입력 항목입니다";
    }

    if (address && !address.startsWith("대한민국")) {
      newFieldErrors.address = "대한민국으로 시작해주세요";
    }

    setFieldErrors(newFieldErrors);

    if (Object.keys(newFieldErrors).length > 0) return;

    window.alert(JSON.stringify(Object.fromEntries(formData.entries()), null, 2));
  }, []);

  return (
    <VStack asChild gap="x3" width="full">
      <form onSubmit={handleSubmit}>
        <HStack gap="x2">
          <TextField
            label="이름"
            description="이름을 써주세요"
            name="name"
            required
            showRequiredIndicator
            {...(fieldErrors.name && { invalid: true, errorMessage: fieldErrors.name })}
          >
            <TextFieldInput placeholder="홍길동" />
          </TextField>
          <TextField
            label="주소"
            description="주소를 써주세요"
            name="address"
            maxGraphemeCount={30}
            required
            showRequiredIndicator
            {...(fieldErrors.address && { invalid: true, errorMessage: fieldErrors.address })}
          >
            <TextFieldInput placeholder="대한민국" />
          </TextField>
        </HStack>
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}
```

#### React Hook Form \[#react-hook-form]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

interface FormValues {
  name: string;
  address: string;
}

export default function TextFieldInputReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const {
    field: { onChange: nameOnChange, ...nameField },
    fieldState: nameFieldState,
  } = useController({
    name: "name",
    control,
    rules: {
      required: "필수 입력 항목입니다",
    },
  });
  const {
    field: { onChange: addressOnChange, ...addressField },
    fieldState: addressFieldState,
  } = useController({
    name: "address",
    control,
    rules: {
      required: "필수 입력 항목입니다",
      pattern: { value: /^대한민국/, message: "대한민국으로 시작해주세요" },
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
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <HStack gap="x2">
        <TextField
          label="이름"
          description="이름을 써주세요"
          invalid={nameFieldState.invalid}
          errorMessage={nameFieldState.error?.message}
          onValueChange={({ value }) => nameOnChange(value)}
          required
          showRequiredIndicator
          {...nameField}
        >
          <TextFieldInput placeholder="홍길동" />
        </TextField>
        <TextField
          label="주소"
          description="주소를 써주세요"
          invalid={addressFieldState.invalid}
          errorMessage={addressFieldState.error?.message}
          maxGraphemeCount={30}
          onValueChange={({ slicedValue }) => addressOnChange(slicedValue)}
          required
          showRequiredIndicator
          {...addressField}
        >
          <TextFieldInput placeholder="대한민국" />
        </TextField>
      </HStack>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}
```

#### Number Formatting \[#number-formatting]

```tsx
import { useMemo, useState } from "react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputNumberFormatting() {
  const [value, setValue] = useState("1000");

  const formattedValue = useMemo(() => {
    if (value === "") return value;

    const number = Number(value.replace(/,/g, ""));
    if (Number.isNaN(number)) return "";

    return number.toLocaleString();
  }, [value]);

  return (
    <TextField
      label="금액"
      description="금액을 써주세요"
      value={formattedValue}
      onValueChange={({ value }) => setValue(value)}
    >
      <TextFieldInput placeholder="9,999,999" />
    </TextField>
  );
}
```

#### Slicing \[#slicing]

```tsx
import { useState } from "react";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

export default function TextFieldInputSlicing() {
  const [value, setValue] = useState("");

  return (
    <TextField
      label="라벨"
      description="6글자까지 입력 가능합니다"
      maxGraphemeCount={6}
      value={value}
      onValueChange={({ slicedValue }) => setValue(slicedValue)}
    >
      <TextFieldInput placeholder="플레이스홀더" />
    </TextField>
  );
}
```