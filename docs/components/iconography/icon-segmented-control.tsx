"use client";

import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { useIcon } from "./icon-context";

export const IconSegmentedControl = () => {
  const { setIconStyle, iconStyle } = useIcon();

  return (
    <SegmentedControl
      className="justify-self-center"
      onValueChange={(value) => setIconStyle(value as "monochrome" | "multicolor")}
      defaultValue={iconStyle}
      value={iconStyle}
      aria-label="Sort by"
    >
      <SegmentedControlItem value="monochrome">Monochrome</SegmentedControlItem>
      <SegmentedControlItem value="multicolor">Multicolor</SegmentedControlItem>
    </SegmentedControl>
  );
};
