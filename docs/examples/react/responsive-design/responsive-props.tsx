import { Box } from "@seed-design/react";

export default function ResponsivePropsExample() {
  return (
    <Box
      bg="bg.informativeWeak"
      color="fg.informativeContrast"
      padding={{ base: "x4", md: "x6", xl: "x8" }}
      borderRadius="r3"
      className="font-mono"
    >
      {`padding={{ base: "x4", md: "x6", xl: "x8" }}`}
    </Box>
  );
}
