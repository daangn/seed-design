import { NextList, NextListCheckItem, NextListRadioItem } from "seed-design/ui/next-list";
import { ListHeader } from "seed-design/ui/list-header";
import { Checkmark } from "seed-design/ui/checkbox";
import { Radiomark } from "seed-design/ui/radio-group";
import { HStack, VStack } from "@seed-design/react";
import { RadioGroup } from "@seed-design/react/primitive";

export default function ListBorderRadius() {
  return (
    <HStack
      gap="x4"
      bg="bg.layerBasement"
      width="full"
      grow
      wrap
      align="center"
      justify="center"
      p="x4"
    >
      <VStack
        width="300px"
        py="x1_5"
        borderRadius="r3_5"
        bg="bg.layerDefault"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
      >
        <ListHeader as="h2">카드 borderRadius: r3_5</ListHeader>
        <NextList as="fieldset" itemBorderRadius="r2">
          <NextListCheckItem
            defaultChecked
            title="borderRadius: r2"
            suffix={<Checkmark size="large" tone="neutral" />}
          />
          <NextListCheckItem
            title="borderRadius: r2"
            suffix={<Checkmark size="large" tone="neutral" />}
          />
        </NextList>
      </VStack>
      <VStack
        width="300px"
        px="x1"
        py="x2_5"
        borderRadius="22px"
        bg="bg.layerDefault"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
      >
        <ListHeader as="h2">카드 borderRadius: 22px</ListHeader>
        <NextList asChild itemBorderRadius="r3">
          <RadioGroup.Root defaultValue="0" aria-label="Border radius options">
            <NextListRadioItem
              value="0"
              title="borderRadius: r3"
              suffix={<Radiomark size="large" tone="neutral" />}
            />
            <NextListRadioItem
              value="1"
              title="borderRadius: r3"
              suffix={<Radiomark size="large" tone="neutral" />}
            />
          </RadioGroup.Root>
        </NextList>
      </VStack>
    </HStack>
  );
}
