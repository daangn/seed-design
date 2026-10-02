import "./styles";

import {
  HStack,
  RadioGroup as RadioGroupPrimitive,
  VStack,
  useSeedClassName,
} from "@seed-design/lynx-react";

import { RadioGroup, Radiomark } from "@/components/ui/radio-group";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-radio-group-root`}>
      <VStack className="radio-group-preview">
        <RadioGroup accessibility-label="Weight selection" defaultValue="medium">
          <HStack gap="x6">
            <RadioGroupPrimitive.Item
              accessibility-label="regular"
              value="regular"
              size="large"
              tone="neutral"
            >
              <VStack gap="x2" align="center">
                <Radiomark tone="neutral" size="large" />
                <RadioGroupPrimitive.ItemLabel>regular</RadioGroupPrimitive.ItemLabel>
              </VStack>
            </RadioGroupPrimitive.Item>
            <RadioGroupPrimitive.Item
              accessibility-label="medium"
              value="medium"
              size="large"
              tone="neutral"
            >
              <VStack gap="x2" align="center">
                <Radiomark tone="neutral" size="large" />
                <RadioGroupPrimitive.ItemLabel>medium</RadioGroupPrimitive.ItemLabel>
              </VStack>
            </RadioGroupPrimitive.Item>
            <RadioGroupPrimitive.Item
              accessibility-label="bold"
              value="bold"
              size="large"
              tone="neutral"
            >
              <VStack gap="x2" align="center">
                <Radiomark tone="neutral" size="large" />
                <RadioGroupPrimitive.ItemLabel>bold</RadioGroupPrimitive.ItemLabel>
              </VStack>
            </RadioGroupPrimitive.Item>
          </HStack>
        </RadioGroup>
      </VStack>
    </view>
  );
}
