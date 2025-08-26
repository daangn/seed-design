"use client";

import { useState } from "react";
import { HStack, VStack } from "@seed-design/react";
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
            required
            values={[formData.category]}
            onValuesChange={([value]) => updateFormData("category")(value)}
            onButtonClick={() => setIsCategorySheetOpen(true)}
          >
            <FieldButtonValue placeholder="카테고리를 선택해주세요">
              {formData.category}
            </FieldButtonValue>
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
          required
          values={[formData.name]}
          onValuesChange={([value]) => updateFormData("name")(value)}
          onButtonClick={handleNameClick}
        >
          <FieldButtonValue placeholder="상품명을 입력해주세요">{formData.name}</FieldButtonValue>
        </FieldButton>
      </HStack>
      <ActionButton type="submit" variant="neutralSolid" size="large">
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
