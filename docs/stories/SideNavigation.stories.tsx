import preview from "../.storybook/preview";
import {
  IconBarchartBoardFill,
  IconBellFill,
  IconDocumentFill,
  IconGearFill,
  IconHouseFill,
  IconMegaphoneFill,
} from "@karrotmarket/react-monochrome-icon";
import { sideNavigationVariantMap } from "@seed-design/css/recipes/side-navigation";
import { Box } from "@seed-design/react";
import {
  SideNavigationContent,
  SideNavigationFooter,
  SideNavigationGroup,
  SideNavigationHeader,
  SideNavigationItemButton,
  SideNavigationProvider,
  SideNavigationRoot,
  SideNavigationTrigger,
} from "seed-design/ui/side-navigation";

import { createStoryParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const SideNavigationPreview = ({
  tone,
  collapsed,
}: {
  tone?: "neutral" | "transparent";
  collapsed?: boolean;
}) => (
  <Box height="480px" bg="bg.layerDefault">
    <SideNavigationProvider collapsed={collapsed}>
      <SideNavigationRoot tone={tone}>
        <SideNavigationHeader>
          <SideNavigationTrigger />
        </SideNavigationHeader>

        <SideNavigationContent>
          <SideNavigationGroup
            items={[
              { label: "홈", prefixIcon: <IconHouseFill />, current: true },
              { label: "대시보드", prefixIcon: <IconBarchartBoardFill /> },
              { label: "알림", prefixIcon: <IconBellFill /> },
            ]}
          />

          <SideNavigationGroup
            label="콘텐츠"
            items={[
              { label: "게시글", prefixIcon: <IconDocumentFill /> },
              {
                label: "공지",
                prefixIcon: <IconMegaphoneFill />,
                defaultOpen: true,
                items: [{ label: "전체 공지" }, { label: "긴급 공지" }],
              },
            ]}
          />
        </SideNavigationContent>

        <SideNavigationFooter>
          <SideNavigationItemButton prefixIcon={<IconGearFill />} label="환경설정" />
        </SideNavigationFooter>
      </SideNavigationRoot>
    </SideNavigationProvider>
  </Box>
);

const meta = preview.meta({
  component: SideNavigationPreview,
  decorators: [SeedThemeDecorator],
});
const conditionMap = {
  collapsed: {
    expanded: { collapsed: false },
    collapsed: { collapsed: true },
  },
};

const CommonStoryTemplate = meta.story({
  render: (args) => (
    <VariantTable
      Component={SideNavigationPreview}
      variantMap={sideNavigationVariantMap}
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
