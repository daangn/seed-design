import "./styles";

import { Box, useSeedClassName } from "@seed-design/lynx-react";
import { IdentityPlaceholder } from "@/components/ui/identity-placeholder";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-identity-placeholder-root`}>
      <view className="identity-placeholder-preview">
        <Box width="160px" height="160px">
          <IdentityPlaceholder />
        </Box>
      </view>
    </view>
  );
}
