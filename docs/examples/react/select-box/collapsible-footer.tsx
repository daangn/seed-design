import { Box, HStack, Text } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";

export default function SelectBoxCollapsibleFooter() {
  return (
    <HStack gap="x8" p="x4" align="flex-start" height="400px">
      <CheckSelectBoxGroup aria-label="Footer 예제">
        <CheckSelectBox
          label="선택 시에만 표시 (기본값)"
          description="footerVisibility='when-selected'"
          suffix={<CheckSelectBoxCheckmark />}
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">선택되었을 때만 보입니다.</Text>
            </Box>
          }
        />
        <CheckSelectBox
          label="항상 표시"
          description="footerVisibility='always'"
          suffix={<CheckSelectBoxCheckmark />}
          footerVisibility="always"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">항상 보입니다.</Text>
            </Box>
          }
        />
        <CheckSelectBox
          label="미선택 시에만 표시"
          description="footerVisibility='when-not-selected'"
          suffix={<CheckSelectBoxCheckmark />}
          footerVisibility="when-not-selected"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">선택되지 않았을 때만 보입니다.</Text>
            </Box>
          }
        />
      </CheckSelectBoxGroup>

      <RadioSelectBoxRoot defaultValue="when-selected" aria-label="Footer 예제">
        <RadioSelectBoxItem
          value="when-selected"
          label="선택 시에만 표시 (기본값)"
          description="footerVisibility='when-selected'"
          suffix={<RadioSelectBoxRadiomark />}
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">선택되었을 때만 보입니다.</Text>
            </Box>
          }
        />
        <RadioSelectBoxItem
          value="always"
          label="항상 표시"
          description="footerVisibility='always'"
          suffix={<RadioSelectBoxRadiomark />}
          footerVisibility="always"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">항상 보입니다.</Text>
            </Box>
          }
        />
        <RadioSelectBoxItem
          value="when-not-selected"
          label="미선택 시에만 표시"
          description="footerVisibility='when-not-selected'"
          suffix={<RadioSelectBoxRadiomark />}
          footerVisibility="when-not-selected"
          footer={
            <Box px="x5" pb="x5">
              <Text textStyle="t3Medium">선택되지 않았을 때만 보입니다.</Text>
            </Box>
          }
        />
      </RadioSelectBoxRoot>
    </HStack>
  );
}
