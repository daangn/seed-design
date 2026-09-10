import "./styles";

import IconMagnifyingglassLine from "@karrotmarket/lynx-monochrome-icon/IconMagnifyingglassLine";

import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { FieldButton, FieldButtonPlaceholder } from "@/components/ui/field-button";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-input-button-root`}>
      <VStack className="input-button-preview">
        <VStack className="input-button-preview__content" gap="spacingY.componentDefault">
          <FieldButton
            label="주소"
            description="사이트 주소를 선택해주세요."
            prefix="https://"
            buttonProps={{ "accessibility-label": "사이트 주소 선택" }}
          >
            <FieldButtonPlaceholder>example.com</FieldButtonPlaceholder>
          </FieldButton>
          <FieldButton
            label="검색"
            description="검색 조건을 선택해주세요."
            prefixIcon={<IconMagnifyingglassLine />}
            buttonProps={{ "accessibility-label": "검색 조건 선택" }}
          >
            <FieldButtonPlaceholder>검색 조건</FieldButtonPlaceholder>
          </FieldButton>
        </VStack>
      </VStack>
    </view>
  );
}
