import "./styles";

import { root } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import { FieldButton, FieldButtonPlaceholder } from "@/components/ui/field-button";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  function handleTap() {
    "background only";
  }

  return (
    <page className={seedClassName}>
      <VStack className="input-button-preview">
        <VStack className="input-button-preview__content" gap="spacingY.componentDefault">
          <FieldButton
            label="라벨"
            description="설명을 써주세요"
            disabled
            showClearButton
            buttonProps={{ bindtap: handleTap, "accessibility-label": "값 선택" }}
          >
            <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
          </FieldButton>
          <FieldButton
            label="라벨"
            disabled
            invalid
            errorMessage="오류가 발생한 이유를 써주세요"
            buttonProps={{ bindtap: handleTap, "accessibility-label": "값 선택" }}
          >
            <FieldButtonPlaceholder>플레이스홀더</FieldButtonPlaceholder>
          </FieldButton>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
