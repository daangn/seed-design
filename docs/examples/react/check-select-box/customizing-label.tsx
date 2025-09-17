import { Badge, Box, Flex, VStack } from "@seed-design/react";
import { CheckSelectBox, CheckSelectBoxGroup } from "@/registry/ui/select-box";

export default function CheckSelectBoxCustomizingLabel() {
  return (
    <CheckSelectBoxGroup>
      <VStack gap="spacingY.componentDefault">
        <CheckSelectBox label="Apple" defaultChecked />
        <CheckSelectBox
          label={
            <Flex gap="x1_5" alignItems="center">
              <Box>Melon</Box>
              <Badge tone="brand" variant="solid">
                New
              </Badge>
            </Flex>
          }
          description="Elit cupidatat dolore fugiat enim veniam culpa."
        />
        <CheckSelectBox
          label="Mango"
          description="Aliqua ad aute eiusmod eiusmod nulla adipisicing proident ullamco in."
        />
      </VStack>
    </CheckSelectBoxGroup>
  );
}
