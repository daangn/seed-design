import "./styles";
import { ImageFrame, HStack, VStack, Text } from "@seed-design/lynx-react";

export default function ImageFrameBorderRadius() {
  return (
    <VStack gap="x6" align="flex-start">
      <HStack gap="x4" wrap="wrap" align="flex-end">
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            alt="size 20 borderRadius=r1"
            style={{ width: "20px" }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            20 / r1 (4px)
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            alt="size 24 borderRadius r1"
            style={{ width: "24px" }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            24 / r1 (4px)
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1_5"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            alt="size 36 borderRadius r1_5"
            style={{ width: "36px" }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            36 / r1_5 (6px)
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1_5"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            alt="size 42 borderRadius r1_5"
            style={{ width: "42px" }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            42 / r1_5 (6px)
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r1_5"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            alt="size 48 borderRadius r1_5"
            style={{ width: "48px" }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            48 / r1_5 (6px)
          </Text>
        </VStack>
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={4 / 3}
            borderRadius="r2"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            alt="size 64 borderRadius r2"
            style={{ width: "64px" }}
            fallback={
              <view className="image-frame-fallback">
                <text className="image-frame-fallback-label">이미지</text>
              </view>
            }
          />
          <Text color="palette.gray700" textStyle="t1Regular">
            64+ / r2 (8px)
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
