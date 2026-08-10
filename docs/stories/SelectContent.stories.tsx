import preview from "../.storybook/preview";
import { IconDiamondLine, IconHeartLine, IconStarLine } from "@karrotmarket/react-monochrome-icon";
import { selectTriggerVariantMap } from "@seed-design/css/recipes/select-trigger";
import type { SelectTriggerVariantProps } from "@seed-design/css/recipes/select-trigger";
import * as React from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";
import { withChromaticParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VIEWPORT_MODES } from "./utils/parameters";

// The listbox is forced open for snapshots. It normally portals to the body and
// is positioned by floating-ui (flip/shift/size, viewport-dependent). Here it is
// portaled into a per-cell container and flattened into normal flow, so the
// snapshot is deterministic regardless of the cell's viewport position.
const SNAPSHOT_CSS = `
  .select-snapshot .seed-select__positioner {
    position: static !important;
    transform: none !important;
    margin-top: 8px;
  }
  .select-snapshot .seed-select__content {
    width: 100% !important;
    animation: none !important;
  }
  .select-snapshot .seed-select__scrollArea {
    max-height: none !important;
  }
`;

// Full item anatomy: group label, cross-group divider, an icon item (selected →
// checkmark + its icon mirrored into the trigger), a description item, a plain
// item, and a disabled item whose icon / label / description are all dimmed.
const GroupedFruitItems = () => (
  <>
    <SelectGroup label="과일">
      <SelectItem value="apple" label="사과" prefixIcon={<IconHeartLine />} />
      <SelectItem
        value="banana"
        label="바나나"
        description="설명이 있는 아이템"
        prefixIcon={<IconDiamondLine />}
      />
      <SelectItem value="cherry" label="체리" />
    </SelectGroup>
    <SelectGroup label="기타">
      <SelectItem
        value="grape"
        label="포도"
        description="비활성 아이템"
        prefixIcon={<IconStarLine />}
        disabled
      />
    </SelectGroup>
  </>
);

const OpenSelectContent = ({ size }: SelectTriggerVariantProps) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // The portal container must precede SelectContent in tree order so its ref is
  // attached before FloatingPortal resolves the portal root; otherwise the
  // listbox falls back to the body portal (React runs layout effects and ref
  // attachments in tree order). Visual order is restored with flex `order`:
  // trigger first, listbox below.
  return (
    <div
      className="select-snapshot"
      style={{ width: 240, display: "flex", flexDirection: "column" }}
    >
      <style>{SNAPSHOT_CSS}</style>
      <div ref={containerRef} style={{ order: 2 }} />
      <div style={{ order: 1 }}>
        <SelectRoot size={size} open defaultValue={["apple"]}>
          <SelectTrigger
            aria-label="과일 선택"
            placeholder="과일 선택"
            prefixIcon={<IconStarLine />}
          />
          <SelectContent positionerContainer={containerRef}>
            <GroupedFruitItems />
          </SelectContent>
        </SelectRoot>
      </div>
    </div>
  );
};

const meta = preview.meta({
  component: OpenSelectContent,
  decorators: [SeedThemeDecorator],
});
// One open select per size — the content layout (item / group-label padding)
// varies by size, but not by the select's own state (disabled/invalid/...), so
// those are left to the closed Select story.
const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={selectTriggerVariantMap}
      conditionMap={{}}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});
