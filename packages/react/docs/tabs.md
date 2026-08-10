file: components/tabs.mdx

# Tabs

한 화면 내에서 콘텐츠를 탭 단위로 구분하여 전환할 수 있는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsPreview() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content>Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content>Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content>Content 3</Content>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:tabs
- pnpm: pnpm dlx @seed-design/cli@latest add ui:tabs
- yarn: yarn dlx @seed-design/cli@latest add ui:tabs
- bun: bun x @seed-design/cli@latest add ui:tabs

<ManualInstallation name="tabs" />

## Props \[#props]

### `TabsRoot` \[#tabsroot]

- `triggerLayout`
  - type: `"fill" | "hug" | undefined`
  - default: `"fill"`
- `contentLayout`
  - type: `"fill" | "hug" | undefined`
  - default: `"hug"`
- `size`
  - type: `"small" | "medium" | undefined`
  - default: `"small"`
- `stickyList`
  - type: `boolean | undefined`
  - default: `false`
- `orientation`
  - type: `"horizontal" | "vertical" | undefined`
- `value`
  - type: `string | undefined`
- `defaultValue`
  - type: `string | undefined`
- `onValueChange`
  - type: `((value: string) => void) | undefined`
- `lazyMount`
  - type: `boolean | undefined`
  - default: `false`
  - description: If \`true\`, the component will be mounted lazily.
- `unmountOnExit`
  - type: `boolean | undefined`
  - default: `false`
  - description: If \`true\`, the component will be unmounted when it's not selected.
- `present`
  - type: `boolean | undefined`
  - default: `false`
  - description: If \`true\`, the component will be mounted.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `TabsList` \[#tabslist]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `TabsTrigger` \[#tabstrigger]

- `notification`
  - type: `boolean | undefined`
- `value`
  - type: `string`
  - required: `true`
- `disabled`
  - type: `boolean | undefined`

### `TabsCarousel` \[#tabscarousel]

- `swipeable`
  - type: `boolean | undefined`
- `autoHeight`
  - type: `boolean | undefined`
- `loop`
  - type: `boolean | undefined`
- `dragThreshold`
  - type: `number | undefined`
- `onSettle`
  - type: `(() => void) | undefined`
- `onSwipeStart`
  - type: `(() => void) | undefined`
  - description: 스와이프 시작 시 호출됩니다.
- `onSwipeEnd`
  - type: `(() => void) | undefined`
  - description: 스와이프 종료 시 호출됩니다.

### `TabsContent` \[#tabscontent]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `value`
  - type: `string`
  - required: `true`

## Examples \[#examples]

### Layout Fill (Default) \[#layout-fill-default]

```tsx
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsLayoutFill() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="2" triggerLayout="fill">
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content>Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content>Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content>Content 3</Content>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

### Layout Hug \[#layout-hug]

```tsx
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsLayoutHug() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1" triggerLayout="hug">
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content>Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content>Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content>Content 3</Content>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

### Size Medium \[#size-medium]

```tsx
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsSizeMedium() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1" size="medium">
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content>Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content>Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content>Content 3</Content>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

### Size Small (Default) \[#size-small-default]

```tsx
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsSizeSmall() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1" size="small">
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content>Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content>Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content>Content 3</Content>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

### Transition \[#transition]

`TabsCarousel` 컴포넌트로 `TabsContent` 컴포넌트들을 감싸면 탭 변경시 컨텐츠가 자연스럽게 전환됩니다.

```tsx
import { TabsRoot, TabsList, TabsTrigger, TabsCarousel, TabsContent } from "seed-design/ui/tabs";

export default function TabsTransition() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="2">
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsCarousel>
          <TabsContent value="1">
            <Content>Content 1</Content>
          </TabsContent>
          <TabsContent value="2">
            <Content>Content 2</Content>
          </TabsContent>
          <TabsContent value="3">
            <Content>Content 3</Content>
          </TabsContent>
        </TabsCarousel>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

### Swipeable \[#swipeable]

`TabsCarousel` 컴포넌트에 `swipeable` 속성을 추가하면 스와이프 제스처로 탭을 이동할 수 있습니다.

```tsx
import { TabsRoot, TabsList, TabsTrigger, TabsCarousel, TabsContent } from "seed-design/ui/tabs";

export default function TabsSwipeable() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="2">
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsCarousel swipeable>
          <TabsContent value="1">
            <Content>Content 1</Content>
          </TabsContent>
          <TabsContent value="2">
            <Content>Content 2</Content>
          </TabsContent>
          <TabsContent value="3">
            <Content>Content 3</Content>
          </TabsContent>
        </TabsCarousel>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

### Carousel Prevent Drag \[#carousel-prevent-drag]

`Tabs.carouselPreventDrag`를 사용하면 특정 요소가 드래그 제스처에 반응하지 않도록 설정할 수 있습니다.

```tsx
import { Box, Tabs } from "@seed-design/react";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsCarouselPreventDrag() {
  return (
    <Box width="360px" height="480px">
      <TabsRoot contentLayout="fill" defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsCarousel swipeable>
          <TabsContent value="1">
            <Box overflowX="scroll" {...Tabs.carouselPreventDrag}>
              <Box width="1000px" height="100px" bg="bg.criticalWeak">
                Scrollable area
              </Box>
            </Box>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis ab ex accusantium
            sit. Amet maxime eum molestiae nemo. Beatae sint omnis aut cumque doloremque fugit
            perspiciatis rerum possimus, reiciendis eaque?
          </TabsContent>
          <TabsContent value="2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </TabsContent>
        </TabsCarousel>
      </TabsRoot>
    </Box>
  );
}
```

### Disabled \[#disabled]

```tsx
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsDisabled() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2" disabled>
            라벨2
          </TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content>Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content>Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content>Content 3</Content>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

### Notification \[#notification]

```tsx
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsNotification() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2" notification>
            라벨2
          </TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content>Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content>Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content>Content 3</Content>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

### Sticky List \[#sticky-list]

<Callout type="info">
  탭이 전체화면을 차지하고, Tabs.List가 top에 고정되어 있는 경우 사용하는 예시입니다.
</Callout>

```tsx
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsStickyList() {
  return (
    // 600은 화면 높이라고 가정합니다. 실제 앱에서는 화면(body)이 스크롤 컨테이너 역할을 하므로
    // 예제에서는 overflowY로 이를 흉내냅니다. TabsList는 이 컨테이너의 top에 고정됩니다.
    <div style={{ width: "360px", height: "600px", overflowY: "auto" }}>
      <TabsRoot defaultValue="1" size="medium" stickyList>
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <Content height="1000px">Content 1</Content>
        </TabsContent>
        <TabsContent value="2">
          <Content height="1000px">Content 2</Content>
        </TabsContent>
        <TabsContent value="3">
          <Content height="1000px">Content 3</Content>
        </TabsContent>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren<{ height: string }>) => {
  const { height, children } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height,
        background: "linear-gradient(to bottom, white, gray)",
      }}
    >
      {children}
    </div>
  );
};
```

### Standalone \[#standalone]

<Callout type="info">
  TabContent를 사용하지 않고, 컨텐츠 영역을 온전히 소유하고 싶을 때 사용하는 예시입니다.
</Callout>

<Callout type="warn">
  탭에서 제공하는 Swipe 기능을 사용할 수 없습니다.
</Callout>

```tsx
import { useState } from "react";
import { TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsStandalone() {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        {activeTab === "1" && (
          <div>
            <Content>Content 1</Content>
          </div>
        )}
        {activeTab === "2" && (
          <div>
            <Content>Content 2</Content>
          </div>
        )}
        {activeTab === "3" && (
          <div>
            <Content>Content 3</Content>
          </div>
        )}
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
```

### Dynamic Height \[#dynamic-height]

<Callout type="info">
  각 탭의 높이가 다를 때, 아래의 컨텐츠를 탭 아래에 바로 맞추기 위해서 사용하는 예시입니다.
</Callout>

<Callout type="warn">
  탭이 자주 바뀌고, 탭에 네트워크 요청이 많은 경우 캐싱을 잘 고려해주세요.
</Callout>

```tsx
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsDynamicHeight() {
  return (
    <div style={{ width: "360px" }}>
      <TabsRoot defaultValue="1" lazyMount unmountOnExit>
        <TabsList>
          <TabsTrigger value="1">라벨1</TabsTrigger>
          <TabsTrigger value="2">라벨2</TabsTrigger>
          <TabsTrigger value="3">라벨3</TabsTrigger>
        </TabsList>
        <TabsCarousel autoHeight>
          <TabsContent value="1">
            <Content height="100px">Content 1</Content>
          </TabsContent>
          <TabsContent value="2">
            <Content height="200px">Content 2</Content>
          </TabsContent>
          <TabsContent value="3">
            <Content height="300px">Content 3</Content>
          </TabsContent>
        </TabsCarousel>
      </TabsRoot>
      <div style={{ height: "100px", backgroundColor: "gray" }}>아래 컨텐츠</div>
    </div>
  );
}

const Content = (props: React.PropsWithChildren<{ height: string }>) => {
  const { height, children } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height,
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {children}
    </div>
  );
};
```

### Scroll to Top \[#scroll-to-top]

```tsx
import { RefObject, useRef, useState } from "react";
import { TabsCarousel, TabsContent, TabsList, TabsRoot, TabsTrigger } from "seed-design/ui/tabs";

export default function TabsScrollTop() {
  const [currentTab, setCurrentTab] = useState("1");
  const contentRefs: Record<string, RefObject<HTMLDivElement | null>> = {
    "1": useRef(null),
    "2": useRef(null),
  };

  const handleTriggerClick = (value: string) => {
    if (value === currentTab) {
      contentRefs[value].current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div style={{ width: "360px" }}>
      <TabsRoot triggerLayout="fill" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger onClick={() => handleTriggerClick("1")} value="1">
            라벨1
          </TabsTrigger>
          <TabsTrigger onClick={() => handleTriggerClick("2")} value="2">
            라벨2
          </TabsTrigger>
        </TabsList>
        <TabsCarousel swipeable>
          <TabsContent ref={contentRefs["1"]} value="1" style={{ maxHeight: "200px" }}>
            <Content height="1000px">Content 1</Content>
          </TabsContent>
          <TabsContent ref={contentRefs["2"]} value="2" style={{ maxHeight: "200px" }}>
            <Content height="1000px">Content 2</Content>
          </TabsContent>
        </TabsCarousel>
      </TabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren<{ height: string }>) => {
  const { height, children } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height,
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {children}
    </div>
  );
};
```