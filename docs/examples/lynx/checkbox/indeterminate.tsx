import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox } from "@/components/ui/checkbox";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="checkbox-preview">
        <Checkbox defaultChecked label="indeterminate" indeterminate tone="neutral" size="large" />
      </VStack>
    </page>
  );
}

root.render(<Root />);
