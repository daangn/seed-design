file: components/concepts/responsive-design.mdx

# Responsive Design

Viewport 크기에 따라 레이아웃과 스타일을 조정하는 방법을 알아봅니다.

SEED는 mobile-first 반응형 시스템을 제공합니다. 특정 breakpoint에 값을 지정하면 더 넓은 viewport에도 동일한 값이 적용됩니다.

## Breakpoints \[#breakpoints]

| 이름     | `min-width` |
| ------ | ----------- |
| `base` | 0px         |
| `sm`   | 480px       |
| `md`   | 768px       |
| `lg`   | 1280px      |
| `xl`   | 1440px      |

## 레이아웃 컴포넌트에서 반응형 Prop 사용하기 \[#레이아웃-컴포넌트에서-반응형-prop-사용하기]

`Box` 및 Box 기반 컴포넌트(`Flex`, `Grid`, `VStack`, `HStack` 등)에서 레이아웃 프로퍼티의 값으로 breakpoint 이름을 키로 사용하는 객체를 받을 수 있습니다.

```tsx
<Box padding={{ base: "x3", md: "x4" }} />
```

| 분류          | 프로퍼티                                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Layout**  | `display`, `flexDirection`, `gap`                                                                                                        |
| **Sizing**  | `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight`                                                                      |
| **Padding** | `padding`, `paddingX`, `paddingY`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `p`, `px`, `py`, `pt`, `pr`, `pb`, `pl` |
| **Bleed**   | `bleedX`, `bleedY`, `bleedTop`, `bleedRight`, `bleedBottom`, `bleedLeft`                                                                 |

```tsx
import { Box } from "@seed-design/react";

export default function ResponsivePropsExample() {
  return (
    <Box
      bg="bg.informativeWeak"
      color="fg.informativeContrast"
      padding={{ base: "x4", md: "x6", xl: "x8" }}
      borderRadius="r3"
      className="font-mono"
    >
      {`padding={{ base: "x4", md: "x6", xl: "x8" }}`}
    </Box>
  );
}
```

<Cards>
  <Card title="Box" href="/react/components/layout/box">
    Box 컴포넌트는 가장 기초적인 레이아웃 컴포넌트입니다. 디자인 토큰을 JSX에서
    사용할 수 있도록 도와줍니다.
  </Card>

  <Card title="Flex" href="/react/components/layout/flex">
    Flex 컴포넌트는 flexbox를 사용하며 디자인 토큰을 JSX에서 사용할 수 있도록
    도와줍니다.
  </Card>

  <Card title="Grid" href="/react/components/layout/grid">
    Grid 컴포넌트는 CSS Grid를 사용하며 디자인 토큰을 JSX에서 사용할 수 있도록
    도와줍니다.
  </Card>

  <Card title="VStack" href="/react/components/layout/v-stack">
    세로로 쌓이는 레이아웃을 구성합니다. 디자인 토큰을 JSX에서 사용할 수 있도록
    도와줍니다.
  </Card>

  <Card title="HStack" href="/react/components/layout/h-stack">
    가로로 쌓이는 레이아웃을 구성합니다. 디자인 토큰을 JSX에서 사용할 수 있도록
    도와줍니다.
  </Card>
</Cards>

### Hiding & Showing Elements \[#hiding--showing-elements]

`display`에 반응형 값을 전달하여 특정 breakpoint에서 요소를 표시하거나 숨길 수 있습니다.

```tsx
import { VStack, Text, Box } from "@seed-design/react";

export default function ResponsiveDisplayExample() {
  return (
    <VStack gap="x2" align="center">
      <Text textStyle="t3Medium">아래 Box는 md breakpoint 이상에서만 보입니다.</Text>
      <Box
        display={{ base: "none", md: "block" }}
        bg="bg.informativeWeak"
        color="fg.informativeContrast"
        padding="x4"
        borderRadius="r3"
        className="font-mono"
      >
        {`display={{ base: "none", md: "block" }}`}
      </Box>
    </VStack>
  );
}
```

#### `hideFrom` \[#hidefrom]

`hideFrom`을 사용하여 특정 breakpoint 이상에서 요소를 숨깁니다. (`display: none;`)

`Box` 및 Box 기반 컴포넌트(`Flex`, `Grid`, `VStack`, `HStack` 등)에서 사용할 수 있습니다.

`hideFrom="md"`는 `display={{ md: "none" }}`과 동일합니다.

```tsx
import { Box, VStack, Text } from "@seed-design/react";

export default function HideFromExample() {
  return (
    <VStack gap="x2" align="center">
      <Text textStyle="t3Medium">아래 Box는 xl breakpoint 이상에서는 숨겨집니다.</Text>
      <Box
        bg="bg.informativeWeak"
        color="fg.informativeContrast"
        padding="x4"
        borderRadius="r3"
        hideFrom="xl"
        className="font-mono"
      >
        hideFrom="xl"
      </Box>
    </VStack>
  );
}
```

### Grid \[#grid]

Breakpoint 별로 `columns`와 `rows` 속성을 지정할 수 있습니다.

```tsx
import { Box, Grid, Text, VStack } from "@seed-design/react";

export default function ResponsiveGridExample() {
  return (
    <VStack gap="x2" align="center">
      <Text textStyle="t3Medium">아래 Grid는 breakpoint 별로 열 수가 다르게 구성됩니다.</Text>
      <Grid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: "x3", md: "x4" }}>
        <Box bg="bg.informativeWeak" color="fg.informativeContrast" padding="x3" borderRadius="r2">
          1
        </Box>
        <Box bg="bg.informativeWeak" color="fg.informativeContrast" padding="x3" borderRadius="r2">
          2
        </Box>
        <Box bg="bg.informativeWeak" color="fg.informativeContrast" padding="x3" borderRadius="r2">
          3
        </Box>
        <Box bg="bg.informativeWeak" color="fg.informativeContrast" padding="x3" borderRadius="r2">
          4
        </Box>
      </Grid>
    </VStack>
  );
}
```

<Card title="Grid" href="/react/components/layout/grid">
  Grid 컴포넌트는 CSS Grid를 사용하며 디자인 토큰을 JSX에서 사용할 수 있도록
  도와줍니다.
</Card>

## Hooks \[#hooks]

`window.matchMedia`를 기반으로 구현된 `useBreakpoint` 및 `useBreakpointValue` 훅을 제공합니다.

가능한 경우 항상 CSS 기반으로 작동하는 반응형 prop을 사용하고, 훅은 JS 로직이 필요한 경우에만 사용하세요.

### `useBreakpoint` \[#usebreakpoint]

현재 속한 breakpoint 이름을 반환합니다.

```tsx
import { Box, useBreakpoint } from "@seed-design/react";

export default function UseBreakpointExample() {
  const breakpoint = useBreakpoint();

  return (
    <Box
      bg="bg.informativeWeak"
      color="fg.informativeContrast"
      padding="x4"
      borderRadius="r3"
      className="font-mono"
    >
      {breakpoint}
    </Box>
  );
}
```

### `useBreakpointValue` \[#usebreakpointvalue]

파라미터로 전달한 반응형 값 객체를 현재 viewport에 맞는 값으로 resolve합니다.

```tsx
import { ActionButton, ActionButtonProps } from "seed-design/ui/action-button";
import { useBreakpointValue, VStack, Text } from "@seed-design/react";

export default function UseBreakpointValueExample() {
  const actionButtonProps = useBreakpointValue<ActionButtonProps>({
    base: {
      variant: "neutralWeak",
      children: "variant=neutralWeak",
    },
    lg: {
      variant: "brandSolid",
      children: "variant=brandSolid",
    },
  });

  return (
    <VStack gap="x2" align="center">
      <Text textStyle="t3Medium">아래 ActionButton은 lg breakpoint에서 variant가 변경됩니다.</Text>
      <ActionButton {...actionButtonProps} />
    </VStack>
  );
}
```

### Server-Side Rendering \[#server-side-rendering]

SSR 등 viewport 정보를 알 수 없는 환경에서 훅 사용 시 적용될 breakpoint 기본값을 정의하려면 `BreakpointProvider`를 통해 `defaultBreakpoint`를 지정하세요.

`BreakpointProvider` 밖에서 훅을 호출했으나 `window.matchMedia`를 사용할 수 없는 경우, `useBreakpoint`는 `base`를, `useBreakpointValue`는 `base` key의 값을 반환합니다.

```tsx
import { BreakpointProvider } from "@seed-design/react";

function App() {
  return (
    <BreakpointProvider defaultBreakpoint="md">
      <MyApp />
    </BreakpointProvider>
  );
}
```