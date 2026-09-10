import "./styles";

import { useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const longLabel =
  "Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla.";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("medium");

  return (
    <view className={`${seedClassName} docs-lynx-radio-group-root`}>
      <VStack className="radio-group-preview">
        <RadioGroup
          accessibility-label="Long label options"
          value={value}
          size="medium"
          tone="neutral"
          onValueChange={setValue}
        >
          <RadioGroupItem value="medium" label={longLabel} />
        </RadioGroup>
        <RadioGroup
          accessibility-label="Long label options"
          value={value}
          size="large"
          tone="neutral"
          onValueChange={setValue}
        >
          <RadioGroupItem value="large" label={longLabel} />
        </RadioGroup>
      </VStack>
    </view>
  );
}
