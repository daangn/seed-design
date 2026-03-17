import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";
import type { FileEntry } from "@seed-design/react/primitive";
import { fileUploadVariantMap } from "@seed-design/css/recipes/file-upload";

// 1x1 pixel PNG (valid image so ItemImage renders without broken icon)
function createMockImageFile(name: string): File {
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

interface FileUploadStoryProps
  extends Omit<React.ComponentProps<typeof FileUploadField>, "children"> {}

const FileUploadForStory = (props: FileUploadStoryProps) => (
  <FileUploadField maxFiles={3} {...props}>
    <FileUpload />
  </FileUploadField>
);

const meta = {
  component: FileUploadForStory,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof FileUploadForStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  accept: {
    "image/*": { accept: "image/*" },
    "*": { accept: undefined },
  },
  files: {
    "0": { defaultAcceptedFileEntries: [] },
    "1 pending": {
      defaultAcceptedFileEntries: [
        {
          id: "mock-1",
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          status: "pending",
        },
      ] satisfies FileEntry[],
    },
    "1 uploading": {
      defaultAcceptedFileEntries: [
        {
          id: "mock-1",
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          status: "uploading",
        },
      ] satisfies FileEntry[],
    },
    "1 success": {
      defaultAcceptedFileEntries: [
        {
          id: "mock-1",
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          status: "success",
        },
      ] satisfies FileEntry[],
    },
    "1 error": {
      defaultAcceptedFileEntries: [
        {
          id: "mock-1",
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          status: "error",
        },
      ] satisfies FileEntry[],
    },
    "3": {
      defaultAcceptedFileEntries: [
        {
          id: "mock-1",
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          status: "success",
        },
        { id: "mock-2", file: createMockImageFile("profile-picture-2024.png"), status: "success" },
        { id: "mock-3", file: createMockImageFile("team-meeting-notes.png"), status: "success" },
      ] satisfies FileEntry[],
    },
  },
  disabled: {
    false: { disabled: false },
    true: { disabled: true },
  },
};

const CommonStoryTemplate: Story = {
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={fileUploadVariantMap}
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

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStoryTemplate,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
