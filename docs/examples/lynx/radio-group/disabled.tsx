import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview">
        <RadioGroup
          accessibility-label="Options with disabled"
          defaultValue="option1"
          size="large"
          tone="neutral"
        >
          <RadioGroupItem value="option1" label="Active option" />
          <RadioGroupItem value="option2" label="Disabled option" disabled />
          <RadioGroupItem value="option3" label="Another active option" />
        </RadioGroup>
      </VStack>
    </page>
  );
}

root.render(<Root />);
