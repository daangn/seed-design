import { Flex, Text } from "@seed-design/react";

export default function TextFontWeights() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" fontSize="t5" fontWeight="regular">
        다람쥐 헌 쳇바퀴에 타고파
      </Text>
      <Text color="fg.neutral" fontSize="t5" fontWeight="medium">
        다람쥐 헌 쳇바퀴에 타고파
      </Text>
      <Text color="fg.neutral" fontSize="t5" fontWeight="bold">
        다람쥐 헌 쳇바퀴에 타고파
      </Text>
    </Flex>
  );
}
