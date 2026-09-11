import "./styles";

import { useSeedClassName } from "@seed-design/lynx-react";
import { ChipTabsList, ChipTabsRoot, ChipTabsTrigger } from "@/components/ui/chip-tabs";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={seedClassName} style={{ maxWidth: "360px" }}>
      <ChipTabsRoot defaultValue="1">
        <ChipTabsList>
          <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
          <ChipTabsTrigger value="4">라벨4</ChipTabsTrigger>
          <ChipTabsTrigger value="5">라벨5</ChipTabsTrigger>
          <ChipTabsTrigger value="6">라벨6</ChipTabsTrigger>
          <ChipTabsTrigger value="7">라벨7</ChipTabsTrigger>
          <ChipTabsTrigger value="8">라벨8</ChipTabsTrigger>
          <ChipTabsTrigger value="9">라벨9</ChipTabsTrigger>
          <ChipTabsTrigger value="10">라벨10</ChipTabsTrigger>
          <ChipTabsTrigger value="11">라벨11</ChipTabsTrigger>
          <ChipTabsTrigger value="12">라벨12</ChipTabsTrigger>
          <ChipTabsTrigger value="13">라벨13</ChipTabsTrigger>
          <ChipTabsTrigger value="14">라벨14</ChipTabsTrigger>
          <ChipTabsTrigger value="15">라벨15</ChipTabsTrigger>
        </ChipTabsList>
      </ChipTabsRoot>
    </view>
  );
}
