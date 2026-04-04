import { List, ListItem, Box, Text, VStack } from "@seed-design/lynx-react";

const ITEMS = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i}`,
  title: `SEED Item ${i + 1}`,
  subtitle: `Description ${i + 1}`,
}));

export function TestSeedListPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>SEED List + ListItem</text>

      <List list-type="single" height="300px">
        {ITEMS.map((item) => (
          <ListItem item-key={item.id} key={item.id} px="spacingX.globalGutter" py="x3">
            <VStack gap="x1">
              <Text textStyle="t5Bold">{item.title}</Text>
              <Text textStyle="t4Regular" color="fg.neutralSubtle">{item.subtitle}</Text>
            </VStack>
          </ListItem>
        ))}
      </List>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Horizontal</text>
      <List list-type="single" scroll-orientation="horizontal" height="120px">
        {ITEMS.slice(0, 20).map((item) => (
          <ListItem item-key={`h-${item.id}`} key={`h-${item.id}`}>
            <Box width="140px" height="100px" bg="bg.neutralWeak" borderRadius="r2" p="x3" display="flex" alignItems="center" justifyContent="center">
              <Text textStyle="t5Regular">{item.title}</Text>
            </Box>
          </ListItem>
        ))}
      </List>
    </scroll-view>
  );
}
