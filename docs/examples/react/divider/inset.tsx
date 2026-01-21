import { Box, Divider, HStack, VStack } from "@seed-design/react";

export default function DividerInset() {
  return (
    <VStack width="full" gap="x4">
      <VStack flexGrow bg="bg.layerDefault" gap="x4">
        <Box bg="palette.blue400" height="x8" />
        <Divider inset />
        <Box bg="palette.blue400" height="x8" />
      </VStack>
      <HStack flexGrow bg="bg.layerDefault" gap="x4" height="x16">
        <Box bg="palette.blue400" flexGrow />
        <Divider orientation="vertical" inset />
        <Box bg="palette.blue400" flexGrow />
      </HStack>
    </VStack>
  );
}
