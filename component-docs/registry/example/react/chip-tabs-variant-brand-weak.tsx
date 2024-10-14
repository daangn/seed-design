import * as React from "react";
import { ChipTabs, ChipTabTrigger, ChipTabTriggerList } from "seed-design/ui/chip-tabs";

export default function ChipTabsVariantBrandWeak() {
  const [value, setValue] = React.useState("1");
  return (
    <>
      <ChipTabs
        variant="brandWeak"
        defaultValue="1"
        value={value}
        onValueChange={(value) => setValue(value)}
      >
        <ChipTabTriggerList>
          <ChipTabTrigger value="1">라벨1</ChipTabTrigger>
          <ChipTabTrigger value="2">라벨2</ChipTabTrigger>
          <ChipTabTrigger value="3">라벨3</ChipTabTrigger>
        </ChipTabTriggerList>
      </ChipTabs>
      {value === "1" && <div>content 1</div>}
      {value === "2" && <div>content 2</div>}
      {value === "3" && <div>content 3</div>}
    </>
  );
}