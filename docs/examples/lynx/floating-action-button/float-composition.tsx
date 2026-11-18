import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { Box, Float } from "@seed-design/lynx-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";

export default function Example() {
  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      width="full"
      flexGrow
      minHeight="0"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="bottom-end" offsetX="x4" offsetY="x4">
        <FloatingActionButton icon={<IconBellFill />} label="알림 설정" />
      </Float>
    </Box>
  );
}
