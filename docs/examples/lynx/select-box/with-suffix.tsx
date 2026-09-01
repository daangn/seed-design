import "./styles";

import IconPersonCircleLine from "@karrotmarket/lynx-monochrome-icon/IconPersonCircleLine";
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
          <CheckSelectBoxGroup accessibility-label="Suffix 예제">
            <CheckSelectBox label="체크마크" suffix={<CheckSelectBoxCheckmark />} />
            <CheckSelectBox
              label="텍스트 suffix"
              suffix={<text className="select-box-preview__suffix">+1,000원</text>}
            />
            <CheckSelectBox
              label="suffix 없음"
              description="Commodo aliquip fugiat aute irure."
              prefixIcon={<IconPersonCircleLine />}
            />
          </CheckSelectBoxGroup>
        </VStack>

        <VStack className="select-box-preview__column">
          <RadioSelectBoxRoot defaultValue="radiomark" accessibility-label="Radiomark 예제">
            <RadioSelectBoxItem
              value="radiomark"
              label="라디오 마크"
              suffix={<RadioSelectBoxRadiomark />}
            />
            <RadioSelectBoxItem
              value="text"
              label="텍스트 suffix"
              description="Commodo aliquip fugiat aute irure."
              suffix={<text className="select-box-preview__suffix">+1,000원</text>}
            />
            <RadioSelectBoxItem
              value="none"
              label="suffix 없음"
              prefixIcon={<IconPersonCircleLine />}
            />
          </RadioSelectBoxRoot>
        </VStack>
      </HStack>
    </page>
  );
}

root.render(<Root />);
