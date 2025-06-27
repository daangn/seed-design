import { Flex, Text } from "@seed-design/react";

export default function TextLineThrough() {
  return (
    <Flex direction="column" gap="x2">
      <Text color="fg.neutral" textStyle="t5Regular" textDecorationLine="line-through">
        다람쥐 헌 쳇바퀴에 타고파
      </Text>
    </Flex>
  );
}
