import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";
import { HStack } from "@seed-design/react";
import { Fab } from "seed-design/ui/fab";

export default function FabExtended() {
  return (
    <HStack gap="x2">
      <Fab icon={<IconPlusLine />} label="Extended" extended={true} />
      <Fab icon={<IconPlusLine />} label="Extended" extended={false} />
    </HStack>
  );
}
