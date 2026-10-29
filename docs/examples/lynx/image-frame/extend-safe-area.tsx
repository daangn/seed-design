import "./styles";

import { useGlobalProps, useState } from "@lynx-js/react";
import {
  Box,
  ImageFrame,
  ImageFrameBadge,
  ImageFrameFloater,
  Text,
  VStack,
} from "@seed-design/lynx-react";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  useGlobalProps();
  const [extend, setExtend] = useState(true);
  return (
    <VStack gap="x4" width="100%">
      <Switch checked={extend} onCheckedChange={setExtend} label="안전 영역까지 확장" />
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        이미지는 화면 끝까지, 배지는 안전 영역 안에 놓입니다.
      </Text>
      <Box pl="safeArea" pr="safeArea">
        <ImageFrame
          ratio={4 / 3}
          borderRadius="r0"
          bleedX={extend ? "safeArea" : 0}
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="프로필 이미지"
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        >
          <ImageFrameFloater placement="top-start">
            <ImageFrameBadge tone="brand" variant="solid">
              시작
            </ImageFrameBadge>
          </ImageFrameFloater>
          <ImageFrameFloater placement="top-center">
            <ImageFrameBadge tone="brand" variant="solid">
              중앙
            </ImageFrameBadge>
          </ImageFrameFloater>
          <ImageFrameFloater placement="top-end">
            <ImageFrameBadge tone="brand" variant="solid">
              끝
            </ImageFrameBadge>
          </ImageFrameFloater>
        </ImageFrame>
      </Box>
    </VStack>
  );
}
