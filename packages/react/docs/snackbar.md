file: components/snackbar.mdx

# Snackbar

화면 하단에 일시적으로 나타나 상태나 결과를 안내하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "seed-design/ui/snackbar";

function Component() {
  const adapter = useSnackbarAdapter();

  return (
    <ActionButton
      onClick={() =>
        adapter.create({
          onClose: () => {},
          render: () => <Snackbar message="알림 메세지" actionLabel="확인" onAction={() => {}} />,
        })
      }
    >
      실행
    </ActionButton>
  );
}

export default function SnackbarPreview() {
  return (
    <SnackbarProvider>
      <Component />
    </SnackbarProvider>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:snackbar
- pnpm: pnpm dlx @seed-design/cli@latest add ui:snackbar
- yarn: yarn dlx @seed-design/cli@latest add ui:snackbar
- bun: bun x @seed-design/cli@latest add ui:snackbar

<ManualInstallation name="snackbar" />

## Props \[#props]

### `Snackbar` \[#snackbar]

- `message`
  - type: `string`
  - required: `true`
  - description: 스낵바에 표시할 메시지
- `actionLabel`
  - type: `string | undefined`
  - description: 스낵바에 표시할 액션 버튼의 라벨
- `onAction`
  - type: `(() => void) | undefined`
  - description: 액션 버튼 클릭 시 호출되는 콜백
- `variant`
  - type: `"default" | "positive" | "critical" | undefined`
  - default: `"default"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `SnackbarAdapter.create` Parameters (`CreateSnackbarOptions`) \[#snackbaradaptercreate-parameters-createsnackbaroptions]

- `timeout`
  - type: `number | undefined`
  - default: `4000`
  - description: The duration the snackbar will be visible
- `removeDelay`
  - type: `number | undefined`
  - default: `200`
  - description: The duration for the snackbar to kept alive before it is removed. Useful for exit transitions.
- `onClose`
  - type: `(() => void) | undefined`
  - description: Function called when the snackbar has been closed and removed
- `render`
  - type: `() => React.ReactNode`
  - required: `true`
  - description: The content to render in the snackbar region
- `strategy`
  - type: `"immediate" | "queued" | undefined`
  - description: Override the provider-level strategy for this specific snackbar. - \`"immediate"\`: Replace the current snackbar instantly. - \`"queued"\`: Wait in the queue until the current one is dismissed.

### `SnackbarProvider` \[#snackbarprovider]

- `children`
  - type: `React.ReactNode`
  - required: `true`
- `pauseOnInteraction`
  - type: `boolean | undefined`
  - default: `true`
  - description: Whether to pause the toast when interacted with
- `strategy`
  - type: `"immediate" | "queued" | undefined`
  - default: `"immediate"`
  - description: How to handle multiple snackbars. - \`"immediate"\`: New snackbar replaces the current one instantly. - \`"queued"\`: New snackbar waits in a queue until the current one is dismissed.

## Examples \[#examples]

### Variants \[#variants]

#### Positive \[#positive]

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "seed-design/ui/snackbar";

function Component() {
  const adapter = useSnackbarAdapter();

  return (
    <ActionButton
      onClick={() =>
        adapter.create({
          onClose: () => {},
          render: () => (
            <Snackbar
              variant="positive"
              message="알림 메세지"
              actionLabel="확인"
              onAction={() => {}}
            />
          ),
        })
      }
    >
      실행
    </ActionButton>
  );
}

export default function SnackbarPositive() {
  return (
    <SnackbarProvider>
      <Component />
    </SnackbarProvider>
  );
}
```

#### Critical \[#critical]

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "seed-design/ui/snackbar";

function Component() {
  const adapter = useSnackbarAdapter();

  return (
    <ActionButton
      onClick={() =>
        adapter.create({
          timeout: 50000000,
          onClose: () => {},
          render: () => (
            <Snackbar
              variant="critical"
              message="알림 메세지"
              actionLabel="확인"
              onAction={() => {}}
            />
          ),
        })
      }
    >
      실행
    </ActionButton>
  );
}

export default function SnackbarNegative() {
  return (
    <SnackbarProvider>
      <Component />
    </SnackbarProvider>
  );
}
```

### Pause on Interaction \[#pause-on-interaction]

사용자가 Snackbar와 상호작용(hover 및 active) 하는 동안 Snackbar가 timeout으로 인해 dismiss되지 않도록 하려면 `SnackbarProvider`의 `pauseOnInteraction`을 `true`로 설정합니다.

<Callout type="warning" title="기본값">
  - `@seed-design/react@0.1.14`까지: `false`: 명시하지 않는 경우, 상호작용 여부와 관계없이 timeout이 지나면 dismiss됩니다.
  - 이후 버전: `true`: 명시하지 않는 경우, 사용자가 상호작용하는 동안 timeout이 멈춥니다.
</Callout>

```tsx
import { VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { useState } from "react";

function Component() {
  const adapter = useSnackbarAdapter();

  return (
    <ActionButton
      onClick={() =>
        adapter.create({
          onClose: () => {},
          render: () => <Snackbar message="알림 메세지" actionLabel="확인" onAction={() => {}} />,
        })
      }
    >
      실행
    </ActionButton>
  );
}

export default function SnackbarPauseOnInteraction() {
  const [pauseOnInteraction, setPauseOnInteraction] = useState(true);

  return (
    <VStack gap="spacingY.componentDefault" alignItems="center">
      <SnackbarProvider pauseOnInteraction={pauseOnInteraction}>
        <Component />
      </SnackbarProvider>
      <SegmentedControl
        aria-label="Pause on interaction"
        value={`${pauseOnInteraction}`}
        onValueChange={(value) => setPauseOnInteraction(value === "true")}
      >
        <SegmentedControlItem value="false">false</SegmentedControlItem>
        <SegmentedControlItem value="true">true</SegmentedControlItem>
      </SegmentedControl>
    </VStack>
  );
}
```

### Strategy \[#strategy]

Snackbar가 이미 표시 중일 때 새로운 Snackbar를 생성하면, 기본적으로 기존 Snackbar를 즉시 교체합니다 (`immediate`).
큐에 넣고 순차적으로 보여주려면 `strategy: "queued"`를 사용합니다.

`strategy`는 `SnackbarProvider`에서 기본값을 설정하거나, `create()` 호출 시 개별적으로 지정할 수 있습니다.

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import { Snackbar, SnackbarProvider, useSnackbarAdapter } from "seed-design/ui/snackbar";

function Component() {
  const adapter = useSnackbarAdapter();

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <ActionButton
        variant="neutralSolid"
        onClick={() =>
          adapter.create({
            render: () => <Snackbar variant="positive" message="저장되었습니다" />,
          })
        }
      >
        Immediate (positive)
      </ActionButton>
      <ActionButton
        variant="neutralSolid"
        onClick={() =>
          adapter.create({
            strategy: "queued",
            render: () => <Snackbar variant="critical" message="오류가 발생했습니다" />,
          })
        }
      >
        Queued (critical)
      </ActionButton>
    </div>
  );
}

export default function SnackbarStrategy() {
  return (
    <SnackbarProvider>
      <Component />
    </SnackbarProvider>
  );
}
```

### Avoid Overlap \[#avoid-overlap]

`<SnackbarAvoidOverlap />` 컴포넌트를 사용하여 스낵바가 겹치지 않아야 하는 영역을 지정할 수 있습니다.
`<SnackbarAvoidOverlap />`의 자식 컴포넌트는 forwardRef(~React 18) 혹은 ref prop(React 19~)으로 ref를 전달받아야 합니다.
offset은 다음 상황에서 갱신됩니다.

- SnackbarAvoidOverlap의 자식 컴포넌트가 mount될 때
- SnackbarAvoidOverlap의 자식 컴포넌트가 unmount될 때
- SnackbarAvoidOverlap의 자식 컴포넌트의 높이가 변경될 때
- SnackbarRegion의 높이가 변경될 때

```tsx
import { Flex, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  Snackbar,
  SnackbarAvoidOverlap,
  SnackbarProvider,
  useSnackbarAdapter,
} from "seed-design/ui/snackbar";

function Component() {
  const adapter = useSnackbarAdapter();

  return (
    <VStack gap="x4">
      <ActionButton
        onClick={() =>
          adapter.create({
            onClose: () => {},
            render: () => <Snackbar message="알림 메세지" actionLabel="확인" onAction={() => {}} />,
          })
        }
      >
        실행
      </ActionButton>
      <SnackbarAvoidOverlap>
        <Flex width="full" height="x16" bg="bg.criticalWeak" justify="center" align="center">
          Snackbar가 이 영역과 겹치지 않게 조정됩니다. 스크롤은 무시합니다.
        </Flex>
      </SnackbarAvoidOverlap>
    </VStack>
  );
}

export default function SnackbarPreview() {
  return (
    <SnackbarProvider>
      <Component />
    </SnackbarProvider>
  );
}
```