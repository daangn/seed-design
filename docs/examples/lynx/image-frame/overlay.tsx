import "./styles";
import IconCarrotFill from "@karrotmarket/lynx-monochrome-icon/IconCarrotFill";
import {
  ImageFrame,
  ImageFrameFloater,
  ImageFrameBadge,
  ImageFrameIcon,
  ImageFrameIndicator,
  ImageFrameReactionButton,
  HStack,
  VStack,
  Text,
} from "@seed-design/lynx-react";
import { useState } from "@lynx-js/react";

export default function ImageFrameOverlayExample() {
  const [liked, setLiked] = useState(false);

  return (
    <HStack gap="x3" wrap="wrap" align="flex-end">
      <VStack gap="x2" align="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="Profile with badge overlay"
          style={{ width: "120px" }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameBadge tone="brand" variant="solid">
              NEW
            </ImageFrameBadge>
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameBadge
        </Text>
      </VStack>

      <VStack gap="x2" align="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="Profile with icon overlay"
          style={{ width: "120px" }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameIcon svg={<IconCarrotFill />} />
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameIcon
        </Text>
      </VStack>

      <VStack gap="x2" align="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="Profile with indicator overlay"
          style={{ width: "120px" }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameIndicator>+9</ImageFrameIndicator>
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameIndicator
        </Text>
      </VStack>

      <VStack gap="x2" align="center">
        <ImageFrame
          ratio={1}
          borderRadius="r2"
          stroke
          src="https://avatars.githubusercontent.com/u/54893898?v=4"
          alt="Profile with reaction button overlay"
          style={{ width: "120px" }}
          fallback={
            <view className="image-frame-fallback">
              <text className="image-frame-fallback-label">이미지</text>
            </view>
          }
        >
          <ImageFrameFloater placement="bottom-end">
            <ImageFrameReactionButton
              pressed={liked}
              onPressedChange={setLiked}
              accessibility-label="좋아요"
            />
          </ImageFrameFloater>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameReactionButton
        </Text>
      </VStack>
    </HStack>
  );
}
