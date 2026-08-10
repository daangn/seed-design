file: components/field-button.mdx

# Field Button

입력 필드 형태의 버튼으로, 선택창이나 피커를 열 때 사용합니다. 선택이 완료되면 버튼 라벨에 선택된 값이 표시됩니다.

사용 가능 버전: @seed-design/react@1.1.0, @seed-design/css@1.1.0

## Preview

```tsx
import { FieldButton } from "seed-design/ui/field-button";

export default function FieldButtonPreview() {
  return (
    <FieldButton
      label="레이블"
      description="버튼에 대한 설명을 작성해주세요"
      buttonProps={{
        onClick: () => window.alert("버튼 클릭됨"),
        "aria-label": "알림 표시",
      }}
    />
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:field-button
- pnpm: pnpm dlx @seed-design/cli@latest add ui:field-button
- yarn: yarn dlx @seed-design/cli@latest add ui:field-button
- bun: bun x @seed-design/cli@latest add ui:field-button

<ManualInstallation name="field-button" />

## Props \[#props]

### `FieldButton` \[#fieldbutton]

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
- `showRequiredIndicator`
  - type: `boolean | undefined`
- `showClearButton`
  - type: `boolean | undefined`
- `buttonProps`
  - type: `SeedFieldButton.ButtonProps | undefined`
- `rootRef`
  - type: `React.Ref<HTMLDivElement> | undefined`
- `size`
  - type: `"medium" | "large" | "responsive" | undefined`
  - default: `"large"`
  - description: - \`large\`: 뷰포트 너비와 관계없이 사용할 수 있습니다. - \`medium\`: Breakpoint \`lg\` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다. - \`responsive\`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint \`lg\` 미만에서는 \`large\`, \`lg\` 이상에서는 \`medium\`으로 적용됩니다.
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
- `invalid`
  - type: `boolean | undefined`
  - default: `false`
- `readOnly`
  - type: `boolean | undefined`
  - default: `false`
- `name`
  - type: `string | undefined`
- `values`
  - type: `string[] | undefined`
- `onValuesChange`
  - type: `((values: string[]) => void) | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `FieldButtonValue` \[#fieldbuttonvalue]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `FieldButtonPlaceholder` \[#fieldbuttonplaceholder]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Basic Usage \[#basic-usage]

`FieldButton`은 `TextField`와 유사한 외관을 갖지만, 근본적으로 내부에 `<button>` 요소를 포함하는 컴포넌트입니다. 사용자는 `buttonProps` prop을 통해 버튼의 속성을 제어할 수 있습니다.

- **`buttonProps`**
  - **`onClick`**: 버튼 클릭 핸들러
  - **`aria-label`**: 버튼의 접근성 레이블
- **`children`**
  - `FieldButtonValue` 또는 `FieldButtonPlaceholder` 등을 사용하여 구성
  - `FieldButtonValue`와 `FieldButtonPlaceholder`는 스타일 차이만 있을 뿐 기능적으로 동일합니다. 스크린 리더는 두 요소를 읽거나 구분하지 않습니다. 접근성을 위해 `buttonProps["aria-label"]`에 적절한 값을 제공하세요. 자세한 내용은 [Accessibility](#accessibility) 섹션을 참고하세요.

```tsx
import { FieldButton, FieldButtonPlaceholder, FieldButtonValue } from "seed-design/ui/field-button";
import { useState } from "react";

export default function FieldButtonBasicUsage() {
  const [selectedCity, setSelectedCity] = useState<string>("");

  return (
    <FieldButton
      label="도시"
      showClearButton={!!selectedCity}
      values={[selectedCity]}
      onValuesChange={([value]) => setSelectedCity(value)}
      buttonProps={{
        onClick: () => {
          // Open your picker dialog/sheet here
          setSelectedCity("서울");
        },
        "aria-label": selectedCity ? `도시 변경. 현재: ${selectedCity}` : "도시 선택",
      }}
    >
      {selectedCity ? (
        <FieldButtonValue>{selectedCity}</FieldButtonValue>
      ) : (
        <FieldButtonPlaceholder>도시를 선택해주세요</FieldButtonPlaceholder>
      )}
    </FieldButton>
  );
}
```

### Clear Button \[#clear-button]

`showClearButton` prop을 `true`로 설정하면 Clear Button이 표시됩니다. `showClearButton`을 `true`로 설정하는 경우 `onValuesChange` prop을 제공해야 합니다.

`FieldButton`이 `disabled` 또는 `readOnly` 상태인 경우 Clear Button은 표시되지 않습니다.

```tsx
import { FieldButton, FieldButtonValue, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { useState } from "react";

export default function FieldButtonFormControl() {
  const [value, setValue] = useState(
    "Do nostrud duis deserunt occaecat sit ex veniam fugiat commodo voluptate voluptate.",
  );

  return (
    <FieldButton
      values={[value]}
      onValuesChange={([value]) => setValue(value ?? "")}
      showClearButton={value !== ""}
      buttonProps={{
        onClick: () => setValue(window.prompt("값을 입력해주세요") || value),
        "aria-label": `값 입력.${value ? ` 현재 값은 ${value}입니다.` : ""}`,
      }}
    >
      {value ? (
        <FieldButtonValue>입력한 값: {value}</FieldButtonValue>
      ) : (
        <FieldButtonPlaceholder>값을 입력하려면 클릭하세요</FieldButtonPlaceholder>
      )}
    </FieldButton>
  );
}
```

### `FieldButtonValue` & `FieldButtonPlaceholder` \[#fieldbuttonvalue--fieldbuttonplaceholder]

`<FieldButton>` 내부에 `children`으로 넣어 사용할 수 있는 단순한 `<div>` 요소입니다.

스크린 리더는 `FieldButtonValue`와 `FieldButtonPlaceholder`를 읽지 않습니다. `buttonProps["aria-label"]`에 적절한 값을 제공하여 접근성을 확보하세요. 자세한 내용은 [Accessibility](#accessibility) 섹션을 참고하세요.

```tsx
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { useCallback, useState } from "react";

export default function FieldButtonValuePlaceholder() {
  const [value, setValue] = useState<string>("");

  const toggleValue = useCallback(() => {
    setValue((prev) => (prev ? "" : "값 설정됨"));
  }, []);

  return (
    <HStack width="full" gap="x3">
      <FieldButton
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "알림 표시",
        }}
      >
        <FieldButtonValue>FieldButtonValue</FieldButtonValue>
      </FieldButton>
      <FieldButton
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "알림 표시",
        }}
      >
        <FieldButtonPlaceholder>FieldButtonPlaceholder</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        buttonProps={{
          onClick: toggleValue,
          "aria-label": "값 설정",
        }}
      >
        {value ? (
          <FieldButtonValue>{value}</FieldButtonValue>
        ) : (
          <FieldButtonPlaceholder>클릭하여 값 설정</FieldButtonPlaceholder>
        )}
      </FieldButton>
    </HStack>
  );
}
```

### Accessibility \[#accessibility]

**Field Button 내부 `button`에 `aria-label` 속성을 제공하세요.** 스크린 리더 사용자가 Field Button을 클릭했을 때 어떤 일이 일어날지 예상할 수 있도록 해야 하며, 현재 선택된 값이 있는 경우 그 값이 무엇인지도 알려야 합니다.

```tsx
<FieldButton
  label="사용자 이름" // 스크린 리더는 label을 읽습니다.
  description="본명을 사용하지 않아도 괜찮습니다." // 스크린 리더는 description을 버튼과 함께 읽습니다.
  buttonProps={{
    // [!code highlight]
    // 버튼을 클릭했을 때 어떤 일이 일어날지, 현재 선택된 값이 무엇인지 알려야 합니다.
    "aria-label": `사용자 이름 선택 화면 열기. 현재 선택된 이름: ${username || "없음"}`, // [!code highlight]
    "aria-haspopup": "dialog",
    onClick: () => setIsUsernamePickerOpen(true),
  }}
>
  {username ? (
    <FieldButtonValue>{username}</FieldButtonValue> // 스크린 리더는 FieldButtonValue를 읽지 않습니다.
  ) : (
    <FieldButtonPlaceholder>김하늘</FieldButtonPlaceholder> // 스크린 리더는 FieldButtonPlaceholder를 읽지 않습니다.
  )}
</FieldButton>
```

화면을 볼 수 있는 사용자는 Field Button이 클릭할 수 있는 요소라는 점과, Field Button을 클릭했을 때 일어날 동작을 쉽게 예측할 수 있지만, 스크린 리더 사용자는 `button`에 `aria-label` 속성이 없는 경우 Field Button을 클릭했을 때 어떤 일이 일어날지 파악하기 어렵습니다.

### Use Cases \[#use-cases]

#### Form \[#form]

`FieldButton`에 `values` prop을 제공하는 경우 폼 제출에 활용할 수 있도록 `<input type="hidden" />`을 함께 렌더링합니다.

```tsx
import { VStack, HStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useState, type FormEvent } from "react";

export default function FieldButtonForm() {
  const [count, setCount] = useState(0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    window.alert(JSON.stringify(Object.fromEntries(formData.entries()), null, 2));
  };

  return (
    <VStack asChild width="full" gap="spacingY.componentDefault">
      <form onSubmit={handleSubmit}>
        <HStack gap="x3">
          <TextField
            label="TextField"
            description="이것은 TextField입니다. FieldButton과 어떻게 다른지 비교해보세요."
            name="text-field-text"
          >
            <TextFieldInput placeholder="TextFieldInput" />
          </TextField>
          <FieldButton
            label="input을 포함한 FieldButton"
            description={`이 FieldButton은 <input type="hidden" /> 요소를 한 개 포함하고 있습니다. 자세한 내용은 예시 코드를 참고하세요.`}
            name="field-button-count"
            values={[`${count}`]}
            buttonProps={{
              onClick: () => setCount((prev) => prev + 1),
              "aria-label": "카운트 증가",
            }}
          >
            <FieldButtonValue>현재 카운트: {count}</FieldButtonValue>
          </FieldButton>
        </HStack>
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}
```

#### Form and Bottom Sheet \[#form-and-bottom-sheet]

```tsx
import { useState } from "react";
import { HStack, VStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetRoot,
  BottomSheetContent,
  BottomSheetBody,
  BottomSheetFooter,
} from "seed-design/ui/bottom-sheet";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { Portal } from "@seed-design/react";

interface ProductFormData {
  category: string;
  name: string;
}

export default function FieldButtonFormBottomSheet() {
  const [formData, setFormData] = useState<ProductFormData>({
    category: "",
    name: "",
  });
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    window.alert(JSON.stringify(formData));
  };

  const updateFormData = (field: keyof ProductFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNameClick = () => {
    const inputName = window.prompt("상품명을 입력해주세요");

    if (inputName === null) return;

    updateFormData("name")(inputName);
  };

  return (
    <VStack gap="spacingY.componentDefault" width="full" as="form" onSubmit={handleSubmit}>
      <HStack gap="x2">
        <BottomSheetRoot open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
          <FieldButton
            label="카테고리"
            values={[formData.category]}
            onValuesChange={([value]) => updateFormData("category")(value ?? "")}
            showClearButton={formData.category !== ""}
            buttonProps={{
              onClick: () => setIsCategorySheetOpen(true),
              "aria-label": "카테고리 선택",
              "aria-haspopup": "dialog",
            }}
          >
            {formData.category ? (
              <FieldButtonValue>{formData.category}</FieldButtonValue>
            ) : (
              <FieldButtonPlaceholder>카테고리를 선택해주세요</FieldButtonPlaceholder>
            )}
          </FieldButton>
          <Portal>
            <CategoryInputSheet
              value={formData.category}
              onSubmit={(value) => {
                updateFormData("category")(value);
                setIsCategorySheetOpen(false);
              }}
            />
          </Portal>
        </BottomSheetRoot>
        <FieldButton
          label="상품명"
          showClearButton={formData.name !== ""}
          values={[formData.name]}
          onValuesChange={([value]) => updateFormData("name")(value)}
          buttonProps={{
            onClick: handleNameClick,
            "aria-label": "상품명 입력",
          }}
        >
          {formData.name ? (
            <FieldButtonValue>{formData.name}</FieldButtonValue>
          ) : (
            <FieldButtonPlaceholder>상품명을 입력해주세요</FieldButtonPlaceholder>
          )}
        </FieldButton>
      </HStack>
      <ActionButton type="submit" variant="neutralSolid">
        제출
      </ActionButton>
    </VStack>
  );
}

interface CategoryInputSheetProps {
  value: string;
  onSubmit: (value: string) => void;
}

function CategoryInputSheet({ value, onSubmit }: CategoryInputSheetProps) {
  const [draft, setDraft] = useState(value);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(draft);

    event.stopPropagation();
  };

  return (
    <BottomSheetContent title="카테고리 선택">
      <form onSubmit={handleSubmit}>
        <BottomSheetBody minHeight="x16">
          <TextField
            label="카테고리를 입력해 주세요"
            value={draft}
            onValueChange={({ value }) => setDraft(value)}
          >
            <TextFieldInput type="text" placeholder="예: 전자기기" />
          </TextField>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton type="submit" variant="neutralSolid">
            확인
          </ActionButton>
        </BottomSheetFooter>
      </form>
    </BottomSheetContent>
  );
}
```

#### React Hook Form \[#react-hook-form]

```tsx
import { VStack, HStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";
import { ActionButton } from "seed-design/ui/action-button";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";

interface FormValues {
  text: string;
  count: number;
}

export default function FieldButtonReactHookFormSimple() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      text: "",
      count: 0,
    },
  });

  const {
    field: { onChange: textOnChange, ...textField },
    fieldState: textFieldState,
  } = useController({
    name: "text",
    control,
    rules: {
      required: "필수 입력 항목입니다",
    },
  });

  const {
    field: { value: countValue, onChange: countOnChange, ...countField },
    fieldState: countFieldState,
  } = useController({
    name: "count",
    control,
    rules: {
      validate: (value) => value >= 3 || "최소 3회 이상 클릭해야 합니다",
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
    <VStack asChild width="full" gap="spacingY.componentDefault">
      <form onSubmit={handleSubmit(onValid)} onReset={onReset}>
        <HStack gap="x3">
          <TextField
            label="TextField"
            description="이것은 TextField입니다. FieldButton과 어떻게 다른지 비교해보세요."
            invalid={textFieldState.invalid}
            errorMessage={textFieldState.error?.message}
            onValueChange={({ value }) => textOnChange(value)}
            showRequiredIndicator
            {...textField}
          >
            <TextFieldInput placeholder="TextFieldInput" />
          </TextField>
          <FieldButton
            label="input을 포함한 FieldButton"
            description={`이 FieldButton은 <input type="hidden" /> 요소를 한 개 포함하고 있습니다. 자세한 내용은 예시 코드를 참고하세요.`}
            invalid={countFieldState.invalid}
            errorMessage={countFieldState.error?.message}
            values={[`${countValue}`]}
            onValuesChange={([value]) => countOnChange(Number(value))}
            buttonProps={{
              onClick: () => countOnChange(countValue + 1),
              "aria-label": "카운트 증가",
            }}
            showRequiredIndicator
            {...countField}
          >
            <FieldButtonValue>현재 카운트: {countValue}</FieldButtonValue>
          </FieldButton>
        </HStack>
        <HStack gap="x2">
          <ActionButton type="reset" variant="neutralWeak">
            초기화
          </ActionButton>
          <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
            제출
          </ActionButton>
        </HStack>
      </form>
    </VStack>
  );
}
```

#### Multiple Values (React Hook Form (Field Array)) \[#multiple-values-react-hook-form-field-array]

```tsx
import React, { useState, useCallback } from "react";
import { Box, HStack, VStack } from "@seed-design/react";
import { useFieldArray, useForm } from "react-hook-form";
import { FieldButton, FieldButtonValue, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetRoot,
  BottomSheetContent,
  BottomSheetBody,
  BottomSheetFooter,
} from "seed-design/ui/bottom-sheet";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { Portal } from "@seed-design/react";

interface ProductFormData {
  tags: { value: string }[];
}

export default function FieldButtonFieldArray() {
  const { control, handleSubmit, reset, setValue } = useForm<ProductFormData>({
    defaultValues: { tags: [] },
  });

  const [isTagSheetOpen, setIsTagSheetOpen] = useState(false);

  const { fields, append } = useFieldArray({ control, name: "tags" });

  const onValid = useCallback((data: ProductFormData) => {
    window.alert(JSON.stringify(data, null, 2));
  }, []);

  const onReset = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      reset();
    },
    [reset],
  );

  const handleAddTag = (tag: string) => {
    if (tag && !fields.some((field) => field.value === tag)) {
      append({ value: tag });
    }

    setIsTagSheetOpen(false);
  };

  return (
    <VStack
      gap="spacingY.componentDefault"
      width="full"
      as="form"
      onSubmit={handleSubmit(onValid)}
      onReset={onReset}
    >
      <BottomSheetRoot open={isTagSheetOpen} onOpenChange={setIsTagSheetOpen}>
        <FieldButton
          label="태그"
          values={fields.map((field) => field.value)}
          onValuesChange={(values) =>
            setValue(
              "tags",
              values.map((value) => ({ value })),
            )
          }
          showClearButton={fields.length > 0}
          buttonProps={{
            onClick: () => setIsTagSheetOpen(true),
            "aria-label": fields.length > 0 ? `태그 ${fields.length}개 편집` : "태그 선택",
            "aria-haspopup": "dialog",
          }}
        >
          {fields.length > 0 ? (
            <FieldButtonValue>{fields.map((field) => field.value).join(", ")}</FieldButtonValue>
          ) : (
            <FieldButtonPlaceholder>태그를 추가해주세요</FieldButtonPlaceholder>
          )}
        </FieldButton>
        <Portal>
          <TagInputSheet onSubmit={handleAddTag} existingTags={fields.map((f) => f.value)} />
        </Portal>
      </BottomSheetRoot>
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

interface TagInputSheetProps {
  onSubmit: (tag: string) => void;
  existingTags: string[];
}

function TagInputSheet({ onSubmit, existingTags }: TagInputSheetProps) {
  const [addDraft, setAddDraft] = useState("");

  const handleAddSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!addDraft) return;

    if (existingTags.includes(addDraft)) {
      window.alert("이미 추가된 태그입니다");

      event.stopPropagation();

      return;
    }

    setAddDraft("");
    onSubmit(addDraft);

    event.stopPropagation();
  };

  return (
    <BottomSheetContent title="태그 입력">
      <Box onSubmit={handleAddSubmit} as="form" width="full">
        <BottomSheetBody minHeight="x16">
          <TextField
            label="태그를 입력해주세요"
            value={addDraft}
            onValueChange={({ value }) => setAddDraft(value)}
          >
            <TextFieldInput type="text" placeholder="예: 전자기기, 신상품" />
          </TextField>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton type="submit" variant="neutralSolid" disabled={!addDraft}>
            추가
          </ActionButton>
        </BottomSheetFooter>
      </Box>
    </BottomSheetContent>
  );
}
```

#### Multiple Values (Native `form`) \[#multiple-values-native-form]

```tsx
import React, { useState, useCallback } from "react";
import { Box, HStack, VStack } from "@seed-design/react";
import { FieldButton, FieldButtonValue, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetRoot,
  BottomSheetContent,
  BottomSheetBody,
  BottomSheetFooter,
} from "seed-design/ui/bottom-sheet";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { Portal } from "@seed-design/react";

export default function FieldButtonMultipleValues() {
  const [tags, setTags] = useState<string[]>([]);
  const [isTagSheetOpen, setIsTagSheetOpen] = useState(false);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = { tags: formData.getAll("tags") };

    window.alert(JSON.stringify(formValues, null, 2));
  }, []);

  const handleReset = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    setTags([]);
  }, []);

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }

    setIsTagSheetOpen(false);
  };

  return (
    <VStack gap="spacingY.componentDefault" width="full" asChild>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <BottomSheetRoot open={isTagSheetOpen} onOpenChange={setIsTagSheetOpen}>
          <FieldButton
            label="태그"
            description="여러 태그를 추가할 수 있습니다"
            name="tags"
            values={tags}
            onValuesChange={setTags}
            showClearButton={tags.length > 0}
            buttonProps={{
              onClick: () => setIsTagSheetOpen(true),
              "aria-label": tags.length > 0 ? `태그 ${tags.length}개 편집` : "태그 선택",
              "aria-haspopup": "dialog",
            }}
          >
            {tags.length > 0 ? (
              <FieldButtonValue>{tags.join(", ")}</FieldButtonValue>
            ) : (
              <FieldButtonPlaceholder>태그를 추가해주세요</FieldButtonPlaceholder>
            )}
          </FieldButton>
          <Portal>
            <TagInputSheet onSubmit={handleAddTag} existingTags={tags} />
          </Portal>
        </BottomSheetRoot>
        <HStack gap="x2">
          <ActionButton type="reset" variant="neutralWeak">
            초기화
          </ActionButton>
          <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
            제출
          </ActionButton>
        </HStack>
      </form>
    </VStack>
  );
}

interface TagInputSheetProps {
  onSubmit: (tag: string) => void;
  existingTags: string[];
}

function TagInputSheet({ onSubmit, existingTags }: TagInputSheetProps) {
  const [addDraft, setAddDraft] = useState("");

  const handleAddSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!addDraft) return;

    if (existingTags.includes(addDraft)) {
      window.alert("이미 추가된 태그입니다");

      event.stopPropagation();

      return;
    }

    onSubmit(addDraft);
    setAddDraft("");

    event.stopPropagation();
  };

  return (
    <BottomSheetContent title="태그 입력">
      <Box onSubmit={handleAddSubmit} as="form" width="full">
        <BottomSheetBody minHeight="x16">
          <TextField
            label="태그를 입력해주세요"
            value={addDraft}
            onValueChange={({ value }) => setAddDraft(value)}
          >
            <TextFieldInput type="text" placeholder="예: 전자기기, 신상품" />
          </TextField>
        </BottomSheetBody>
        <BottomSheetFooter>
          <ActionButton type="submit" variant="neutralSolid" disabled={!addDraft}>
            추가
          </ActionButton>
        </BottomSheetFooter>
      </Box>
    </BottomSheetContent>
  );
}
```

### State \[#state]

#### Enabled \[#enabled]

```tsx
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonEnabled() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "알림 표시",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "알림 표시",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
```

#### Disabled \[#disabled]

- `values`를 제공할 때 렌더링되는 `<input type="hidden" />`도 함께 `disabled` 처리되어 폼 제출 시 값이 전송되지 않습니다.
- `<button>` 요소도 `disabled` 처리되어 클릭할 수 없게 됩니다.

```tsx
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonDisabled() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        disabled
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "값 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        disabled
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "값 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
```

#### Read Only \[#read-only]

- `values`를 제공할 때 렌더링되는 `<input type="hidden" />`은 영향을 받지 않습니다.
- `<button>` 요소는 `disabled` 처리되어 클릭할 수 없게 됩니다.

```tsx
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonReadOnly() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        readOnly
        buttonProps={{
          "aria-label": "값 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        readOnly
        invalid
        errorMessage="오류가 발생한 이유를 써주세요"
        buttonProps={{
          "aria-label": "값 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
```

### Size \[#size]

`size`로 FieldButton의 크기를 정합니다. (default: `large`)

`responsive`는 화면 너비에 따라 size가 자동으로 전환되는 값입니다. 여러 화면 너비를 함께 지원하는 제품에서 `size=responsive`를 사용하여 대응합니다.

```tsx
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonSize() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="size=large (default)"
        size="large"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "선택 화면 열기",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="size=medium"
        size="medium"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "선택 화면 열기",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="size=responsive"
        size="responsive"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "선택 화면 열기",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
```

### Customizable Parts \[#customizable-parts]

#### Prefix \[#prefix]

```tsx
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";

export default function FieldButtonPrefix() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefix="https://"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "URL 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefixIcon={<IconMagnifyingglassLine />}
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "검색",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
```

#### Suffix \[#suffix]

```tsx
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { IconWonLine } from "@karrotmarket/react-monochrome-icon";

export default function FieldButtonSuffix() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        suffix="cm"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "키 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        suffixIcon={<IconWonLine />}
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "금액 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
```

#### Both Affixes \[#both-affixes]

```tsx
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";
import { IconPlusCircleLine, IconWonLine } from "@karrotmarket/react-monochrome-icon";

export default function FieldButtonBothAffixes() {
  return (
    <HStack width="full" gap="x3">
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefix="만"
        suffix="세"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "나이 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="라벨"
        description="설명을 써주세요"
        prefixIcon={<IconPlusCircleLine />}
        suffixIcon={<IconWonLine />}
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "금액 선택",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
```

#### Indicator \[#indicator]

```tsx
import { HStack } from "@seed-design/react";
import { FieldButton, FieldButtonPlaceholder } from "seed-design/ui/field-button";

export default function FieldButtonIndicator() {
  return (
    <HStack gap="x3" width="full">
      <FieldButton
        label="선택 필드"
        labelWeight="bold"
        indicator="선택"
        description="이 필드는 선택사항입니다"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "선택 값 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
      <FieldButton
        label="필수 필드"
        showRequiredIndicator
        description="이 필드는 필수사항입니다"
        buttonProps={{
          onClick: () => window.alert("버튼 클릭됨"),
          "aria-label": "필수 값 입력",
        }}
      >
        <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
      </FieldButton>
    </HStack>
  );
}
```