import "./styles";

import { Box, HStack, VStack, useSeedClassName } from "@seed-design/lynx-react";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

const identities = ["person", "business"] as const;

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-identity-placeholder-root`}>
      <VStack height="full" align="center" justify="center" gap="x4">
        {identities.map((identity) => (
          <HStack key={identity} align="center" gap="x4">
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
    </view>
  );
}
