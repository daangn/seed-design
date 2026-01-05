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
