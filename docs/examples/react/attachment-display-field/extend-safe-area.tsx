import { useState } from "react";
import { Box, Text, VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";
import { AttachmentDisplayField, AttachmentDisplay } from "seed-design/ui/attachment-display-field";

export default function Example() {
  const [extend, setExtend] = useState(false);
  return (
    <VStack gap="x4" width="100%">
      <Switch checked={extend} onCheckedChange={setExtend} label="안전 영역까지 확장" />
      <Text textStyle="t3Bold">
        {extend
          ? "확장 후 (TO BE) · extendSafeAreaX=true"
          : "확장 전 (AS IS) · extendSafeAreaX=false"}
      </Text>
      <Box pl="safeArea" pr="safeArea" className="docs-safe-area-frame">
        <AttachmentDisplayField
          controlProps={{ extendSafeAreaX: extend }}
          label="첨부 이미지"
          description="목록을 끝까지 스크롤해 마지막 이미지의 여백을 확인해 보세요."
          maxEntries={8}
          defaultEntries={Array.from({ length: 6 }, (_, index) => ({
            id: String(index),
            thumbnailUrl: `https://picsum.photos/seed/seed${index + 1}/200/200`,
            status: "success" as const,
          }))}
        >
          <AttachmentDisplay onTriggerClick={() => {}} />
        </AttachmentDisplayField>
      </Box>
    </VStack>
  );
}
