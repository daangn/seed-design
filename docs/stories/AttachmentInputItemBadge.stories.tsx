import preview from "../.storybook/preview";
import { AttachmentInput, Icon, type AttachmentInputFileEntry } from "@seed-design/react";
import { IconXmarkFill } from "@karrotmarket/react-monochrome-icon";

import { withVisualTestParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";

// A checkerboard, not a flat color: the badge's backdrop blur leaves a flat backdrop unchanged and vanishes from snapshots.
function createMockImageFile(name: string): File {
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAbElEQVR42u3XMQ0AIAxFQRwgASlIQgqSwUCZukC4hLEDN738skYNX+szfLfdFwAAAACAFOCVj57uAQAAAAByACUGAAAAsAeUGAAAAMAeUGIAAAAAe0CJAQAAAOwBJQYAAACwB5QYAAAA4BvABn7HUR7MRpyqAAAAAElFTkSuQmCC";
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

const BADGE_LABEL_BY_ID: Record<string, string> = {
  "mock-short": "대표사진",
  "mock-long": "대표사진으로 설정됨",
};

const DURATION_BY_ID: Record<string, string> = {
  "mock-short": "0:05",
  "mock-long": "10:02:05",
};

const mockFileEntries: AttachmentInputFileEntry[] = [
  { id: "mock-short", file: createMockImageFile("cover.png"), status: "success" },
  { id: "mock-long", file: createMockImageFile("cover-long-label.png"), status: "success" },
];

// Focused on the badge slots' font scaling and ellipsis only.
// `type=image` variant is activated via `accept="image/*"`, which is the only
// condition under which the badge slot receives styles.
const AttachmentInputItemBadgeForStory = () => (
  <AttachmentInput.Root accept="image/*" defaultAcceptedFileEntries={mockFileEntries}>
    <AttachmentInput.Container>
      <AttachmentInput.ItemGroup>
        <AttachmentInput.Context>
          {({ acceptedFileEntries }) =>
            acceptedFileEntries.map((fileEntry) => (
              <AttachmentInput.Item key={fileEntry.id} fileEntry={fileEntry}>
                <AttachmentInput.ItemImage />
                <AttachmentInput.ItemDurationBadge>
                  {DURATION_BY_ID[fileEntry.id]}
                </AttachmentInput.ItemDurationBadge>
                <AttachmentInput.ItemBadge>
                  {BADGE_LABEL_BY_ID[fileEntry.id]}
                </AttachmentInput.ItemBadge>
                <AttachmentInput.ItemRemoveButton aria-label="파일 제거">
                  <Icon svg={<IconXmarkFill />} />
                </AttachmentInput.ItemRemoveButton>
              </AttachmentInput.Item>
            ))
          }
        </AttachmentInput.Context>
      </AttachmentInput.ItemGroup>
    </AttachmentInput.Container>
  </AttachmentInput.Root>
);

const meta = preview.meta({
  component: AttachmentInputItemBadgeForStory,
  decorators: [SeedThemeDecorator],
});
const Template = meta.story({});

export const LightTheme = Template.extend({});

export const DarkTheme = Template.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});

export const FontScalingExtraSmall = Template.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Small" }),
});

export const FontScalingExtraExtraExtraLarge = Template.extend({
  parameters: withVisualTestParameters({ fontScale: "Extra Extra Extra Large" }),
});
