file: components/menu.mdx

# Menu

사용자가 취할 수 있는 선택지나 액션 리스트를 제공하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0

## Preview

```tsx
import {
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "seed-design/ui/menu";

export default function MenuPreview() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>작업</MenuGroupLabel>
          <MenuItem label="라이브러리에 추가" prefixIcon={<IconPlusLine />} />
          <MenuItem
            label="수정"
            description="현재 항목을 수정합니다"
            prefixIcon={<IconPencilLine />}
          />
        </MenuGroup>
        <MenuGroup>
          <MenuItem
            label="삭제"
            description="이 작업은 되돌릴 수 없습니다"
            tone="critical"
            prefixIcon={<IconTrashcanLine />}
          />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:menu
- pnpm: pnpm dlx @seed-design/cli@latest add ui:menu
- yarn: yarn dlx @seed-design/cli@latest add ui:menu
- bun: bun x @seed-design/cli@latest add ui:menu

<ManualInstallation name="menu" />

## Usage \[#usage]

Menu는 아래와 같은 구조로 구성됩니다.

```tsx
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
} from "seed-design/ui/menu";
```

```tsx
<MenuRoot>
  <MenuTrigger>...</MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuGroupLabel>그룹 제목</MenuGroupLabel>
      <MenuItem label="항목 1" />
      <MenuItem label="항목 2" />
    </MenuGroup>
    <MenuGroup>
      <MenuItem label="항목 3" />
    </MenuGroup>
  </MenuContent>
</MenuRoot>
```

- `MenuRoot`: 메뉴의 상태(열림/닫힘)와 위치를 관리합니다.
- `MenuTrigger`: 클릭 시 메뉴를 열고 닫는 트리거입니다.
- `MenuAnchor`: 메뉴의 위치 기준점만 제공하며, 열고 닫는 동작은 포함하지 않습니다. 트리거 동작을 직접 제어해야 하는 경우에 `MenuTrigger` 대신 사용합니다.
- `MenuContent`: 메뉴 항목들을 감싸는 플로팅 컨테이너입니다.
- `MenuGroup`: 관련된 항목들을 그룹으로 묶습니다. 모든 `MenuItem`은 `MenuGroup` 안에 있어야 합니다.
- `MenuGroupLabel`: 그룹의 제목을 표시합니다.
- `MenuItem`: 개별 메뉴 항목입니다.

## Props \[#props]

### `MenuRoot` \[#menuroot]

- `size`
  - type: `"medium" | "small" | "responsive" | undefined`
  - default: `"medium"`
  - description: - \`medium\`: 뷰포트 너비와 관계없이 사용할 수 있습니다. - \`small\`: Breakpoint \`lg\` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다. - \`responsive\`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint \`lg\` 미만에서는 \`medium\`, \`lg\` 이상에서는 \`small\`로 적용됩니다.
- `children`
  - type: `React.ReactNode`
- `disabled`
  - type: `boolean | undefined`
- `placement`
  - type: `Placement | undefined`
  - default: `"bottom"`
  - description: Floating UI placement.
- `gutter`
  - type: `number | undefined`
  - default: `0`
  - description: Distance between trigger and floating element.
- `overflowPadding`
  - type: `number | undefined`
  - default: `8`
  - description: Virtual padding around viewport edges.
- `strategy`
  - type: `"absolute" | "fixed" | undefined`
  - default: `"absolute"`
  - description: Positioning strategy.
- `matchReferenceWidth`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the floating element's width should match the reference(trigger/anchor)'s width.
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
- `onOpenChange`
  - type: `((open: boolean, details?: MenuChangeDetails) => void) | undefined`

### `MenuTrigger` \[#menutrigger]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `MenuAnchor` \[#menuanchor]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `MenuContent` \[#menucontent]

- `positionerContainer`
  - type: `React.RefObject<HTMLElement | null> | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `MenuGroup` \[#menugroup]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `MenuGroupLabel` \[#menugrouplabel]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `MenuItem` \[#menuitem]

- `prefixIcon`
  - type: `React.ReactNode`
- `label`
  - type: `React.ReactNode`
  - required: `true`
- `description`
  - type: `React.ReactNode`
- `suffixIcon`
  - type: `React.ReactNode`
- `size`
  - type: `"medium" | "small" | "responsive" | undefined`
  - default: `"medium"`
  - description: - \`medium\`: 뷰포트 너비와 관계없이 사용할 수 있습니다. - \`small\`: Breakpoint \`lg\` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다. - \`responsive\`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint \`lg\` 미만에서는 \`medium\`, \`lg\` 이상에서는 \`small\`로 적용됩니다.
- `tone`
  - type: `"neutral" | "critical" | undefined`
  - default: `"neutral"`
  - description: - \`neutral\`: 일반적인 작업을 수행하는 기본 아이템입니다. - \`critical\`: 데이터 삭제와 같이 되돌릴 수 없는 작업을 수행하는 아이템입니다.
- `onClick`
  - type: `React.MouseEventHandler<Element> | undefined`
  - description: Called when the item is activated (click or keyboard). Not called when the item is disabled.
- `disabled`
  - type: `boolean | undefined`
- `typeaheadLabel`
  - type: `string | undefined`
  - description: Overrides the text label to use when the item is matched during keyboard text navigation. Falls back to the element's text content if not provided.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Trigger \[#trigger]

`<MenuTrigger>`는 `aria-haspopup="menu"` 속성을 설정하고, Menu의 `open` 상태에 따라 `aria-expanded` 속성을 자동으로 설정합니다. 이 속성은 스크린 리더와 같은 보조 기술에 유용합니다.

## Preview

```tsx
import {
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "seed-design/ui/menu";

export default function MenuPreview() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>작업</MenuGroupLabel>
          <MenuItem label="라이브러리에 추가" prefixIcon={<IconPlusLine />} />
          <MenuItem
            label="수정"
            description="현재 항목을 수정합니다"
            prefixIcon={<IconPencilLine />}
          />
        </MenuGroup>
        <MenuGroup>
          <MenuItem
            label="삭제"
            description="이 작업은 되돌릴 수 없습니다"
            tone="critical"
            prefixIcon={<IconTrashcanLine />}
          />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
```

### Size \[#size]

`size`로 MenuRoot의 크기를 정합니다. (default: `medium`)

`responsive`는 화면 너비에 따라 size가 자동으로 전환되는 값입니다. 여러 화면 너비를 함께 지원하는 제품에서 `size=responsive`를 사용하여 대응합니다.

```tsx
import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { HStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "seed-design/ui/menu";

export default function MenuSize() {
  return (
    <HStack gap="x4">
      <MenuRoot size="medium">
        <MenuTrigger asChild>
          <ActionButton variant="neutralSolid">Medium</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>작업</MenuGroupLabel>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>

      <MenuRoot size="small">
        <MenuTrigger asChild>
          <ActionButton variant="neutralSolid">Small</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>작업</MenuGroupLabel>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>

      <MenuRoot size="responsive">
        <MenuTrigger asChild>
          <ActionButton variant="neutralSolid">Responsive</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>작업</MenuGroupLabel>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
}
```

### With Description \[#with-description]

`MenuItem`의 `description` prop을 사용하여 항목에 부가 설명을 추가합니다.

```tsx
import {
  IconArrowUpBracketDownLine,
  IconPencilLine,
  IconPlusLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

export default function MenuWithDescription() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem
            label="라이브러리에 추가"
            description="내 라이브러리에 항목을 추가합니다"
            prefixIcon={<IconPlusLine />}
          />
          <MenuItem
            label="수정"
            description="현재 항목을 수정합니다"
            prefixIcon={<IconPencilLine />}
          />
          <MenuItem
            label="공유"
            description="다른 사람에게 공유합니다"
            prefixIcon={<IconArrowUpBracketDownLine />}
          />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
```

### Tone \[#tone]

`MenuItem`의 `tone` prop으로 항목의 톤을 설정합니다.

```tsx
import {
  IconPencilLine,
  IconPlusLine,
  IconTrashcanLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

export default function MenuTone() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
          <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
        </MenuGroup>
        <MenuGroup>
          <MenuItem label="삭제" tone="critical" prefixIcon={<IconTrashcanLine />} />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
```

### Disabled Items \[#disabled-items]

`MenuItem`의 `disabled` prop을 사용하여 특정 항목을 비활성화합니다.

```tsx
import {
  IconArrowUpBracketDownLine,
  IconPencilLine,
  IconPlusLine,
} from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

export default function MenuDisabled() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">열기</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
          <MenuItem
            label="수정"
            description="현재 항목을 수정합니다"
            prefixIcon={<IconPencilLine />}
            disabled
          />
          <MenuItem label="공유" prefixIcon={<IconArrowUpBracketDownLine />} />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
```

### Placement \[#placement]

`MenuRoot`의 `placement` prop으로 메뉴의 위치를 설정합니다. 기본값은 `"bottom"`입니다.

```tsx
import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { Box } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  type MenuRootProps,
} from "seed-design/ui/menu";

function PlacementMenu({ placement }: { placement: NonNullable<MenuRootProps["placement"]> }) {
  return (
    <MenuRoot placement={placement}>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid">{placement}</ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
          <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}

export default function MenuPlacement() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "80px", padding: "80px" }}
    >
      <PlacementMenu placement="top-end" />
      <PlacementMenu placement="top" />
      <PlacementMenu placement="top-start" />
      <PlacementMenu placement="left-end" />
      <Box />
      <PlacementMenu placement="right-end" />
      <PlacementMenu placement="left" />
      <Box />
      <PlacementMenu placement="right" />
      <PlacementMenu placement="left-start" />
      <Box />
      <PlacementMenu placement="right-start" />
      <PlacementMenu placement="bottom-end" />
      <PlacementMenu placement="bottom" />
      <PlacementMenu placement="bottom-start" />
    </div>
  );
}
```

### Anchor \[#anchor]

`MenuAnchor`의 `children`은 Menu가 위치를 잡는 데에만 사용되며, `MenuTrigger`와 달리 클릭으로 열고 닫는 동작이 포함되지 않습니다.

`open` prop을 controlled하게 사용하여 열리고 닫힌 상태를 직접 관리해야 합니다.

<Callout title="Menu는 기본적으로 Menu 밖 영역에서 클릭(마우스 환경) 또는 드래그(터치 환경)가 발생할 때 닫힙니다.">
  아래 예시의 경우 `onOpenChange` 콜백에 조건을 추가하여 바깥 영역을 클릭한 경우에도 메뉴가 닫히지 않도록 구현되어 있습니다.
</Callout>

```tsx
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";
import { Switch } from "seed-design/ui/switch";
import { MenuAnchor, MenuContent, MenuGroup, MenuItem, MenuRoot } from "seed-design/ui/menu";
import { HStack } from "@seed-design/react";

export default function MenuAnchorExample() {
  const [open, setOpen] = useState(false);

  return (
    <HStack align="center" justify="space-between" width="full">
      <Switch tone="neutral" label="메뉴" checked={open} onCheckedChange={setOpen} />
      <MenuRoot
        open={open}
        onOpenChange={(nextOpen, details) => {
          if (!nextOpen && details?.reason === "interactOutside") return;
          setOpen(nextOpen);
        }}
      >
        <MenuAnchor asChild>
          <Avatar
            size="80"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        </MenuAnchor>
        <MenuContent>
          <MenuGroup>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
}
```

### Match Width \[#match-width]

`MenuRoot`의 `matchReferenceWidth` prop을 사용하면 메뉴의 너비가 reference 요소(Trigger 또는 Anchor)의 너비에 맞춰집니다.

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

export default function MenuMatchReferenceWidth() {
  return (
    <MenuRoot matchReferenceWidth>
      <MenuTrigger asChild>
        <ActionButton variant="neutralSolid" style={{ width: 400, maxWidth: "100%" }}>
          열기
        </ActionButton>
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuItem label="추가" />
          <MenuItem label="수정" />
          <MenuItem label="공유" />
        </MenuGroup>
      </MenuContent>
    </MenuRoot>
  );
}
```

### `onOpenChange` Details \[#onopenchange-details]

`onOpenChange` 두 번째 인자로 `details`가 제공됩니다.

#### `reason` \[#reason]

**열릴 때** (`open: true`)

- `"trigger"`: `MenuTrigger`로 열림

**닫힐 때** (`open: false`)

- `"trigger"`: `MenuTrigger`로 닫힘
- `"escapeKeyDown"`: <kbd>ESC</kbd> 키 사용
- `"interactOutside"`: 외부 영역 클릭
- `"itemClick"`: 메뉴 항목 클릭
- `"cascadeDismiss"`: 상위 레이어 닫힘으로 인한 연쇄 닫힘

```tsx
import { IconPencilLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { MenuContent, MenuGroup, MenuItem, MenuRoot, MenuTrigger } from "seed-design/ui/menu";

export default function MenuOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <MenuRoot
        open={open}
        onOpenChange={(open, details) => {
          setOpen(open);

          (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
        }}
      >
        <MenuTrigger asChild>
          <ActionButton variant="neutralSolid">열기</ActionButton>
        </MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuItem label="추가" prefixIcon={<IconPlusLine />} />
            <MenuItem label="수정" prefixIcon={<IconPencilLine />} />
          </MenuGroup>
        </MenuContent>
      </MenuRoot>

      <HStack gap="x4">
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 열림 이유: {openReason ?? "-"}
        </Text>
        <Text fontSize="t3" color="fg.neutralMuted">
          마지막 닫힘 이유: {closeReason ?? "-"}
        </Text>
      </HStack>
    </VStack>
  );
}
```