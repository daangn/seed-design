import "@seed-design/lynx-css/base.css";

import * as React from "@lynx-js/react";
import type { NativeFile } from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";
import { TextField, TextFieldInput } from "@/components/ui/text-field";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

type AttachmentFieldStyle = NonNullable<React.ComponentProps<typeof AttachmentField>["style"]> & {
  "--seed-attachment-input-extend-x": string;
};

const INSET_STYLE: AttachmentFieldStyle = {
  "--seed-attachment-input-extend-x": "var(--seed-dimension-spacing-x-global-gutter)",
};

const MOCKED_FILES: NativeFile[] = Array.from({ length: 8 }, (_, index) => ({
  uri: `fixture://attachment-field/file${index + 1}.txt`,
  name: `file${index + 1}.txt`,
  type: "text/plain",
  size: 1,
}));

export default function AttachmentFieldCustomInset() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={seedClassName}>
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
          <AttachmentField
            maxFiles={5}
            label="첨부파일"
            defaultAcceptedFileEntries={MOCKED_FILES.map((file, index) => ({
              id: `${index}`,
              file,
              status: "pending",
            }))}
            style={INSET_STYLE}
            onSelectFiles={() => [MOCKED_FILES[0]]}
          >
            <AttachmentInput />
          </AttachmentField>
        </VStack>
      </VStack>
    </view>
  );
}
