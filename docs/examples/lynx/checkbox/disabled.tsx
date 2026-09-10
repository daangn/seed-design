import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-checkbox-root`}>
      <VStack className="checkbox-preview">
        <CheckboxGroup>
          <Checkbox
            defaultChecked
            label="Disabled Checked, Square"
            disabled
            tone="neutral"
            size="large"
          />
          <Checkbox
            checked={false}
            label="Disabled without Checked, Square"
            disabled
            tone="neutral"
            size="large"
          />
          <Checkbox
            variant="ghost"
            defaultChecked
            label="Disabled Checked, Ghost"
            disabled
            tone="neutral"
            size="large"
          />
          <Checkbox
            variant="ghost"
            checked={false}
            label="Disabled without Checked, Ghost"
            disabled
            tone="neutral"
            size="large"
          />
        </CheckboxGroup>
      </VStack>
    </view>
  );
}
