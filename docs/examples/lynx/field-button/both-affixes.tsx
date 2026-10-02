import "./styles";

import IconPlusCircleLine from "@karrotmarket/lynx-monochrome-icon/IconPlusCircleLine";
import IconWonLine from "@karrotmarket/lynx-monochrome-icon/IconWonLine";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { FieldButton, FieldButtonPlaceholder } from "@/components/ui/field-button";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-field-button-root`}>
      <VStack className="field-button-preview">
        <VStack className="field-button-preview__content" gap="spacingY.componentDefault">
          <FieldButton
            label="나이"
            description="나이를 선택해주세요."
            prefix="만"
            suffix="세"
            buttonProps={{ "accessibility-label": "나이 선택" }}
          >
            <FieldButtonPlaceholder>25</FieldButtonPlaceholder>
          </FieldButton>
          <FieldButton
            label="추가 금액"
            description="추가할 금액을 선택해주세요."
            prefixIcon={<IconPlusCircleLine />}
            suffixIcon={<IconWonLine />}
            buttonProps={{ "accessibility-label": "추가 금액 선택" }}
          >
            <FieldButtonPlaceholder>50,000</FieldButtonPlaceholder>
          </FieldButton>
        </VStack>
      </VStack>
    </view>
  );
}
