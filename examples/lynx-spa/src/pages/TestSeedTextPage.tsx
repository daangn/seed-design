import { Box, Text } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 30 }, (_, i) => i);

export function TestSeedTextPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>SEED Text</text>

      {ITEMS.map((i) => (
        <Box key={`s-${i}`} py="x2">
          <Text textStyle="t5Bold">Title {i + 1}</Text>
          <Text textStyle="t4Regular" color="fg.neutralSubtle">Subtitle for item {i + 1}</Text>
        </Box>
      ))}
    </scroll-view>
  );
}
