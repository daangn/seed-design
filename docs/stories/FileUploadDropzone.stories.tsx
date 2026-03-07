import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { FileUploadDropzone } from "seed-design/ui/file-upload-dropzone";
import type { FileWithStatus } from "@seed-design/react/primitive";

// 1x1 pixel PNG (valid image so ItemImage renders without broken icon)
function createMockImageFile(name: string): File {
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

interface FileUploadStoryProps
  extends Omit<React.ComponentProps<typeof FileUploadDropzone>, "children"> {}

const FileUploadForStory = (props: FileUploadStoryProps) => (
  <FileUploadDropzone maxFiles={3} {...props} />
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
    "0": { defaultAcceptedFiles: [] },
    "1 pending": {
      defaultAcceptedFiles: [
        {
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          details: { status: "pending" },
        },
      ] satisfies FileWithStatus[],
    },
    "1 uploading": {
      defaultAcceptedFiles: [
        {
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          details: { status: "uploading" },
        },
      ] satisfies FileWithStatus[],
    },
    "1 success": {
      defaultAcceptedFiles: [
        {
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          details: { status: "success" },
        },
      ] satisfies FileWithStatus[],
    },
    "1 error": {
      defaultAcceptedFiles: [
        {
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          details: { status: "error" },
        },
      ] satisfies FileWithStatus[],
    },
    "3": {
      defaultAcceptedFiles: [
        {
          file: createMockImageFile("summer-vacation-photo-of-the-year.png"),
          details: { status: "success" },
        },
        { file: createMockImageFile("profile-picture-2024.png"), details: { status: "success" } },
        { file: createMockImageFile("team-meeting-notes.png"), details: { status: "success" } },
      ] satisfies FileWithStatus[],
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
      variantMap={{}}
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
