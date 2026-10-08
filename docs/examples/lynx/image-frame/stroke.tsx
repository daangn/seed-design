import "./styles";
import { ImageFrame, HStack, VStack, Text } from "@seed-design/lynx-react";

export default function ImageFrameStroke() {
  return (
    <HStack gap="x4" wrap="wrap" align="flex-end">
      <VStack gap="x2" align="center">
        <ImageFrame
          ratio={4 / 3}
          stroke={false}
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="stroke=false"
          style={{ width: "150px" }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          stroke=false
        </Text>
      </VStack>
      <VStack gap="x2" align="center">
        <ImageFrame
          ratio={4 / 3}
          stroke={true}
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="stroke=true"
          style={{ width: "150px" }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          stroke=true
        </Text>
      </VStack>
    </HStack>
  );
}
