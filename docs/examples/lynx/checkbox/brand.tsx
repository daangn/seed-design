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
            label="Square (default)"
            variant="square"
            tone="brand"
            size="large"
            defaultChecked
          />
          <Checkbox label="Ghost" variant="ghost" tone="brand" size="large" defaultChecked />
        </CheckboxGroup>
      </VStack>
    </page>
  );
}

root.render(<Root />);
