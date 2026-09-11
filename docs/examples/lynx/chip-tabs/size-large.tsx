import "./styles";

import { useState } from "@lynx-js/react";
import { useSeedClassName } from "@seed-design/lynx-react";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "@/components/ui/chip-tabs";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const [value, setValue] = useState("1");

  function handleValueChange(nextValue: string) {
    "background only";
    setValue(nextValue);
  }

  return (
    <view className={`${seedClassName} docs-lynx-chip-tabs-root`}>
      <ChipTabsRoot
        variant="neutralSolid"
        size="large"
        defaultValue="1"
        value={value}
        onValueChange={handleValueChange}
      >
        <ChipTabsList>
          <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
        </ChipTabsList>
      </ChipTabsRoot>
      {value === "1" && <text className="chip-tabs-preview__content-text">content 1</text>}
      {value === "2" && <text className="chip-tabs-preview__content-text">content 2</text>}
      {value === "3" && <text className="chip-tabs-preview__content-text">content 3</text>}
    </view>
  );
}
