import { useGlobalProps, useState } from "@lynx-js/react";
import { Box, Text, VStack, type AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";

const ENTRIES: AttachmentDisplayEntry[] = Array.from({ length: 6 }, (_, index) => ({
  id: String(index),
  thumbnailUrl: `https://picsum.photos/seed/seed${index + 1}/200/200`,
  status: "success",
}));

export default function Example() {
  useGlobalProps();
  const [extend, setExtend] = useState(true);
  return (
    <VStack gap="x4" width="100%">
      <Switch checked={extend} onCheckedChange={setExtend} label="안전 영역까지 확장" />
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        목록을 끝까지 스크롤해 마지막 이미지와 삭제 버튼을 확인해 보세요.
      </Text>
      <Box pl="safeArea" pr="safeArea">
        <AttachmentDisplayField
          controlProps={{ extendSafeAreaX: extend }}
          label="첨부 이미지"
          description="라벨과 설명은 안전 영역 안에 남습니다."
          defaultEntries={ENTRIES}
          maxEntries={8}
        >
          <AttachmentDisplay
            onTriggerTap={({ addEntries }) => {
              "background only";
              addEntries([
                { id: "added", thumbnailUrl: ENTRIES[0].thumbnailUrl, status: "success" },
              ]);
            }}
          />
        </AttachmentDisplayField>
      </Box>
    </VStack>
  );
}
