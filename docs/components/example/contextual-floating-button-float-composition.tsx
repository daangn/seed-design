import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { Box, Float, PrefixIcon } from "@seed-design/react";
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";

export default function ContextualFloatingButtonFloatComposition() {
  return (
    <Box
      position="relative"
      width="300px"
      height="500px"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <Float placement="bottom-center" offsetY="x4">
        <ContextualFloatingButton>
          <PrefixIcon svg={<IconBellFill />} />
          알림 설정
        </ContextualFloatingButton>
      </Float>
    </Box>
  );
}
