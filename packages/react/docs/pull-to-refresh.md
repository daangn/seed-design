file: components/pull-to-refresh.mdx

# Pull To Refresh

사용자가 화면을 아래로 당겨 콘텐츠를 새로고침할 수 있게 해주는 컴포넌트입니다. 모바일 환경에서 최신 콘텐츠를 불러올 때 사용됩니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

<StackflowExample path="/pull-to-refresh-preview">
  ```tsx
  import { AppBar, AppScreen } from "@seed-design/stackflow";
  import { type StaticActivityComponentType } from "@stackflow/react/future";
  import { VStack } from "@seed-design/react";
  import {
    PullToRefreshContent,
    PullToRefreshIndicator,
    PullToRefreshRoot,
  } from "seed-design/ui/pull-to-refresh";

  declare module "@stackflow/config" {
    interface Register {
      ActivityPullToRefreshPreview: {};
    }
  }

  const ActivityPullToRefreshPreview: StaticActivityComponentType<
    "ActivityPullToRefreshPreview"
  > = () => {
    // AppScreen is imported from @seed-design/stackflow instead of snippet for demo purpose.
    // AppScreen snippet is integrating PullToRefresh, so it's not necessary to use it here.
    return (
      <AppScreen.Root>
        <AppBar.Root>
          <AppBar.Main>
            <AppBar.Title>Pull To Refresh</AppBar.Title>
          </AppBar.Main>
        </AppBar.Root>
        <PullToRefreshRoot
          asChild
          onPtrReady={() => {}}
          onPtrRefresh={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
        >
          <AppScreen.Layer>
            <PullToRefreshIndicator />
            <PullToRefreshContent asChild>
              <VStack px="spacingX.globalGutter">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam autem deserunt
                reprehenderit ducimus sunt. Quod laudantium excepturi tempora fuga repellendus
                accusantium nam maiores? Quas debitis, neque ullam eligendi minus sit?
              </VStack>
            </PullToRefreshContent>
          </AppScreen.Layer>
        </PullToRefreshRoot>
      </AppScreen.Root>
    );
  };

  export default ActivityPullToRefreshPreview;
  ```
</StackflowExample>

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:pull-to-refresh
- pnpm: pnpm dlx @seed-design/cli@latest add ui:pull-to-refresh
- yarn: yarn dlx @seed-design/cli@latest add ui:pull-to-refresh
- bun: bun x @seed-design/cli@latest add ui:pull-to-refresh

<ManualInstallation name="pull-to-refresh" />

## Props \[#props]

### `PullToRefreshRoot` \[#pulltorefreshroot]

- `threshold`
  - type: `number | undefined`
  - default: `44`
  - description: The threshold value to trigger the refresh. (px)
- `displacementMultiplier`
  - type: `number | undefined`
  - default: `0.5`
  - description: The multiplier to calculate displacement from the touch movement.
- `onPtrPullStart`
  - type: `((ctx: PullToRefreshContext) => void) | undefined`
  - description: Callback when the pull-to-refresh has started to pull.
- `onPtrPullMove`
  - type: `((ctx: PullToRefreshContext) => void) | undefined`
  - description: Callback when the pull-to-refresh is moving during the pull.
- `onPtrPullEnd`
  - type: `((ctx: PullToRefreshContext) => void) | undefined`
  - description: Callback when the pull-to-refresh is released. It does not matter if it is ready or not. If you want to handle the refresh, use \`onPtrRefresh\`.
- `onPtrReady`
  - type: `(() => void) | undefined`
  - description: Callback when the pull-to-refresh is pulled over the threshold.
- `onPtrRefresh`
  - type: `(() => Promise<void>) | undefined`
  - description: Callback when the pull-to-refresh is released after ready.
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether to disable the pull-to-refresh.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `PullToRefreshIndicator` \[#pulltorefreshindicator]

<TypeTable
  id="type-table-pull-to-refresh.tsx-PullToRefreshIndicatorProps"
  type="{
&#x22;id&#x22;: &#x22;pull-to-refresh.tsx-PullToRefreshIndicatorProps&#x22;,
&#x22;name&#x22;: &#x22;PullToRefreshIndicatorProps&#x22;,
&#x22;description&#x22;: &#x22;&#x22;,
&#x22;entries&#x22;: []
}"
/>

### `PullToRefreshContent` \[#pulltorefreshcontent]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### PTR in Tabs \[#ptr-in-tabs]

<StackflowExample path="/pull-to-refresh-tabs">
  ```tsx
  import { VStack } from "@seed-design/react";
  import { type StaticActivityComponentType } from "@stackflow/react/future";
  import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
  import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
  import {
    PullToRefreshContent,
    PullToRefreshIndicator,
    PullToRefreshRoot,
  } from "seed-design/ui/pull-to-refresh";
  import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

  declare module "@stackflow/config" {
    interface Register {
      ActivityPullToRefreshTabs: {};
    }
  }

  const ActivityPullToRefreshTabs: StaticActivityComponentType<"ActivityPullToRefreshTabs"> = () => {
    return (
      <AppScreen>
        <AppBar>
          <AppBarMain>Pull To Refresh</AppBarMain>
        </AppBar>
        <AppScreenContent>
          <TabsRoot defaultValue="1" contentLayout="fill">
            <TabsList>
              <TabsTrigger value="1">Tab 1</TabsTrigger>
              <TabsTrigger value="2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
              <PullToRefreshRoot
                onPtrReady={() => {}}
                onPtrRefresh={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                }}
              >
                <PullToRefreshIndicator />
                <PullToRefreshContent asChild>
                  <VStack px="spacingX.globalGutter">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam autem deserunt
                    reprehenderit ducimus sunt. Quod laudantium excepturi tempora fuga repellendus
                    accusantium nam maiores? Quas debitis, neque ullam eligendi minus sit?
                  </VStack>
                </PullToRefreshContent>
              </PullToRefreshRoot>
            </TabsContent>
            <TabsContent value="2">
              <VStack px="spacingX.globalGutter">PTR is not available in this tab.</VStack>
            </TabsContent>
          </TabsRoot>
        </AppScreenContent>
      </AppScreen>
    );
  };

  export default ActivityPullToRefreshTabs;
  ```
</StackflowExample>

### Disabled \[#disabled]

`disabled` 속성을 사용하여 PTR를 비활성화할 수 있습니다.

```tsx
import { Box, HStack, Text } from "@seed-design/react";
import { useState } from "react";
import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "seed-design/ui/pull-to-refresh";
import { Switch } from "seed-design/ui/switch";

const PullToRefreshDisabled = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <Box width="300px" height="500px" borderColor="stroke.neutralMuted" borderWidth={1}>
      <PullToRefreshRoot
        onPtrReady={() => {}}
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        disabled={disabled}
      >
        <PullToRefreshIndicator />
        <PullToRefreshContent asChild>
          <HStack px="spacingX.globalGutter" py="x4" align="center" justify="space-between">
            <Text>Disabled</Text>
            <Switch checked={disabled} onCheckedChange={setDisabled} />
          </HStack>
        </PullToRefreshContent>
      </PullToRefreshRoot>
    </Box>
  );
};

export default PullToRefreshDisabled;
```

### Prevent Pull \[#prevent-pull]

`PullToRefresh.preventPull` 속성을 사용하여 특정 영역에서 PTR 동작을 방지할 수 있습니다. `user-select: auto;`등을 통해 텍스트 선택이 가능한 영역에서 주로 사용됩니다.

<StackflowExample path="/pull-to-refresh-prevent-pull">
  ```tsx
  import { AppBar, AppScreen } from "@seed-design/stackflow";
  import { type StaticActivityComponentType } from "@stackflow/react/future";
  import { VStack, PullToRefresh, Box } from "@seed-design/react";
  import {
    PullToRefreshContent,
    PullToRefreshIndicator,
    PullToRefreshRoot,
  } from "seed-design/ui/pull-to-refresh";

  declare module "@stackflow/config" {
    interface Register {
      ActivityPullToRefreshPreventPull: {};
    }
  }

  const ActivityPullToRefreshPreventPull: StaticActivityComponentType<
    "ActivityPullToRefreshPreventPull"
  > = () => {
    // AppScreen is imported from @seed-design/stackflow instead of snippet for demo purpose.
    // AppScreen snippet is integrating PullToRefresh, so it's not necessary to use it here.
    return (
      <AppScreen.Root>
        <AppBar.Root>
          <AppBar.Main>
            <AppBar.Title>Pull To Refresh</AppBar.Title>
          </AppBar.Main>
        </AppBar.Root>
        <PullToRefreshRoot
          asChild
          onPtrReady={() => {}}
          onPtrRefresh={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
        >
          <AppScreen.Layer>
            <PullToRefreshIndicator />
            <PullToRefreshContent asChild>
              <VStack px="spacingX.globalGutter" gap="x4">
                <Box p="x4" bg="bg.neutralWeak" color="fg.neutral" borderRadius="r2">
                  이 영역은 당겨서 새로고침이 가능합니다. Amet in laborum proident fugiat mollit quis
                  aute mollit esse nostrud. Excepteur ea proident ipsum duis. Nulla Lorem pariatur
                  exercitation velit anim.
                </Box>
                <Box
                  p="x4"
                  bg="bg.criticalWeak"
                  color="fg.criticalContrast"
                  borderRadius="r2"
                  {...PullToRefresh.preventPull}
                >
                  이 영역은 당겨서 새로고침이 불가능합니다. Aliquip ad amet eu dolore id enim
                  excepteur laboris officia anim in. Irure irure nulla sit eiusmod aliqua sint
                  excepteur amet laboris.
                </Box>
                <Box p="x4" bg="bg.neutralWeak" color="fg.neutral" borderRadius="r2">
                  이 영역은 당겨서 새로고침이 가능합니다. Amet in laborum proident fugiat mollit quis
                  aute mollit esse nostrud. Excepteur ea proident ipsum duis. Nulla Lorem pariatur
                  exercitation velit anim.
                </Box>
                <Box
                  p="x4"
                  bg="bg.criticalWeak"
                  color="fg.criticalContrast"
                  borderRadius="r2"
                  {...PullToRefresh.preventPull}
                >
                  이 영역은 당겨서 새로고침이 불가능합니다. Aliquip ad amet eu dolore id enim
                  excepteur laboris officia anim in. Irure irure nulla sit eiusmod aliqua sint
                  excepteur amet laboris.
                </Box>
              </VStack>
            </PullToRefreshContent>
          </AppScreen.Layer>
        </PullToRefreshRoot>
      </AppScreen.Root>
    );
  };

  export default ActivityPullToRefreshPreventPull;
  ```
</StackflowExample>