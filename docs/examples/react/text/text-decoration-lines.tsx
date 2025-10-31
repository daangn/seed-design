import { Flex, Text } from "@seed-design/react";

export default function TextTextDecorationLines() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" fontSize="t5" textDecorationLine="underline">
        underline
      </Text>
      <Text color="fg.neutral" fontSize="t5" textDecorationLine="line-through">
        line-through
      </Text>
    </Flex>
  );
}
