import "./styles";

import { root, useState } from "@lynx-js/react";
import { ActionButton, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
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
    <page className={seedClassName}>
      <VStack className="radio-group-preview">
        <HStack width="full" gap="x8" align="flex-start">
          <VStack style={{ flex: 1 }} gap="spacingY.componentDefault">
            <RadioGroup
              label="선호하는 연락 방법"
              indicator="필수"
              description="이메일을 선택하고 제출해보세요."
              value={contact}
              onValueChange={setContact}
              invalid={firstErrorMessage != null}
              errorMessage={firstErrorMessage}
              tone="neutral"
              size="large"
            >
              <RadioGroupItem value="email" label="이메일" />
              <RadioGroupItem value="phone" label="전화" />
              <RadioGroupItem value="sms" label="문자" />
            </RadioGroup>
            <ActionButton variant="neutralSolid" bindtap={handleFirstSubmit}>
              제출
            </ActionButton>
          </VStack>

          <VStack style={{ flex: 1 }} gap="spacingY.componentDefault">
            <RadioGroup
              label="필수 선택"
              labelWeight="bold"
              showRequiredIndicator
              description="옵션 1을 선택하고 제출해보세요."
              value={option}
              onValueChange={setOption}
              invalid={secondErrorMessage != null}
              errorMessage={secondErrorMessage}
              tone="neutral"
              size="large"
            >
              <RadioGroupItem value="option1" label="옵션 1" />
              <RadioGroupItem value="option2" label="옵션 2" disabled />
              <RadioGroupItem value="option3" label="옵션 3" />
            </RadioGroup>
            <ActionButton variant="neutralSolid" bindtap={handleSecondSubmit}>
              제출
            </ActionButton>
          </VStack>
        </HStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
