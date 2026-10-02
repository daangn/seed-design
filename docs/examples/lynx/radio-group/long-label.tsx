import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const longLabel =
  "Consequat ut veniam aliqua deserunt occaecat enim occaecat veniam et et cillum nulla officia incididunt incididunt. Sint laboris labore occaecat fugiat culpa voluptate ullamco in elit dolore exercitation nulla.";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-radio-group-root`}>
      <VStack className="radio-group-preview">
        <RadioGroup accessibility-label="Long label options" defaultValue="medium">
          <RadioGroupItem value="medium" label={longLabel} size="medium" tone="neutral" />
          <RadioGroupItem value="large" label={longLabel} size="large" tone="neutral" />
        </RadioGroup>
      </VStack>
    </view>
  );
}
