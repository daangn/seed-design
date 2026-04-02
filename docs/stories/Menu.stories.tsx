import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import {
  IconDiamondLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { menuVariantMap } from "@seed-design/css/recipes/menu";
import type { MenuVariantProps } from "@seed-design/css/recipes/menu";
import { useCallback, useRef, useState } from "react";
import {
  MenuContent,
  MenuDivider,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
} from "seed-design/ui/menu";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const MenuPreview = ({ size }: MenuVariantProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    setMounted(!!node);
  }, []);

  return (
    <div ref={setRef} style={{ width: 300, padding: 16, position: "relative" }}>
      <style>{`
        .seed-menu__positioner {
          position: relative !important;
          inset: unset !important;
        }
        .seed-menu__content {
          animation: none !important;
        }
      `}</style>
      {mounted && (
        <MenuRoot open size={size}>
          <MenuContent container={containerRef}>
            <MenuGroup>
              <MenuGroupLabel>작업</MenuGroupLabel>
              <MenuItem
                prefixIcon={<IconPlusLine />}
                label="Action 1 Action 1 Action 1 Action 1"
                description="Incididunt do nostrud amet mollit"
              />
              <MenuItem
                label="Action 2"
                description="Reprehenderit duis minim elit magna amet pariatur dolor deserunt"
                suffixIcon={<IconDiamondLine />}
              />
              <MenuItem prefixIcon={<IconPlusLine />} label="Action 3 Action 3 Action 3 Action 3" />
              <MenuItem label="Action 4" />
              <MenuItem
                prefixIcon={<IconPlusLine />}
                label="Action 5"
                description="asdf"
                disabled
              />
            </MenuGroup>
            <MenuDivider />
            <MenuGroup>
              <MenuItem
                tone="critical"
                prefixIcon={<IconTrashcanLine />}
                label="삭제"
                description="foobar"
              />
              <MenuItem tone="critical" label="삭제" suffixIcon={<IconDiamondLine />} />
            </MenuGroup>
          </MenuContent>
        </MenuRoot>
      )}
    </div>
  );
};

const meta = {
  component: MenuPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof MenuPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={menuVariantMap}
      conditionMap={{}}
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
