import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview">
        <RadioGroup accessibility-label="과일 선택" defaultValue="apple" size="large" tone="brand">
          <RadioGroupItem value="apple" label="사과" />
          <RadioGroupItem value="banana" label="바나나" />
          <RadioGroupItem value="orange" label="오렌지" />
        </RadioGroup>
      </VStack>
    </page>
  );
}

root.render(<Root />);
