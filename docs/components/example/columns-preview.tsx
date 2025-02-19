import { Column, Columns } from "@seed-design/react";

export default function ColumnsPreview() {
  return (
    <Columns background="bg.layerDefault" gap="x2" width="full" borderRadius="r2">
      <Column background="bg.brandSolid" paddingX="x4" paddingY="x3" borderRadius="r2">
        1
      </Column>
      <Column
        background="bg.brandSolid"
        paddingX="x4"
        paddingY="x3"
        width="content"
        borderRadius="r2"
      >
        Content Width
      </Column>
      <Column background="bg.brandSolid" paddingX="x4" paddingY="x3" borderRadius="r2">
        2
      </Column>
    </Columns>
  );
}
