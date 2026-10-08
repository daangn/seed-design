import IconDiamond from "@karrotmarket/lynx-multicolor-icon/IconDiamond";
import { useState } from "@lynx-js/react";
import { Box, Icon, VStack } from "@seed-design/lynx-react";
import { ResultSection } from "@/components/ui/result-section";

export default function Example() {
  const [actionResult, setActionResult] = useState<string | null>(null);

  function handlePrimaryAction() {
    "background only";
    setActionResult("Primary Action Clicked");
  }

  function handleSecondaryAction() {
    "background only";
    setActionResult("Secondary Action Clicked");
  }

  return (
    <VStack width="full" maxWidth="320px" alignSelf="center" grow minHeight="0">
      <ResultSection
        asset={
          <Box pb="x4">
            <Icon icon={<IconDiamond />} size="x10" multicolor />
          </Box>
        }
        title="결과 타이틀"
        description={actionResult ?? "부가 설명을 적어주세요"}
        primaryActionProps={{ children: "Primary Action", bindtap: handlePrimaryAction }}
        secondaryActionProps={{
          children: "Secondary Action",
          bindtap: handleSecondaryAction,
        }}
      />
    </VStack>
  );
}
