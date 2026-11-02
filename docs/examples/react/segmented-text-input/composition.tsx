import { Box } from "@seed-design/react";
import {
  SegmentedTextField,
  SegmentedTextFieldSegment,
  SegmentedTextFieldSeparator,
} from "seed-design/ui/segmented-text-field";

export default function SegmentedTextInputComposition() {
  return (
    <Box width="358px" maxWidth="100%">
      <SegmentedTextField label="사업자등록번호">
        <SegmentedTextFieldSegment aria-label="앞 3자리" placeholder="000" length={3} />
        <SegmentedTextFieldSeparator> - </SegmentedTextFieldSeparator>
        <SegmentedTextFieldSegment aria-label="가운데 2자리" placeholder="00" length={2} />
        <SegmentedTextFieldSeparator> - </SegmentedTextFieldSeparator>
        <SegmentedTextFieldSegment aria-label="뒤 5자리" placeholder="00000" length={5} />
      </SegmentedTextField>
    </Box>
  );
}
