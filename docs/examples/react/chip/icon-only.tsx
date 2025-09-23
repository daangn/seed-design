import { HStack, VStack, Icon } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import {
  IconArrowClockwiseCircularLine,
  IconBellLine,
  IconBellSlashLine,
  IconTimer_10Line,
  IconTimer_3Line,
} from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";

export default function ChipIconOnly() {
  const [checked, setChecked] = useState(false);

  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button layout="iconOnly" aria-label="Refresh">
          <Icon svg={<IconArrowClockwiseCircularLine />} />
        </Chip.Button>
        <Chip.Toggle
          layout="iconOnly"
          checked={checked}
          onCheckedChange={setChecked}
          inputProps={{ "aria-label": "Receive notifications" }}
        >
          <Icon svg={checked ? <IconBellLine /> : <IconBellSlashLine />} />
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="3" aria-label="Timer">
        <HStack gap="x2">
          <Chip.RadioItem value="3" layout="iconOnly" inputProps={{ "aria-label": "3 seconds" }}>
            <Icon svg={<IconTimer_3Line />} />
          </Chip.RadioItem>
          <Chip.RadioItem value="10" layout="iconOnly" inputProps={{ "aria-label": "10 seconds" }}>
            <Icon svg={<IconTimer_10Line />} />
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
