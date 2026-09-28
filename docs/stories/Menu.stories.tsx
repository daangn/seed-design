import preview from "../.storybook/preview";
import { withVisualTestParameters } from "@/stories/utils/parameters";
import {
  IconDiamondLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { menuVariantMap } from "@seed-design/css/recipes/menu";
import type { MenuVariantProps } from "@seed-design/css/recipes/menu";
import { useCallback, useRef, useState } from "react";
import { MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuRoot } from "seed-design/ui/menu";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { VISUAL_VIEWPORT_PARAMETERS } from "./utils/parameters";

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
          <MenuContent positionerContainer={containerRef}>
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

const meta = preview.meta({
  component: MenuPreview,
  decorators: [SeedThemeDecorator],
});
const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable Component={component!} variantMap={menuVariantMap} conditionMap={{}} {...args} />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({
  parameters: {
    ...VISUAL_VIEWPORT_PARAMETERS,
  },
});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
