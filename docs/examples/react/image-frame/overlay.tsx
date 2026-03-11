import { IconCarrotFill } from "@karrotmarket/react-monochrome-icon";
import { AspectRatio, Flex, Text, VStack } from "@seed-design/react";
import {
  ImageFrame,
  ImageFrameBadge,
  ImageFrameFloater,
  ImageFrameIcon,
  ImageFrameIndicator,
  ImageFrameReactionButton,
} from "seed-design/ui/image-frame";
import { useState } from "react";

export default function ImageFrameOverlayExample() {
  const [liked, setLiked] = useState(false);

  return (
    <Flex gap="x3" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <AspectRatio ratio={1} style={{ width: 120 }}>
          <ImageFrame
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="Landscape with badge overlay"
          >
            <ImageFrameFloater placement="bottom-end">
              <ImageFrameBadge tone="brand" variant="solid">
                NEW
              </ImageFrameBadge>
            </ImageFrameFloater>
          </ImageFrame>
        </AspectRatio>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameBadge
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <AspectRatio ratio={1} style={{ width: 120 }}>
          <ImageFrame
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="Landscape with icon overlay"
          >
            <ImageFrameFloater placement="bottom-end">
              <ImageFrameIcon svg={<IconCarrotFill />} />
            </ImageFrameFloater>
          </ImageFrame>
        </AspectRatio>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameIcon
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <AspectRatio ratio={1} style={{ width: 120 }}>
          <ImageFrame
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="Landscape with indicator overlay"
          >
            <ImageFrameFloater placement="bottom-end">
              <ImageFrameIndicator>+9</ImageFrameIndicator>
            </ImageFrameFloater>
          </ImageFrame>
        </AspectRatio>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameIndicator
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <AspectRatio ratio={1} style={{ width: 120 }}>
          <ImageFrame
            borderRadius="r2"
            stroke
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
            alt="Landscape with reaction button overlay"
          >
            <ImageFrameFloater placement="bottom-end">
              <ImageFrameReactionButton
                pressed={liked}
                onPressedChange={setLiked}
                aria-label="좋아요"
              />
            </ImageFrameFloater>
          </ImageFrame>
        </AspectRatio>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameReactionButton
        </Text>
      </VStack>
    </Flex>
  );
}
