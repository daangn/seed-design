import "./styles";

import { useState } from "@lynx-js/react";
import { Box, HStack, Text, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { HelpBubbleAnchor } from "@/components/ui/help-bubble";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";

const AVATAR_SRC = "https://avatars.githubusercontent.com/u/54893898?v=4";
const OFFSET_OPTIONS = ["0", "1", "2", "3", "4", "5"] as const;

function Avatar() {
  const [hasImageError, setHasImageError] = useState(false);

  function handleImageError() {
    "background only";
    setHasImageError(true);
  }

  return (
    <Box
      width="64px"
      height="64px"
      alignItems="center"
      justifyContent="center"
      overflowX="hidden"
      overflowY="hidden"
      borderRadius="full"
      bg="bg.neutralWeak"
    >
      {hasImageError ? (
        <Text textStyle="t2Bold">L</Text>
      ) : (
        <image
          src={AVATAR_SRC}
          mode="aspectFill"
          style={{ width: "64px", height: "64px" }}
          binderror={handleImageError}
        />
      )}
    </Box>
  );
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [zIndexOffset, setZIndexOffset] = useState(5);

  function handleOffsetChange(nextOffset: string) {
    "background only";
    setZIndexOffset(Number(nextOffset));
  }

  return (
    <view className={`${seedClassName} docs-lynx-help-bubble-root`}>
      <VStack width="full" height="480px" p="x5" gap="x8" align="center" justify="center">
        <HStack gap="x2">
          {Array.from({ length: 5 }, (_, index) => (
            <Box
              key={index}
              width="64px"
              height="64px"
              borderRadius="r2"
              alignItems="center"
              justifyContent="center"
              bg="bg.neutralWeak"
              borderColor="stroke.neutralWeak"
              borderWidth={1}
              zIndex={index + 100}
            >
              <Text>{index + 100}</Text>
            </Box>
          ))}
        </HStack>
        <HelpBubbleAnchor
          defaultOpen
          title={`default: 99, current: ${99 + zIndexOffset}`}
          description="Et ullamco laborum voluptate ipsum labore ea nostrud sunt ipsum."
          zIndexOffset={zIndexOffset}
          closeOnInteractOutside={false}
        >
          <Avatar />
        </HelpBubbleAnchor>
        <VStack gap="x1" align="center">
          <SegmentedControl
            value={String(zIndexOffset)}
            onValueChange={handleOffsetChange}
            accessibility-label="zIndexOffset"
          >
            {OFFSET_OPTIONS.map((option) => (
              <SegmentedControlItem key={option} value={option}>
                {option}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
          <HStack width="full" justify="spaceBetween">
            <Text>0</Text>
            <Text>5</Text>
          </HStack>
        </VStack>
      </VStack>
    </view>
  );
}
