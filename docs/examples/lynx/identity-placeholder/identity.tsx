import { Box, HStack } from "@seed-design/lynx-react";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

export default function Example() {
  return (
    <HStack
      gap="x4"
      align="center"
      justify="center"
      style={{ display: "flex", flexWrap: "wrap", maxWidth: "100%" }}
    >
      <Box width="160px" height="160px">
        <IdentityPlaceholder identity="person" />
      </Box>
      <Box width="160px" height="160px">
        <IdentityPlaceholder identity="business" />
      </Box>
    </HStack>
  );
}
