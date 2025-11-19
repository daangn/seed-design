import { List, ListCheckItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";
import { Checkmark } from "seed-design/ui/checkbox";
import { HStack, VStack } from "@seed-design/react";

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
        <ListHeader as="h2">카드 radius: r3_5</ListHeader>
        <List as="fieldset">
          <ListCheckItem
            defaultChecked
            title="borderRadius: r2"
            suffix={<Checkmark size="large" tone="neutral" />}
            borderRadius="r2"
          />
          <ListCheckItem
            title="borderRadius: r2"
            suffix={<Checkmark size="large" tone="neutral" />}
            borderRadius="r2"
          />
        </List>
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
        <ListHeader as="h2">카드 radius: 22px</ListHeader>
        <List as="fieldset">
          <ListCheckItem
            defaultChecked
            title="borderRadius: r3"
            suffix={<Checkmark size="large" tone="neutral" />}
            borderRadius="r3"
          />
          <ListCheckItem
            title="borderRadius: r3"
            suffix={<Checkmark size="large" tone="neutral" />}
            borderRadius="r3"
          />
        </List>
      </VStack>
    </HStack>
  );
}
