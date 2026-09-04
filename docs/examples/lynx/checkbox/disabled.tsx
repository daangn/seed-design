import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
