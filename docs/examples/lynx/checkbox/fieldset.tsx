import "./styles";

import { useState } from "@lynx-js/react";
import { ActionButton, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [apple, setApple] = useState(true);
  const [banana, setBanana] = useState(false);
  const [orange, setOrange] = useState(false);
  const [firstErrorMessage, setFirstErrorMessage] = useState<string | undefined>();
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [secondErrorMessage, setSecondErrorMessage] = useState<string | undefined>();

  const handleFirstSubmit = () => {
    setFirstErrorMessage(apple ? "Apple은 선택할 수 없습니다." : undefined);
  };

  const handleSecondSubmit = () => {
    setSecondErrorMessage(!terms || !privacy ? "필수 항목에 동의해 주세요." : undefined);
  };

  return (
    <view className={`${seedClassName} docs-lynx-checkbox-root`}>
      <VStack className="checkbox-preview">
        <HStack width="full" gap="x8" align="flex-start">
          <VStack style={{ flex: 1 }} gap="spacingY.componentDefault">
            <CheckboxGroup
              label="좋아하는 과일"
              indicator="선택"
              description="Apple을 선택하고 제출해보세요."
              errorMessage={firstErrorMessage}
            >
              <Checkbox
                label="Apple"
                tone="neutral"
                size="large"
                checked={apple}
                onCheckedChange={setApple}
              />
              <Checkbox
                label="Banana"
                tone="neutral"
                size="large"
                checked={banana}
                onCheckedChange={setBanana}
              />
              <Checkbox
                label="Orange"
                tone="neutral"
                size="large"
                checked={orange}
                onCheckedChange={setOrange}
              />
            </CheckboxGroup>
            <ActionButton variant="neutralSolid" bindtap={handleFirstSubmit}>
              제출
            </ActionButton>
          </VStack>

          <VStack style={{ flex: 1 }} gap="spacingY.componentDefault">
            <CheckboxGroup
              label="약관 동의"
              labelWeight="bold"
              showRequiredIndicator
              description="이용약관을 선택하지 않고 제출해보세요."
              errorMessage={secondErrorMessage}
            >
              <Checkbox
                label="이용약관 동의 (필수)"
                tone="neutral"
                size="large"
                checked={terms}
                onCheckedChange={setTerms}
              />
              <Checkbox
                label="개인정보 처리방침 동의 (필수)"
                tone="neutral"
                size="large"
                checked={privacy}
                onCheckedChange={setPrivacy}
              />
              <Checkbox
                label="마케팅 수신 동의 (선택)"
                tone="neutral"
                size="large"
                checked={marketing}
                onCheckedChange={setMarketing}
              />
            </CheckboxGroup>
            <ActionButton variant="neutralSolid" bindtap={handleSecondSubmit}>
              제출
            </ActionButton>
          </VStack>
        </HStack>
      </VStack>
    </view>
  );
}
