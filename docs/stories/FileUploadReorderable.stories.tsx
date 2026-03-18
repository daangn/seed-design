import type { Meta, StoryObj } from "@storybook/nextjs";

import { createStoryWithParameters } from "@/stories/utils/parameters";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { FileUploadField } from "seed-design/ui/file-upload";
import { ReorderableFileUpload } from "seed-design/ui/file-upload-reorderable";
import type { FileEntry } from "@seed-design/react/primitive";
import { fileUploadVariantMap } from "@seed-design/css/recipes/file-upload";

function createMockImageFile(name: string): File {
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4n+wOAAQOAaoOR2bDAAAAAElFTkSuQmCC";
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

interface FileUploadReorderableStoryProps
  extends Omit<React.ComponentProps<typeof FileUploadField>, "children"> {}

const FileUploadReorderableForStory = (props: FileUploadReorderableStoryProps) => (
  <FileUploadField maxFiles={5} {...props}>
    <ReorderableFileUpload />
  </FileUploadField>
);

const meta = {
  component: FileUploadReorderableForStory,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof FileUploadReorderableForStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const conditionMap = {
  accept: {
    "image/*": { accept: "image/*" },
    "*": { accept: undefined },
  },
  files: {
    "0": { defaultAcceptedFileEntries: [] },
    "3": {
      defaultAcceptedFileEntries: [
        {
          id: "mock-1",
          file: createMockImageFile("summer-vacation-photo.png"),
          status: "success",
        },
        { id: "mock-2", file: createMockImageFile("profile-picture.png"), status: "success" },
        { id: "mock-3", file: createMockImageFile("team-meeting-notes.png"), status: "success" },
      ] satisfies FileEntry[],
    },
    "5": {
      defaultAcceptedFileEntries: [
        { id: "mock-1", file: createMockImageFile("photo-1.png"), status: "success" },
        { id: "mock-2", file: createMockImageFile("photo-2.png"), status: "success" },
        { id: "mock-3", file: createMockImageFile("photo-3.png"), status: "pending" },
        { id: "mock-4", file: createMockImageFile("photo-4.png"), status: "uploading" },
        { id: "mock-5", file: createMockImageFile("photo-5.png"), status: "error" },
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
