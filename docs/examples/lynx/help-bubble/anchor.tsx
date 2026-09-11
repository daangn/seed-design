import "./styles";

import { useState } from "@lynx-js/react";
import { Box, Text, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { HelpBubbleAnchor } from "@/components/ui/help-bubble";
import { Switch } from "@/components/ui/switch";

const AVATAR_SRC = "https://avatars.githubusercontent.com/u/54893898?v=4";

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
  const [isControlledHelpBubbleOpen, setIsControlledHelpBubbleOpen] = useState(true);

  function handleControlledOpenChange(nextOpen: boolean) {
    "background only";
    setIsControlledHelpBubbleOpen(nextOpen);
  }

  return (
    <view className={`${seedClassName} docs-lynx-help-bubble-root`}>
      <VStack width="full" height="320px" gap="x16" align="center" justify="center">
        <HelpBubbleAnchor
          defaultOpen
          title="Anchor, uncontrolled"
          description="클릭으로 열고 닫는 동작 없이 위치만 지정합니다."
          placement="right"
          showCloseButton
          closeOnInteractOutside={false}
        >
          <Avatar />
        </HelpBubbleAnchor>
        <VStack gap="spacingY.componentDefault" align="center">
          <HelpBubbleAnchor
            open={isControlledHelpBubbleOpen}
            onOpenChange={handleControlledOpenChange}
            title="Anchor, controlled"
            description="클릭으로 열고 닫는 동작 없이 위치만 지정합니다."
            placement="right"
            showCloseButton
            closeOnInteractOutside={false}
          >
            <Avatar />
          </HelpBubbleAnchor>
          <Switch
            size="24"
            tone="neutral"
            label="열림"
            checked={isControlledHelpBubbleOpen}
            onCheckedChange={handleControlledOpenChange}
          />
        </VStack>
      </VStack>
    </view>
  );
}
