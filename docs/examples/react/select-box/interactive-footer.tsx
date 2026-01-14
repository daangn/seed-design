import { Box, VStack } from "@seed-design/react";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadioMark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

export default function SelectBoxInteractiveFooter() {
  return (
    <VStack gap="x8" width="full">
      <Box flexGrow>
        <CheckSelectBoxGroup>
          <CheckSelectBox label="Apple" suffix={<CheckSelectBoxCheckmark />} />
          <CheckSelectBox label="Melon" suffix={<CheckSelectBoxCheckmark />} />
          <CheckSelectBox
            label="기타"
            suffix={<CheckSelectBoxCheckmark />}
            footer={
              <Box px="x5" pb="x5">
                <TextField label="상세 내용">
                  <TextFieldTextarea placeholder="내용을 입력해주세요" />
                </TextField>
              </Box>
            }
          />
        </CheckSelectBoxGroup>
      </Box>

      <Box flexGrow>
        <RadioSelectBoxRoot defaultValue="apple" aria-label="Footer 예제">
          <RadioSelectBoxItem value="apple" label="Apple" suffix={<RadioSelectBoxRadioMark />} />
          <RadioSelectBoxItem value="melon" label="Melon" suffix={<RadioSelectBoxRadioMark />} />
          <RadioSelectBoxItem
            value="other"
            label="기타"
            suffix={<RadioSelectBoxRadioMark />}
            footer={
              <Box px="x5" pb="x5">
                <TextField label="상세 내용">
                  <TextFieldTextarea placeholder="내용을 입력해주세요" />
                </TextField>
              </Box>
            }
          />
        </RadioSelectBoxRoot>
      </Box>
    </VStack>
  );
}
