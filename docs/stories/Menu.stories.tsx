import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { menuVariantMap } from "@seed-design/css/recipes/menu";
import { Box } from "@seed-design/react";
import type { ReactNode } from "react";
import {
  MenuContent,
  MenuDivider,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuRoot,
} from "seed-design/ui/menu";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const MenuPreview = ({
  prefixIcon,
  description,
}: {
  prefixIcon?: ReactNode;
  description?: ReactNode;
}) => {
  return (
    <Box width="300px" p="x4">
      <style>{`
        .seed-menu__positioner {
          position: relative !important;
          inset: unset !important;
        }
        .seed-menu__content {
          animation: none !important;
        }
      `}</style>
      <MenuRoot open>
        <MenuContent>
          <MenuGroup>
            <MenuGroupHeader>작업</MenuGroupHeader>
            <MenuItem prefixIcon={prefixIcon} label="Action 1" description={description} />
            <MenuItem prefixIcon={prefixIcon} label="Action 2" />
            <MenuItem prefixIcon={prefixIcon} label="Action 3" disabled />
          </MenuGroup>
          <MenuDivider />
          <MenuGroup>
            <MenuItem tone="critical" prefixIcon={prefixIcon} label="삭제" />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </Box>
  );
};

const meta = {
  component: MenuPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof MenuPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  prefixIcon: {
    true: { prefixIcon: <IconPlusLine /> },
    false: { prefixIcon: undefined },
  },
  description: {
    true: { description: "항목에 대한 설명" },
    false: { description: undefined },
  },
};

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={menuVariantMap}
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
