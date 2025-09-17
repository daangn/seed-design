import { FloatingActionButton } from "seed-design/ui/floating-action-button";
import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Float } from "@seed-design/react";

export default function FloatingActionButtonFloatComposition() {
  return (
    <Box
      position="relative"
      width="300px"
      height="500px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="bottom-end" offsetX="x4" offsetY="x4">
        <FloatingActionButton icon={<IconBellFill />} label="알림 설정" />
      </Float>
    </Box>
  );
}
