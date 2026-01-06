import { Flex, Text } from "@seed-design/react";

export default function TextUserSelect() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" fontSize="t5" userSelect="auto">
        auto
      </Text>
      <Text color="fg.neutral" fontSize="t5" userSelect="none">
        none
      </Text>
      <Text color="fg.neutral" fontSize="t5" userSelect="text">
        text
      </Text>
    </Flex>
  );
}
