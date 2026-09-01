import "./styles";

import { root } from "@lynx-js/react";
import { HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "@/components/ui/select-box";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
      <HStack className="select-box-preview" gap="x8" align="flex-start">
        <VStack className="select-box-preview__column">
          <CheckSelectBoxGroup accessibility-label="Footer 예제">
            <CheckSelectBox
              label="선택 시에만 표시 (기본값)"
              description="footerVisibility='when-selected'"
              suffix={<CheckSelectBoxCheckmark />}
              footer={<text className="select-box-preview__footer">선택되었을 때만 보입니다.</text>}
            />
            <CheckSelectBox
              label="항상 표시"
              description="footerVisibility='always'"
              suffix={<CheckSelectBoxCheckmark />}
              footerVisibility="always"
              footer={<text className="select-box-preview__footer">항상 보입니다.</text>}
            />
            <CheckSelectBox
              label="미선택 시에만 표시"
              description="footerVisibility='when-not-selected'"
              suffix={<CheckSelectBoxCheckmark />}
              footerVisibility="when-not-selected"
              footer={
                <text className="select-box-preview__footer">선택되지 않았을 때만 보입니다.</text>
              }
            />
          </CheckSelectBoxGroup>
        </VStack>

        <VStack className="select-box-preview__column">
          <RadioSelectBoxRoot defaultValue="when-selected" accessibility-label="Footer 예제">
            <RadioSelectBoxItem
              value="when-selected"
              label="선택 시에만 표시 (기본값)"
              description="footerVisibility='when-selected'"
              suffix={<RadioSelectBoxRadiomark />}
              footer={<text className="select-box-preview__footer">선택되었을 때만 보입니다.</text>}
            />
            <RadioSelectBoxItem
              value="always"
              label="항상 표시"
              description="footerVisibility='always'"
              suffix={<RadioSelectBoxRadiomark />}
              footerVisibility="always"
              footer={<text className="select-box-preview__footer">항상 보입니다.</text>}
            />
            <RadioSelectBoxItem
              value="when-not-selected"
              label="미선택 시에만 표시"
              description="footerVisibility='when-not-selected'"
              suffix={<RadioSelectBoxRadiomark />}
              footerVisibility="when-not-selected"
              footer={
                <text className="select-box-preview__footer">선택되지 않았을 때만 보입니다.</text>
              }
            />
          </RadioSelectBoxRoot>
        </VStack>
      </HStack>
    </page>
  );
}

root.render(<Root />);
