import { Box, Field, SegmentedTextInput } from "@seed-design/react";

export default function SegmentedTextInputComposition() {
  return (
    <Box width="358px" maxWidth="100%">
      <Field.Root>
        <Field.Header>
          <Field.Label>사업자등록번호</Field.Label>
        </Field.Header>
        <SegmentedTextInput.Root>
          <SegmentedTextInput.Segment aria-label="앞 3자리" placeholder="000" length={3} />
          <SegmentedTextInput.Separator> - </SegmentedTextInput.Separator>
          <SegmentedTextInput.Segment aria-label="가운데 2자리" placeholder="00" length={2} />
          <SegmentedTextInput.Separator> - </SegmentedTextInput.Separator>
          <SegmentedTextInput.Segment aria-label="뒤 5자리" placeholder="00000" length={5} />
        </SegmentedTextInput.Root>
      </Field.Root>
    </Box>
  );
}
