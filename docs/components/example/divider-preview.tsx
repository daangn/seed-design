import { Box, Divider, VStack } from "@seed-design/react";

export default function DividerPreview() {
  return (
    <VStack width="full" bg="bg.layerDefault" p="x4">
      <Box p="x4">
        Nisi elit pariatur incididunt quis fugiat mollit ipsum fugiat duis culpa esse incididunt
        cupidatat.
      </Box>
      <Divider />
      <Box p="x4">Consectetur voluptate quis do culpa et culpa.</Box>
    </VStack>
  );
}
