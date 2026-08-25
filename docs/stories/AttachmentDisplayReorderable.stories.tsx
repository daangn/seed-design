import preview from "../.storybook/preview";
import { attachmentInputVariantMap } from "@seed-design/css/recipes/attachment-input";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { AttachmentDisplayReorderable } from "seed-design/ui/attachment-display-field-reorderable";
import { withVisualTestParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";

const sampleThumbnailColors: Record<string, string> = {
  a: "#577590",
  b: "#43aa8b",
  c: "#f9c74f",
  d: "#9b5de5",
  e: "#e76f51",
};

const sampleThumbnailUrl = (seed: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='${sampleThumbnailColors[seed] ?? "#adb5bd"}'/></svg>`,
  )}`;

interface AttachmentDisplayReorderableStoryProps
  extends Omit<React.ComponentProps<typeof AttachmentDisplayField>, "children"> {}

const AttachmentDisplayReorderableForStory = (props: AttachmentDisplayReorderableStoryProps) => (
  <AttachmentDisplayField maxEntries={5} {...props}>
    <AttachmentDisplayReorderable onTriggerClick={() => {}} onRetry={() => {}} />
  </AttachmentDisplayField>
);

const meta = preview.meta({
  component: AttachmentDisplayReorderableForStory,
  decorators: [SeedThemeDecorator],
});
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

const CommonStoryTemplate = meta.story({
  render: (args, { component }) => (
    <VariantTable
      Component={component!}
      variantMap={attachmentInputVariantMap}
      conditionMap={conditionMap}
      {...args}
    />
  ),
});

export const LightTheme = CommonStoryTemplate.extend({});

export const DarkTheme = CommonStoryTemplate.extend({
  parameters: withVisualTestParameters({ theme: "dark" }),
});
