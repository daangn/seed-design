import IconBellFill from "@karrotmarket/lynx-monochrome-icon/IconBellFill";

import { Box, ContextualFloatingButton, PrefixIcon } from "@seed-design/lynx-react";

export default function Example() {
  return (
    <Box
      position="relative"
      width="300px"
      height="500px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Box position="absolute" width="full" bottom="x4" display="flex" justifyContent="center">
        <ContextualFloatingButton>
          <PrefixIcon icon={<IconBellFill />} />
          알림 설정
        </ContextualFloatingButton>
      </Box>
    </Box>
  );
}
