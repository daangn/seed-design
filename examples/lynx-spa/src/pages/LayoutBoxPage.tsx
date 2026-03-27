import { Box } from "@seed-design/lynx-react";

export function LayoutBoxPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Box</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Background & Padding</text>
      <Box bg="bg.neutralWeak" px="x3" py="x2">
        <text>bg.neutralWeak with padding</text>
      </Box>
      <Box bg="bg.brandWeak" px="x4" py="x3">
        <text>bg.brandWeak with larger padding</text>
      </Box>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Border & Radius</text>
      <Box borderWidth="1" borderColor="stroke.neutral" borderRadius="r2" px="x3" py="x2">
        <text>Border with radius r2</text>
      </Box>
      <Box borderWidth="2" borderColor="stroke.brandWeak" borderRadius="r4" px="x3" py="x2">
        <text>Thicker border with radius r4</text>
      </Box>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Shadow</text>
      <Box bg="bg.neutral" boxShadow="s1" borderRadius="r2" px="x3" py="x2">
        <text>Shadow s1</text>
      </Box>
      <Box bg="bg.neutral" boxShadow="s2" borderRadius="r2" px="x3" py="x2">
        <text>Shadow s2</text>
      </Box>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Nested Box</text>
      <Box bg="bg.neutralWeak" p="x3" borderRadius="r2">
        <Box bg="bg.neutral" p="x3" borderRadius="r2">
          <Box bg="bg.brandWeak" p="x2" borderRadius="r1">
            <text>Nested boxes</text>
          </Box>
        </Box>
      </Box>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Dimensions</text>
      <Box bg="bg.brandWeak" width="200" height="80" display="flex" alignItems="center" justifyContent="center">
        <text>200 x 80</text>
      </Box>
    </scroll-view>
  );
}
