import { useGlobalProps, useState } from "@lynx-js/react";
import { Box, Text, VStack, type NativeFile } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";

const FILES: NativeFile[] = Array.from({ length: 6 }, (_, index) => ({
  uri: `fixture://attachment-field/file${index + 1}.txt`,
  name: `file${index + 1}.txt`,
  type: "text/plain",
  size: 1024,
}));

export default function Example() {
  useGlobalProps();
  const [extend, setExtend] = useState(true);
  return (
    <VStack gap="x4" width="100%">
      <Switch checked={extend} onCheckedChange={setExtend} label="안전 영역까지 확장" />
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        목록을 끝까지 스크롤해 마지막 항목의 여백을 확인해 보세요.
      </Text>
      <Box pl="safeArea" pr="safeArea">
        <AttachmentField
          extendSafeAreaX={extend}
          label="첨부파일"
          description="스크롤 영역만 안전 영역까지 확장됩니다."
          maxFiles={8}
          defaultAcceptedFileEntries={FILES.map((file, index) => ({
            id: String(index),
            file,
            status: "success",
          }))}
          onSelectFiles={() => {
            "background only";
            return [FILES[0]];
          }}
        >
          <AttachmentInput />
        </AttachmentField>
      </Box>
    </VStack>
  );
}
