import preview from "../.storybook/preview";
import { attachmentInputVariantMap } from "@seed-design/css/recipes/attachment-input";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { createStoryParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const sampleThumbnailColors: Record<string, string> = {
  pending: "#f4a261",
  uploading: "#2a9d8f",
  success: "#8ab17d",
  error: "#e76f51",
  a: "#577590",
  b: "#43aa8b",
  c: "#f9c74f",
};

const sampleThumbnailUrl = (seed: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='${sampleThumbnailColors[seed] ?? "#adb5bd"}'/></svg>`,
  )}`;

interface AttachmentDisplayStoryProps
  extends Omit<React.ComponentProps<typeof AttachmentDisplayField>, "children"> {}

const AttachmentDisplayForStory = (props: AttachmentDisplayStoryProps) => (
  <AttachmentDisplayField maxEntries={3} {...props}>
    <AttachmentDisplay onTriggerClick={() => {}} onRetry={() => {}} />
  </AttachmentDisplayField>
);

const meta = preview.meta({
  component: AttachmentDisplayForStory,
  decorators: [SeedThemeDecorator],
});
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

const CommonStoryTemplate = meta.story({
  args: {
    label: "Attachment Display Field",
    indicator: "필수",
    showRequiredIndicator: true,
    description: "최대 3장까지 첨부할 수 있어요.",
    errorMessage: "최소 1장은 첨부해야 해요.",
  },
  render: (args) => (
    <VariantTable
      Component={AttachmentDisplayForStory}
      variantMap={attachmentInputVariantMap}
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
