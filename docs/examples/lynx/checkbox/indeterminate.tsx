import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-checkbox-root`}>
      <VStack className="checkbox-preview">
        <Checkbox defaultChecked label="indeterminate" indeterminate tone="neutral" size="large" />
      </VStack>
    </view>
  );
}
