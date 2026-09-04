import "./styles";

import { root, useCallback, useState } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  FieldButton,
  FieldButtonPlaceholder,
  FieldButtonValue,
} from "@/components/ui/field-button";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState<string | null>(null);
  const selectValue = useCallback(() => {
    "background only";
    setValue("판교동");
  }, []);
  const clearValue = useCallback(() => {
    "background only";
    setValue(null);
  }, []);

  return (
    <page className={seedClassName}>
      <VStack className="input-button-preview">
        <VStack className="input-button-preview__content">
          <FieldButton
            label="동네"
            description="거래할 동네를 선택해 주세요."
            showClearButton={value != null}
            buttonProps={{
              "accessibility-label": value ? `동네 변경. 현재: ${value}` : "동네 선택",
              bindtap: selectValue,
            }}
            clearButtonProps={{
              bindtap: clearValue,
            }}
          >
            {value == null ? (
              <FieldButtonPlaceholder>동네를 선택해 주세요</FieldButtonPlaceholder>
            ) : (
              <FieldButtonValue>{value}</FieldButtonValue>
            )}
          </FieldButton>
        </VStack>
      </VStack>
    </page>
  );
}

root.render(<Root />);
