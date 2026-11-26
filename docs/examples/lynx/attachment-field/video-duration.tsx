import IconXmarkFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkFill";
import { AttachmentInput as SeedAttachmentInput, Icon, VStack } from "@seed-design/lynx-react";
import type { AttachmentFileEntry, NativeFile } from "@seed-design/lynx-react";
import {
  AttachmentField,
  AttachmentInput,
  AttachmentInputItemDurationBadge,
} from "@/components/ui/attachment-field";

// 문서 고정 fixture입니다. 호스트 파일 선택 adapter가 동영상의 썸네일(`previewUrl`)과 재생시간(초)을 함께 준다고 가정합니다.
const PICKED_FILES: { file: NativeFile; seconds?: number }[] = [
  {
    file: {
      uri: "fixture://attachment-field/photo.png",
      name: "photo.png",
      type: "image/png",
      size: 8,
      previewUrl: "https://picsum.photos/seed/duration-photo/200/200",
    },
  },
  {
    file: {
      uri: "fixture://attachment-field/clip.mp4",
      name: "clip.mp4",
      type: "video/mp4",
      size: 16,
      previewUrl: "https://picsum.photos/seed/duration-clip/200/200",
    },
    seconds: 125,
  },
  {
    file: {
      uri: "fixture://attachment-field/long.mp4",
      name: "long.mp4",
      type: "video/mp4",
      size: 32,
      previewUrl: "https://picsum.photos/seed/duration-long/200/200",
    },
    seconds: 3725,
  },
];

const DEFAULT_FILE_ENTRIES: AttachmentFileEntry[] = PICKED_FILES.map(({ file }) => ({
  id: file.uri,
  file,
  status: "success",
}));

const VIDEO_SECONDS = new Map(
  PICKED_FILES.flatMap(({ file, seconds }) =>
    seconds === undefined ? [] : [[file.uri, seconds] as const],
  ),
);

function MediaItem({ fileEntry }: { fileEntry: AttachmentFileEntry }) {
  const seconds = VIDEO_SECONDS.get(fileEntry.file.uri);

  return (
    // `accept`에 `video/*`가 섞이면 파일 레이아웃이 되므로 이미지 레이아웃을 직접 지정합니다.
    <SeedAttachmentInput.Item fileEntry={fileEntry} type="image">
      <SeedAttachmentInput.ItemSurface>
        <SeedAttachmentInput.ItemImage />
        {seconds === undefined ? null : <AttachmentInputItemDurationBadge seconds={seconds} />}
      </SeedAttachmentInput.ItemSurface>
      <SeedAttachmentInput.ItemRemoveButton accessibility-label="파일 제거">
        <Icon icon={<IconXmarkFill />} />
      </SeedAttachmentInput.ItemRemoveButton>
    </SeedAttachmentInput.Item>
  );
}

export default function AttachmentFieldVideoDuration() {
  return (
    <VStack gap="x4" width="100%">
      <AttachmentField
        accept="image/*,video/*"
        maxFiles={10}
        label="사진·동영상 업로드"
        description="동영상에는 재생시간이 표시됩니다"
        defaultAcceptedFileEntries={DEFAULT_FILE_ENTRIES}
        onSelectFiles={() => PICKED_FILES.map(({ file }) => file)}
      >
        <AttachmentInput>
          {({ acceptedFileEntries }) =>
            acceptedFileEntries.map((fileEntry) => (
              <MediaItem key={fileEntry.id} fileEntry={fileEntry} />
            ))
          }
        </AttachmentInput>
      </AttachmentField>
    </VStack>
  );
}
