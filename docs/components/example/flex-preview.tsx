import { Flex } from "@seed-design/react";

export default function FlexPreview() {
  return (
    <Flex direction="row" background="bg.layerDefault" gap="x2" width="full" borderRadius="r2">
      <Flex
        direction="column"
        background="bg.brandSolid"
        gap="x1_5"
        paddingX="x2"
        paddingY="x2"
        flexGrow={1}
        borderRadius="r2"
      >
        <Flex background="bg.neutralWeak" paddingX="x4" paddingY="x3" borderRadius="r1">
          1
        </Flex>
        <Flex background="bg.neutralWeak" paddingX="x4" paddingY="x3" borderRadius="r1">
          2
        </Flex>
      </Flex>
      <Flex
        direction="row"
        background="bg.brandSolid"
        gap="x1_5"
        paddingX="x2"
        paddingY="x2"
        flexGrow={1}
        borderRadius="r2"
      >
        <Flex background="bg.neutralWeak" paddingX="x4" paddingY="x3" borderRadius="r1">
          3
        </Flex>
        <Flex background="bg.neutralWeak" paddingX="x4" paddingY="x3" borderRadius="r1">
          4
        </Flex>
      </Flex>
      <Flex background="bg.brandSolid" paddingX="x4" paddingY="x3" borderRadius="r2">
        5
      </Flex>
    </Flex>
  );
}
