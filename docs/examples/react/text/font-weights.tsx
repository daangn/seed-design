import { Flex, Text } from "@seed-design/react";

export default function TextFontWeights() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" fontSize="t5" fontWeight="regular">
        regular
      </Text>
      <Text color="fg.neutral" fontSize="t5" fontWeight="medium">
        medium
      </Text>
      <Text color="fg.neutral" fontSize="t5" fontWeight="bold">
        bold
      </Text>
    </Flex>
  );
}
