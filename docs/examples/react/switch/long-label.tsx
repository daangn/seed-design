import { VStack } from "@seed-design/react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchLongLabel() {
  return (
    <VStack gap="spacingY.componentDefault">
      <Switch
        size="32"
        label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
      />
      <Switch
        size="24"
        label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
      />
      <Switch
        size="16"
        label="Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla."
      />
    </VStack>
  );
}
