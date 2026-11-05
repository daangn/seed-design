import "./styles";
import { ImageFrame, HStack, VStack, Text } from "@seed-design/lynx-react";

export default function ImageFrameRatio() {
  return (
    <HStack gap="x2" wrap="wrap" align="flex-end">
      <VStack gap="x2" align="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="1:1"
          style={{ width: "120px" }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          1:1
        </Text>
      </VStack>
      <VStack gap="x2" align="center">
        <ImageFrame
          ratio={4 / 3}
          borderRadius="r2"
          stroke
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="4:3"
          style={{ width: "160px" }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          4:3
        </Text>
      </VStack>
      <VStack gap="x2" align="center">
        <ImageFrame
          ratio={16 / 9}
          borderRadius="r2"
          stroke
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="16:9"
          style={{ width: "200px" }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        />
        <Text color="palette.gray700" textStyle="t1Regular">
          16:9
        </Text>
      </VStack>
    </HStack>
  );
}
