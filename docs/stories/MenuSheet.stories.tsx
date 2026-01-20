import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { menuSheetVariantMap } from "@seed-design/css/recipes/menu-sheet";
import { Box, PrefixIcon, Text } from "@seed-design/react";
import {
  MenuSheetRoot,
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
} from "seed-design/ui/menu-sheet";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import type { ReactNode } from "react";

const MenuSheetPreview = ({ title, prefixIcon }: { title?: ReactNode; prefixIcon?: ReactNode }) => {
  return (
    <Box width="400px" p="x4">
      <style>{`
        .seed-menu-sheet__positioner {
          position: relative !important;
          inset: unset !important;
        }
        .seed-menu-sheet__backdrop {
          display: none !important;
        }
        .seed-menu-sheet__content {
          animation: none !important;
        }
      `}</style>
      <MenuSheetRoot open>
        <MenuSheetContent title={title} labelAlign={prefixIcon ? "left" : "center"}>
          <MenuSheetGroup>
            <MenuSheetItem>
              {prefixIcon}
              <Text>Action 1</Text>
            </MenuSheetItem>
            <MenuSheetItem>
              {prefixIcon}
              <Text>Action 2</Text>
            </MenuSheetItem>
            <MenuSheetItem>
              {prefixIcon}
              <Text>Action 3</Text>
            </MenuSheetItem>
          </MenuSheetGroup>
          <MenuSheetGroup>
            <MenuSheetItem>
              {prefixIcon}
              <Text>Action 4</Text>
            </MenuSheetItem>
            <MenuSheetItem tone="critical">
              {prefixIcon}
              <Text>Action 5</Text>
            </MenuSheetItem>
          </MenuSheetGroup>
        </MenuSheetContent>
      </MenuSheetRoot>
    </Box>
  );
};

const meta = {
  component: MenuSheetPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof MenuSheetPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const { skipAnimation: _skipAnimation, ...restVariantMap } = menuSheetVariantMap;

const conditionMap = {
  title: {
    true: {
      title:
        "이것은 매우 긴 제목 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있으며, 텍스트가 어떻게 줄바꿈되는지 확인합니다.",
    },
    false: { title: undefined },
  },
  labelAlign: {
    left: { prefixIcon: <PrefixIcon svg={<IconEyeSlashLine />} /> },
    center: { prefixIcon: undefined },
  },
};

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={restVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = CommonStoryTemplate;

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
