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
