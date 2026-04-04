import { ScrollView, Box, Text, VStack, HStack } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 30 }, (_, i) => i);

export function TestSeedScrollViewPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>SEED ScrollView</text>

      <ScrollView height="200px" bg="bg.neutralWeak" borderRadius="r2" px="x3" py="x2">
        <VStack gap="x2">
          {ITEMS.map((i) => (
            <Box key={`s-${i}`} bg="bg.neutral" px="x3" py="x2" borderRadius="r1">
              <Text textStyle="t5Regular">SEED Item {i + 1}</Text>
            </Box>
          ))}
        </VStack>
      </ScrollView>

      <ScrollView scroll-orientation="horizontal" height="100px" bg="bg.neutralWeak" borderRadius="r2" px="x3" py="x2">
        <HStack gap="x2">
          {ITEMS.map((i) => (
            <Box key={`sh-${i}`} width="140px" height="70px" bg="bg.brandWeak" borderRadius="r2" p="x3" display="flex" alignItems="center" justifyContent="center">
              <Text textStyle="t5Regular">Card {i + 1}</Text>
            </Box>
          ))}
        </HStack>
      </ScrollView>
    </scroll-view>
  );
}
