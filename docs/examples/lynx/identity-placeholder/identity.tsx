import "./styles";

import { Box, HStack, useSeedClassName } from "@seed-design/lynx-react";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-identity-placeholder-root`}>
      <HStack className="identity-placeholder-preview" gap="x4">
        <Box width="160px" height="160px">
          <IdentityPlaceholder identity="person" />
        </Box>
        <Box width="160px" height="160px">
          <IdentityPlaceholder identity="business" />
        </Box>
      </HStack>
    </view>
  );
}
