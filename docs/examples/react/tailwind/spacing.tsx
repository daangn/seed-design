import { VStack, HStack, Text } from "@seed-design/react";

export default function TailwindSpacing() {
  return (
    <VStack gap="x4">
      {/* 크기 유틸리티 */}
      <HStack gap="x3" align="center">
        <div className="size-x6 bg-palette-gray-400 rounded-r1" />
        <Text>size-x6</Text>
      </HStack>
      <HStack gap="x3" align="center">
        <div className="w-x8 h-x4 bg-palette-gray-400 rounded-r1" />
        <Text>w-x8 h-x4</Text>
      </HStack>

      {/* 패딩 유틸리티 */}
      <HStack gap="x3" align="center">
        <div className="p-x2 bg-palette-gray-600 rounded-r3">
          <div className="size-x6 bg-palette-gray-400 rounded-r1" />
        </div>
        <Text>p-x2</Text>
      </HStack>
      <HStack gap="x3" align="center">
        <div className="px-x4 py-x2 bg-palette-gray-600 rounded-r3">
          <div className="size-x6 bg-palette-gray-400 rounded-r1" />
        </div>
        <Text>px-x4 py-x2</Text>
      </HStack>

      {/* 간격 유틸리티 */}
      <HStack gap="x3" align="center">
        <div className="flex gap-x3 p-x2 bg-palette-gray-600 rounded-r3">
          <div className="size-x6 bg-palette-gray-400 rounded-r1" />
          <div className="size-x6 bg-palette-gray-400 rounded-r1" />
          <div className="size-x6 bg-palette-gray-400 rounded-r1" />
        </div>
        <Text>p-x2 gap-x3</Text>
      </HStack>
    </VStack>
  );
}
