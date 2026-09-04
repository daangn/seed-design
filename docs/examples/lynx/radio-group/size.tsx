import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview" gap="x5">
        <RadioGroup
          accessibility-label="과일 선택"
          defaultValue="apple"
          size="medium"
          tone="neutral"
        >
          <RadioGroupItem value="apple" label="사과" />
          <RadioGroupItem value="banana" label="바나나" />
          <RadioGroupItem value="orange" label="오렌지" />
        </RadioGroup>
        <RadioGroup accessibility-label="색상 선택" defaultValue="red" size="large" tone="neutral">
          <RadioGroupItem value="red" label="빨간색" />
          <RadioGroupItem value="blue" label="파란색" />
          <RadioGroupItem value="green" label="초록색" />
        </RadioGroup>
      </VStack>
    </page>
  );
}

root.render(<Root />);
