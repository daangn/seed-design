import { Badge, Box, Flex, VStack } from "@seed-design/react";
import { RadioSelectBoxItem, RadioSelectBoxRoot } from "seed-design/ui/select-box";

export default function CheckSelectBoxPreview() {
  return (
    <RadioSelectBoxRoot defaultValue="apple" aria-label="Fruit">
      <VStack gap="spacingY.componentDefault">
        <RadioSelectBoxItem value="apple" label="Apple" />
        <RadioSelectBoxItem
          value="melon"
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
        <RadioSelectBoxItem
          value="mango"
          label="Mango"
          description="Aliqua ad aute eiusmod eiusmod nulla adipisicing proident ullamco in."
        />
      </VStack>
    </RadioSelectBoxRoot>
  );
}
