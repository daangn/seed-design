import { Box, VStack, Text } from "@seed-design/react";

export default function HideFromExample() {
  return (
    <VStack gap="x2" align="center">
      <Text textStyle="t3Medium">아래 Box는 xl breakpoint 이상에서는 숨겨집니다.</Text>
      <Box
        bg="bg.informativeWeak"
        color="fg.informativeContrast"
        padding="x4"
        borderRadius="r3"
        hideFrom="xl"
        className="font-mono"
      >
        hideFrom="xl"
      </Box>
    </VStack>
  );
}
