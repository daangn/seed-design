import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { useState } from "@lynx-js/react";

import { VStack } from "@seed-design/lynx-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  const [extended, setExtended] = useState(true);

  function handleCheckedChange(checked: boolean) {
    "background only";
    setExtended(checked);
  }

  return (
    <VStack align="center" gap="x6">
      <FloatingActionButton icon={<IconPlusLine />} label="Extended" extended={extended} />
      <Switch
        size="16"
        tone="neutral"
        label="Extended"
        checked={extended}
        onCheckedChange={handleCheckedChange}
      />
    </VStack>
  );
}
