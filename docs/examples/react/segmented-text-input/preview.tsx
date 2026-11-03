import { Box } from "@seed-design/react";
import { ResidentNumberField } from "seed-design/ui/resident-number-field";

export default function SegmentedTextInputPreview() {
  return (
    <Box width="358px" maxWidth="100%">
      <ResidentNumberField label="주민등록번호" />
    </Box>
  );
}
