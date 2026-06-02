import type { Meta, StoryObj } from "@storybook/nextjs";

import { attachmentInputVariantMap } from "@seed-design/css/recipes/attachment-input";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { AttachmentDisplayReorderable } from "seed-design/ui/attachment-display-field-reorderable";
import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const sampleThumbnailUrl = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`;

interface AttachmentDisplayReorderableStoryProps
  extends Omit<React.ComponentProps<typeof AttachmentDisplayField>, "children"> {}

const AttachmentDisplayReorderableForStory = (props: AttachmentDisplayReorderableStoryProps) => (
  <AttachmentDisplayField maxEntries={5} {...props}>
    <AttachmentDisplayReorderable onTriggerClick={() => {}} onRetry={() => {}} />
  </AttachmentDisplayField>
);

const meta = {
  component: AttachmentDisplayReorderableForStory,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof AttachmentDisplayReorderableForStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  entries: {
    "0": { defaultEntries: [] },
    "3": {
      defaultEntries: [
        { id: "mock-1", thumbnailUrl: sampleThumbnailUrl("a"), status: "success" },
        { id: "mock-2", thumbnailUrl: sampleThumbnailUrl("b"), status: "success" },
        { id: "mock-3", thumbnailUrl: sampleThumbnailUrl("c"), status: "success" },
      ] satisfies DisplayItemEntry[],
    },
    "5": {
      defaultEntries: [
        { id: "mock-1", thumbnailUrl: sampleThumbnailUrl("a"), status: "success" },
        { id: "mock-2", thumbnailUrl: sampleThumbnailUrl("b"), status: "success" },
        { id: "mock-3", thumbnailUrl: sampleThumbnailUrl("c"), status: "pending" },
        {
          id: "mock-4",
          thumbnailUrl: sampleThumbnailUrl("d"),
          status: "uploading",
          progress: 50,
        },
        { id: "mock-5", thumbnailUrl: sampleThumbnailUrl("e"), status: "error" },
      ] satisfies DisplayItemEntry[],
    },
  },
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
  readOnly: {
    false: { readOnly: false },
    true: { readOnly: true },
  },
};

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={attachmentInputVariantMap}
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
