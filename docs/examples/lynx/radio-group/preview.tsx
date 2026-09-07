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
          defaultValue="apple"
          label="좋아하는 과일"
          description="좋아하는 과일을 선택해 주세요."
          indicator="선택"
          tone="neutral"
          size="large"
        >
          <RadioGroupItem value="apple" label="Apple" />
          <RadioGroupItem value="banana" label="Banana" />
          <RadioGroupItem value="orange" label="Orange" />
        </RadioGroup>
      </VStack>
    </page>
  );
}

root.render(<Root />);
