import { Box, HStack, VStack } from "@seed-design/lynx-react";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

const identities = ["person", "business"] as const;

export default function Example() {
  return (
    <VStack gap="x4" align="center" style={{ maxWidth: "100%" }}>
      {identities.map((identity) => (
        <HStack
          key={identity}
          align="center"
          gap="x4"
          justify="center"
          style={{ display: "flex", flexWrap: "wrap", maxWidth: "100%" }}
        >
          <Box width="80px" height="80px">
            <IdentityPlaceholder identity={identity} />
          </Box>
          <Box width="160px" height="80px">
            <IdentityPlaceholder identity={identity} />
          </Box>
          <Box width="80px" height="160px">
            <IdentityPlaceholder identity={identity} />
          </Box>
        </HStack>
      ))}
    </VStack>
  );
}
