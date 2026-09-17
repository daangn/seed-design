import "./styles";
import { useSeedClassName } from "@seed-design/lynx-react";
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

  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} image-frame-example`}>
      <HStack gap="x3" wrap="wrap" align="flex-end">
        <VStack gap="x2" align="center">
          <ImageFrame
            ratio={1}
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="Landscape with badge overlay"
            style={{ width: 120 }}
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
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="Landscape with icon overlay"
            style={{ width: 120 }}
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
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="Landscape with indicator overlay"
            style={{ width: 120 }}
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
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="Landscape with reaction button overlay"
            style={{ width: 120 }}
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
    </view>
  );
}
