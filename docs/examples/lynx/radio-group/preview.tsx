import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="radio-group-preview">
        <VStack className="radio-group-preview__field" gap="x3">
          <VStack gap="x1">
            <view className="radio-group-preview__field-header">
              <text className="radio-group-preview__field-label">좋아하는 과일</text>
              <text className="radio-group-preview__field-indicator">선택</text>
            </view>
            <text className="radio-group-preview__field-description">
              좋아하는 과일을 선택해 주세요.
            </text>
          </VStack>
          <RadioGroup
            accessibility-label="좋아하는 과일"
            defaultValue="apple"
            size="large"
            tone="neutral"
          >
            <RadioGroupItem value="apple" label="Apple" />
            <RadioGroupItem value="banana" label="Banana" />
            <RadioGroupItem value="orange" label="Orange" />
          </RadioGroup>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
