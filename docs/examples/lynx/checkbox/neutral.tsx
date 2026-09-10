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
            label="Square (default)"
            variant="square"
            tone="neutral"
            size="large"
            defaultChecked
          />
          <Checkbox label="Ghost" variant="ghost" tone="neutral" size="large" defaultChecked />
        </CheckboxGroup>
      </VStack>
    </view>
  );
}
