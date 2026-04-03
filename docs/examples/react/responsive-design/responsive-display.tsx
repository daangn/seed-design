import { VStack, Text, Box } from "@seed-design/react";

export default function ResponsiveDisplayExample() {
  return (
    <VStack gap="x2" align="center">
      <Text textStyle="t3Medium">아래 Box는 md breakpoint 이상에서만 보입니다.</Text>
      <Box
        display={{ base: "none", md: "block" }}
        bg="bg.informativeWeak"
        color="fg.informativeContrast"
        padding="x4"
        borderRadius="r3"
        className="font-mono"
      >
        {`display={{ base: "none", md: "block" }}`}
      </Box>
    </VStack>
  );
}
