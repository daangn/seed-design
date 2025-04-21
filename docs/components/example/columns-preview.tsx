import { Column, Columns } from "@seed-design/react";

/**
 * @deprecated use `HStack` instead.
 */
export default function ColumnsPreview() {
  return (
    <Columns bg="bg.layerDefault" gap="x2" width="full" borderRadius="r2">
      <Column bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        1
      </Column>
      <Column bg="bg.brandSolid" px="x4" py="x3" width="content" borderRadius="r2">
        Content Width
      </Column>
      <Column bg="bg.brandSolid" px="x4" py="x3" borderRadius="r2">
        2
      </Column>
    </Columns>
  );
}
