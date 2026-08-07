import preview from "../.storybook/preview";
import { IconDiamondLine, IconHeartLine, IconStarLine } from "@karrotmarket/react-monochrome-icon";
import { selectTriggerVariantMap } from "@seed-design/css/recipes/select-trigger";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";
import type { SelectRootProps, SelectTriggerProps } from "seed-design/ui/select";
import { createStoryParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VIEWPORT_MODES } from "./utils/parameters";

interface ClosedSelectProps
  extends SelectRootProps,
    Pick<SelectTriggerProps, "placeholder" | "prefixIcon"> {}

// Closed trigger only. SelectContent still renders — its options register on
// mount even while the listbox stays hidden — so the trigger resolves the
// selected value's label and mirrored prefix icon. The listbox anatomy itself
// lives in the SelectContent story.
const ClosedSelect = ({ placeholder, prefixIcon, children, ...rootProps }: ClosedSelectProps) => (
  <div style={{ width: 220 }}>
    <SelectRoot {...rootProps}>
      <SelectTrigger aria-label="과일 선택" placeholder={placeholder} prefixIcon={prefixIcon} />
      <SelectContent>{children}</SelectContent>
    </SelectRoot>
  </div>
);

// apple: heart, banana: diamond, cherry: (no icon). Only the selected item's
// label/icon surfaces in the closed trigger.
const FruitItems = () => (
  <SelectGroup>
    <SelectItem value="apple" label="사과" prefixIcon={<IconHeartLine />} />
    <SelectItem value="banana" label="바나나" prefixIcon={<IconDiamondLine />} />
    <SelectItem value="cherry" label="체리" />
  </SelectGroup>
);

const meta = preview.meta({
  component: ClosedSelect,
  decorators: [SeedThemeDecorator],
});
// selection = value display + prefix-icon mirror (a single item's own icon wins
// over the static one; multi reverts to static). prefix = the static trigger
// prefix icon. disabled/readOnly/invalid are independent boolean axes.
const conditionMap = {
  selection: {
    none: { defaultValue: [] },
    single: { defaultValue: ["apple"] },
    multiple: { multiple: true, defaultValue: ["apple", "banana"] },
  },
  prefix: {
    icon: { prefixIcon: <IconStarLine /> },
  },
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
  readOnly: {
    false: { readOnly: false },
    true: { readOnly: true },
  },
  invalid: {
    false: { invalid: false },
    true: { invalid: true },
  },
};

const CommonStoryTemplate = meta.story({
  args: {
    placeholder: "과일 선택",
    children: <FruitItems />,
  },
  render: (args) => (
    <VariantTable
      Component={ClosedSelect}
      variantMap={selectTriggerVariantMap}
      conditionMap={conditionMap}
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
  parameters: createStoryParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});
