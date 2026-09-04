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
          <Checkbox label="Regular Label Text" weight="regular" tone="neutral" size="large" />
          <Checkbox label="Bold Label Text" weight="bold" tone="neutral" size="large" />
        </CheckboxGroup>
      </VStack>
    </page>
  );
}

root.render(<Root />);
