import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { vars } from "@seed-design/css/vars";

const mockedFiles = Array.from({ length: 8 }, (_, i) => {
  const file = new File(["file content"], `file${i + 1}.txt`, { type: "text/plain" });
  Object.defineProperty(file, "size", { value: 1 });

  return file;
});

export default function AttachmentInputCustomInset() {
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
        <AttachmentField
          maxFiles={5}
          label="첨부파일"
          defaultAcceptedFileEntries={mockedFiles.map((file, index) => ({
            id: `${index}`,
            file,
            status: "pending",
          }))}
          rootProps={{
            style: {
              "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
            } as React.CSSProperties,
          }}
        >
          <AttachmentInput />
        </AttachmentField>
      </VStack>
    </VStack>
  );
}
