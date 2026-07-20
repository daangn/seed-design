import type { Meta, StoryObj } from "@storybook/nextjs";

import { IconDiamondLine, IconHeartLine, IconStarLine } from "@karrotmarket/react-monochrome-icon";
import { selectTriggerVariantMap } from "@seed-design/css/recipes/select-trigger";
import type { SelectTriggerVariantProps } from "@seed-design/css/recipes/select-trigger";
import type { ReactNode } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VIEWPORT_MODES } from "./utils/parameters";

// apple: heart, banana: diamond, cherry: (no icon)
const FruitItems = () => (
  <SelectGroup>
    <SelectItem value="apple" label="사과" prefixIcon={<IconHeartLine />} />
    <SelectItem value="banana" label="바나나" prefixIcon={<IconDiamondLine />} />
    <SelectItem value="cherry" label="체리" />
  </SelectGroup>
);

const Row = ({ caption, children }: { caption: string; children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, color: "#8e8e8e" }}>{caption}</span>
    <div style={{ width: 220 }}>{children}</div>
  </div>
);

// Focuses on the trigger prefix slot: how a selected item's prefix icon is
// mirrored into the trigger, and how the author-provided static prefix icon
// / prefixText interact with the selection count.
const SelectPreview = ({ size }: SelectTriggerVariantProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
    <Row caption="0개 · static(star) 표시">
      <SelectRoot size={size}>
        <SelectTrigger aria-label="빈 상태" placeholder="과일 선택" prefixIcon={<IconStarLine />} />
        <SelectContent>
          <FruitItems />
        </SelectContent>
      </SelectRoot>
    </Row>

    <Row caption="1개 · 아이콘 item(사과) → item 아이콘이 static을 이김">
      <SelectRoot size={size} defaultValue={["apple"]}>
        <SelectTrigger
          aria-label="아이콘 item"
          placeholder="과일 선택"
          prefixIcon={<IconStarLine />}
        />
        <SelectContent>
          <FruitItems />
        </SelectContent>
      </SelectRoot>
    </Row>

    <Row caption="1개 · 무아이콘 item(체리) → static(star) fallback">
      <SelectRoot size={size} defaultValue={["cherry"]}>
        <SelectTrigger
          aria-label="무아이콘 item"
          placeholder="과일 선택"
          prefixIcon={<IconStarLine />}
        />
        <SelectContent>
          <FruitItems />
        </SelectContent>
      </SelectRoot>
    </Row>

    <Row caption="multi 1개(사과) → 미러">
      <SelectRoot size={size} multiple defaultValue={["apple"]}>
        <SelectTrigger
          aria-label="다중 1개"
          placeholder="과일 선택"
          prefixIcon={<IconStarLine />}
        />
        <SelectContent>
          <FruitItems />
        </SelectContent>
      </SelectRoot>
    </Row>

    <Row caption="multi 2개 → static(star)로 복귀">
      <SelectRoot size={size} multiple defaultValue={["apple", "banana"]}>
        <SelectTrigger
          aria-label="다중 2개"
          placeholder="과일 선택"
          prefixIcon={<IconStarLine />}
        />
        <SelectContent>
          <FruitItems />
        </SelectContent>
      </SelectRoot>
    </Row>

    <Row caption="prefixText '정렬:' · 선택 무관 상시 노출">
      <SelectRoot size={size} defaultValue={["newest"]}>
        <SelectTrigger aria-label="정렬" prefixText="정렬:" placeholder="선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="newest" label="최신순" />
            <SelectItem value="popular" label="인기순" />
            <SelectItem value="price" label="가격순" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Row>
  </div>
);

const meta = {
  component: SelectPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof SelectPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={selectTriggerVariantMap}
      conditionMap={{}}
      {...args}
    />
  ),
};

export const LightTheme: Story = {
  ...CommonStoryTemplate,
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
};

export const DarkTheme = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
