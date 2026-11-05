import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { Switch, type SwitchProps } from "@/components/ui/switch";

const label =
  "Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla.";

function SwitchItem({ size }: { size: SwitchProps["size"] }) {
  return <Switch size={size} label={label} />;
}

export default function Example() {
  return (
    <VStack className="switch-preview" gap="spacingY.componentDefault">
      <SwitchItem size="32" />
      <SwitchItem size="24" />
      <SwitchItem size="16" />
    </VStack>
  );
}
