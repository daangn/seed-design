file: components/attachment-display-field.mdx

# Attachment Display Field

외부 소스에서 제공된 미디어를 URL 기반으로 표시하고 관리하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0

## Preview

```tsx
import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const sampleEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/seed1/200/200",
    status: "success",
  },
  {
    id: "2",
    thumbnailUrl: "https://picsum.photos/seed/seed2/200/200",
    status: "success",
  },
];

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "success",
    },
  ];
}

export default function AttachmentDisplayPreview() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={sampleEntries} maxEntries={5}>
        <AttachmentDisplay
          onTriggerClick={async ({ addEntries }) => {
            addEntries(await openMediaPicker());
          }}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
```

## Installation \[#installation]

### Default \[#default]

순서 변경이 불필요한 경우 사용할 수 있는 컴포넌트를 포함합니다.

- npm: npx @seed-design/cli@latest add ui:attachment-display-field
- pnpm: pnpm dlx @seed-design/cli@latest add ui:attachment-display-field
- yarn: yarn dlx @seed-design/cli@latest add ui:attachment-display-field
- bun: bun x @seed-design/cli@latest add ui:attachment-display-field

<ManualInstallation name="attachment-display-field" />

### Reorderable \[#reorderable]

드래그 앤 드롭을 통한 항목 순서 변경이 필요한 경우 활용할 수 있는 컴포넌트를 포함합니다. 프로젝트에 [dnd-kit](https://dndkit.com/overview) 의존성이 추가됩니다.

- npm: npx @seed-design/cli@latest add ui:attachment-display-field-reorderable
- pnpm: pnpm dlx @seed-design/cli@latest add ui:attachment-display-field-reorderable
- yarn: yarn dlx @seed-design/cli@latest add ui:attachment-display-field-reorderable
- bun: bun x @seed-design/cli@latest add ui:attachment-display-field-reorderable

<ManualInstallation name="attachment-display-field-reorderable" />

## Props \[#props]

### `AttachmentDisplayField` \[#attachmentdisplayfield]

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
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
- `invalid`
  - type: `boolean | undefined`
  - default: `false`
- `readOnly`
  - type: `boolean | undefined`
  - default: `false`
- `maxEntries`
  - type: `number | undefined`
  - default: `1`
- `entries`
  - type: `DisplayItemEntry[] | undefined`
- `defaultEntries`
  - type: `DisplayItemEntry[] | undefined`
- `onEntriesChange`
  - type: `((entries: DisplayItemEntry[]) => void) | undefined`

### `AttachmentDisplay` \[#attachmentdisplay]

- `onTriggerClick`
  - type: `(helpers: Pick<UseAttachmentDisplayReturn, "addEntries" | "updateEntryStatus">) => void`
  - required: `true`
- `children`
  - type: `((context: UseAttachmentDisplayContext) => React.ReactNode) | undefined`
- `onRetry`
  - type: `((entry: DisplayItemEntry, helpers: Pick<UseAttachmentDisplayReturn, "updateEntryStatus">) => void) | undefined`

### `AttachmentDisplayItem` \[#attachmentdisplayitem]

- `onRetry`
  - type: `(() => void) | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `entry`
  - type: `DisplayItemEntry`
  - required: `true`

## Usage \[#usage]

### 기본 사용법 \[#기본-사용법]

`AttachmentDisplayField` 안에 `AttachmentDisplay` 또는 `AttachmentDisplayReorderable`을 조합하여 사용합니다.

`AttachmentDisplay`는 HTML `<input type="file">`을 사용하지 않습니다. `onTriggerClick`으로 외부 미디어 피커를 호출하고, 콜백 인자로 전달되는 `addEntries`에 그 결과를 넘겨 표시하세요. `addEntries`는 `maxEntries` 상한과 single-mode(`maxEntries={1}`) 치환을 내부에서 처리하므로, `entries`를 직접 펼쳐 넣는 것보다 안전합니다.

[`AttachmentField`](/react/components/attachment-field)와 달리 `AttachmentDisplayField`는 파일의 유효성을 검증하거나 파일 객체를 직접 다루지 않습니다.

```tsx
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

<AttachmentDisplayField defaultEntries={[]} maxEntries={10}>
  <AttachmentDisplay
    onTriggerClick={async ({ addEntries }) => {
      const pickedEntries = await openMediaPicker();
      addEntries(pickedEntries);
    }}
  />
</AttachmentDisplayField>;
```

`entries`와 `onEntriesChange`로 목록을 직접 제어하는 controlled 방식도 지원합니다. 이 경우에도 `addEntries`는 동일하게 동작합니다([Controlled](#controlled) 참고).

### Item 직접 구성하기 \[#item-직접-구성하기]

`AttachmentDisplay`, `AttachmentDisplayReorderable`은 `children`을 render prop으로 사용합니다.

`entries`를 활용하여 `AttachmentDisplayItem`을 직접 렌더링할 수 있습니다. 이때 `DisplayItemEntry` 타입이 제공하는 `id`를 `key`로 활용하는 것을 권장합니다.

`children`을 제공하지 않는 경우 자동으로 `entries`를 `AttachmentDisplayItem`으로 렌더링합니다.

```tsx
import {
  AttachmentDisplay,
  AttachmentDisplayField,
  AttachmentDisplayItem,
} from "seed-design/ui/attachment-display-field";

<AttachmentDisplayField defaultEntries={[]} maxEntries={10}>
  <AttachmentDisplay
    onTriggerClick={async ({ addEntries }) => {
      addEntries(await openMediaPicker());
    }}
  >
    {({ entries }) =>
      entries.map((entry) => (
        <AttachmentDisplayItem key={entry.id} entry={entry} />
      ))
    }
  </AttachmentDisplay>
</AttachmentDisplayField>;
```

## Adding Entries \[#adding-entries]

### Trigger \[#trigger]

`AttachmentDisplay`는 trigger(업로드 버튼)가 포함된 레이아웃을 제공합니다. trigger 클릭 시 `onTriggerClick` 콜백이 실행됩니다. 일반적으로 외부 미디어 피커 호출을 수행합니다. 콜백은 `{ addEntries, updateEntryStatus }`를 인자로 받아, 피커 결과를 추가하고 곧바로 업로드 상태를 갱신할 수 있습니다.

```tsx
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const defaultEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/trigger1/200/200",
    status: "success",
  },
];

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "success",
    },
  ];
}

export default function AttachmentDisplayTrigger() {
  return (
    <AttachmentDisplayField defaultEntries={defaultEntries} maxEntries={3}>
      <AttachmentDisplay
        onTriggerClick={async ({ addEntries }) => {
          addEntries(await openMediaPicker());
        }}
      />
    </AttachmentDisplayField>
  );
}
```

### Listening to Entry Changes \[#listening-to-entry-changes]

`entries`는 현재 표시되고 있는 항목의 목록입니다. `onEntriesChange` 콜백으로 `entries`에 등록된 파일 변경 이벤트를 감지할 수 있습니다.

```tsx
"use client";

import { Text, VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { useRef, useState } from "react";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "success",
    },
  ];
}

export default function AttachmentDisplayValueChanges() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>([]);
  const entriesRef = useRef(entries);
  const [logs, setLogs] = useState<string[]>([]);

  entriesRef.current = entries;

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // addEntries로 추가하든 제거 버튼으로 지우든 변경은 항상 onEntriesChange로 흐르므로,
  // 추가/삭제 감지를 여기 한 곳에서 처리합니다.
  const handleEntriesChange = (next: DisplayItemEntry[]) => {
    const prev = entriesRef.current;
    const added = next.filter((n) => !prev.some((p) => p.id === n.id));
    const removed = prev.filter((p) => !next.some((n) => n.id === p.id));
    if (added.length > 0) addLog(`added: ${added.map((a) => a.id).join(", ")}`);
    if (removed.length > 0) addLog(`removed: ${removed.map((r) => r.id).join(", ")}`);
    setEntries(next);
  };

  return (
    <VStack gap="x4" width="100%" alignItems="center">
      <VStack gap="x1">
        {logs.length === 0 ? (
          <Text color="fg.neutralMuted">아이템을 추가하거나 삭제하면 로그가 표시됩니다.</Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} fontSize="fontSize.caption1">
              {log}
            </Text>
          ))
        )}
      </VStack>
      <AttachmentDisplayField
        entries={entries}
        onEntriesChange={handleEntriesChange}
        maxEntries={3}
      >
        <AttachmentDisplay
          onTriggerClick={async ({ addEntries }) => {
            addEntries(await openMediaPicker());
          }}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
```

## Managing Item Status \[#managing-item-status]

`entries`의 각 항목은 `pending`, `uploading`, `success`, `error`의 status를 가질 수 있습니다. 새로 추가되는 항목의 status 기본값은 의도에 맞게 자유롭게 지정할 수 있습니다(외부 피커가 막 던진 항목이라면 `uploading`, 이미 업로드 완료된 미디어를 hydrate한다면 `success`).

외부 업로드 API와 연동하는 경우, `onTriggerClick`·`onRetry` 콜백으로 함께 전달되는 `updateEntryStatus` 헬퍼를 사용하여 각 항목의 status를 업데이트합니다.

```tsx
"use client";

import { VStack } from "@seed-design/react";
import type { DisplayItemEntry, DisplayItemStatusDetails } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const defaultEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/upload1/200/200",
    status: "uploading",
    progress: 30,
  },
  {
    id: "2",
    thumbnailUrl: "https://picsum.photos/seed/upload2/200/200",
    status: "success",
  },
  {
    id: "3",
    thumbnailUrl: "https://picsum.photos/seed/upload3/200/200",
    status: "error",
  },
];

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "uploading",
    },
  ];
}

// 실제 환경에서는 네이티브 브릿지 또는 외부 업로드 API와 연동하세요.
// status는 컴포넌트가 콜백으로 전달하는 updateEntryStatus 헬퍼로만 갱신합니다.
function simulateUpload(
  id: string,
  updateEntryStatus: (id: string, details: DisplayItemStatusDetails) => void,
) {
  updateEntryStatus(id, { status: "uploading", progress: 0 });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    if (progress >= 100) {
      clearInterval(interval);
      updateEntryStatus(id, Math.random() > 0.5 ? { status: "success" } : { status: "error" });
    } else {
      updateEntryStatus(id, { status: "uploading", progress });
    }
  }, 300);
}

export default function AttachmentDisplayStatus() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={defaultEntries} maxEntries={5}>
        <AttachmentDisplay
          onTriggerClick={async ({ addEntries, updateEntryStatus }) => {
            const pickedEntries = await openMediaPicker();
            addEntries(pickedEntries);
            for (const entry of pickedEntries) {
              simulateUpload(entry.id, updateEntryStatus);
            }
          }}
          onRetry={(entry, { updateEntryStatus }) => simulateUpload(entry.id, updateEntryStatus)}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
```

- `uploading`: [ProgressCircle](/react/components/progress-circle)이 표시됩니다.
  - `progress`를 설정하여 업로드 진행률을 표시할 수 있습니다.
  - `progress`를 지정하지 않는 경우 [indeterminate](/react/components/progress-circle#indeterminate) 상태로 표시됩니다.
- `error`: 재시도 버튼이 표시됩니다.
  - 클릭 시 `AttachmentDisplay`에 지정한 `onRetry` 콜백이 `(entry, { updateEntryStatus })` 인자로 실행됩니다. `updateEntryStatus`로 해당 항목을 다시 `uploading` 상태로 되돌려 업로드를 재시도하세요.

## Reordering Entries \[#reordering-entries]

`AttachmentDisplayReorderable`을 사용하면 드래그로 항목의 순서를 변경할 수 있습니다.

해당 컴포넌트는 `dnd-kit` 의존성 분리를 위해 별도 snippet [`ui:attachment-display-field-reorderable`](#reorderable)로 제공됩니다.

Context를 통해 `reorderEntry`가 제공되므로, 필요한 경우 원하는 드래그 앤 드롭 동작을 직접 구현하거나, 이미 프로젝트에서 사용 중인 드래그 앤 드롭 라이브러리와 연동하여 사용할 수 있습니다.

```tsx
"use client";

import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { useState } from "react";
import { AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { AttachmentDisplayReorderable } from "seed-design/ui/attachment-display-field-reorderable";

const defaultEntries: DisplayItemEntry[] = [
  { id: "1", thumbnailUrl: "https://picsum.photos/seed/reorder1/200/200", status: "success" },
  { id: "2", thumbnailUrl: "https://picsum.photos/seed/reorder2/200/200", status: "success" },
  { id: "3", thumbnailUrl: "https://picsum.photos/seed/reorder3/200/200", status: "success" },
];

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "success",
    },
  ];
}

export default function AttachmentDisplayReorderableExample() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>(defaultEntries);

  return (
    <AttachmentDisplayField entries={entries} onEntriesChange={setEntries} maxEntries={5}>
      <AttachmentDisplayReorderable
        onTriggerClick={async ({ addEntries }) => {
          addEntries(await openMediaPicker());
        }}
      />
    </AttachmentDisplayField>
  );
}
```

## Examples \[#examples]

### Disabled \[#disabled]

`disabled` prop으로 trigger 버튼을 비활성화할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const sampleEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/disabled1/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayDisabled() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={sampleEntries} maxEntries={5} disabled>
        <AttachmentDisplay onTriggerClick={() => {}} />
      </AttachmentDisplayField>
    </VStack>
  );
}
```

### Read Only \[#read-only]

`readOnly` prop으로 읽기 전용 상태를 표현할 수 있습니다. trigger, 파일 제거 버튼, 순서 변경 모두 비활성화됩니다.

```tsx
import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const sampleEntries: DisplayItemEntry[] = [
  {
    id: "1",
    thumbnailUrl: "https://picsum.photos/seed/readonly1/200/200",
    status: "success",
  },
  {
    id: "2",
    thumbnailUrl: "https://picsum.photos/seed/readonly2/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayReadOnly() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={sampleEntries} maxEntries={5} readOnly>
        <AttachmentDisplay onTriggerClick={() => {}} />
      </AttachmentDisplayField>
    </VStack>
  );
}
```

### Controlled \[#controlled]

`entries`와 `onEntriesChange`를 사용하여 외부에서 아이템 목록을 제어할 수 있습니다.

```tsx
"use client";

import { HStack, Text, VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "success",
    },
  ];
}

export default function AttachmentDisplayControlled() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>([]);

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField entries={entries} onEntriesChange={setEntries} maxEntries={5}>
        <AttachmentDisplay
          onTriggerClick={async ({ addEntries }) => {
            addEntries(await openMediaPicker());
          }}
        />
      </AttachmentDisplayField>
      <Text>현재 아이템: {entries.length}개</Text>
      <HStack gap="x2">
        <ActionButton type="button" variant="neutralWeak" onClick={() => setEntries([])}>
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
import { vars } from "@seed-design/css/vars";
import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

const defaultEntries: DisplayItemEntry[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  thumbnailUrl: `https://picsum.photos/seed/inset${i + 1}/200/200`,
  status: "success",
}));

export default function AttachmentDisplayCustomInset() {
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
        <AttachmentDisplayField
          defaultEntries={defaultEntries}
          maxEntries={10}
          style={
            {
              "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
            } as React.CSSProperties
          }
        >
          <AttachmentDisplay
            onTriggerClick={() => {
              // 외부 미디어 피커 호출 자리
            }}
          />
        </AttachmentDisplayField>
      </VStack>
    </VStack>
  );
}
```

### Field Integration \[#field-integration]

`label`, `description`, `errorMessage` 등 Field 관련 prop을 전달할 수 있습니다.

```tsx
"use client";

import { VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { useState } from "react";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";

const defaultEntries: DisplayItemEntry[] = [
  { id: "1", thumbnailUrl: "https://picsum.photos/seed/field1/200/200", status: "success" },
];

// 외부 미디어 피커 모킹. 실제 환경에서는 네이티브 브릿지/모달/서버 호출 등으로 교체하세요.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [
    {
      id,
      thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
      status: "success",
    },
  ];
}

export default function AttachmentDisplayFieldExample() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>(defaultEntries);
  const invalid = entries.length < 1;

  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField
        entries={entries}
        onEntriesChange={setEntries}
        maxEntries={5}
        invalid={invalid}
        label="프로필 사진"
        indicator="선택"
        description="최대 5장까지 첨부할 수 있어요"
        errorMessage="최소 1장은 첨부해야 해요"
        showRequiredIndicator
      >
        <AttachmentDisplay
          onTriggerClick={async ({ addEntries }) => {
            addEntries(await openMediaPicker());
          }}
        />
      </AttachmentDisplayField>
    </VStack>
  );
}
```

### Customizing Items \[#customizing-items]

Snippet이 제공하는 기본 아이템 구성 외에 추가적인 커스터마이징이 필요한 경우, `@seed-design/react`에서 제공하는 `AttachmentDisplay.ItemBadge` 등의 요소를 활용하여 직접 아이템을 구성할 수 있습니다.

아래 예시에서는 `AttachmentDisplay.ItemBadge`를 사용하여 첫 번째 이미지에 "대표사진" 배지를 표시합니다.

```tsx
"use client";

import { IconArrowClockwiseCircularFill, IconXmarkFill } from "@karrotmarket/react-monochrome-icon";
import { AttachmentDisplay as SeedAttachmentDisplay, Icon, VStack } from "@seed-design/react";
import type { DisplayItemEntry } from "@seed-design/react/primitive";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { ProgressCircle } from "seed-design/ui/progress-circle";

const LABEL_REMOVE = "삭제";
const LABEL_RETRY = "재시도";

function CustomImageItem({
  entry,
  isCover,
  onRetry,
}: {
  entry: DisplayItemEntry;
  isCover?: boolean;
  onRetry?: () => void;
}) {
  return (
    <SeedAttachmentDisplay.Item entry={entry}>
      <SeedAttachmentDisplay.ItemImage />
      {isCover && <SeedAttachmentDisplay.ItemBadge>대표사진</SeedAttachmentDisplay.ItemBadge>}
      <SeedAttachmentDisplay.ItemBackdrop status="uploading">
        {(e) => (
          <ProgressCircle
            size="24"
            tone="staticWhite"
            {...("progress" in e && { value: e.progress })}
          />
        )}
      </SeedAttachmentDisplay.ItemBackdrop>
      {onRetry && (
        <SeedAttachmentDisplay.ItemBackdrop status="error">
          <SeedAttachmentDisplay.ItemActionButton onClick={onRetry}>
            <Icon svg={<IconArrowClockwiseCircularFill />} />
            {LABEL_RETRY}
          </SeedAttachmentDisplay.ItemActionButton>
        </SeedAttachmentDisplay.ItemBackdrop>
      )}
      <SeedAttachmentDisplay.ItemRemoveButton aria-label={LABEL_REMOVE}>
        <Icon svg={<IconXmarkFill />} />
      </SeedAttachmentDisplay.ItemRemoveButton>
    </SeedAttachmentDisplay.Item>
  );
}

const defaultEntries: DisplayItemEntry[] = [
  { id: "1", thumbnailUrl: "https://picsum.photos/seed/customizing1/200/200", status: "success" },
  { id: "2", thumbnailUrl: "https://picsum.photos/seed/customizing2/200/200", status: "success" },
  { id: "3", thumbnailUrl: "https://picsum.photos/seed/customizing3/200/200", status: "success" },
];

export default function AttachmentDisplayCustomizingItems() {
  return (
    <VStack gap="x4" p="x6" width="100%">
      <AttachmentDisplayField defaultEntries={defaultEntries} maxEntries={10}>
        <AttachmentDisplay
          onTriggerClick={() => {
            // 외부 미디어 피커 호출 자리
          }}
        >
          {({ entries }) =>
            entries.map((entry, index) => (
              <CustomImageItem key={entry.id} entry={entry} isCover={index === 0} />
            ))
          }
        </AttachmentDisplay>
      </AttachmentDisplayField>
    </VStack>
  );
}
```

## Attachment Display Field vs. Attachment Field \[#attachment-display-field-vs-attachment-field]

HTML `<input type="file">`을 사용해야 하는 경우 `AttachmentField`를, 외부 소스와 연동하여 URL 기반으로 미디어를 표시해야 하는 경우 `AttachmentDisplayField`를 사용하세요.

|                | Attachment Field           | Attachment Display           |
| -------------- | -------------------------- | ---------------------------- |
| 미디어 소스         | HTML `<input type="file">` | 이미지 URL                      |
| 데이터 모델         | `File` 기반 `FileEntry`      | URL 기반 `DisplayItemEntry`    |
| 파일 선택          | `<input type="file">`      | 다루지 않음 (`onTriggerClick` 위임) |
| 드래그 앤 드롭으로 업로드 | `AttachmentDropzone`       | 다루지 않음                       |
| 파일 검증          | accept, maxFileSize 등      | 다루지 않음                       |
| Form 연동        | `<input type="file">` 동기화  | 다루지 않음                       |