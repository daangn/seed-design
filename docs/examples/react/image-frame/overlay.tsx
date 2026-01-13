import { IconCarrotFill } from "@karrotmarket/react-monochrome-icon";
import {
  ImageFrame,
  ImageFrameOverlayPositioner,
  ImageFrameOverlay,
  Flex,
  VStack,
  Text,
} from "@seed-design/react";
import { useState } from "react";

export default function ImageFrameOverlayExample() {
  const [liked, setLiked] = useState(false);

  return (
    <Flex gap="x3" wrap="wrap" align="flex-end">
      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          rounded
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with badge overlay"
          style={{ width: 120 }}
        >
          <ImageFrameOverlayPositioner position="bottom-right">
            <ImageFrameOverlay.Badge tone="brand" variant="solid">
              NEW
            </ImageFrameOverlay.Badge>
          </ImageFrameOverlayPositioner>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameOverlay.Badge
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          rounded
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with icon overlay"
          style={{ width: 120 }}
        >
          <ImageFrameOverlayPositioner position="bottom-right">
            <ImageFrameOverlay.Icon svg={<IconCarrotFill />} />
          </ImageFrameOverlayPositioner>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameOverlay.Icon
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          rounded
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with indicator overlay"
          style={{ width: 120 }}
        >
          <ImageFrameOverlayPositioner position="bottom-right">
            <ImageFrameOverlay.Indicator>+9</ImageFrameOverlay.Indicator>
          </ImageFrameOverlayPositioner>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameOverlay.Indicator
        </Text>
      </VStack>

      <VStack gap="x2" alignItems="center">
        <ImageFrame
          ratio={1}
          rounded
          stroke
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape with reaction button overlay"
          style={{ width: 120 }}
        >
          <ImageFrameOverlayPositioner position="bottom-right">
            <ImageFrameOverlay.ReactionButton
              pressed={liked}
              onPressedChange={setLiked}
              aria-label="좋아요"
            />
          </ImageFrameOverlayPositioner>
        </ImageFrame>
        <Text color="palette.gray700" textStyle="t1Regular">
          ImageFrameOverlay.ReactionButton
        </Text>
      </VStack>
    </Flex>
  );
}
