import preview from "../.storybook/preview";
import { withChromaticParameters } from "@/stories/utils/parameters";
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { menuSheetVariantMap } from "@seed-design/css/recipes/menu-sheet";
import { Box } from "@seed-design/react";
import {
  MenuSheetRoot,
  MenuSheetContent,
  MenuSheetGroup,
  MenuSheetItem,
} from "seed-design/ui/menu-sheet";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import type { ReactNode } from "react";

const MenuSheetPreview = ({
  title,
  description,
  prefixIcon,
}: {
  title?: ReactNode;
  description?: ReactNode;
  prefixIcon?: ReactNode;
}) => {
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
        <MenuSheetContent
          title={title}
          description={description}
          labelAlign={prefixIcon ? "left" : "center"}
        >
          <MenuSheetGroup>
            <MenuSheetItem prefixIcon={prefixIcon} label="Action 1" />
            <MenuSheetItem
              prefixIcon={prefixIcon}
              label="Action 2"
              description="항목에 대한 설명"
            />
            <MenuSheetItem prefixIcon={prefixIcon} label="Action 3" />
          </MenuSheetGroup>
          <MenuSheetGroup>
            <MenuSheetItem prefixIcon={prefixIcon} label="Action 4" />
            <MenuSheetItem tone="critical" prefixIcon={prefixIcon} label="Action 5" />
          </MenuSheetGroup>
        </MenuSheetContent>
      </MenuSheetRoot>
    </Box>
  );
};

const meta = preview.meta({
  component: MenuSheetPreview,
  decorators: [SeedThemeDecorator],
});
const { skipAnimation: _skipAnimation, ...restVariantMap } = menuSheetVariantMap;

const conditionMap = {
  title: {
    true: {
      title:
        "이것은 매우 긴 제목 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있으며, 텍스트가 어떻게 줄바꿈되는지 확인합니다.",
    },
    false: { title: undefined },
  },
  description: {
    true: {
      description: "부가적인 설명이 여기에 표시됩니다.",
    },
    false: { description: undefined },
  },
  labelAlign: {
    left: { prefixIcon: <IconEyeSlashLine /> },
    center: { prefixIcon: undefined },
  },
};

const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={restVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});
