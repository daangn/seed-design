import { HStack, VStack, Icon } from "@seed-design/react";
import { Chip } from "seed-design/ui/chip";
import { IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";

export default function ChipSuffixIcon() {
  return (
    <VStack gap="x3" align="center">
      <HStack gap="x2">
        <Chip.Button>
          <Chip.Label>Button with Suffix</Chip.Label>
          <Chip.SuffixIcon>
            <Icon svg={<IconChevronDownLine />} />
          </Chip.SuffixIcon>
        </Chip.Button>
        <Chip.Toggle>
          <Chip.Label>Toggle with Suffix</Chip.Label>
          <Chip.SuffixIcon>
            <Icon svg={<IconChevronDownLine />} />
          </Chip.SuffixIcon>
        </Chip.Toggle>
      </HStack>
      <Chip.RadioRoot defaultValue="option1" aria-label="Options">
        <HStack gap="x2">
          <Chip.RadioItem value="option1">
            <Chip.Label>Radio with Suffix 1</Chip.Label>
            <Chip.SuffixIcon>
              <Icon svg={<IconChevronDownLine />} />
            </Chip.SuffixIcon>
          </Chip.RadioItem>
          <Chip.RadioItem value="option2">
            <Chip.Label>Radio with Suffix 2</Chip.Label>
            <Chip.SuffixIcon>
              <Icon svg={<IconChevronDownLine />} />
            </Chip.SuffixIcon>
          </Chip.RadioItem>
        </HStack>
      </Chip.RadioRoot>
    </VStack>
  );
}
