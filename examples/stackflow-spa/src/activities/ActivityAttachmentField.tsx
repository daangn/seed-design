import { useCallback } from "react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import {
  AttachmentField,
  AttachmentInput,
  AttachmentDropzone,
} from "seed-design/ui/attachment-field";
import {
  AttachmentInputReorderable,
  AttachmentDropzoneReorderable,
} from "seed-design/ui/attachment-field-reorderable";
import { Divider, VStack } from "@seed-design/react";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import type { FileEntry, FileStatusDetails } from "@seed-design/react/primitive";
import { vars } from "@seed-design/css/vars";

declare module "@stackflow/config" {
  interface Register {
    ActivityAttachmentField: {};
  }
}

async function uploadFile(
  file: File,
  onProgress: (progress: number) => void,
): Promise<{ url: string }> {
  const totalChunks = 5;
  for (let i = 1; i <= totalChunks; i++) {
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
    onProgress(Math.round((i / totalChunks) * 100));
  }

  if (Math.random() > 0.5) {
    throw new Error("Network error");
  }

  return { url: `https://example.com/uploads/${file.name}` };
}

const ActivityAttachmentField: StaticActivityComponentType<"ActivityAttachmentField"> = () => {
  const { push } = useFlow();

  const startUpload = useCallback(
    (
      file: File,
      id: string,
      updateFileEntryStatus: (id: string, details: FileStatusDetails) => void,
    ) => {
      updateFileEntryStatus(id, { status: "uploading", progress: 0 });

      uploadFile(file, (progress) => {
        updateFileEntryStatus(id, { status: "uploading", progress });
      })
        .then(() => updateFileEntryStatus(id, { status: "success" }))
        .catch(() => updateFileEntryStatus(id, { status: "error" }));
    },
    [],
  );

  const handleFileAccept = useCallback(
    (
      entries: FileEntry[],
      {
        updateFileEntryStatus,
      }: { updateFileEntryStatus: (id: string, details: FileStatusDetails) => void },
    ) => {
      for (const entry of entries) {
        startUpload(entry.file, entry.id, updateFileEntryStatus);
      }
    },
    [startUpload],
  );

  const handleRetry = useCallback(
    (
      fileEntry: FileEntry,
      {
        updateFileEntryStatus,
      }: { updateFileEntryStatus: (id: string, details: FileStatusDetails) => void },
    ) => {
      startUpload(fileEntry.file, fileEntry.id, updateFileEntryStatus);
    },
    [startUpload],
  );

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>AttachmentField</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x6" px="spacingX.globalGutter" py="x4">
          <AttachmentField
            label="AttachmentInput (image/*)"
            description="업로드 상태 시뮬레이션 (50% 확률로 실패)"
            accept="image/*"
            maxFiles={5}
            onFileAccept={handleFileAccept}
            rootProps={{
              style: {
                "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
              } as React.CSSProperties,
            }}
          >
            <AttachmentInput onRetry={handleRetry} />
          </AttachmentField>

          <Divider />

          <AttachmentField
            label="AttachmentInput (all files)"
            description="업로드 상태 시뮬레이션 (50% 확률로 실패)"
            maxFiles={5}
            onFileAccept={handleFileAccept}
            rootProps={{
              style: {
                "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
              } as React.CSSProperties,
            }}
          >
            <AttachmentInput onRetry={handleRetry} />
          </AttachmentField>

          <Divider />

          <AttachmentField
            label="AttachmentDropzone (image/*)"
            description="업로드 상태 시뮬레이션 (50% 확률로 실패)"
            accept="image/*"
            maxFiles={5}
            onFileAccept={handleFileAccept}
            rootProps={{
              style: {
                "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
              } as React.CSSProperties,
            }}
          >
            <AttachmentDropzone onRetry={handleRetry} />
          </AttachmentField>

          <Divider />

          <AttachmentField
            label="AttachmentDropzone (all files)"
            description="업로드 상태 시뮬레이션 (50% 확률로 실패)"
            maxFiles={5}
            onFileAccept={handleFileAccept}
            rootProps={{
              style: {
                "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
              } as React.CSSProperties,
            }}
          >
            <AttachmentDropzone onRetry={handleRetry} />
          </AttachmentField>

          <Divider />

          <AttachmentField
            label="AttachmentInputReorderable (image/*)"
            description="업로드 상태 시뮬레이션 (50% 확률로 실패)"
            accept="image/*"
            maxFiles={5}
            onFileAccept={handleFileAccept}
            rootProps={{
              style: {
                "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
              } as React.CSSProperties,
            }}
          >
            <AttachmentInputReorderable onRetry={handleRetry} />
          </AttachmentField>

          <Divider />

          <AttachmentField
            label="AttachmentInputReorderable (all files)"
            description="업로드 상태 시뮬레이션 (50% 확률로 실패)"
            maxFiles={5}
            onFileAccept={handleFileAccept}
            rootProps={{
              style: {
                "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
              } as React.CSSProperties,
            }}
          >
            <AttachmentInputReorderable onRetry={handleRetry} />
          </AttachmentField>

          <Divider />

          <AttachmentField
            label="AttachmentDropzoneReorderable (image/*)"
            description="업로드 상태 시뮬레이션 (50% 확률로 실패)"
            accept="image/*"
            maxFiles={5}
            onFileAccept={handleFileAccept}
            rootProps={{
              style: {
                "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
              } as React.CSSProperties,
            }}
          >
            <AttachmentDropzoneReorderable onRetry={handleRetry} />
          </AttachmentField>

          <Divider />

          <AttachmentField
            label="AttachmentDropzoneReorderable (all files)"
            description="업로드 상태 시뮬레이션 (50% 확률로 실패)"
            maxFiles={5}
            onFileAccept={handleFileAccept}
            rootProps={{
              style: {
                "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
              } as React.CSSProperties,
            }}
          >
            <AttachmentDropzoneReorderable onRetry={handleRetry} />
          </AttachmentField>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAttachmentField;
