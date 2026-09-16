import "./styles";

import IconSparkle2 from "@karrotmarket/lynx-multicolor-icon/IconSparkle2";

import { Box, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { HelpBubbleAnchor, type HelpBubbleAnchorProps } from "@/components/ui/help-bubble";

function PlacementAnchor({
  placement,
}: {
  placement: NonNullable<HelpBubbleAnchorProps["placement"]>;
}) {
  return (
    <Box width="200px" alignItems="center">
      <HelpBubbleAnchor
        open
        flip={false}
        placement={placement}
        title={placement}
        description="est tempor aute"
      >
        <IconSparkle2 />
      </HelpBubbleAnchor>
    </Box>
  );
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-help-bubble-root`}>
      <scroll-view scroll-orientation="horizontal" style={{ width: "100%", height: "600px" }}>
        <VStack width="full" minWidth="920px" gap="80px" px="80px" py="80px">
          <HStack justify="center" gap="80px">
            <PlacementAnchor placement="top-end" />
            <PlacementAnchor placement="top" />
            <PlacementAnchor placement="top-start" />
          </HStack>
          <HStack justify="center" gap="80px">
            <PlacementAnchor placement="left-end" />
            <Box width="200px" />
            <PlacementAnchor placement="right-end" />
          </HStack>
          <HStack justify="center" gap="80px">
            <PlacementAnchor placement="left" />
            <Box width="200px" />
            <PlacementAnchor placement="right" />
          </HStack>
          <HStack justify="center" gap="80px">
            <PlacementAnchor placement="left-start" />
            <Box width="200px" />
            <PlacementAnchor placement="right-start" />
          </HStack>
          <HStack justify="center" gap="80px">
            <PlacementAnchor placement="bottom-end" />
            <PlacementAnchor placement="bottom" />
            <PlacementAnchor placement="bottom-start" />
          </HStack>
        </VStack>
      </scroll-view>
    </view>
  );
}
