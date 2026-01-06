import { FloatingActionButton } from "seed-design/ui/floating-action-button";
import { Switch } from "seed-design/ui/switch";
import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";
import { Flex, VStack } from "@seed-design/react";
import { useState } from "react";

export default function FloatingActionButtonExtended() {
  const [extended, setExtended] = useState(true);

  return (
    <VStack align="center" justify="space-between">
      <Flex height="100px" align="center" justify="center">
        <FloatingActionButton icon={<IconPlusLine />} label="Extended" extended={extended} />
      </Flex>
      <Switch
        size="16"
        tone="neutral"
        label="Extended"
        checked={extended}
        onCheckedChange={setExtended}
      />
    </VStack>
  );
}
