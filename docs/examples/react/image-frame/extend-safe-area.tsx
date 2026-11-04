import { useState } from "react";
import { Box, Text, VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";
import { ImageFrame, ImageFrameFloater, ImageFrameIndicator } from "@seed-design/react";

export default function Example() {
  const [extend, setExtend] = useState(false);
  return (
    <VStack gap="x4" width="100%">
      <Switch checked={extend} onCheckedChange={setExtend} label="안전 영역까지 확장" />
      <Text textStyle="t3Bold">
        {extend ? '확장 후 (TO BE) · bleedX="safeArea"' : "확장 전 (AS IS) · bleedX=0"}
      </Text>
      <Box pl="safeArea" pr="safeArea" className="docs-safe-area-frame">
        <ImageFrame
          ratio={4 / 3}
          borderRadius="r0"
          bleedX={extend ? "safeArea" : 0}
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="프로필 이미지"
        >
          <ImageFrameFloater placement="top-start">
            <ImageFrameIndicator>시작</ImageFrameIndicator>
          </ImageFrameFloater>
          <ImageFrameFloater placement="top-center">
            <ImageFrameIndicator>중앙</ImageFrameIndicator>
          </ImageFrameFloater>
          <ImageFrameFloater placement="top-end">
            <ImageFrameIndicator>끝</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>
      </Box>
    </VStack>
  );
}
