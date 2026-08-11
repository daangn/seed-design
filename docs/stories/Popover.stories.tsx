import preview from "../.storybook/preview";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import { Icon, Popover } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { withChromaticParameters } from "@/stories/utils/parameters";
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

const meta = preview.meta({
  component: PopoverPreview,
  decorators: [SeedThemeDecorator],
});

const CommonStoryTemplate = meta.story({});

export const LightTheme = CommonStoryTemplate.extend({
  parameters: {
    chromatic: { modes: VIEWPORT_MODES },
  },
});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = CommonStoryTemplate.extend({
  parameters: withChromaticParameters({ fontScale: "Extra Extra Extra Large" }),
});
