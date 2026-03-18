import type { FileEntry } from "@seed-design/react/primitive";
import { FileUploadField } from "seed-design/ui/file-upload";
import { ReorderableFileUpload } from "seed-design/ui/file-upload-reorderable";

function createMockImageFile(name: string, base64: string): File {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

const defaultAcceptedFileEntries: FileEntry[] = [
  {
    id: "1",
    file: createMockImageFile(
      "sunset-landscape.png",
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN4FcEDAAN+AU+hW/ICAAAAAElFTkSuQmCC",
    ),
    status: "success",
  },
  {
    id: "2",
    file: createMockImageFile(
      "city-night.png",
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGOYbPwKAAMNAbHKe2UaAAAAAElFTkSuQmCC",
    ),
    status: "success",
  },
  {
    id: "3",
    file: createMockImageFile(
      "morning-coffee.png",
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN4tZkDAAQwAaYlKXDxAAAAAElFTkSuQmCC",
    ),
    status: "success",
  },
];

export default function FileUploadReorderableExample() {
  return (
    <FileUploadField
      accept="image/*"
      maxFiles={5}
      label="이미지 업로드"
      description="드래그하여 순서를 변경할 수 있습니다"
      defaultAcceptedFileEntries={defaultAcceptedFileEntries}
    >
      <ReorderableFileUpload />
    </FileUploadField>
  );
}
