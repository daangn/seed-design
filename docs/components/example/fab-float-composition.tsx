import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Float, PrefixIcon } from "@seed-design/react";
import { Fab } from "seed-design/ui/fab";

export default function FabFloatComposition() {
  return (
    <Box
      position="relative"
      width="300px"
      height="500px"
      borderWidth={1}
      borderColor="stroke.neutral"
    >
      <Float placement="bottom-end" offsetY="16px">
        <Fab icon={<IconBellFill />} label="알림 설정" />
      </Float>
    </Box>
  );
}
