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
