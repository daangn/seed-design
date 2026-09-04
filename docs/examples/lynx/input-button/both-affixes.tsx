import "./styles";

import IconPlusCircleLine from "@karrotmarket/lynx-monochrome-icon/IconPlusCircleLine";
import IconWonLine from "@karrotmarket/lynx-monochrome-icon/IconWonLine";
import { root } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { FieldButton, FieldButtonPlaceholder } from "@/components/ui/field-button";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <VStack className="input-button-preview">
        <VStack className="input-button-preview__content" gap="spacingY.componentDefault">
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
    </page>
  );
}

root.render(<Root />);
