import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-checkbox-root`}>
      <VStack className="checkbox-preview">
        <CheckboxGroup>
          <Checkbox label="Regular Label Text" weight="regular" tone="neutral" size="large" />
          <Checkbox label="Bold Label Text" weight="bold" tone="neutral" size="large" />
        </CheckboxGroup>
      </VStack>
    </view>
  );
}
