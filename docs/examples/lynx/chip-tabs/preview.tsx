import "./styles";

import {
  ChipTabsContent,
  ChipTabsList,
  ChipTabsRoot,
  ChipTabsTrigger,
} from "@/components/ui/chip-tabs";

export default function Example() {
  return (
    <ChipTabsRoot defaultValue="1" style={{ width: "100%", maxWidth: "360px" }}>
      <ChipTabsList>
        <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
        <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
        <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
      </ChipTabsList>
      <ChipTabsContent className="chip-tabs-preview__content" value="1">
        <text className="chip-tabs-preview__content-text">Content 1</text>
      </ChipTabsContent>
      <ChipTabsContent className="chip-tabs-preview__content" value="2">
        <text className="chip-tabs-preview__content-text">Content 2</text>
      </ChipTabsContent>
      <ChipTabsContent className="chip-tabs-preview__content" value="3">
        <text className="chip-tabs-preview__content-text">Content 3</text>
      </ChipTabsContent>
    </ChipTabsRoot>
  );
}
