import { VStack, Text } from "@seed-design/react";

export default function TailwindColors() {
  return (
    <VStack gap="x4">
      {/* 텍스트 색상 */}
      <VStack gap="x2">
        <div className="p-x3 rounded-r2">
          <p className="text-fg-brand t4-bold">text-fg-brand</p>
        </div>
        <div className="p-x3 rounded-r2">
          <p className="text-fg-neutral t4-bold">text-fg-neutral</p>
        </div>
        <div className="p-x3 rounded-r2">
          <p className="text-palette-blue-500 t4-bold">text-palette-blue-500</p>
        </div>
      </VStack>

      {/* 배경 색상 */}
      <VStack gap="x2">
        <div className="bg-bg-informative-weak p-x3 rounded-r2">
          <Text>bg-bg-informative-weak</Text>
        </div>
        <div className="bg-palette-gray-200 p-x3 rounded-r2">
          <Text>bg-palette-gray-200</Text>
        </div>
      </VStack>

      {/* 테두리 색상 */}
      <VStack gap="x2">
        <div className="border-2 border-stroke-brand-solid p-x3 rounded-r2">
          <Text>border-stroke-brand-solid</Text>
        </div>
        <div className="border-2 border-palette-red-500 p-x3 rounded-r2">
          <Text>border-palette-red-500</Text>
        </div>
      </VStack>
    </VStack>
  );
}
