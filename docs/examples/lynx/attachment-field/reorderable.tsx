import "@seed-design/lynx-css/base.css";

import IconXmarkFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkFill";
import type { AttachmentFileEntry, NativeFile } from "@seed-design/lynx-react";
import {
  AttachmentInput as SeedAttachmentInput,
  Icon,
  VStack,
  useSeedClassName,
} from "@seed-design/lynx-react";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { AttachmentField } from "@/components/ui/attachment-field";
import {
  AttachmentInputReorderable,
  SortableAttachmentInputItem,
} from "@/components/ui/attachment-field-reorderable";

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

function SortableImageItem({
  fileEntry,
  index,
  isCover,
}: {
  fileEntry: AttachmentFileEntry;
  index: number;
  isCover: boolean;
}) {
  return (
    <SortableAttachmentInputItem fileEntry={fileEntry} index={index}>
      {(dragging) => (
        <SeedAttachmentInput.Item fileEntry={fileEntry} dragging={dragging}>
          <SeedAttachmentInput.ItemSurface>
            <SeedAttachmentInput.ItemImage />
            {isCover ? (
              <SeedAttachmentInput.ItemBadge>대표사진</SeedAttachmentInput.ItemBadge>
            ) : null}
            <SeedAttachmentInput.ItemBackdrop status="uploading">
              {(entry) => (
                <ProgressCircle
                  size="24"
                  tone="staticWhite"
                  {...("progress" in entry ? { value: entry.progress } : {})}
                />
              )}
            </SeedAttachmentInput.ItemBackdrop>
          </SeedAttachmentInput.ItemSurface>
          <SeedAttachmentInput.ItemRemoveButton accessibility-label="파일 제거">
            <Icon icon={<IconXmarkFill />} />
          </SeedAttachmentInput.ItemRemoveButton>
        </SeedAttachmentInput.Item>
      )}
    </SortableAttachmentInputItem>
  );
}

export default function AttachmentFieldReorderable() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={seedClassName}>
      <VStack p="x6" width="100%">
        <AttachmentField
          accept="image/*"
          maxFiles={5}
          label="이미지 업로드"
          description="길게 눌러 드래그하여 순서를 변경할 수 있습니다"
          defaultAcceptedFileEntries={DEFAULT_FILES}
        >
          <AttachmentInputReorderable>
            {({ acceptedFileEntries }) =>
              acceptedFileEntries.map((fileEntry, index) => (
                <SortableImageItem
                  key={fileEntry.id}
                  fileEntry={fileEntry}
                  index={index}
                  isCover={index === 0}
                />
              ))
            }
          </AttachmentInputReorderable>
        </AttachmentField>
      </VStack>
    </view>
  );
}
