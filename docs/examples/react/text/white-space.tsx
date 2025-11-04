import { Box, Text, VStack } from "@seed-design/react";

const sampleText = `이것은 여러 개         의
공백, 줄바꿈과
    들여쓰기를 포함한 샘플 텍스트입니다.          각각의 white-space 속성\n값이 어떻게 작동하는지 보여줍니다.`;

export default function TextWhiteSpace() {
  return (
    <VStack gap="x4" width="full">
      {(["normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces"] as const).map(
        (value) => (
          <VStack gap="x2" key={value}>
            <Text textStyle="t4Bold">{value}</Text>
            <Box width="full" padding="x4" borderRadius="r2" bg="bg.neutralWeak" overflowX="auto">
              <Text whiteSpace={value}>{sampleText}</Text>
            </Box>
          </VStack>
        ),
      )}
    </VStack>
  );
}
