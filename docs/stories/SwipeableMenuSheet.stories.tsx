import preview from "../.storybook/preview";
import { createStoryParameters } from "@/stories/utils/parameters";
import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { menuSheetVariantMap } from "@seed-design/css/recipes/menu-sheet";
import { Box } from "@seed-design/react";
import {
  SwipeableMenuSheetContent,
  SwipeableMenuSheetGroup,
  SwipeableMenuSheetItem,
  SwipeableMenuSheetRoot,
} from "seed-design/ui/swipeable-menu-sheet";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import type { ReactNode } from "react";

const SwipeableMenuSheetPreview = ({
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
      <SwipeableMenuSheetRoot open>
        <SwipeableMenuSheetContent
          title={title}
          description={description}
          labelAlign={prefixIcon ? "left" : "center"}
        >
          <SwipeableMenuSheetGroup>
            <SwipeableMenuSheetItem prefixIcon={prefixIcon} label="Action 1" />
            <SwipeableMenuSheetItem
              prefixIcon={prefixIcon}
              label="Action 2"
              description="항목에 대한 설명"
            />
            <SwipeableMenuSheetItem prefixIcon={prefixIcon} label="Action 3" />
          </SwipeableMenuSheetGroup>
          <SwipeableMenuSheetGroup>
            <SwipeableMenuSheetItem prefixIcon={prefixIcon} label="Action 4" />
            <SwipeableMenuSheetItem tone="critical" prefixIcon={prefixIcon} label="Action 5" />
          </SwipeableMenuSheetGroup>
        </SwipeableMenuSheetContent>
      </SwipeableMenuSheetRoot>
    </Box>
  );
};

const meta = preview.meta({
  component: SwipeableMenuSheetPreview,
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
  render: (args) => (
    <VariantTable
      Component={SwipeableMenuSheetPreview}
      variantMap={restVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: createStoryParameters({ fontScale: "Extra Extra Extra Large" }),
});
