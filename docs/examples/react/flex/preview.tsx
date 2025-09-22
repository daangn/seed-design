import { Flex } from "@seed-design/react";

export default function FlexPreview() {
  return (
    <Flex direction="row" bg="bg.layerDefault" gap="x2" width="full" borderRadius="r2">
      <Flex
        direction="column"
        bg="bg.brandSolid"
        gap="x1_5"
        px="x2"
        py="x2"
        flexGrow={1}
        borderRadius="r2"
      >
        <Flex bg="bg.neutralWeak" px="x4" py="x3" borderRadius="r1">
          1
        </Flex>
        <Flex bg="bg.neutralWeak" px="x4" py="x3" borderRadius="r1">
          2
        </Flex>
      </Flex>
      <Flex
        direction="row"
        bg="bg.brandSolid"
        gap="x1_5"
        px="x2"
        py="x2"
        flexGrow={1}
        borderRadius="r2"
      >
        <Flex bg="bg.neutralWeak" px="x4" py="x3" borderRadius="r1">
          3
        </Flex>
        <Flex bg="bg.neutralWeak" px="x4" py="x3" borderRadius="r1">
          4
        </Flex>
      </Flex>
      <Flex bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        5
      </Flex>
    </Flex>
  );
}
