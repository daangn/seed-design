"use client";

import { IconXmarkFill } from "@karrotmarket/react-monochrome-icon";
import {
  AttachmentInput as SeedAttachmentInput,
  Icon,
  VStack,
  type AttachmentInputFileEntry,
} from "@seed-design/react";
import { useEffect, useState } from "react";
import {
  AttachmentField,
  AttachmentInput,
  AttachmentInputItemDurationBadge,
} from "seed-design/ui/attachment-field";

const LABEL_REMOVE_FILE = "파일 제거";

interface VideoPreview {
  thumbnailUrl: string;
  seconds: number;
}

const waitFor = (target: HTMLVideoElement, eventName: "loadeddata" | "seeked") =>
  new Promise<void>((resolve, reject) => {
    target.addEventListener(eventName, () => resolve(), { once: true });
    target.addEventListener("error", () => reject(target.error), { once: true });
  });

async function createVideoPreview(file: File): Promise<VideoPreview> {
  const videoUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = videoUrl;

  try {
    await waitFor(video, "loadeddata");

    // 일부 브라우저는 seek 전까지 첫 프레임을 그리지 않는다.
    video.currentTime = Math.min(0.1, video.duration / 2);
    await waitFor(video, "seeked");

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.8),
    );
    if (!blob) throw new Error(`Failed to draw a thumbnail for ${file.name}`);

    return { thumbnailUrl: URL.createObjectURL(blob), seconds: video.duration };
  } finally {
    URL.revokeObjectURL(videoUrl);
  }
}

function useVideoPreview(file: File) {
  const [preview, setPreview] = useState<VideoPreview>();

  useEffect(() => {
    if (!file.type.startsWith("video/")) return;

    let cancelled = false;
    let thumbnailUrl: string | undefined;

    createVideoPreview(file).then((next) => {
      thumbnailUrl = next.thumbnailUrl;
      if (cancelled) URL.revokeObjectURL(next.thumbnailUrl);
      else setPreview(next);
    }, console.error);

    return () => {
      cancelled = true;
      if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
      setPreview(undefined);
    };
  }, [file]);

  return preview;
}

function MediaItem({ fileEntry }: { fileEntry: AttachmentInputFileEntry }) {
  const isVideo = fileEntry.file.type.startsWith("video/");
  const videoPreview = useVideoPreview(fileEntry.file);

  return (
    // `accept`에 `video/*`가 섞이면 파일 레이아웃이 되므로 이미지 레이아웃을 직접 지정한다.
    <SeedAttachmentInput.Item fileEntry={fileEntry} type="image">
      {/* 사진은 SEED가 만든 미리보기를 쓰고, 동영상은 썸네일이 준비된 뒤 `src`로 넘긴다. */}
      {!isVideo && <SeedAttachmentInput.ItemImage />}
      {videoPreview && (
        <>
          <SeedAttachmentInput.ItemImage src={videoPreview.thumbnailUrl} />
          <AttachmentInputItemDurationBadge seconds={videoPreview.seconds} />
        </>
      )}
      <SeedAttachmentInput.ItemRemoveButton aria-label={LABEL_REMOVE_FILE}>
        <Icon svg={<IconXmarkFill />} />
      </SeedAttachmentInput.ItemRemoveButton>
    </SeedAttachmentInput.Item>
  );
}

export default function AttachmentFieldVideoDuration() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        accept="image/*,video/*"
        maxFiles={10}
        label="사진·동영상 업로드"
        description="동영상에는 재생시간이 표시됩니다"
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
