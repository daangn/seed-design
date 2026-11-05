import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, HStack, VStack } from "@seed-design/lynx-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  const [contact, setContact] = useState("email");
  const [firstErrorMessage, setFirstErrorMessage] = useState<string | undefined>();
  const [option, setOption] = useState("option1");
  const [secondErrorMessage, setSecondErrorMessage] = useState<string | undefined>();

  const handleFirstSubmit = () => {
    setFirstErrorMessage(contact === "email" ? "이메일은 선택할 수 없습니다." : undefined);
  };

  const handleSecondSubmit = () => {
    setSecondErrorMessage(option === "option1" ? "옵션 1은 선택할 수 없습니다." : undefined);
  };

  return (
    <VStack className="radio-group-preview" maxWidth="640px">
      <HStack width="full" gap="x8" align="flex-start" wrap="wrap" justify="center">
        <VStack
          grow
          shrink
          minWidth="240px"
          style={{ flexBasis: 0 }}
          gap="spacingY.componentDefault"
        >
          <RadioGroup
            label="선호하는 연락 방법"
            indicator="필수"
            description="이메일을 선택하고 제출해보세요."
            value={contact}
            onValueChange={setContact}
            invalid={firstErrorMessage != null}
            errorMessage={firstErrorMessage}
          >
            <RadioGroupItem value="email" label="이메일" tone="neutral" size="large" />
            <RadioGroupItem value="phone" label="전화" tone="neutral" size="large" />
            <RadioGroupItem value="sms" label="문자" tone="neutral" size="large" />
          </RadioGroup>
          <ActionButton variant="neutralSolid" bindtap={handleFirstSubmit}>
            제출
          </ActionButton>
        </VStack>

        <VStack
          grow
          shrink
          minWidth="240px"
          style={{ flexBasis: 0 }}
          gap="spacingY.componentDefault"
        >
          <RadioGroup
            label="필수 선택"
            labelWeight="bold"
            showRequiredIndicator
            description="옵션 1을 선택하고 제출해보세요."
            value={option}
            onValueChange={setOption}
            invalid={secondErrorMessage != null}
            errorMessage={secondErrorMessage}
          >
            <RadioGroupItem value="option1" label="옵션 1" tone="neutral" size="large" />
            <RadioGroupItem value="option2" label="옵션 2" tone="neutral" size="large" disabled />
            <RadioGroupItem value="option3" label="옵션 3" tone="neutral" size="large" />
          </RadioGroup>
          <ActionButton variant="neutralSolid" bindtap={handleSecondSubmit}>
            제출
          </ActionButton>
        </VStack>
      </HStack>
    </VStack>
  );
}
