import "@seed-design/lynx-css/base.css";

import IconArrowClockwiseCircularFill from "@karrotmarket/lynx-monochrome-icon/IconArrowClockwiseCircularFill";
import IconXmarkFill from "@karrotmarket/lynx-monochrome-icon/IconXmarkFill";
import {
  AttachmentInput as SeedAttachmentInput,
  Icon,
  VStack,
  useSeedClassName,
} from "@seed-design/lynx-react";
import { ProgressCircle } from "@/components/ui/progress-circle";
import type {
  AttachmentFileEntry,
  AttachmentFileStatusDetails,
  NativeFile,
} from "@seed-design/lynx-react";
import { AttachmentField, AttachmentInput } from "@/components/ui/attachment-field";

const PICKED_FILE: NativeFile = {
  uri: "fixture://attachment-field/custom.png",
  name: "custom.png",
  type: "image/png",
  size: 8,
  previewUrl: "https://picsum.photos/seed/attachment-custom/200/200",
};

function CustomImageItem({
  fileEntry,
  isCover,
  onRetry,
}: {
  fileEntry: AttachmentFileEntry;
  isCover: boolean;
  onRetry?: () => void;
}) {
  return (
    <SeedAttachmentInput.Item fileEntry={fileEntry}>
      <SeedAttachmentInput.ItemSurface>
        <SeedAttachmentInput.ItemImage />
        {isCover ? <SeedAttachmentInput.ItemBadge>대표사진</SeedAttachmentInput.ItemBadge> : null}
        <SeedAttachmentInput.ItemBackdrop status="uploading">
          {(entry) => (
            <ProgressCircle
              size="24"
              tone="staticWhite"
              {...("progress" in entry ? { value: entry.progress } : {})}
            />
          )}
        </SeedAttachmentInput.ItemBackdrop>
        {onRetry ? (
          <SeedAttachmentInput.ItemBackdrop status="error">
            <SeedAttachmentInput.ItemActionButton bindtap={onRetry}>
              <Icon icon={<IconArrowClockwiseCircularFill />} />
              재시도
            </SeedAttachmentInput.ItemActionButton>
          </SeedAttachmentInput.ItemBackdrop>
        ) : null}
      </SeedAttachmentInput.ItemSurface>
      <SeedAttachmentInput.ItemRemoveButton accessibility-label="파일 제거">
        <Icon icon={<IconXmarkFill />} />
      </SeedAttachmentInput.ItemRemoveButton>
    </SeedAttachmentInput.Item>
  );
}

export default function AttachmentFieldCustomizingItems() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentField
          accept="image/*"
          maxFiles={10}
          label="이미지 업로드"
          description="첫 번째 이미지가 대표사진으로 설정됩니다"
          onSelectFiles={() => [PICKED_FILE]}
          onFileAccept={(entries, { updateFileEntryStatus }) => {
            for (const entry of entries) {
              updateFileEntryStatus(entry.id, { status: "uploading", progress: 0 });
              setTimeout(() => updateFileEntryStatus(entry.id, { status: "success" }), 500);
            }
          }}
        >
          <AttachmentInput>
            {({ acceptedFileEntries, updateFileEntryStatus }) =>
              acceptedFileEntries.map((fileEntry, index) => (
                <CustomImageItem
                  key={fileEntry.id}
                  fileEntry={fileEntry}
                  isCover={index === 0}
                  onRetry={() => {
                    updateFileEntryStatus(fileEntry.id, {
                      status: "uploading",
                      progress: 0,
                    } satisfies AttachmentFileStatusDetails);
                    setTimeout(
                      () => updateFileEntryStatus(fileEntry.id, { status: "success" }),
                      500,
                    );
                  }}
                />
              ))
            }
          </AttachmentInput>
        </AttachmentField>
      </VStack>
    </view>
  );
}
