import "./styles";

import IconDiamond from "@karrotmarket/lynx-multicolor-icon/IconDiamond";
import { root, useState } from "@lynx-js/react";
import { Box, Icon, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { ResultSection } from "@/components/ui/result-section";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
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
    <page className={seedClassName}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
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
      </VStack>
    </page>
  );
}

root.render(<Root />);
