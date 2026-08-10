file: components/select.mdx

# Select

트리거를 눌러 열리는 목록에서 값을 선택하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@2.1.0, @seed-design/css@2.3.0

## Preview

```tsx
import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectPreview() {
  return (
    <Box width="240px">
      <SelectRoot defaultValue={["apple"]}>
        <SelectTrigger aria-label="과일" placeholder="과일을 선택하세요" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:select
- pnpm: pnpm dlx @seed-design/cli@latest add ui:select
- yarn: yarn dlx @seed-design/cli@latest add ui:select
- bun: bun x @seed-design/cli@latest add ui:select

<ManualInstallation name="select" />

## Usage \[#usage]

```tsx
import {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "seed-design/ui/select";
```

```tsx
<SelectRoot defaultValue={["apple"]}>
  <SelectTrigger aria-label="과일" placeholder="과일을 선택하세요" />
  <SelectContent>
    <SelectGroup label="국산">
      <SelectItem value="apple" label="사과" />
      <SelectItem value="pear" label="배" />
    </SelectGroup>
    <SelectGroup label="수입산">
      <SelectItem value="banana" label="바나나" />
    </SelectGroup>
  </SelectContent>
</SelectRoot>
```

- `SelectRoot`: 선택 값(`value`)과 열림 상태를 관리합니다.
- `SelectTrigger`: 선택된 값 또는 placeholder를 표시하며, 클릭 시 목록을 엽니다.
- `SelectContent`: 옵션 목록을 감싸는 플로팅 컨테이너입니다.
- `SelectGroup`: 관련된 옵션들을 그룹으로 묶습니다. 모든 `SelectItem`은 `SelectGroup` 안에 있어야 합니다. `label`로 그룹의 제목을 표시할 수 있습니다.
- `SelectItem`: 개별 옵션입니다. `value`가 필요하며, 선택되면 체크마크가 표시됩니다.

## Props \[#props]

### `SelectRoot` \[#selectroot]

- `label`
  - type: `React.ReactNode`
- `labelWeight`
  - type: `"medium" | "bold" | undefined`
  - default: `"medium"`
- `indicator`
  - type: `React.ReactNode`
- `showRequiredIndicator`
  - type: `boolean | undefined`
- `description`
  - type: `React.ReactNode`
- `errorMessage`
  - type: `React.ReactNode`
- `hiddenSelectProps`
  - type: `SeedSelect.HiddenSelectProps | undefined`
- `fieldRef`
  - type: `React.Ref<HTMLDivElement> | undefined`
- `size`
  - type: `"medium" | "large" | "responsive" | undefined`
  - default: `"large"`
  - description: - \`large\`: 뷰포트 너비와 관계없이 사용할 수 있습니다. - \`medium\`: Breakpoint \`lg\` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다. - \`responsive\`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint \`lg\` 미만에서는 \`large\`, \`lg\` 이상에서는 \`medium\`으로 적용됩니다.
- `children`
  - type: `React.ReactNode`
- `open`
  - type: `boolean | undefined`
- `defaultOpen`
  - type: `boolean | undefined`
- `onOpenChange`
  - type: `((open: boolean, details?: SelectOpenChangeDetails) => void) | undefined`
- `value`
  - type: `string[] | undefined`
  - description: Selected option values. An empty array means nothing is selected; single-select carries at most one entry.
- `defaultValue`
  - type: `string[] | undefined`
- `onValueChange`
  - type: `((value: string[]) => void) | undefined`
- `disabled`
  - type: `boolean | undefined`
- `invalid`
  - type: `boolean | undefined`
- `readOnly`
  - type: `boolean | undefined`
- `name`
  - type: `string | undefined`
  - description: Name of the hidden native \`\<select>\` for form submission.
- `form`
  - type: `string | undefined`
  - description: Form association of the hidden native \`\<select>\`.
- `required`
  - type: `boolean | undefined`
  - description: Marks the hidden native \`\<select>\` as required.
- `multiple`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether multiple options can be selected.
- `placement`
  - type: `Placement | undefined`
  - default: `"bottom"`
  - description: Floating UI placement.
- `gutter`
  - type: `number | undefined`
  - default: `8`
  - description: Distance between the trigger and the listbox.
- `overflowPadding`
  - type: `number | undefined`
  - default: `8`
  - description: Virtual padding around viewport edges for collision detection.
- `strategy`
  - type: `"absolute" | "fixed" | undefined`
  - default: `"absolute"`
  - description: Positioning strategy.
- `formatValue`
  - type: `((items: SelectedItem[]) => React.ReactNode) | undefined`
  - description: Custom trigger value rendering; overrides the default \`textValue\` join. Also the way to put an option's \`label\` node in the trigger, which the default deliberately never does.

### `SelectTrigger` \[#selecttrigger]

- `placeholder`
  - type: `React.ReactNode`
- `prefixIcon`
  - type: `React.ReactNode`
- `suffixIcon`
  - type: `React.ReactNode`
  - default: `<IconChevronDownSmallLine />`
- `size`
  - type: `"medium" | "large" | "responsive" | undefined`
  - default: `"large"`
  - description: - \`large\`: 뷰포트 너비와 관계없이 사용할 수 있습니다. - \`medium\`: Breakpoint \`lg\` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다. - \`responsive\`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint \`lg\` 미만에서는 \`large\`, \`lg\` 이상에서는 \`medium\`으로 적용됩니다.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `SelectContent` \[#selectcontent]

- `positionerContainer`
  - type: `React.RefObject<HTMLElement | null> | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `SelectGroup` \[#selectgroup]

- `label`
  - type: `React.ReactNode`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `SelectItem` \[#selectitem]

- `description`
  - type: `React.ReactNode`
- `size`
  - type: `"medium" | "large" | "responsive" | undefined`
  - default: `"large"`
  - description: - \`large\`: 뷰포트 너비와 관계없이 사용할 수 있습니다. - \`medium\`: Breakpoint \`lg\` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다. - \`responsive\`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint \`lg\` 미만에서는 \`large\`, \`lg\` 이상에서는 \`medium\`으로 적용됩니다.
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.
- `disabled`
  - type: `boolean | undefined`
- `value`
  - type: `string`
  - required: `true`
- `typeaheadLabel`
  - type: `string | undefined`
  - description: Overrides the string matched by keyboard typeahead.
- `label`
  - type: `React.ReactNode`
  - description: Rich display label. Rendered in this option's row, and used as the typeahead label when it is a string and \`typeaheadLabel\` is omitted. The trigger shows \`textValue\` instead — a node's own layout would not survive the trigger's single-line value slot — so put it there through the root's \`formatValue\`.
- `textValue`
  - type: `string | undefined`
  - description: Plain-string identity used for the trigger display and the hidden native \`\<option>\` text. Defaults to \`label\` when it is a string, otherwise the option \`value\`. Provide it when \`label\` is a \`ReactNode\` — it then also serves as the typeahead match string unless \`typeaheadLabel\` overrides it.
- `prefixIcon`
  - type: `React.ReactNode`
  - description: The option's prefix icon. Forwarded to the headless item's position-agnostic \`icon\`, which registers it for the trigger prefix slot and exposes it to the styled \`ItemPrefixIcon\` rendered in the row.

## Examples \[#examples]

### Size \[#size]

`size`로 트리거와 목록의 크기를 정합니다. (default: `large`)

`responsive` 사용 시 화면 너비에 따라 size가 자동으로 전환됩니다.

```tsx
import { VStack } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectSize() {
  return (
    <VStack gap="x4" width="240px">
      <SelectRoot size="large" defaultValue={["apple"]}>
        <SelectTrigger aria-label="과일 (large)" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <SelectRoot size="medium" defaultValue={["apple"]}>
        <SelectTrigger aria-label="과일 (medium)" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </VStack>
  );
}
```

### Groups \[#groups]

`SelectGroup`으로 옵션을 묶고, `label`로 그룹의 제목을 표시합니다. `SelectGroup`의 개수와 관계없이 모든 `SelectItem`은 `SelectGroup` 안에 있어야 합니다.

그룹이 두 개 이상이면 그룹 사이에 구분선이 자동으로 그려집니다.

```tsx
import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectGroups() {
  return (
    <Box width="240px">
      <SelectRoot defaultValue={["seoul"]}>
        <SelectTrigger aria-label="지역" placeholder="지역 선택" />
        <SelectContent>
          <SelectGroup label="아시아">
            <SelectItem value="seoul" label="서울" />
            <SelectItem value="tokyo" label="도쿄" />
            <SelectItem value="singapore" label="싱가포르" />
            <SelectItem value="dubai" label="두바이" />
          </SelectGroup>
          <SelectGroup label="유럽">
            <SelectItem value="london" label="런던" />
            <SelectItem value="paris" label="파리" />
            <SelectItem value="berlin" label="베를린" />
          </SelectGroup>
          <SelectGroup label="아메리카">
            <SelectItem value="new-york" label="뉴욕" />
            <SelectItem value="sao-paulo" label="상파울루" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
```

### Multiple Selection \[#multiple-selection]

`SelectRoot`에 `multiple`을 지정하면 여러 옵션을 선택할 수 있습니다. 옵션을 선택해도 목록이 닫히지 않으며, 이미 선택된 옵션을 다시 누르면 선택이 해제됩니다.

트리거에는 선택된 옵션들의 `textValue`가 `", "`로 이어져 표시됩니다. 이 문구는 [Custom Value Format](#custom-value-format)으로 바꿀 수 있습니다.

```tsx
import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectMultiple() {
  return (
    <Box width="240px">
      <SelectRoot multiple defaultValue={["apple", "cherry"]}>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
            <SelectItem value="grape" label="포도" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
```

### With Description \[#with-description]

`SelectItem`의 `description` prop으로 옵션에 부가 설명을 추가합니다.

```tsx
import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectWithDescription() {
  return (
    <Box width="280px">
      <SelectRoot defaultValue={["standard"]}>
        <SelectTrigger aria-label="배송 방법" placeholder="배송 방법 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="standard" label="일반 배송" description="3-5일 소요" />
            <SelectItem value="express" label="빠른 배송" description="1-2일 소요" />
            <SelectItem value="same-day" label="당일 배송" description="오늘 도착" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
```

### With Prefix Icon \[#with-prefix-icon]

`SelectItem`의 `prefixIcon` prop으로 옵션에 아이콘을 표시합니다.

1개의 옵션이 선택된 경우 해당 옵션의 아이콘이 트리거의 prefix 아이콘으로 표시됩니다. 선택된 옵션이 없거나, 선택된 옵션에 아이콘이 없거나, 여러 옵션이 선택된 경우 트리거에는 `SelectTrigger`에 지정한 `prefixIcon`이 표시됩니다.

```tsx
import {
  IconGlobeLine,
  IconLockLine,
  IconPerson2Line,
  IconPersonLine,
} from "@karrotmarket/react-monochrome-icon";
import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectWithPrefixIcon() {
  return (
    <Box width="280px">
      <SelectRoot>
        <SelectTrigger
          aria-label="공유 대상"
          placeholder="공유 대상"
          prefixIcon={<IconPerson2Line />}
        />
        <SelectContent>
          <SelectGroup label="그룹">
            <SelectItem value="public" label="전체 공개" prefixIcon={<IconGlobeLine />} />
            <SelectItem value="followers" label="팔로워만" prefixIcon={<IconLockLine />} />
            <SelectItem value="private" label="나만" prefixIcon={<IconPersonLine />} />
          </SelectGroup>
          <SelectGroup label="사람">
            <SelectItem value="kim" label="김하늘" />
            <SelectItem value="lee" label="이하늘" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
```

### Custom Item Label \[#custom-item-label]

`SelectItem`의 `label`에는 ReactNode를 넘길 수 있습니다. 이 노드는 목록의 옵션에만 렌더링됩니다.

`SelectItem`의 `label`로 string이 아닌 ReactNode를 지정하는 경우 트리거에는 `SelectItem`의 `textValue`가 표시됩니다. `textValue`는 `label`이 string이면 `label`, 아니면 `value`입니다.

따라서, `label`이 string이 아닌 경우 `textValue`를 함께 지정하는 것을 권장합니다. `textValue`는 트리거에 표시되는 문구, 키보드로 타이핑해 옵션을 찾을 때 매칭되는 문자열(typeahead), 폼 제출용 native `<option>`의 텍스트로 쓰입니다. `label`로 string이 아닌 ReactNode를 전달하면서 `textValue`를 지정하지 않는 경우 이 값들은 모두 기본적으로 `value`로 설정되며, 개발 모드에서 경고가 출력됩니다.

typeahead 문자열만 변경하고자 하는 경우 `typeaheadLabel`을 사용하세요.

```tsx
import {
  IconCarLine,
  IconFigureBikeLine,
  IconMetroFrontsideLine,
} from "@karrotmarket/react-monochrome-icon";
import { Badge, Box, HStack } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectCustomLabel() {
  return (
    <Box width="280px">
      <SelectRoot defaultValue={["metro"]}>
        <SelectTrigger aria-label="이동 수단" placeholder="이동 수단 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="bike" label="자전거" prefixIcon={<IconFigureBikeLine />} />
            <SelectItem
              value="metro"
              textValue="지하철"
              prefixIcon={<IconMetroFrontsideLine />}
              label={
                <HStack as="span" align="center" gap="x1_5">
                  지하철
                  <Badge variant="weak" tone="informative">
                    가장 빠름
                  </Badge>
                </HStack>
              }
            />
            <SelectItem
              value="car"
              textValue="자동차"
              disabled
              prefixIcon={<IconCarLine />}
              label={
                <HStack as="span" align="center" gap="x1_5">
                  자동차
                  <Badge variant="weak" tone="warning">
                    고객지원에 문의
                  </Badge>
                </HStack>
              }
            />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
```

### Disabled \[#disabled]

`SelectItem`의 `disabled`로 특정 옵션을, `SelectRoot`의 `disabled`로 Select 전체를 비활성화합니다.

```tsx
import { VStack } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectDisabled() {
  return (
    <VStack gap="x4" width="240px">
      <SelectRoot defaultValue={["apple"]}>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" disabled />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <SelectRoot disabled defaultValue={["apple"]}>
        <SelectTrigger aria-label="비활성 과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </VStack>
  );
}
```

### Long List \[#long-list]

옵션이 많으면 목록 안에서 스크롤됩니다. 목록의 최대 높이는 지정된 최대 높이와 트리거 주변에 남은 화면 공간 중 더 작은 값으로 정해지고, 노치와 홈 인디케이터 영역을 피해 배치됩니다.

목록은 현재 선택된 옵션이 보이는 위치로 스크롤된 상태에서 열립니다.

```tsx
import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

const TIME_SLOTS = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";

  return `${hour}:${minute}`;
});

export default function SelectLongList() {
  return (
    <Box width="240px">
      <SelectRoot defaultValue={["14:00"]}>
        <SelectTrigger aria-label="예약 시간" placeholder="시간 선택" />
        <SelectContent>
          <SelectGroup>
            {TIME_SLOTS.map((slot) => (
              <SelectItem key={slot} value={slot} label={slot} />
            ))}
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
```

### Placement \[#placement]

`SelectRoot`의 `placement` prop으로 목록의 위치를 설정합니다. 기본값은 `"bottom"`입니다.

```tsx
import { Box } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectPlacement() {
  return (
    <Box width="240px">
      <SelectRoot placement="top" defaultValue={["apple"]}>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}
```

### Listening to Value Changes \[#listening-to-value-changes]

`value`와 `onValueChange`로 선택 값을 제어할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import * as React from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectControlled() {
  const [value, setValue] = React.useState<string[]>(["apple"]);

  return (
    <VStack gap="x2" width="240px">
      <SelectRoot value={value} onValueChange={setValue}>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <span>선택된 값: {value.length > 0 ? value.join(", ") : "없음"}</span>
    </VStack>
  );
}
```

### Controlled Open State \[#controlled-open-state]

`open`과 `onOpenChange`로 목록의 열림 상태를 제어할 수 있습니다. 초기 상태만 지정하려면 `defaultOpen`을 사용하세요.

목록이 열리면 포커스가 목록으로 이동하고, 닫히면 트리거로 되돌아옵니다.

```tsx
import { VStack } from "@seed-design/react";
import * as React from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectControlledOpen() {
  const [open, setOpen] = React.useState(false);

  return (
    <VStack gap="x2" width="240px">
      <SelectRoot open={open} onOpenChange={setOpen} defaultValue={["apple"]}>
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <ActionButton variant="neutralWeak" disabled={open} onClick={() => setOpen(true)}>
        목록 열기
      </ActionButton>
      <span>목록 상태: {open ? "열림" : "닫힘"}</span>
    </VStack>
  );
}
```

### `onOpenChange` Details \[#onopenchange-details]

`onOpenChange` 두 번째 인자로 `details`가 제공됩니다.

#### `reason` \[#reason]

**열릴 때** (`open: true`)

- `"trigger"`: `SelectTrigger` 클릭 또는 `SelectTrigger`에 포커스된 상태에서 <kbd>↓</kbd>, <kbd>↑</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd> 키 사용

**닫힐 때** (`open: false`)

- `"trigger"`: 목록이 열린 상태에서 `SelectTrigger` 클릭
- `"itemSelect"`: 옵션 선택
  - `multiple`인 경우 옵션을 선택해도 목록이 닫히지 않으므로 발생하지 않습니다.
- `"keyboardClose"`: 하이라이트된 옵션이 없는 상태에서 <kbd>Enter</kbd> 또는 <kbd>Space</kbd> 키 사용
- `"escapeKeyDown"`: <kbd>ESC</kbd> 키 사용
- `"interactOutside"`: 외부 영역 클릭
- `"focusOut"`: <kbd>Tab</kbd> 등으로 포커스가 목록 밖으로 이동
- `"cascadeDismiss"`: 상위 레이어 닫힘으로 인한 연쇄 닫힘

```tsx
import { Box, HStack, Text, VStack } from "@seed-design/react";
import { useState } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectOpenChangeReason() {
  const [open, setOpen] = useState(false);
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<string | null>(null);

  return (
    <VStack gap="x4" align="center">
      <Box width="240px">
        <SelectRoot
          open={open}
          onOpenChange={(open, details) => {
            setOpen(open);

            (open ? setOpenReason : setCloseReason)(details?.reason ?? null);
          }}
          defaultValue={["apple"]}
        >
          <SelectTrigger aria-label="과일" placeholder="과일 선택" />
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple" label="사과" />
              <SelectItem value="banana" label="바나나" />
              <SelectItem value="cherry" label="체리" />
            </SelectGroup>
          </SelectContent>
        </SelectRoot>
      </Box>

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

### Custom Value Format \[#custom-value-format]

`SelectRoot`의 `formatValue` prop으로 트리거에 표시되는 선택 값을 커스텀합니다. 기본적으로는, 선택된 옵션들의 `textValue`를 `", "`로 join하여 표시합니다. `textValue`의 기본값은 `label`이 string이면 `label`, 아닌 경우 `value`입니다.

`formatValue`가 받는 각 항목에는 `label`도 담겨 있으므로, ReactNode `label`을 트리거에 렌더링하고 싶다면 여기서 꺼내 쓰면 됩니다.

```tsx
// 선택된 옵션 중 첫 번째 옵션의 label만 트리거에 표시
<SelectRoot formatValue={(items) => items[0]?.label} />
```

[`Intl.ListFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)을 사용하면 locale에 맞는 접속사로 목록을 조합할 수 있습니다.

```tsx
import { HStack } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

const listFormat = new Intl.ListFormat("ko", { type: "conjunction" });

export default function SelectFormatValue() {
  return (
    <HStack gap="x4" width="full">
      <SelectRoot
        multiple
        defaultValue={["apple", "banana"]}
        formatValue={(items) => listFormat.format(items.map((item) => item.textValue))}
      >
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <SelectRoot
        multiple
        defaultValue={["apple", "banana", "cherry"]}
        formatValue={([first, ...rest]) =>
          rest.length > 0 ? `${first.textValue} 외 ${rest.length}개` : first.textValue
        }
      >
        <SelectTrigger aria-label="과일" placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </HStack>
  );
}
```

### Field Integration \[#field-integration]

`label`, `description`, `errorMessage` 등의 Field 관련 prop을 사용할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectField() {
  return (
    <VStack gap="x6" width="240px">
      <SelectRoot
        label="과일"
        description="가장 좋아하는 과일을 선택하세요."
        defaultValue={["apple"]}
      >
        <SelectTrigger placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      <SelectRoot label="과일" labelWeight="bold" invalid errorMessage="과일을 선택해주세요.">
        <SelectTrigger placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </VStack>
  );
}
```

### Form Integration \[#form-integration]

`SelectRoot`가 내부에서 렌더링하는 숨겨진 native `<select>`를 통해 폼 제출에 참여할 수 있습니다.

```tsx
import { VStack } from "@seed-design/react";
import * as React from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

export default function SelectForm() {
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  return (
    <VStack asChild gap="x2" width="240px">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSubmitted(String(data.get("fruit")));
        }}
      >
        <SelectRoot name="fruit" required>
          <SelectTrigger aria-label="과일" placeholder="과일 선택" />
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple" label="사과" />
              <SelectItem value="banana" label="바나나" />
              <SelectItem value="cherry" label="체리" />
            </SelectGroup>
          </SelectContent>
        </SelectRoot>
        <ActionButton type="submit" variant="neutralSolid">
          제출
        </ActionButton>
        {submitted && <span>제출된 값: {submitted}</span>}
      </form>
    </VStack>
  );
}
```

### React Hook Form \[#react-hook-form]

`value`, `onValueChange`, `invalid`, `errorMessage`를 연결하면 [React Hook Form](https://react-hook-form.com/)의 `useController`로 검증 상태를 제어할 수 있습니다.

```tsx
import { HStack, VStack } from "@seed-design/react";
import { useCallback, type FormEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { ActionButton } from "seed-design/ui/action-button";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "seed-design/ui/select";

interface FormValues {
  fruit: string[];
}

export default function SelectReactHookForm() {
  const { handleSubmit, reset, control } = useForm<FormValues>({
    reValidateMode: "onSubmit",
    defaultValues: {
      fruit: [],
    },
  });

  // SelectRoot is not a forwardRef component, so pass only the field props it
  // accepts instead of spreading `...field` (which carries a `ref`).
  const {
    field: { value, onChange, name },
    fieldState,
  } = useController({
    name: "fruit",
    control,
    rules: {
      validate: (value) => value.length > 0 || "과일을 선택해주세요",
    },
  });

  const onValid = useCallback(
    (data: FormValues) => window.alert(JSON.stringify(data, null, 2)),
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
      <SelectRoot
        name={name}
        label="과일"
        description="가장 좋아하는 과일을 선택하세요"
        invalid={fieldState.invalid}
        errorMessage={fieldState.error?.message}
        value={value}
        onValueChange={onChange}
        showRequiredIndicator
      >
        <SelectTrigger placeholder="과일 선택" />
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" label="사과" />
            <SelectItem value="banana" label="바나나" />
            <SelectItem value="cherry" label="체리" />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
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