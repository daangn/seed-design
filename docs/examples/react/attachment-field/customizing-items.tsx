"use client";

import { AttachmentInput as SeedAttachmentInput, Icon, VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { IconArrowClockwiseCircularFill, IconXmarkFill } from "@karrotmarket/react-monochrome-icon";

import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";
import { ProgressCircle } from "seed-design/ui/progress-circle";

const LABEL_REMOVE_FILE = "파일 제거";
const LABEL_RETRY = "재시도";

function CustomImageItem({
  fileEntry,
  isCover,
  onRetry,
}: {
  fileEntry: FileEntry;
  isCover?: boolean;
  onRetry?: () => void;
}) {
  return (
    <SeedAttachmentInput.Item fileEntry={fileEntry}>
      <SeedAttachmentInput.ItemImage />
      {isCover && <SeedAttachmentInput.ItemBadge>대표사진</SeedAttachmentInput.ItemBadge>}
      <SeedAttachmentInput.ItemBackdrop status="uploading">
        {(entry) => (
          <ProgressCircle
            size="24"
            tone="staticWhite"
            {...("progress" in entry && { value: entry.progress })}
          />
        )}
      </SeedAttachmentInput.ItemBackdrop>
      {onRetry && (
        <SeedAttachmentInput.ItemBackdrop status="error">
          <SeedAttachmentInput.ItemActionButton onClick={onRetry}>
            <Icon svg={<IconArrowClockwiseCircularFill />} />
            {LABEL_RETRY}
          </SeedAttachmentInput.ItemActionButton>
        </SeedAttachmentInput.ItemBackdrop>
      )}
      <SeedAttachmentInput.ItemRemoveButton aria-label={LABEL_REMOVE_FILE}>
        <Icon svg={<IconXmarkFill />} />
      </SeedAttachmentInput.ItemRemoveButton>
    </SeedAttachmentInput.Item>
  );
}

export default function AttachmentFieldCustomizingItems() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        accept="image/*"
        maxFiles={10}
        label="이미지 업로드"
        description="첫 번째 이미지가 대표사진으로 설정됩니다"
      >
        <AttachmentInput>
          {({ acceptedFileEntries }) =>
            acceptedFileEntries.map((fileEntry, index) => (
              <CustomImageItem
                key={fileEntry.id}
                fileEntry={fileEntry}
                {...(index === 0 && { isCover: true })}
              />
            ))
          }
        </AttachmentInput>
      </AttachmentField>
    </VStack>
  );
}
