import "./styles";

import IconWonLine from "@karrotmarket/lynx-monochrome-icon/IconWonLine";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { FieldButton, FieldButtonPlaceholder } from "@/components/ui/field-button";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-input-button-root`}>
      <VStack className="input-button-preview">
        <VStack className="input-button-preview__content" gap="spacingY.componentDefault">
          <FieldButton
            label="키"
            description="측정한 키를 선택해주세요."
            suffix="cm"
            buttonProps={{ "accessibility-label": "키 선택" }}
          >
            <FieldButtonPlaceholder>170</FieldButtonPlaceholder>
          </FieldButton>
          <FieldButton
            label="금액"
            description="거래 금액을 선택해주세요."
            suffixIcon={<IconWonLine />}
            buttonProps={{ "accessibility-label": "거래 금액 선택" }}
          >
            <FieldButtonPlaceholder>50,000</FieldButtonPlaceholder>
          </FieldButton>
        </VStack>
      </VStack>
    </view>
  );
}
