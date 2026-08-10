file: components/text-field-textarea.mdx

# Text Field Textarea

여러 줄의 긴 텍스트를 입력받고 자동으로 높이를 조절하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@1.1.0, @seed-design/css@1.1.0

## Preview

```tsx
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function MultilineTextFieldPreview() {
  return (
    <TextField label="라벨">
      <TextFieldTextarea autoFocus />
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

### `TextFieldTextarea` \[#textfieldtextarea]

- `autoresize`
  - type: `boolean | undefined`
  - default: `true`
  - description: If true, the textarea will automatically resize based on its content.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### State \[#state]

#### Enabled \[#enabled]

```tsx
import { HStack } from "@seed-design/react";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaEnabled() {
  return (
    <HStack width="full" gap="x3">
      <TextField label="라벨" description="설명을 써주세요">
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
      <TextField
        label="라벨"
        description="설명을 써주세요"
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
      >
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
```

#### Disabled \[#disabled]

```tsx
import { HStack } from "@seed-design/react";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaDisabled() {
  return (
    <HStack width="full" gap="x3">
      <TextField label="라벨" description="설명을 써주세요" disabled>
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
      <TextField
        label="라벨"
        description="설명을 써주세요"
        disabled
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
      >
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
```

#### Read Only \[#read-only]

```tsx
import { HStack } from "@seed-design/react";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaReadOnly() {
  return (
    <HStack width="full" gap="x3">
      <TextField label="라벨" description="설명을 써주세요" readOnly>
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
      <TextField
        label="라벨"
        description="설명을 써주세요"
        readOnly
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
      >
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
```

### Size \[#size]

`size`로 TextField의 크기를 정합니다. (default: `large`)

`responsive`는 화면 너비에 따라 size가 자동으로 전환되는 값입니다. 여러 화면 너비를 함께 지원하는 제품에서 `size=responsive`를 사용하여 대응합니다.

```tsx
import { HStack, VStack } from "@seed-design/react";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaSize() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <HStack gap="x3">
        <TextField label="라벨" description="size=large (default)" size="large">
          <TextFieldTextarea placeholder="플레이스홀더" />
        </TextField>
        <TextField label="라벨" description="size=medium" size="medium">
          <TextFieldTextarea placeholder="플레이스홀더" />
        </TextField>
        <TextField label="라벨" description="size=responsive" size="responsive">
          <TextFieldTextarea placeholder="플레이스홀더" />
        </TextField>
      </HStack>
      <HStack gap="x3">
        <TextField variant="underline" description="size=large (default)" size="large">
          <TextFieldTextarea aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField variant="underline" description="size=medium" size="medium">
          <TextFieldTextarea aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
        <TextField variant="underline" description="size=responsive" size="responsive">
          <TextFieldTextarea aria-label="라벨" placeholder="플레이스홀더" />
        </TextField>
      </HStack>
    </VStack>
  );
}
```

### Sizing \[#sizing]

`<TextFieldTextarea>`에 `height` 관련 스타일을 직접 지정하여 높이를 고정하거나 최소/최대 높이를 설정할 수 있습니다.

#### Fixed Height \[#fixed-height]

```tsx
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaSpecifiedHeight() {
  return (
    <TextField label="라벨" description="설명을 써주세요">
      <TextFieldTextarea placeholder="플레이스홀더" style={{ height: "250px" }} />
    </TextField>
  );
}
```

#### Auto Height with Constraints \[#auto-height-with-constraints]

```tsx
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaConstraints() {
  return (
    <TextField label="라벨" description="설명을 써주세요">
      <TextFieldTextarea
        placeholder="플레이스홀더"
        style={{ minHeight: "200px", maxHeight: "300px" }}
      />
    </TextField>
  );
}
```

### Customizable Parts \[#customizable-parts]

#### Indicator \[#indicator]

`indicator` 또는 `showRequiredIndicator` prop을 사용할 수 있습니다.

```tsx
import { HStack } from "@seed-design/react";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaIndicator() {
  return (
    <HStack gap="x3" width="full">
      <TextField
        label="선택 필드"
        labelWeight="bold"
        description="설명을 써주세요"
        indicator="선택"
      >
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
      <TextField label="필수 필드" description="설명을 써주세요" required>
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
      <TextField label="필수 필드" description="설명을 써주세요" required showRequiredIndicator>
        <TextFieldTextarea placeholder="플레이스홀더" />
      </TextField>
    </HStack>
  );
}
```

#### Grapheme Count \[#grapheme-count]

```tsx
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaGraphemeCount() {
  return (
    <TextField label="라벨" description="설명을 써주세요" maxGraphemeCount={8}>
      <TextFieldTextarea placeholder="플레이스홀더" />
    </TextField>
  );
}
```

자소 단위로 쪼개진 `value`에 관한 정보를 `onValueChange` 콜백에서 `graphemes`와 `slicedGraphemes`로 제공합니다.

자소 분리는 [unicode-segmenter](https://github.com/cometkim/unicode-segmenter)를 통해 이루어집니다.

```tsx
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";
import { useState } from "react";
import { Text, VStack } from "@seed-design/react";

export default function TextFieldTextareaGraphemeControlled() {
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
        <TextFieldTextarea placeholder="플레이스홀더" />
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
        <Text textStyle="t3Medium" style={{ whiteSpace: "pre-wrap" }}>
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
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

type FieldErrors = {
  bio?: string;
  address?: string;
};

export default function TextFieldTextareaForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const bio = formData.get("bio")?.toString();
    const address = formData.get("address")?.toString();

    const newFieldErrors: FieldErrors = {};

    if (!bio) {
      newFieldErrors.bio = "필수 입력 항목입니다";
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
            label="자기소개"
            description="자기소개를 써주세요"
            name="bio"
            required
            showRequiredIndicator
            {...(fieldErrors.bio && { invalid: true, errorMessage: fieldErrors.bio })}
          >
            <TextFieldTextarea placeholder="저는…" />
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
            <TextFieldTextarea placeholder="대한민국" />
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
import { useCallback, type FormEvent, type KeyboardEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

interface FormValues {
  bio: string;
  address: string;
}

export default function TextFieldTextareaReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      bio: "",
      address: "",
    },
  });

  const {
    field: { onChange: bioOnChange, ...bioField },
    fieldState: bioFieldState,
  } = useController({
    name: "bio",
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

  const onValid = useCallback(
    (data: FormValues) => window.alert(JSON.stringify(data, null, 2)),
    [],
  );

  const onReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      reset();
    },
    [reset],
  );

  const onMetaReturn = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();

        handleSubmit(onValid)();
      }
    },
    [handleSubmit, onValid],
  );

  return (
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <HStack gap="x2">
        <TextField
          label="자기소개"
          description="자기소개를 써주세요"
          invalid={bioFieldState.invalid}
          errorMessage={bioFieldState.error?.message}
          onValueChange={({ value }) => bioOnChange(value)}
          required
          showRequiredIndicator
          {...bioField}
        >
          <TextFieldTextarea placeholder="저는…" onKeyDown={onMetaReturn} />
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
          <TextFieldTextarea placeholder="대한민국" onKeyDown={onMetaReturn} />
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

#### Formatting \[#formatting]

```tsx
import { useMemo, useState } from "react";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaFormatting() {
  const [value, setValue] = useState("");

  const formattedValue = useMemo(
    () =>
      value
        .split("")
        .filter((char) => char !== " ")
        .join(""),
    [value],
  );

  return (
    <TextField
      label="레이블"
      description="공백을 입력할 수 없어요"
      value={formattedValue}
      onValueChange={({ value }) => setValue(value)}
    >
      <TextFieldTextarea placeholder="공백을 입력해보세요" />
    </TextField>
  );
}
```

#### Slicing \[#slicing]

```tsx
import { useState } from "react";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function TextFieldTextareaSlicing() {
  const [value, setValue] = useState("");

  return (
    <TextField
      label="라벨"
      description="6글자까지 입력 가능합니다"
      maxGraphemeCount={6}
      value={value}
      onValueChange={({ slicedValue }) => setValue(slicedValue)}
    >
      <TextFieldTextarea placeholder="플레이스홀더" />
    </TextField>
  );
}
```