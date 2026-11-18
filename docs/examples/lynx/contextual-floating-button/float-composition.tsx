import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { Box, ContextualFloatingButton, Float, PrefixIcon } from "@seed-design/lynx-react";

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
      <Float placement="bottom-center" offsetY="x4">
        <ContextualFloatingButton>
          <PrefixIcon icon={<IconBellFill />} />
          알림 설정
        </ContextualFloatingButton>
      </Float>
    </Box>
  );
}
