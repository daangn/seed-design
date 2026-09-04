import "./styles";

import { root } from "@lynx-js/react";
import { HStack, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
