file: components/attachment-field.mdx

# Attachment Field

파일을 선택하거나 드래그 앤 드롭으로 업로드할 수 있는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0

## Preview

```tsx
import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

export default function AttachmentFieldPreview() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        maxFiles={3}
        label="파일 업로드"
        description="최대 3개까지 업로드할 수 있습니다"
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
```

## Installation \[#installation]

### Default \[#default]

파일 순서 변경이 불필요한 경우 사용할 수 있는 컴포넌트를 포함합니다.

- npm: npx @seed-design/cli@latest add ui:attachment-field
- pnpm: pnpm dlx @seed-design/cli@latest add ui:attachment-field
- yarn: yarn dlx @seed-design/cli@latest add ui:attachment-field
- bun: bun x @seed-design/cli@latest add ui:attachment-field

<ManualInstallation name="attachment-field" />

### Reorderable \[#reorderable]

드래그 앤 드롭을 통한 파일 순서 변경이 필요한 경우 활용할 수 있는 컴포넌트를 포함합니다. 프로젝트에 [dnd-kit](https://dndkit.com/overview) 의존성이 추가됩니다.

- npm: npx @seed-design/cli@latest add ui:attachment-field-reorderable
- pnpm: pnpm dlx @seed-design/cli@latest add ui:attachment-field-reorderable
- yarn: yarn dlx @seed-design/cli@latest add ui:attachment-field-reorderable
- bun: bun x @seed-design/cli@latest add ui:attachment-field-reorderable

<ManualInstallation name="attachment-field-reorderable" />

## Props \[#props]

### `AttachmentField` \[#attachmentfield]

- `label`
  - type: `React.ReactNode`
- `labelWeight`
  - type: `"medium" | "bold" | undefined`
  - default: `"medium"`
- `indicator`
  - type: `React.ReactNode`
- `description`
  - type: `React.ReactNode`
- `errorMessage`
  - type: `React.ReactNode`
- `showRequiredIndicator`
  - type: `boolean | undefined`
- `inputProps`
  - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
- `fieldRef`
  - type: `React.Ref<HTMLDivElement> | undefined`
- `rootProps`
  - type: `React.HTMLAttributes<HTMLDivElement> | undefined`
- `accept`
  - type: `string | string[] | undefined`
  - description: Accepted file types (e.g., "image/\*", ".pdf", "image/png")
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
- `required`
  - type: `boolean | undefined`
  - default: `false`
- `invalid`
  - type: `boolean | undefined`
  - default: `false`
- `readOnly`
  - type: `boolean | undefined`
  - default: `false`
- `maxFiles`
  - type: `number | undefined`
  - default: `1`
- `maxFileSize`
  - type: `number | undefined`
  - default: `Infinity`
- `minFileSize`
  - type: `number | undefined`
  - default: `0`
- `name`
  - type: `string | undefined`
- `validate`
  - type: `((file: File) => FileError[] | null) | undefined`
  - description: Custom validation function.
- `preventDocumentDrop`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to prevent the browser's default behavior when files are dropped outside the dropzone (e.g., opening the file in a new tab).
- `acceptedFileEntries`
  - type: `FileEntry[] | undefined`
- `defaultAcceptedFileEntries`
  - type: `FileEntry[] | undefined`
- `onAcceptedFileEntriesChange`
  - type: `((fileEntries: FileEntry[]) => void) | undefined`
- `onFileReject`
  - type: `((rejections: FileRejection[]) => void) | undefined`
- `onFileAccept`
  - type: `((acceptedEntries: FileEntry[], helpers: { updateFileEntryStatus: (id: string, details: FileStatusDetails) => void; }) => void) | undefined`

### `AttachmentInput` \[#attachmentinput]

- `children`
  - type: `((context: UseFileUploadContext) => React.ReactNode) | undefined`
- `onRetry`
  - type: `((fileEntry: FileEntry, helpers: Pick<UseFileUploadReturn, "updateFileEntryStatus">) => void) | undefined`

### `AttachmentDropzone` \[#attachmentdropzone]

- `children`
  - type: `((context: UseFileUploadContext) => React.ReactNode) | undefined`
- `onRetry`
  - type: `((fileEntry: FileEntry, helpers: Pick<UseFileUploadReturn, "updateFileEntryStatus">) => void) | undefined`

### `AttachmentInputItem` \[#attachmentinputitem]

- `onRetry`
  - type: `(() => void) | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `type`
  - type: `"general" | "image" | undefined`
  - default: `"general"`
- `fileEntry`
  - type: `FileEntry`
  - required: `true`

## Usage \[#usage]

### 기본 사용법 \[#기본-사용법]

`AttachmentField` 안에 `AttachmentInput`, `AttachmentDropzone`, `AttachmentInputReorderable`, `AttachmentDropzoneReorderable` 중 하나를 조합하여 사용합니다.

```tsx
import {
  AttachmentField,
  AttachmentInput,
  AttachmentDropzone,
} from "seed-design/ui/attachment-field";

<AttachmentField>
  <AttachmentInput />
</AttachmentField>;

<AttachmentField>
  <AttachmentDropzone />
</AttachmentField>;
```

```tsx
import { AttachmentField } from "seed-design/ui/attachment-field";
import {
  AttachmentInputReorderable,
  AttachmentDropzoneReorderable,
} from "seed-design/ui/attachment-field-reorderable";

<AttachmentField>
  <AttachmentInputReorderable />
</AttachmentField>;

<AttachmentField>
  <AttachmentDropzoneReorderable />
</AttachmentField>;
```

### Item 직접 구성하기 \[#item-직접-구성하기]

`AttachmentInput`, `AttachmentDropzone`, `AttachmentInputReorderable`, `AttachmentDropzoneReorderable`은 `children`을 render prop으로 사용합니다.

`acceptedFileEntries`을 활용하여 `AttachmentInputItem`을 직접 렌더링할 수 있습니다. 이때 `FileEntry` 타입이 제공하는 `id`를 `key`로 활용하는 것을 권장합니다.

`children`을 제공하지 않는 경우 자동으로 `acceptedFileEntries`에 등록된 파일을 `AttachmentInputItem`으로 렌더링합니다.

```tsx
import {
  AttachmentField,
  AttachmentInput,
  AttachmentInputItem,
} from "seed-design/ui/attachment-field";

<AttachmentField>
  <AttachmentInput>
    {({ acceptedFileEntries }) =>
      acceptedFileEntries.map((entry) => (
        <AttachmentInputItem key={entry.id} fileEntry={entry} />
      ))
    }
  </AttachmentInput>
</AttachmentField>;
```

## Uploading Files \[#uploading-files]

### Trigger \[#trigger]

`AttachmentInput`를 사용하면 trigger(업로드 버튼)가 포함된 레이아웃을 사용할 수 있습니다.

```tsx
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

const defaultAcceptedFileEntries: FileEntry[] = [
  {
    id: "1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
];

export default function AttachmentFieldTriggerExample() {
  return (
    <AttachmentField
      maxFiles={3}
      label="파일 업로드"
      defaultAcceptedFileEntries={defaultAcceptedFileEntries}
    >
      <AttachmentInput />
    </AttachmentField>
  );
}
```

### Dropzone \[#dropzone]

`AttachmentDropzone`을 사용하면 드래그 앤 드롭 영역이 포함된 레이아웃을 사용할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentDropzone } from "seed-design/ui/attachment-field";

const defaultAcceptedFileEntries: FileEntry[] = [
  {
    id: "1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
];

export default function AttachmentFieldDropzone() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        maxFiles={5}
        label="파일 업로드"
        description="파일을 선택하거나 드래그 앤 드롭하세요"
        defaultAcceptedFileEntries={defaultAcceptedFileEntries}
      >
        <AttachmentDropzone />
      </AttachmentField>
    </VStack>
  );
}
```

### Listening to Accepted File Changes \[#listening-to-accepted-file-changes]

`acceptedFileEntries`는 유효성 검사를 마친 파일의 목록입니다. `onAcceptedFileEntriesChange` 콜백으로 `acceptedFileEntries`에 등록된 파일 변경 이벤트를 감지할 수 있습니다.

```tsx
import { VStack, Text } from "@seed-design/react";
import { useState } from "react";
import type { FileStatusDetails } from "@seed-design/react/primitive";
import {
  AttachmentField,
  AttachmentInput,
  AttachmentInputItem,
} from "seed-design/ui/attachment-field";

function simulateUpload(
  _file: File,
  id: string,
  updateFileEntryStatus: (id: string, details: FileStatusDetails) => void,
) {
  updateFileEntryStatus(id, { status: "uploading", progress: 0 });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 25;
    if (progress >= 100) {
      clearInterval(interval);
      updateFileEntryStatus(id, { status: "success" });
    } else {
      updateFileEntryStatus(id, { status: "uploading", progress });
    }
  }, 500);
}

export default function AttachmentFieldValueChanges() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  return (
    <VStack gap="x4" width="100%" alignItems="center">
      <VStack gap="x1">
        {logs.length === 0 ? (
          <Text color="fg.neutralMuted">파일을 추가하거나 삭제하면 로그가 표시됩니다.</Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} fontSize="fontSize.caption1">
              {log}
            </Text>
          ))
        )}
      </VStack>
      <AttachmentField
        maxFiles={3}
        label="파일 업로드"
        description="콜백 호출 로그를 확인하세요"
        onFileAccept={(entries, { updateFileEntryStatus }) => {
          addLog(`onFileAccept: ${entries.map((e) => e.file.name).join(", ")}`);
          for (const entry of entries) {
            simulateUpload(entry.file, entry.id, updateFileEntryStatus);
          }
        }}
        onAcceptedFileEntriesChange={(files) => {
          addLog(
            `onAcceptedFileEntriesChange: ${files.map((f) => `${f.file.name} (${f.status})`).join(", ")}`,
          );
        }}
        onFileReject={(files) => {
          addLog(
            `onFileReject: ${files.map((f) => `${f.file.name} (${f.errors.join(", ")})`).join(", ")}`,
          );
        }}
      >
        <AttachmentInput>
          {({ acceptedFileEntries }) =>
            acceptedFileEntries.map((fileEntry) => (
              <AttachmentInputItem key={fileEntry.id} fileEntry={fileEntry} />
            ))
          }
        </AttachmentInput>
      </AttachmentField>
    </VStack>
  );
}
```

## Validating Files \[#validating-files]

사용자가 선택한 파일이 `acceptedFileEntries`에 등록되기 전 유효성을 확인할 수 있습니다.

유효하지 않은 파일에 대해 각각 `onFileReject` 콜백이 실행됩니다. 해당 콜백에서 파일과 에러 코드들을 확인하여 에러 메시지를 표시할 수 있습니다.

### Max Files \[#max-files]

`maxFiles`로 업로드 가능한 최대 파일 수를 제한할 수 있습니다. 기본값은 `1`입니다. 최대 수에 도달한 경우 trigger 및 dropzone이 비활성화됩니다.

업로드 가능한 파일의 수보다 많은 파일을 선택한 경우 업로드 가능한 파일까지 `acceptedFileEntries`에 등록됩니다. 나머지 파일에 대해서는 각각 `onFileReject` 콜백이 실행됩니다. 이때 reject된 파일의 에러는 `"TOO_MANY_FILES"`입니다.

```tsx
import { VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

const defaultAcceptedFileEntries: FileEntry[] = [
  {
    id: "1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
];

export default function AttachmentFieldMaxFiles() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        maxFiles={3}
        label="파일 업로드"
        description="최대 3개까지 업로드할 수 있습니다"
        defaultAcceptedFileEntries={defaultAcceptedFileEntries}
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
```

### Invalid File Type \[#invalid-file-type]

`accept`로 업로드 가능한 파일의 종류를 제한할 수 있습니다.

MIME type(`image/png`, `image/*`) 또는 확장자(`.png`, `.jpg, .jpeg`) 형식을 지정할 수 있으며, `string[]`을 전달하는 경우 각 `string` `,`로 join합니다.

`<input type="file">`에 등록되는 `accept` 속성을 통해 사용자가 선택할 수 있는 파일의 종류를 제한하는 것은 브라우저 UI에서만 동작하는 편의 기능입니다. 따라서 사용자는 브라우저 파일 선택 다이얼로그의 `모든 파일 보기`와 같은 기능을 통해 제한된 종류의 파일도 선택할 수 있습니다. 이렇게 선택된 파일의 경우 `"INVALID_TYPE"` 에러와 함께 `onFileReject` 콜백이 실행됩니다.

<Callout type="warning">
  파일 종류 검증이 필요한 경우 해당 검증은 서버에서도 수행되어야 합니다.
</Callout>

```tsx
import { useState } from "react";
import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "INVALID_TYPE":
      return "지원하지 않는 파일 형식입니다";
    default:
      return "업로드에 실패했습니다";
  }
}

export default function AttachmentFieldInvalidFileType() {
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        accept={["image/png", "image/jpeg"]}
        maxFiles={3}
        invalid={!!errorMessage}
        errorMessage={errorMessage}
        label="이미지 업로드"
        description="PNG, JPEG 파일만 업로드할 수 있습니다"
        onAcceptedFileEntriesChange={() => setErrorMessage(undefined)}
        onFileReject={(files) => {
          const messages = files.map(
            ({ file, errors }) => `"${file.name}": ${errors.map(getErrorMessage).join(", ")}`,
          );
          setErrorMessage(messages.join("\n"));
        }}
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
```

### File Size \[#file-size]

`minFileSize`, `maxFileSize` prop을 활용할 수 있습니다.

- 사용자가 선택한 파일이 `minFileSize`보다 작은 경우 `"FILE_TOO_SMALL"` 에러와 함께 `onFileReject` 콜백이 실행됩니다.
- 사용자가 선택한 파일이 `maxFileSize`보다 큰 경우 `"FILE_TOO_LARGE"` 에러와 함께 `onFileReject` 콜백이 실행됩니다.

```tsx
import { useState } from "react";
import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";
import { formatBytes } from "seed-design/lib/format-bytes";

const MIN_FILE_SIZE = 1 * 1024; // 1KB
const MAX_FILE_SIZE = 10 * 1024; // 10KB

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "FILE_TOO_LARGE":
      return `크기가 ${formatBytes(MAX_FILE_SIZE)}를 초과합니다`;
    case "FILE_TOO_SMALL":
      return `크기가 ${formatBytes(MIN_FILE_SIZE)} 미만입니다`;
    case "TOO_MANY_FILES":
      return "업로드 가능한 파일 개수를 초과했습니다";
    default:
      return "업로드에 실패했습니다";
  }
}

export default function AttachmentFieldValidation() {
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        maxFiles={3}
        minFileSize={MIN_FILE_SIZE}
        maxFileSize={MAX_FILE_SIZE}
        invalid={!!errorMessage}
        errorMessage={errorMessage}
        label="파일 업로드"
        description={`${formatBytes(MIN_FILE_SIZE)} ~ ${formatBytes(MAX_FILE_SIZE)} 크기의 파일만 업로드할 수 있습니다`}
        onAcceptedFileEntriesChange={() => setErrorMessage(undefined)}
        onFileReject={(files) => {
          const messages = files.map(
            ({ file, errors }) => `"${file.name}": ${errors.map(getErrorMessage).join(", ")}`,
          );

          setErrorMessage(messages.join("\n"));
        }}
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
```

### Custom Validation \[#custom-validation]

`validate` prop으로 각 파일에 대한 유효성 검사를 직접 추가할 수 있습니다. 커스텀 에러 코드를 반환하여 `onFileReject`에서 에러 종류별로 메시지를 분기할 수 있습니다.

```tsx
import { useState } from "react";
import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

function validateFileName(file: File) {
  const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
  if (nameWithoutExt.length > 8) {
    return ["FILENAME_TOO_LONG"];
  }
  return null;
}

export default function AttachmentFieldCustomValidation() {
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        maxFiles={5}
        validate={validateFileName}
        invalid={!!errorMessage}
        errorMessage={errorMessage}
        label="파일 업로드"
        description="파일 이름은 확장자를 제외하고 8자 이하여야 합니다"
        onAcceptedFileEntriesChange={() => setErrorMessage(undefined)}
        onFileReject={(files) => {
          if (files.every((f) => f.errors.includes("FILENAME_TOO_LONG")) === false) {
            return;
          }

          const names = files.map((f) => f.file.name).join(", ");

          setErrorMessage(`"${names}"은(는) 파일 이름이 8자를 초과합니다.`);
        }}
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
```

## Managing File Status \[#managing-file-status]

`acceptedFileEntries`의 각 항목은 `pending`, `uploading`, `success`, `error`의 status를 가질 수 있습니다. 새로 추가되는 항목의 status 기본값은 `pending`입니다.

파일 선택 직후 외부 업로드 API와 연동하는 경우, 사용자에게 각 파일 항목의 업로딩 상태를 보여줄 수 있습니다. `onFileAccept` 콜백에서 새로 추가된 파일을 받고, 함께 제공되는 `updateFileEntryStatus` 헬퍼를 사용하여 항목의 status를 업데이트합니다.

```tsx
import { useCallback } from "react";
import { VStack } from "@seed-design/react";
import type { FileStatusDetails } from "@seed-design/react/primitive";
import {
  AttachmentField,
  AttachmentInput,
  AttachmentInputItem,
} from "seed-design/ui/attachment-field";

// 실제 환경에서는 fetch 등으로 교체하세요.
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

export default function AttachmentFieldStatus() {
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

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        accept="image/*"
        maxFiles={5}
        label="파일 업로드"
        description="업로드 상태 시뮬레이션"
        onFileAccept={(entries, { updateFileEntryStatus }) => {
          for (const entry of entries) {
            startUpload(entry.file, entry.id, updateFileEntryStatus);
          }
        }}
      >
        <AttachmentInput>
          {({ acceptedFileEntries, updateFileEntryStatus }) =>
            acceptedFileEntries.map((fileEntry) => (
              <AttachmentInputItem
                key={fileEntry.id}
                fileEntry={fileEntry}
                onRetry={() => startUpload(fileEntry.file, fileEntry.id, updateFileEntryStatus)}
              />
            ))
          }
        </AttachmentInput>
      </AttachmentField>
    </VStack>
  );
}
```

- `uploading`: [ProgressCircle](/react/components/progress-circle)이 표시됩니다.
  - `progress`를 설정하여 업로드 진행률을 표시할 수 있습니다.
  - `progress`를 지정하지 않는 경우 [indeterminate](/react/components/progress-circle#indeterminate) 상태로 표시됩니다.
- `error`: 재시도 버튼이 표시됩니다.
  - 클릭 시 `AttachmentInputItem`에 지정한 `onRetry` 콜백이 실행됩니다.

유효성 검증에 성공한 파일 항목은 status와 관계없이 `acceptedFileEntries`에 유지되므로, 네이티브 form 제출 시 포함됩니다.

## Reordering Files \[#reordering-files]

`AttachmentInputReorderable` 또는 `AttachmentDropzoneReorderable`을 사용하면 드래그로 파일의 순서를 변경할 수 있습니다.

두 컴포넌트는 `dnd-kit` 의존성 분리를 위해 별도 snippet [`ui:attachment-field-reorderable`](#reorderable)로 제공됩니다.

Context를 통해 `reorderFileEntry`가 제공되므로, 필요한 경우 원하는 드래그 앤 드롭 동작을 직접 구현하거나, 이미 프로젝트에서 사용 중인 드래그 앤 드롭 라이브러리와 연동하여 사용할 수 있습니다.

```tsx
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField } from "seed-design/ui/attachment-field";
import { AttachmentInputReorderable } from "seed-design/ui/attachment-field-reorderable";

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

export default function AttachmentFieldReorderableExample() {
  return (
    <AttachmentField
      accept="image/*"
      maxFiles={5}
      label="이미지 업로드"
      description="드래그하여 순서를 변경할 수 있습니다"
      defaultAcceptedFileEntries={defaultAcceptedFileEntries}
    >
      <AttachmentInputReorderable />
    </AttachmentField>
  );
}
```

## Examples \[#examples]

### Showing Thumbnails \[#showing-thumbnails]

파일 이름 및 크기 대신 이미지 미리보기를 표시하려면 `accept`를 `"image/*"`, `["image/png", "image/jpeg"]` 등으로 설정하여 사용자가 이미지 파일만 선택할 수 있도록 제한합니다.

```tsx
import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

export default function AttachmentFieldAcceptImage() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        accept="image/*"
        maxFiles={5}
        label="이미지 업로드"
        description="이미지 파일만 허용됩니다"
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
```

<Callout type="warning">
  [`"image/heic"`](https://caniuse.com/heif) 등 일부 이미지 형식은 브라우저에
  따라 이미지 미리보기가 표시되지 않을 수 있습니다.
</Callout>

### Disabled \[#disabled]

`disabled` prop으로 trigger 및 dropzone을 비활성화하여 신규 파일 선택을 차단하고, `<input type="file">`을 `disabled` 처리하여 폼 제출 시 값이 전송되지 않도록 합니다.

```tsx
import { VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

const defaultFiles: FileEntry[] = [
  {
    id: "mock-1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
  {
    id: "mock-2",
    file: new File(["world"], "image.png", { type: "image/png" }),
    status: "success",
  },
];

export default function AttachmentFieldDisabled() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        disabled
        maxFiles={5}
        defaultAcceptedFileEntries={defaultFiles}
        label="파일 업로드"
        description="비활성화된 AttachmentField"
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
```

### Read Only \[#read-only]

`readOnly` prop으로 첨부된 파일을 읽기 전용 상태로 표시할 수 있습니다. trigger, dropzone, 파일 제거 버튼, 순서 변경 모두 비활성화되지만 `<input type="file">`의 값은 유지되어 form 제출 시 함께 전송됩니다.

```tsx
import { VStack } from "@seed-design/react";
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

const defaultFiles: FileEntry[] = [
  {
    id: "mock-1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
  {
    id: "mock-2",
    file: new File(["world"], "image.png", { type: "image/png" }),
    status: "success",
  },
];

export default function AttachmentFieldReadOnly() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentField
        readOnly
        maxFiles={5}
        defaultAcceptedFileEntries={defaultFiles}
        label="첨부 파일"
        description="읽기 전용 상태"
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
```

### Controlled \[#controlled]

`acceptedFileEntries`와 `onAcceptedFileEntriesChange`를 사용하여 외부에서 파일 목록을 제어할 수 있습니다.

```tsx
import { VStack, HStack, Text } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

export default function AttachmentFieldControlled() {
  const [acceptedFileEntries, setAcceptedFileEntries] = useState<FileEntry[]>([]);

  return (
    <VStack gap="x4" width="100%">
      <AttachmentField
        maxFiles={5}
        label="Controlled"
        description="최대 5개까지 업로드할 수 있습니다"
        acceptedFileEntries={acceptedFileEntries}
        onAcceptedFileEntriesChange={setAcceptedFileEntries}
      >
        <AttachmentInput />
      </AttachmentField>
      <Text>현재 파일: {JSON.stringify(acceptedFileEntries.map((f) => f.file.name))}</Text>
      <HStack gap="x2">
        <ActionButton
          type="button"
          variant="neutralWeak"
          onClick={() => setAcceptedFileEntries([])}
        >
          전체 삭제
        </ActionButton>
      </HStack>
    </VStack>
  );
}
```

### Custom Inset \[#custom-inset]

`--seed-attachment-input-extend-x` CSS 변수를 사용하여 스크롤되는 아이템 목록이 레이아웃 바깥으로 빠져나오도록 구성할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { vars } from "@seed-design/css/vars";

const mockedFiles = Array.from({ length: 8 }, (_, i) => {
  const file = new File(["file content"], `file${i + 1}.txt`, { type: "text/plain" });
  Object.defineProperty(file, "size", { value: 1 });

  return file;
});

export default function AttachmentFieldCustomInset() {
  return (
    <VStack
      px="spacingX.globalGutter"
      width="400px"
      maxWidth="full"
      bg="palette.gray300"
      borderWidth={1}
      borderColor="stroke.neutralMuted"
    >
      <VStack gap="spacingY.componentDefault" bg="bg.layerDefault">
        <TextField label="이름">
          <TextFieldInput placeholder="홍길동" />
        </TextField>
        <AttachmentField
          maxFiles={5}
          label="첨부파일"
          defaultAcceptedFileEntries={mockedFiles.map((file, index) => ({
            id: `${index}`,
            file,
            status: "pending",
          }))}
          rootProps={{
            style: {
              "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
            } as React.CSSProperties,
          }}
        >
          <AttachmentInput />
        </AttachmentField>
      </VStack>
    </VStack>
  );
}
```

### Field Integration \[#field-integration]

`label`, `description`, `errorMessage` 등의 Field 관련 prop을 사용할 수 있습니다.

```tsx
import { Divider, VStack } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

export default function AttachmentFieldField() {
  return (
    <VStack gap="x8" width="100%">
      <AttachmentField
        maxFiles={3}
        label="첨부파일"
        labelWeight="bold"
        required
        showRequiredIndicator
        invalid
        errorMessage="필수 항목입니다."
      >
        <AttachmentInput />
      </AttachmentField>
      <Divider />
      <AttachmentField
        maxFiles={3}
        label="첨부파일"
        description="파일을 선택하거나 드래그 앤 드롭하세요."
        indicator="선택"
      >
        <AttachmentInput />
      </AttachmentField>
    </VStack>
  );
}
```

### Form (Uncontrolled) \[#form-uncontrolled]

`acceptedFileEntries`에 등록된 파일이 `<input type="file">`의 `files`로 동기화되므로 `<form>`과 `name` prop을 사용하여 formData에 포함시킬 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import { useState, type FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

type FieldErrors = {
  files?: string;
};

export default function AttachmentFieldForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      setFieldErrors({ files: "최소 1개의 파일을 업로드해주세요" });
      return;
    }

    window.alert(`제출된 파일: ${files.map((f) => f.name).join(", ")}`);
  };

  return (
    <VStack asChild gap="x3" width="full">
      <form onSubmit={handleSubmit}>
        <AttachmentField
          name="files"
          maxFiles={3}
          label="첨부파일"
          description="최대 3개까지 업로드할 수 있습니다"
          required
          showRequiredIndicator
          onAcceptedFileEntriesChange={(files) => {
            if (files.length > 0) {
              setFieldErrors({});
            }
          }}
          {...(fieldErrors.files && { invalid: true, errorMessage: fieldErrors.files })}
        >
          <AttachmentInput />
        </AttachmentField>
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
      </form>
    </VStack>
  );
}
```

### React Hook Form \[#react-hook-form]

```tsx
import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

interface FormValues {
  files: FileEntry[];
}

export default function AttachmentFieldReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      files: [],
    },
  });

  const {
    field: { value, onChange, ...field },
    fieldState,
  } = useController({
    name: "files",
    control,
    rules: {
      validate: (value) => value.length > 0 || "최소 1개의 파일을 업로드해주세요",
    },
  });

  const onValid = useCallback(
    (data: FormValues) =>
      window.alert(`제출된 파일: ${data.files.map((f) => f.file.name).join(", ")}`),
    [],
  );

  const onReset = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      reset();
    },
    [reset],
  );

  return (
    <VStack gap="x3" width="full" as="form" onSubmit={handleSubmit(onValid)} onReset={onReset}>
      <AttachmentField
        maxFiles={5}
        label="첨부파일"
        description="최대 5개까지 업로드할 수 있습니다"
        showRequiredIndicator
        invalid={fieldState.invalid}
        errorMessage={fieldState.error?.message}
        acceptedFileEntries={value}
        onAcceptedFileEntriesChange={onChange}
        {...field}
      >
        <AttachmentInput />
      </AttachmentField>
      <HStack gap="x2">
        <ActionButton type="reset" variant="neutralWeak">
          초기화
        </ActionButton>
        <ActionButton type="submit" variant="neutralSolid" flexGrow={1}>
          제출
        </ActionButton>
      </HStack>
    </VStack>
  );
}
```

### Customizing Items \[#customizing-items]

Snippet이 제공하는 기본 아이템 구성 외에 추가적인 커스터마이징이 필요한 경우, `@seed-design/react`에서 제공하는 `AttachmentInput.ItemBadge` 등의 요소를 활용하여 직접 아이템을 구성할 수 있습니다.

아래 예시에서는 `AttachmentInput.ItemBadge`를 사용하여 첫 번째 이미지에 "대표사진" 배지를 표시합니다.

```tsx
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
              <CustomImageItem key={fileEntry.id} fileEntry={fileEntry} isCover={index === 0} />
            ))
          }
        </AttachmentInput>
      </AttachmentField>
    </VStack>
  );
}
```