import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

export default function Example() {
  return (
    <VStack className="checkbox-preview">
      <CheckboxGroup>
        <Checkbox label="Regular Label Text" weight="regular" tone="neutral" size="large" />
        <Checkbox label="Bold Label Text" weight="bold" tone="neutral" size="large" />
      </CheckboxGroup>
    </VStack>
  );
}
