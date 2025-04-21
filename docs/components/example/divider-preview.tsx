import { Box, Divider, VStack } from "@seed-design/react";

export default function DividerPreview() {
  return (
    <VStack width="full">
      <Box bg="bg.layerDefault" height="100px" />
      <Divider />
      <Box bg="bg.layerDefault" height="100px" />
    </VStack>
  );
}
