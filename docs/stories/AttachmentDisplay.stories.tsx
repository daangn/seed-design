import type { Meta, StoryObj } from "@storybook/nextjs";

import { attachmentInputVariantMap } from "@seed-design/css/recipes/attachment-input";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { createStoryWithParameters, VIEWPORT_MODES } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const sampleThumbnailUrl = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`;

interface AttachmentDisplayStoryProps
  extends Omit<React.ComponentProps<typeof AttachmentDisplayField>, "children"> {}

const AttachmentDisplayForStory = (props: AttachmentDisplayStoryProps) => (
  <AttachmentDisplayField maxEntries={3} {...props}>
    <AttachmentDisplay onTriggerClick={() => {}} onRetry={() => {}} />
  </AttachmentDisplayField>
);

const meta = {
  component: AttachmentDisplayForStory,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof AttachmentDisplayForStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  entries: {
    "0": { defaultEntries: [] },
    "1 pending": {
      defaultEntries: [
        { id: "mock-1", thumbnailUrl: sampleThumbnailUrl("pending"), status: "pending" },
      ] satisfies DisplayItemEntry[],
    },
    "1 uploading": {
      defaultEntries: [
        {
          id: "mock-1",
          thumbnailUrl: sampleThumbnailUrl("uploading"),
          status: "uploading",
          progress: 60,
        },
      ] satisfies DisplayItemEntry[],
    },
    "1 success": {
      defaultEntries: [
        { id: "mock-1", thumbnailUrl: sampleThumbnailUrl("success"), status: "success" },
      ] satisfies DisplayItemEntry[],
    },
    "1 error": {
      defaultEntries: [
        { id: "mock-1", thumbnailUrl: sampleThumbnailUrl("error"), status: "error" },
      ] satisfies DisplayItemEntry[],
    },
    "3": {
      defaultEntries: [
        { id: "mock-1", thumbnailUrl: sampleThumbnailUrl("a"), status: "success" },
        { id: "mock-2", thumbnailUrl: sampleThumbnailUrl("b"), status: "success" },
        { id: "mock-3", thumbnailUrl: sampleThumbnailUrl("c"), status: "success" },
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
  invalid: {
    false: { invalid: false },
    true: { invalid: true },
  },
};

const CommonStoryTemplate: Story = {
  args: {
    label: "Attachment Display Field",
    indicator: "필수",
    showRequiredIndicator: true,
    description: "최대 3장까지 첨부할 수 있어요.",
    errorMessage: "최소 1장은 첨부해야 해요.",
  },
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={attachmentInputVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
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
