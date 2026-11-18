import "./styles";

import { VStack } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

export default function Example() {
  return (
    <VStack className="checkbox-preview">
      <CheckboxGroup>
        <Checkbox
          label="Square (default)"
          variant="square"
          tone="brand"
          size="large"
          defaultChecked
        />
        <Checkbox label="Ghost" variant="ghost" tone="brand" size="large" defaultChecked />
      </CheckboxGroup>
    </VStack>
  );
}
