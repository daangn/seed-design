import type { Meta, StoryObj } from "@storybook/nextjs";
import { AttachmentInput } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";

// 1x1 pixel PNG (valid image so ItemImage renders without broken icon)
function createMockImageFile(name: string): File {
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4n+wOAAQOAaoOR2bDAAAAAElFTkSuQmCC";
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

const BADGE_LABEL_BY_ID: Record<string, string> = {
  "mock-short": "대표사진",
  "mock-long": "대표사진으로 설정됨",
};

const mockFileEntries: FileEntry[] = [
  { id: "mock-short", file: createMockImageFile("cover.png"), status: "success" },
  { id: "mock-long", file: createMockImageFile("cover-long-label.png"), status: "success" },
];

// Focused on the badge slot's font scaling and ellipsis only.
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
                <AttachmentInput.ItemBadge>
                  {BADGE_LABEL_BY_ID[fileEntry.id]}
                </AttachmentInput.ItemBadge>
              </AttachmentInput.Item>
            ))
          }
        </AttachmentInput.Context>
      </AttachmentInput.ItemGroup>
    </AttachmentInput.Container>
  </AttachmentInput.Root>
);

const meta = {
  component: AttachmentInputItemBadgeForStory,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof AttachmentInputItemBadgeForStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {};

export const LightTheme = Template;

export const DarkTheme = createStoryWithParameters({
  ...Template,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...Template,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...Template,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
