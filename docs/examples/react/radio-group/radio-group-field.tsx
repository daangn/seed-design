import { ActionButton, HStack, VStack } from "@seed-design/react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupRadioGroupField() {
  const [firstErrorMessage, setFirstErrorMessage] = useState<string | undefined>();
  const [secondErrorMessage, setSecondErrorMessage] = useState<string | undefined>();

  const handleFirstSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const contact = formData.get("contact");

    if (contact === "email") {
      setFirstErrorMessage("이메일은 선택할 수 없습니다.");

      return;
    }

    setFirstErrorMessage(undefined);

    alert(JSON.stringify({ contact }, null, 2));
  };

  const handleSecondSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const option = formData.get("option");

    if (option === "option1") {
      setSecondErrorMessage("옵션 1은 선택할 수 없습니다.");

      return;
    }

    setSecondErrorMessage(undefined);

    alert(JSON.stringify({ option }, null, 2));
  };

  return (
    <HStack width="full" gap="x8" align="flex-start" p="x6">
      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleFirstSubmit}>
          <RadioGroup
            label="선호하는 연락 방법"
            indicator="필수"
            description="이메일을 선택하고 제출해보세요."
            name="contact"
            defaultValue="email"
            invalid={!!firstErrorMessage}
            errorMessage={firstErrorMessage}
          >
            <RadioGroupItem value="email" label="이메일" tone="neutral" size="large" />
            <RadioGroupItem value="phone" label="전화" tone="neutral" size="large" />
            <RadioGroupItem value="sms" label="문자" tone="neutral" size="large" />
          </RadioGroup>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>

      <VStack asChild gap="spacingY.componentDefault" style={{ flex: 1 }}>
        <form onSubmit={handleSecondSubmit}>
          <RadioGroup
            label="필수 선택"
            labelWeight="bold"
            showRequiredIndicator
            description="옵션 1을 선택하고 제출해보세요."
            name="option"
            defaultValue="option1"
            invalid={!!secondErrorMessage}
            errorMessage={secondErrorMessage}
          >
            <RadioGroupItem value="option1" label="옵션 1" tone="neutral" size="large" />
            <RadioGroupItem value="option2" label="옵션 2" tone="neutral" size="large" disabled />
            <RadioGroupItem value="option3" label="옵션 3" tone="neutral" size="large" />
          </RadioGroup>
          <ActionButton type="submit" variant="neutralSolid">
            제출
          </ActionButton>
        </form>
      </VStack>
    </HStack>
  );
}
