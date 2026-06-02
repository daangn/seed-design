import { vars } from "@seed-design/css/vars";
import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

const defaultEntries: DisplayItemEntry[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  thumbnailUrl: `https://picsum.photos/seed/inset${i + 1}/200/200`,
  status: "success",
}));

export default function AttachmentDisplayCustomInset() {
  return (
    <VStack
      px="spacingX.globalGutter"
      width="400px"
      maxWidth="full"
      bg="palette.gray300"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <VStack gap="spacingY.componentDefault" bg="bg.layerDefault">
        <TextField label="이름">
          <TextFieldInput placeholder="홍길동" />
        </TextField>
        <AttachmentDisplayField
          defaultEntries={defaultEntries}
          maxEntries={10}
          style={
            {
              "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
            } as React.CSSProperties
          }
        >
          <AttachmentDisplay
            onTriggerClick={() => {
              // 외부 미디어 피커 호출 자리
            }}
          />
        </AttachmentDisplayField>
      </VStack>
    </VStack>
  );
}
