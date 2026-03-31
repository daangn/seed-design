import { VStack, HStack, Box } from "@seed-design/lynx-react";

function ColorBox({ label, bg = "bg.brandWeak" }: { label: string; bg?: string }) {
  return (
    <Box bg={bg} px="x3" py="x2" borderRadius="r1">
      <text>{label}</text>
    </Box>
  );
}

export function LayoutStackPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>VStack / HStack</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>VStack (Vertical)</text>
      <VStack gap="x2">
        <ColorBox label="Item 1" />
        <ColorBox label="Item 2" />
        <ColorBox label="Item 3" />
      </VStack>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>HStack (Horizontal)</text>
      <HStack gap="x2">
        <ColorBox label="A" />
        <ColorBox label="B" />
        <ColorBox label="C" />
      </HStack>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>VStack with Align Center</text>
      <VStack gap="x2" align="center" bg="bg.neutralWeak" p="x3" borderRadius="r2">
        <ColorBox label="Short" />
        <ColorBox label="Medium Text" />
        <ColorBox label="A Longer Item" />
      </VStack>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>HStack with Align Center</text>
      <HStack gap="x2" align="center">
        <Box bg="bg.brandWeak" px="x3" py="x1" borderRadius="r1">
          <text>Small</text>
        </Box>
        <Box bg="bg.criticalWeak" px="x3" py="x4" borderRadius="r1">
          <text>Tall</text>
        </Box>
        <Box bg="bg.brandWeak" px="x3" py="x2" borderRadius="r1">
          <text>Medium</text>
        </Box>
      </HStack>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Nested Stacks</text>
      <VStack gap="x3" bg="bg.neutralWeak" p="x3" borderRadius="r2">
        <HStack gap="x2">
          <ColorBox label="Row 1 - A" />
          <ColorBox label="Row 1 - B" />
        </HStack>
        <HStack gap="x2">
          <ColorBox label="Row 2 - A" bg="bg.criticalWeak" />
          <ColorBox label="Row 2 - B" bg="bg.criticalWeak" />
          <ColorBox label="Row 2 - C" bg="bg.criticalWeak" />
        </HStack>
      </VStack>
    </scroll-view>
  );
}
