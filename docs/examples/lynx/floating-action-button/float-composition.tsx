import "./styles";

import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { Box, useSeedClassName } from "@seed-design/lynx-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-floating-action-button-root`}>
      <view className="floating-action-button-preview">
        <Box
          position="relative"
          width="300px"
          height="500px"
          borderWidth={1}
          borderColor="stroke.neutralMuted"
        >
          <Box position="absolute" right="16px" bottom="16px">
            <FloatingActionButton icon={<IconBellFill />} label="알림 설정" />
          </Box>
        </Box>
      </view>
    </view>
  );
}
