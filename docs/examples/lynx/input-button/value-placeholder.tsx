import "./styles";

import { root, useState } from "@lynx-js/react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  FieldButton,
  FieldButtonPlaceholder,
  FieldButtonValue,
} from "@/components/ui/field-button";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("");

  function toggleValue() {
    "background only";
    setValue((current) => (current ? "" : "값 설정됨"));
  }

  return (
    <page className={seedClassName}>
      <VStack className="input-button-preview">
        <VStack className="input-button-preview__content" gap="spacingY.componentDefault">
          <FieldButton buttonProps={{ "accessibility-label": "현재 값: FieldButtonValue" }}>
            <FieldButtonValue>FieldButtonValue</FieldButtonValue>
          </FieldButton>
          <FieldButton buttonProps={{ "accessibility-label": "현재 값 없음" }}>
            <FieldButtonPlaceholder>FieldButtonPlaceholder</FieldButtonPlaceholder>
          </FieldButton>
          <FieldButton
            buttonProps={{
              bindtap: toggleValue,
              "accessibility-label": value ? `값 지우기. 현재: ${value}` : "값 설정",
            }}
          >
            {value ? (
              <FieldButtonValue>{value}</FieldButtonValue>
            ) : (
              <FieldButtonPlaceholder>탭하여 값 설정</FieldButtonPlaceholder>
            )}
          </FieldButton>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
