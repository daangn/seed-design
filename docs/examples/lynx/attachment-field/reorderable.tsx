import type { AttachmentFileEntry, NativeFile } from "@seed-design/lynx-react";
import { VStack } from "@seed-design/lynx-react";
import { AttachmentField } from "@/components/ui/attachment-field";
import { AttachmentInputReorderable } from "@/components/ui/attachment-field-reorderable";

const PIXEL_SUNSET =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN4FcEDAAN+AU+hW/ICAAAAAElFTkSuQmCC";
const PIXEL_CITY =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGOYbPwKAAMNAbHKe2UaAAAAAElFTkSuQmCC";
const PIXEL_COFFEE =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN4tZkDAAQwAaYlKXDxAAAAAElFTkSuQmCC";
function createFixture(name: string, data: string): NativeFile {
  return {
    uri: `fixture://attachment-field/${name}`,
    name,
    type: "image/png",
    size: 1,
    previewUrl: `data:image/png;base64,${data}`,
  };
}
const DEFAULT_FILES: AttachmentFileEntry[] = [
  { id: "1", file: createFixture("sunset-landscape.png", PIXEL_SUNSET), status: "success" },
  { id: "2", file: createFixture("city-night.png", PIXEL_CITY), status: "success" },
  { id: "3", file: createFixture("morning-coffee.png", PIXEL_COFFEE), status: "success" },
];

export default function AttachmentFieldReorderable() {
  return (
    <VStack width="100%">
      <AttachmentField
        accept="image/*"
        maxFiles={5}
        label="이미지 업로드"
        description="길게 눌러 드래그하여 순서를 변경할 수 있습니다"
        defaultAcceptedFileEntries={DEFAULT_FILES}
      >
        <AttachmentInputReorderable />
      </AttachmentField>
    </VStack>
  );
}
