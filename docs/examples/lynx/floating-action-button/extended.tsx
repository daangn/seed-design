import "./styles";

import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { useState } from "@lynx-js/react";

import { Box, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const [extended, setExtended] = useState(true);

  function handleCheckedChange(checked: boolean) {
    "background only";
    setExtended(checked);
  }

  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-floating-action-button-root`}>
      <VStack height="full" align="center" justify="space-between">
        <Box width="full" height="100px" display="flex" alignItems="center" justifyContent="center">
          <FloatingActionButton icon={<IconPlusLine />} label="Extended" extended={extended} />
        </Box>
        <Switch
          size="16"
          tone="neutral"
          label="Extended"
          checked={extended}
          onCheckedChange={handleCheckedChange}
        />
      </VStack>
    </view>
  );
}
