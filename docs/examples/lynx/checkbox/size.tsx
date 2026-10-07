import "./styles";

import { HStack } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

export default function Example() {
  return (
    <HStack className="checkbox-preview" gap="x8">
      <CheckboxGroup>
        <Checkbox label="Medium (default)" size="medium" defaultChecked tone="neutral" />
        <Checkbox label="Large" size="large" defaultChecked tone="neutral" />
      </CheckboxGroup>
      <CheckboxGroup>
        <Checkbox
          label="Medium (default)"
          size="medium"
          variant="ghost"
          defaultChecked
          tone="neutral"
        />
        <Checkbox label="Large" size="large" variant="ghost" defaultChecked tone="neutral" />
      </CheckboxGroup>
    </HStack>
  );
}
