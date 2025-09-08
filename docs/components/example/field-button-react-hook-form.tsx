"use client";

import { useState, useCallback } from "react";
import { HStack, VStack } from "@seed-design/react";
import { useController, useForm } from "react-hook-form";
import { FieldButton, FieldButtonValue } from "seed-design/ui/field-button";
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

export default function FieldButtonReactHookForm() {
  const { handleSubmit, reset, control } = useForm<ProductFormData>({
    defaultValues: {
      category: "",
      name: "",
    },
  });

  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const {
    field: { onChange: categoryOnChange, ...categoryField },
    fieldState: categoryFieldState,
  } = useController({
    name: "category",
    control,
    rules: {
      required: "카테고리를 선택해주세요",
    },
  });

  const {
    field: { onChange: nameOnChange, ...nameField },
    fieldState: nameFieldState,
  } = useController({
    name: "name",
    control,
    rules: {
      required: "상품명을 입력해주세요",
    },
  });

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

  const handleNameClick = () => {
    const inputName = window.prompt("상품명을 입력해주세요");

    if (inputName === null) return;

    nameOnChange(inputName);
  };

  return (
    <VStack
      gap="spacingY.componentDefault"
      width="full"
      as="form"
      onSubmit={handleSubmit(onValid)}
      onReset={onReset}
    >
      <HStack gap="x2">
        <BottomSheetRoot open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
          <FieldButton
            label="카테고리"
            required
            invalid={categoryFieldState.invalid}
            errorMessage={categoryFieldState.error?.message}
            values={[categoryField.value]}
            onValuesChange={([value]) => categoryOnChange(value)}
            onButtonClick={() => setIsCategorySheetOpen(true)}
            {...categoryField}
          >
            <FieldButtonValue placeholder="카테고리를 선택해주세요">
              {categoryField.value}
            </FieldButtonValue>
          </FieldButton>
          <Portal>
            <CategoryInputSheet
              value={categoryField.value}
              onSubmit={(value) => {
                categoryOnChange(value);
                setIsCategorySheetOpen(false);
              }}
            />
          </Portal>
        </BottomSheetRoot>
        <FieldButton
          label="상품명"
          required
          invalid={nameFieldState.invalid}
          errorMessage={nameFieldState.error?.message}
          values={[nameField.value]}
          onValuesChange={([value]) => nameOnChange(value)}
          onButtonClick={handleNameClick}
          {...nameField}
        >
          <FieldButtonValue placeholder="상품명을 입력해주세요">{nameField.value}</FieldButtonValue>
        </FieldButton>
      </HStack>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak" size="large">
          초기화
        </ActionButton>
        <ActionButton type="submit" variant="neutralSolid" size="large" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
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
