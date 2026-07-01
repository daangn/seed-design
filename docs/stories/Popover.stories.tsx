import type { Meta, StoryObj } from "@storybook/nextjs";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import { Icon, Popover } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VIEWPORT_MODES } from "./utils/parameters";

// Render the popover open and inline: the positioner is normally fixed/absolute via
// floating-ui, so force it back into flow and drop the enter animation for a stable snapshot.
const PopoverPreview = () => {
  return (
    <div style={{ padding: 16, position: "relative" }}>
      <style>{`
        .seed-popover__positioner {
          position: relative !important;
          inset: unset !important;
          transform: none !important;
        }
        .seed-popover__content {
          animation: none !important;
        }
      `}</style>
      <Popover.Root open>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Header>
              <Popover.Title>제목</Popover.Title>
              <Popover.Description>설명을 작성할 수 있어요</Popover.Description>
              <Popover.CloseButton aria-label="닫기">
                <Icon svg={<IconXmarkLine />} />
              </Popover.CloseButton>
            </Popover.Header>
            <Popover.Body>
              Popover 본문에는 사용자가 확인해야 할 내용이나 추가 액션을 배치할 수 있습니다.
            </Popover.Body>
            <Popover.Footer>
              <ActionButton variant="neutralSolid">확인</ActionButton>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    </div>
  );
};

const meta = {
  component: PopoverPreview,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof PopoverPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStoryTemplate: Story = {
  render: () => <PopoverPreview />,
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
