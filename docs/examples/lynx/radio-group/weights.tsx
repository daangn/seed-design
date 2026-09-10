import "./styles";

import { useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("regular");

  return (
    <view className={`${seedClassName} docs-lynx-radio-group-root`}>
      <VStack className="radio-group-preview">
        <RadioGroup
          accessibility-label="글꼴 굵기 선택"
          value={value}
          size="large"
          tone="neutral"
          weight="regular"
          onValueChange={setValue}
        >
          <RadioGroupItem value="regular" label="Regular" />
        </RadioGroup>
        <RadioGroup
          accessibility-label="글꼴 굵기 선택"
          value={value}
          size="large"
          tone="neutral"
          weight="bold"
          onValueChange={setValue}
        >
          <RadioGroupItem value="bold" label="Bold" />
        </RadioGroup>
      </VStack>
    </view>
  );
}
