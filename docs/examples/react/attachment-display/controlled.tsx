import { VStack, HStack, Text } from "@seed-design/react";
import { useState } from "react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { ActionButton } from "seed-design/ui/action-button";
import { AttachmentDisplayField, AttachmentDisplayInput } from "seed-design/ui/attachment-display";

let nextId = 1;

export default function AttachmentDisplayControlled() {
  const [items, setItems] = useState<DisplayItemEntry[]>([]);

  const addItem = () => {
    const id = String(nextId++);
    setItems((prev) => [
      ...prev,
      {
        id,
        thumbnailUrl: `https://picsum.photos/seed/ctrl${id}/200/200`,
        status: "success" as const,
      },
    ]);
  };

  return (
    <VStack gap="x4" width="100%">
      <AttachmentDisplayField items={items} onItemsChange={setItems} maxItems={5}>
        <AttachmentDisplayInput />
      </AttachmentDisplayField>
      <Text>현재 아이템: {items.length}개</Text>
      <HStack gap="x2">
        <ActionButton type="button" variant="neutralWeak" onClick={addItem}>
          아이템 추가
        </ActionButton>
        <ActionButton type="button" variant="neutralWeak" onClick={() => setItems([])}>
          전체 삭제
        </ActionButton>
      </HStack>
    </VStack>
  );
}
