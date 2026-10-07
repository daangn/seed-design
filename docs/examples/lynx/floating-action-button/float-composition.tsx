import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { Box } from "@seed-design/lynx-react";
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
      <Box position="absolute" right="16px" bottom="16px">
        <FloatingActionButton icon={<IconBellFill />} label="알림 설정" />
      </Box>
    </Box>
  );
}
