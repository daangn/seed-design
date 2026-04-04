import { Box, Text, HStack } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 30 }, (_, i) => i);

export function TestSeedBoxPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>SEED Box</text>

      {ITEMS.map((i) => (
        <Box
          key={`s-${i}`}
          bg={i % 2 === 0 ? "bg.neutralWeak" : "bg.brandWeak"}
          px="x3"
          py="x2"
          borderRadius="r2"
          borderWidth="1"
          borderColor="stroke.neutralMuted"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text textStyle="t5Regular">SEED Item {i + 1}</Text>
          <Text textStyle="t4Regular" color="fg.neutralSubtle">seed</Text>
        </Box>
      ))}
    </scroll-view>
  );
}
