file: components/list.mdx

# List

가로 행으로 구성된 콘텐츠를 표현하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.2.3, @seed-design/css@0.2.3

## Preview

```tsx
import { List, ListDivider, ListItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";
import {
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon, VStack } from "@seed-design/react";

export default function ListPreview() {
  return (
    <VStack width="360px">
      <ListHeader as="h2">리스트 헤더</ListHeader>
      <List width="full">
        <ListItem title="기본 리스트 아이템" />
        <ListDivider />
        <ListItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="아이콘이 있는 리스트 아이템"
          detail="부가 정보가 포함된 설명"
          suffix={<Icon svg={<IconILowercaseSerifCircleLine />} />}
        />
      </List>
    </VStack>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:list
- pnpm: pnpm dlx @seed-design/cli@latest add ui:list
- yarn: yarn dlx @seed-design/cli@latest add ui:list
- bun: bun x @seed-design/cli@latest add ui:list

<ManualInstallation name="list" />

## Usage \[#usage]

```tsx
import { ListHeader } from "seed-design/ui/list-header";
import { List, ListItem } from "seed-design/ui/list";

<VStack>
  <ListHeader as="h2">리스트 헤더</ListHeader>
  <List>
    <ListItem title="리스트 아이템 1" />
    <ListDivider />
    <ListItem title="리스트 아이템 2" />
  </List>
</VStack>
```

## Props \[#props]

### `ListHeader` \[#listheader]

- `as`
  - type: `"div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | undefined`
  - default: `"div"`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `variant`
  - type: `"mediumWeak" | "boldSolid" | undefined`
  - default: `"mediumWeak"`

### `List` \[#list]

[`VStackProps`](/react/components/layout/v-stack#props)와 동일합니다.

### List Items \[#list-items]

<Accordions>
  <Accordion title="ListItem">
    - `title`
      - type: `React.ReactNode`
      - required: `true`
    - `detail`
      - type: `React.ReactNode`
    - `prefix`
      - type: `React.ReactNode`
    - `suffix`
      - type: `React.ReactNode`
    - `alignItems`
      - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
    - `highlighted`
      - type: `boolean | undefined`
      - default: `false`
  </Accordion>

  <Accordion title="ListButtonItem">
    - `title`
      - type: `React.ReactNode`
      - required: `true`
    - `detail`
      - type: `React.ReactNode`
    - `prefix`
      - type: `React.ReactNode`
    - `suffix`
      - type: `React.ReactNode`
    - `rootRef`
      - type: `React.Ref<HTMLLIElement> | undefined`
    - `rootProps`
      - type: `React.HTMLAttributes<HTMLLIElement> | undefined`
    - `alignItems`
      - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
    - `highlighted`
      - type: `boolean | undefined`
      - default: `false`
  </Accordion>

  <Accordion title="ListLinkItem">
    - `title`
      - type: `React.ReactNode`
      - required: `true`
    - `detail`
      - type: `React.ReactNode`
    - `prefix`
      - type: `React.ReactNode`
    - `suffix`
      - type: `React.ReactNode`
    - `rootRef`
      - type: `React.Ref<HTMLLIElement> | undefined`
    - `rootProps`
      - type: `React.HTMLAttributes<HTMLLIElement> | undefined`
    - `alignItems`
      - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
    - `highlighted`
      - type: `boolean | undefined`
      - default: `false`
  </Accordion>

  <Accordion title="ListSwitchItem">
    - `title`
      - type: `React.ReactNode`
      - required: `true`
    - `detail`
      - type: `React.ReactNode`
    - `prefix`
      - type: `React.ReactNode`
    - `suffix`
      - type: `React.ReactNode`
    - `inputProps`
      - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
    - `rootRef`
      - type: `React.Ref<HTMLLabelElement> | undefined`
    - `alignItems`
      - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
    - `highlighted`
      - type: `boolean | undefined`
      - default: `false`
    - `defaultChecked`
      - type: `boolean | undefined`
    - `disabled`
      - type: `boolean | undefined`
    - `invalid`
      - type: `boolean | undefined`
    - `required`
      - type: `boolean | undefined`
    - `checked`
      - type: `boolean | undefined`
    - `onCheckedChange`
      - type: `((checked: boolean) => void) | undefined`
  </Accordion>

  <Accordion title="ListCheckItem">
    - `title`
      - type: `React.ReactNode`
      - required: `true`
    - `detail`
      - type: `React.ReactNode`
    - `prefix`
      - type: `React.ReactNode`
    - `suffix`
      - type: `React.ReactNode`
    - `inputProps`
      - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
    - `rootRef`
      - type: `React.Ref<HTMLLabelElement> | undefined`
    - `alignItems`
      - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
    - `highlighted`
      - type: `boolean | undefined`
      - default: `false`
    - `defaultChecked`
      - type: `boolean | undefined`
    - `disabled`
      - type: `boolean | undefined`
    - `invalid`
      - type: `boolean | undefined`
    - `required`
      - type: `boolean | undefined`
    - `checked`
      - type: `boolean | undefined`
    - `onCheckedChange`
      - type: `((checked: boolean) => void) | undefined`
    - `indeterminate`
      - type: `boolean | undefined`
  </Accordion>

  <Accordion title="ListRadioItem">
    - `title`
      - type: `React.ReactNode`
      - required: `true`
    - `detail`
      - type: `React.ReactNode`
    - `prefix`
      - type: `React.ReactNode`
    - `suffix`
      - type: `React.ReactNode`
    - `inputProps`
      - type: `React.InputHTMLAttributes<HTMLInputElement> | undefined`
    - `rootRef`
      - type: `React.Ref<HTMLLabelElement> | undefined`
    - `alignItems`
      - type: `"flex-start" | "flex-end" | "center" | "stretch" | undefined`
    - `highlighted`
      - type: `boolean | undefined`
      - default: `false`
    - `disabled`
      - type: `boolean | undefined`
    - `value`
      - type: `string`
      - required: `true`
  </Accordion>

  <Accordion title="ListDivider">
    [`DividerProps`](/react/components/divider#props)와 동일하나, 기본적으로 `<li aria-hidden></li>`로 렌더링됩니다. `List`를 `fieldset` 등으로 바꿔 사용하는 경우 `ListDivider` 역시 적절한 태그로 교체해주세요.

    - `as`
      - type: `"hr" | "div" | "li" | undefined`
      - default: `"li"`
      - description: The HTML element to use for the divider. Keep in mind that "hr" elements are read by screen readers as a semantic break with an implicit role="separator" If the element should be read by screen readers but be rendered as an element other than "hr", give an explicit role="separator"
    - `aria-hidden`
      - type: `Booleanish | undefined`
      - default: `true`
      - description: Indicates whether the element is exposed to an accessibility API.
    - `color`
      - type: `(string & {}) | ScopedColorStroke | ScopedColorPalette | undefined`
      - default: `"stroke.neutralMuted"`
    - `thickness`
      - type: `0 | (string & {}) | 1 | undefined`
      - default: `1`
    - `orientation`
      - type: `"horizontal" | "vertical" | undefined`
      - default: `"horizontal"`
    - `inset`
      - type: `boolean | undefined`
      - default: `false`
  </Accordion>
</Accordions>

## Examples \[#examples]

### Using `ListHeader` \[#using-listheader]

`ListHeader`는 `List` 밖에 위치합니다.

```tsx
import { List, ListButtonItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";
import { ActionButton } from "seed-design/ui/action-button";
import {
  IconChevronRightLine,
  IconLockLine,
  IconPersonCircleLine,
  IconQuestionmarkCircleFill,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon, PrefixIcon, VStack } from "@seed-design/react";

export default function () {
  return (
    <VStack gap="x6" py="x6" width="360px">
      <VStack>
        <ListHeader as="h2" variant="mediumWeak">
          variant="mediumWeak"
        </ListHeader>
        <List>
          <ListButtonItem
            title="내 계정"
            detail="이메일과 연락처, 본인 인증 관리"
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="18px" />}
          />
          <ListButtonItem
            title="보안 · 인증 관리"
            detail="비밀번호, 생체 인증 사용을 관리해요"
            prefix={<Icon svg={<IconLockLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
          />
        </List>
      </VStack>
      <Divider />
      <VStack>
        <ListHeader as="h2" variant="boldSolid">
          variant="boldSolid"
        </ListHeader>
        <List>
          <ListButtonItem
            title="내 계정"
            detail="이메일과 연락처, 본인 인증 관리"
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="18px" />}
          />
          <ListButtonItem
            title="보안 · 인증 관리"
            detail="비밀번호, 생체 인증 사용을 관리해요"
            prefix={<Icon svg={<IconLockLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
          />
        </List>
      </VStack>
      <Divider />
      <VStack>
        <ListHeader>
          <h2>List Header with Action Button</h2>
          <ActionButton
            variant="ghost"
            size="small"
            color="fg.neutralSubtle"
            fontWeight="medium"
            bleed="asPadding"
          >
            <PrefixIcon svg={<IconQuestionmarkCircleFill />} />
            도움말
          </ActionButton>
        </ListHeader>
        <List>
          <ListButtonItem
            title="내 계정"
            detail="이메일과 연락처, 본인 인증 관리"
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="18px" />}
          />
          <ListButtonItem
            title="보안 · 인증 관리"
            detail="비밀번호, 생체 인증 사용을 관리해요"
            prefix={<Icon svg={<IconLockLine />} />}
            suffix={<Icon svg={<IconChevronRightLine />} size="x4_5" />}
          />
        </List>
      </VStack>
    </VStack>
  );
}
```

### Affixes (Prefix/Suffix) \[#affixes-prefixsuffix]

```tsx
import {
  IconArrowUpBracketDownFill,
  IconILowercaseSerifCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { List, ListDivider, ListItem } from "seed-design/ui/list";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ListAffixes() {
  const [isToggleButtonPressed, setIsToggleButtonPressed] = useState(false);

  return (
    <List width="360px">
      <ListItem
        prefix={
          <Avatar
            size="48"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        }
        title="Prefix에 Avatar 넣기"
        detail="Amet elit ullamco magna."
      />
      <ListDivider />
      <ListItem
        title="Prefix에 아이콘 넣기"
        detail="Deserunt nulla elit est."
        prefix={<Icon svg={<IconILowercaseSerifCircleLine />} />}
      />
      <ListDivider />
      <ListItem
        title="Suffix에 Action Button 넣기"
        detail="Veniam non est non ut consequat."
        suffix={
          <ActionButton variant="neutralWeak" size="xsmall">
            액션 버튼
          </ActionButton>
        }
      />
      <ListDivider />
      <ListItem
        title="Suffix에 Action Button (Ghost) 넣기"
        detail="Deserunt nulla elit est."
        suffix={
          <ActionButton size="small" variant="ghost" layout="iconOnly" aria-label="공유">
            <Icon svg={<IconArrowUpBracketDownFill />} />
          </ActionButton>
        }
      />
      <ListDivider />
      <ListItem
        title="Suffix에 Toggle Button 넣기"
        detail="Sit eu incididunt aute ea elit ex."
        suffix={
          <ToggleButton
            size="xsmall"
            pressed={isToggleButtonPressed}
            onPressedChange={setIsToggleButtonPressed}
          >
            {isToggleButtonPressed ? "선택됨" : "토글 버튼"}
          </ToggleButton>
        }
      />
    </List>
  );
}
```

### Clickable List Items \[#clickable-list-items]

`ListButtonItem` 또는 `ListLinkItem`를 사용해서 리스트 항목 전체를 클릭 가능하도록 만들 수 있습니다.

`prefix` 또는 `suffix`에 클릭할 수 있는 요소를 포함하는 경우 `z-index: 1`, `position: relative`, `isolation: isolate` 등의 스타일을 적용하여 클릭 이벤트가 리스트 항목과 별개로 동작하도록 하세요. `ActionButton`, `ToggleButton` 등 SEED React 컴포넌트는 추가적으로 스타일을 적용하지 않아도 됩니다.

```tsx
import {
  IconArrowUpRightLine,
  IconCheckmarkFill,
  IconChevronRightLine,
  IconPenHorizlineFill,
  IconPlusFill,
  IconSquare2StackedFill,
} from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon, Icon, Box } from "@seed-design/react";
import { useCallback, useState } from "react";
import { List, ListDivider, ListItem, ListButtonItem, ListLinkItem } from "seed-design/ui/list";
import { ActionButton } from "seed-design/ui/action-button";
import { ToggleButton } from "seed-design/ui/toggle-button";

const href = "https://www.daangn.com";

export default function ListClickable() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const onCopyClick = useCallback(() => {
    navigator.clipboard.writeText(href);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  return (
    <List width="full">
      <ListItem
        title="ListItem은 클릭할 수 없어요. 눌러보세요."
        detail="우측의 Action Button만 클릭할 수 있어요"
        suffix={
          <ActionButton
            variant="ghost"
            size="xsmall"
            color="fg.neutralMuted"
            onClick={() => alert("편집 클릭됨")}
          >
            <PrefixIcon svg={<IconPenHorizlineFill />} />
            편집
          </ActionButton>
        }
      />
      <ListDivider />
      <ListButtonItem
        title="ListButtonItem은 클릭할 수 있어요. 눌러보세요."
        detail="리스트 항목 전체와 우측의 Toggle Button 각각을 클릭할 수 있어요"
        onClick={() => alert("리스트 아이템 클릭됨")}
        suffix={
          <>
            <ToggleButton size="xsmall" pressed={isSubscribed} onPressedChange={setIsSubscribed}>
              <PrefixIcon svg={isSubscribed ? <IconCheckmarkFill /> : <IconPlusFill />} />
              {isSubscribed ? "모아보는 중" : "모아보기"}
            </ToggleButton>
            <Icon svg={<IconChevronRightLine />} />
          </>
        }
      />
      <ListDivider />
      <ListButtonItem
        title="ListButtonItem은 클릭할 수 있어요. 눌러보세요."
        detail="리스트 항목 전체와 우측의 커스텀 버튼 각각을 클릭할 수 있어요"
        onClick={() => alert("리스트 아이템 클릭됨")}
        suffix={
          <>
            <Box asChild bg="bg.brandSolid" color="palette.staticWhite" p="x1" borderRadius="r1_5">
              <button
                type="button"
                onClick={() => alert("커스텀 버튼 클릭됨")}
                style={{ zIndex: 1 }}
              >
                커스텀 버튼
              </button>
            </Box>
            <Icon svg={<IconChevronRightLine />} />
          </>
        }
      />
      <ListDivider />
      <ListLinkItem
        title="ListLinkItem도 클릭할 수 있어요. 눌러보세요."
        detail="리스트 항목 전체와 우측의 Action Button 각각을 클릭할 수 있어요"
        suffix={
          <>
            <ActionButton variant="neutralWeak" size="xsmall" onClick={onCopyClick}>
              <PrefixIcon svg={isCopied ? <IconCheckmarkFill /> : <IconSquare2StackedFill />} />
              {isCopied ? "복사됨" : "URL 복사"}
            </ActionButton>
            <Icon svg={<IconArrowUpRightLine />} />
          </>
        }
        href={href}
        target="_blank"
        rel="noreferrer"
      />
    </List>
  );
}
```

### `input`s in List Items \[#inputs-in-list-items]

`ListSwitchItem`, `ListCheckItem`, `ListRadioItem`을 사용해서 리스트 항목에 `input` 요소를 포함할 수 있습니다. 이때, [Switchmark](/react/components/switch#using-switchmark), [Checkmark](/react/components/checkbox#using-checkmark) 또는 [Radiomark](/react/components/radio-group#using-radiomark)와 같은 컨트롤 요소를 `prefix`나 `suffix` 영역에 넣어 사용합니다.

```tsx
import { IconTrashcanLine } from "@karrotmarket/react-monochrome-icon";
import { IconSparkle2 } from "@karrotmarket/react-multicolor-icon";
import { Icon } from "@seed-design/react";
import { List, ListDivider, ListSwitchItem } from "seed-design/ui/list";
import { Switchmark } from "seed-design/ui/switch";

export default function ListSwitch() {
  return (
    <List width="360px">
      <ListSwitchItem
        title="삭제하기 전에 확인"
        prefix={<Icon svg={<IconTrashcanLine />} />}
        suffix={<Switchmark tone="neutral" />}
      />
      <ListDivider />
      <ListSwitchItem
        title="메시지 요약"
        detail="핵심 내용만 빠르게 확인해보세요."
        prefix={<Icon svg={<IconSparkle2 />} />}
        suffix={<Switchmark tone="neutral" />}
        defaultChecked
      />
    </List>
  );
}
```

```tsx
import { Badge, HStack } from "@seed-design/react";
import { List, ListDivider, ListCheckItem } from "seed-design/ui/list";
import { Checkmark } from "seed-design/ui/checkbox";

export default function ListCheckbox() {
  return (
    <List as="fieldset" width="360px">
      <ListCheckItem
        title={
          <HStack gap="x1_5">
            <span>알림 수신 동의</span>
            <Badge variant="weak">권장</Badge>
          </HStack>
        }
        detail="푸시 알림을 받으시겠습니까?"
        suffix={<Checkmark tone="neutral" size="large" />}
        defaultChecked
      />
      <ListDivider as="div" />
      <ListCheckItem
        prefix={<Checkmark tone="neutral" size="large" />}
        title="마케팅 정보 수신 동의"
        detail="마케팅 정보를 받으시겠습니까?"
        defaultChecked
      />
      <ListDivider as="div" />
      <ListCheckItem
        prefix={<Checkmark tone="neutral" size="large" variant="ghost" />}
        title="Ghost Variant"
      />
    </List>
  );
}
```

```tsx
import { RadioGroup } from "@seed-design/react/primitive";
import { List, ListDivider, ListRadioItem } from "seed-design/ui/list";
import { Radiomark } from "seed-design/ui/radio-group";

export default function ListRadio() {
  return (
    <List width="360px" asChild>
      <RadioGroup.Root defaultValue="option1" aria-label="옵션 선택">
        <ListRadioItem
          value="option1"
          title="옵션 1"
          detail="첫 번째 선택지"
          suffix={<Radiomark tone="neutral" size="large" />}
        />
        <ListDivider as="div" />
        <ListRadioItem
          prefix={<Radiomark tone="neutral" size="large" />}
          value="option2"
          title="옵션 2"
          detail="두 번째 선택지"
        />
        <ListDivider as="div" />
        <ListRadioItem
          prefix={<Radiomark tone="neutral" size="large" />}
          value="option3"
          title="옵션 3"
          detail="세 번째 선택지"
        />
      </RadioGroup.Root>
    </List>
  );
}
```

### Accessibility \[#accessibility]

`List`는 기본적으로 `<ul>`입니다. `ListCheckItem`와 `ListRadioItem`를 사용하는 경우 `List`에 적절한 role을 부여해야 합니다.

```tsx
{/* [!code highlight] */}
<List as="fieldset">
  <ListCheckItem
    suffix={<Checkmark size="large" />}
    title="알림 수신 동의"
    detail="푸시 알림을 받으시겠습니까?"
  />
  <ListCheckItem
    suffix={<Checkmark size="large" />}
    title="마케팅 정보 수신 동의"
    detail="마케팅 정보를 받으시겠습니까?"
  />
</List>
```

```tsx
{/* [!code highlight] */}
<List asChild>
  <RadioGroup.Root defaultValue="짜장" aria-label="점심 메뉴"> {/* <div role="radiogroup"> */}
    <ListRadioItem
      suffix={<Radiomark size="large" />}
      value="짜장"
      title="짜장"
    />
    <ListRadioItem
      suffix={<Radiomark size="large" />}
      value="짬뽕"
      title="짬뽕"
    />
  </RadioGroup.Root>
</List>
```

### Disabled \[#disabled]

```tsx
import {
  IconChevronRightLine,
  IconPersonCircleLine,
  IconSlashCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Divider, Icon, VStack } from "@seed-design/react";
import { RadioGroup } from "@seed-design/react/primitive";
import { List, ListButtonItem, ListCheckItem, ListRadioItem } from "seed-design/ui/list";
import { Checkmark } from "seed-design/ui/checkbox";
import { Radiomark } from "seed-design/ui/radio-group";

export default function ListDisabled() {
  return (
    <VStack width="360px">
      <List>
        <ListButtonItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 ListButtonItem"
          detail="Cupidatat et pariatur amet."
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </List>
      <List as="fieldset">
        <ListCheckItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="활성화된 ListCheckItem"
          suffix={<Checkmark tone="neutral" size="large" />}
        />
      </List>
      <List asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <ListRadioItem
            prefix={<Icon svg={<IconPersonCircleLine />} />}
            title="활성화된 ListRadioItem"
            suffix={<Radiomark tone="neutral" size="large" />}
            value="foo"
          />
        </RadioGroup.Root>
      </List>
      <Divider />
      <List>
        <ListButtonItem
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 ListButtonItem"
          detail="Cupidatat et pariatur amet."
          suffix={<Icon svg={<IconChevronRightLine />} />}
        />
      </List>
      <List as="fieldset">
        <ListCheckItem
          disabled
          prefix={<Icon svg={<IconSlashCircleLine />} />}
          title="비활성화된 ListCheckItem"
          suffix={<Checkmark tone="neutral" size="large" />}
        />
      </List>
      <List asChild>
        <RadioGroup.Root defaultValue="foo" aria-label="옵션 선택">
          <ListRadioItem
            disabled
            prefix={<Icon svg={<IconSlashCircleLine />} />}
            title="비활성화된 ListRadioItem"
            suffix={<Radiomark tone="neutral" size="large" />}
            value="foo"
          />
        </RadioGroup.Root>
      </List>
    </VStack>
  );
}
```

### Variants \[#variants]

#### Highlighted \[#highlighted]

```tsx
import { IconPersonCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Icon, VStack } from "@seed-design/react";
import { useState } from "react";
import { List, ListDivider, ListItem, ListButtonItem } from "seed-design/ui/list";
import { Switch } from "seed-design/ui/switch";

export default function ListHighlighted() {
  const [highlighted, setHighlighted] = useState(true);

  return (
    <VStack width="360px" gap="x4">
      <List>
        <ListButtonItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="버튼"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          onClick={() => {}}
        />
        <ListDivider />
        <ListButtonItem
          highlighted
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트된 버튼"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          onClick={() => {}}
        />
        <ListDivider />
        <ListButtonItem
          highlighted
          disabled
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트 및 비활성화된 버튼"
          detail="Enim aute duis magna mollit aute sit aliquip duis ut tempor sunt."
          onClick={() => {}}
        />
      </List>
      <List>
        <ListItem
          prefix={<Icon svg={<IconPersonCircleLine />} />}
          title="하이라이트"
          highlighted={highlighted}
        />
      </List>
      <Box alignSelf="center">
        <Switch
          size="24"
          tone="neutral"
          label="highlight"
          checked={highlighted}
          onCheckedChange={setHighlighted}
        />
      </Box>
    </VStack>
  );
}
```

### With Bottom Sheet \[#with-bottom-sheet]

```tsx
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
  BottomSheetTrigger,
} from "seed-design/ui/bottom-sheet";
import { ActionButton } from "seed-design/ui/action-button";
import { Checkmark } from "seed-design/ui/checkbox";
import { List, ListCheckItem } from "seed-design/ui/list";
import { PrefixIcon, VStack } from "@seed-design/react";
import { useState } from "react";
import { IconArrowClockwiseCircularFill } from "@karrotmarket/react-monochrome-icon";

const TYPES = ["버스", "지하철", "택시", "자전거", "도보"] as const;

export default function ListBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<(typeof TYPES)[number][]>([]);

  return (
    <BottomSheetRoot open={isOpen} onOpenChange={setIsOpen}>
      <BottomSheetTrigger asChild>
        <ActionButton variant="neutralSolid">BottomSheet 열기</ActionButton>
      </BottomSheetTrigger>
      <BottomSheetContent title="교통수단" description="이동할 교통수단을 선택해주세요.">
        <VStack asChild>
          <form
            onReset={(e) => {
              e.preventDefault();
              setSelectedTypes([]);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            <BottomSheetBody paddingX="0" asChild>
              <List as="fieldset">
                {TYPES.map((type) => (
                  <ListCheckItem
                    key={type}
                    title={type}
                    checked={selectedTypes.includes(type)}
                    prefix={<Checkmark tone="neutral" size="large" />}
                    onCheckedChange={() => {
                      setSelectedTypes((prev) =>
                        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
                      );
                    }}
                  />
                ))}
              </List>
            </BottomSheetBody>
            <BottomSheetFooter>
              <VStack gap="x2">
                <ActionButton
                  size="large"
                  variant="neutralSolid"
                  disabled={selectedTypes.length === 0}
                  type="submit"
                >
                  경로 찾기
                </ActionButton>
                <ActionButton
                  size="small"
                  variant="ghost"
                  disabled={selectedTypes.length === 0}
                  type="reset"
                >
                  <PrefixIcon svg={<IconArrowClockwiseCircularFill />} />
                  초기화
                </ActionButton>
              </VStack>
            </BottomSheetFooter>
          </form>
        </VStack>
      </BottomSheetContent>
    </BottomSheetRoot>
  );
}
```

### Alignment \[#alignment]

`alignItems` prop으로 `prefix`와 `suffix`의 정렬 방식을 조정할 수 있습니다.

```tsx
import { List, ListItem } from "seed-design/ui/list";
import { HStack } from "@seed-design/react";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Avatar } from "seed-design/ui/avatar";

export default function ListAlignment() {
  return (
    <HStack width="full" align="flex-start" gap="x4">
      <List>
        <ListItem
          prefix={<Avatar size="48" fallback={<IdentityPlaceholder />} />}
          title="Prefix에 Avatar 넣기. Veniam elit velit esse ea incididunt sunt sit aute."
          detail="Et proident sit ullamco ut voluptate. Voluptate eiusmod occaecat adipisicing quis qui esse."
        />
      </List>
      <List>
        <ListItem
          alignItems="flex-start"
          prefix={<Avatar size="48" fallback={<IdentityPlaceholder />} />}
          title="Prefix에 Avatar 넣고 상단으로 정렬하기. Veniam elit velit esse ea incididunt sunt sit aute."
          detail="일반적으로 `title`이 길어질 때 `alignItems`를 `flex-start`로 설정합니다."
        />
      </List>
    </HStack>
  );
}
```

### Border Radius \[#border-radius]

`List`에 `itemBorderRadius` prop을 설정하여 active 상태에서 적용되는 리스트 항목의 radius를 조정할 수 있습니다. 리스트가 카드 등 모서리가 둥근 컨테이너 안에 포함되는 경우 유용합니다.

```tsx
import { List, ListCheckItem, ListRadioItem } from "seed-design/ui/list";
import { ListHeader } from "seed-design/ui/list-header";
import { Checkmark } from "seed-design/ui/checkbox";
import { Radiomark } from "seed-design/ui/radio-group";
import { HStack, VStack } from "@seed-design/react";
import { RadioGroup } from "@seed-design/react/primitive";

export default function ListBorderRadius() {
  return (
    <HStack
      gap="x4"
      bg="bg.layerBasement"
      width="full"
      grow
      wrap
      align="center"
      justify="center"
      p="x4"
    >
      <VStack
        width="300px"
        py="x1_5"
        borderRadius="r3_5"
        bg="bg.layerDefault"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
      >
        <ListHeader as="h2">카드 borderRadius: r3_5</ListHeader>
        <List as="fieldset" itemBorderRadius="r2">
          <ListCheckItem
            defaultChecked
            title="borderRadius: r2"
            suffix={<Checkmark size="large" tone="neutral" />}
          />
          <ListCheckItem
            title="borderRadius: r2"
            suffix={<Checkmark size="large" tone="neutral" />}
          />
        </List>
      </VStack>
      <VStack
        width="300px"
        px="x1"
        py="x2_5"
        borderRadius="22px"
        bg="bg.layerDefault"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
      >
        <ListHeader as="h2">카드 borderRadius: 22px</ListHeader>
        <List asChild itemBorderRadius="r3">
          <RadioGroup.Root defaultValue="0" aria-label="Border radius options">
            <ListRadioItem
              value="0"
              title="borderRadius: r3"
              suffix={<Radiomark size="large" tone="neutral" />}
            />
            <ListRadioItem
              value="1"
              title="borderRadius: r3"
              suffix={<Radiomark size="large" tone="neutral" />}
            />
          </RadioGroup.Root>
        </List>
      </VStack>
    </HStack>
  );
}
```

## Customization and Composition \[#customization-and-composition]

### Usage \[#usage-1]

@seed-design/react 패키지에서 제공하는 `List`와 `ListHeader` 컴포넌트는 다음과 같은 구조로 사용됩니다.

```
ListHeader
List.Root
└── List.Item
    ├── List.Prefix (선택사항)
    ├── List.Content
    │   ├── List.Title
    │   └── List.Detail (선택사항)
    └── List.Suffix (선택사항)
└── List.Item
    ├── ...
```

```tsx
import { ListHeader, List, Icon } from "@seed-design/react";

<ListHeader>
  내 정보
</ListHeader>
<List.Root>
  <List.Item>
    <List.Prefix>
      <Icon svg={<IconPersonCircleLine />} />
    </List.Prefix>
    <List.Content>
      <List.Title>내 프로필</List.Title>
      <List.Detail>다른 사람들에게 보이는 내 정보를 관리합니다.</List.Detail>
    </List.Content>
    <List.Suffix>
      <Icon svg={<IconArrowRightLine />} />
    </List.Suffix>
  </List.Item>
  <List.Item>
    {/* ... */}
  </List.Item>
</List.Root>
```

- `ListHeader`: 리스트의 제목이나 설명을 표시하는 헤더 역할
- `List.Root`: 모든 리스트 항목을 감싸는 컨테이너 역할
  - `List.Item`: 개별 리스트 항목. 클릭 가능한 영역을 정의
  - `List.Prefix`: 아이콘, [Avatar](/react/components/avatar), [Checkmark](/react/components/checkbox#using-checkmark) 등을 표시할 수 있는 시작 영역
  - `List.Content`: 주요 콘텐츠가 들어가는 중앙 영역
    - `List.Title`: 리스트 항목의 제목
    - `List.Detail`: 부가 설명이나 세부 정보
  - `List.Suffix`: 아이콘, [Action Button](/react/components/action-button), [Toggle Button](/react/components/toggle-button) 등을 표시할 수 있는 끝 영역

### `asChild` prop으로 적절한 시맨틱 요소와 조합하기 \[#aschild-prop으로-적절한-시맨틱-요소와-조합하기]

<Card title="Composition" href="/react/components/concepts/composition#aschild-prop" icon="<IconComponent />">
  `asChild` prop에 대해 자세히 알아봅니다.
</Card>

#### Using `asChild` prop in `List.Content` \[#using-aschild-prop-in-listcontent]

리스트 항목 전체 영역을 클릭 가능한 버튼으로 만드는 경우 활용할 수 있는 패턴입니다. 이 경우 `List.Item`에 `asChild` prop을 사용하지 않도록 유의하세요. `List.Prefix` 또는 `List.Suffix`에 버튼을 넣는 경우 `button`이 중첩되는 등 유효하지 않은 HTML이 생성됩니다.

```tsx
import { List as SeedList } from "@seed-design/react";

<SeedList.Item>
  {/* [!code highlight] */}
  <SeedList.Content asChild>
    {/* [!code highlight] */}
    <button type="button" onClick={() => alert("사용자 클릭됨")}>
      <SeedList.Title>사용자</SeedList.Title>
      {/* [!code highlight] */}
    </button>
    {/* [!code highlight] */}
  </SeedList.Content>
  <SeedList.Suffix>
    <ActionButton
      size="xsmall"
      variant="brandSolid"
      onClick={() => alert("보기 클릭됨")}
    >
      보기
    </ActionButton>
  </SeedList.Suffix>
</SeedList.Item>
```

[Snippet](/react/components/concepts/snippet)으로 제공되는 `ListButtonItem` 및 `ListLinkItem`는 이 패턴을 쉽게 구현할 수 있도록 돕습니다.

```tsx
import { ListButtonItem } from "seed-design/ui/list";

<ListButtonItem
  onClick={() => alert("사용자 클릭됨")}
  title="사용자"
  detail="항목 6개"
  suffix={
    <ActionButton
      size="xsmall"
      variant="brandSolid"
      onClick={() => alert("보기 클릭됨")}
    >
      보기
    </ActionButton>
  }
/>
```

#### Using `asChild` prop in `List.Item` \[#using-aschild-prop-in-listitem]

리스트 항목 전체 영역을 `label`로 만들고, `List.Prefix` 또는 `List.Suffix`에 [Switchmark](/react/components/switch#using-switchmark), [Checkmark](/react/components/checkbox#using-checkmark) 또는 [Radiomark](/react/components/radio-group#using-radiomark)를 넣는 경우 활용할 수 있는 패턴입니다.

```tsx
import { List as SeedList } from "@seed-design/react";
import { Checkbox } from "@seed-design/react/primitive";

{/* [!code highlight] */}
<SeedList.Item asChild> {/* <label> */}
  {/* [!code highlight] */}
  <Checkbox.Root defaultChecked>
    <SeedList.Content>
      <SeedList.Title>동의</SeedList.Title>
    </SeedList.Content>
    <SeedList.Suffix>
      <Checkmark />
    </SeedList.Suffix>
    <Checkbox.HiddenInput />
    {/* [!code highlight] */}
  </Checkbox.Root>
  {/* [!code highlight] */}
</SeedList.Item>
```

[Snippet](/react/components/concepts/snippet)으로 제공되는 `ListSwitchItem`, `ListCheckItem` 및 `ListRadioItem`는 이 패턴을 쉽게 구현할 수 있도록 돕습니다.

```tsx
import { ListCheckItem } from "seed-design/ui/list";

<ListCheckItem
  defaultChecked
  title="동의"
  suffix={<Checkmark size="large" />}
/>
```