file: components/accordion.mdx

# Accordion

여러 개의 관련된 콘텐츠 섹션을 수직으로 나열하고, 각 섹션을 펼치거나 접어 정보를 탐색할 수 있는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0

## Preview

```tsx
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionPreview() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" />
        <AccordionContent>
          <Box p="x4">
            <p>첫 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" />
        <AccordionContent>
          <Box p="x4">
            <p>두 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" />
        <AccordionContent>
          <Box p="x4">
            <p>세 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:accordion
- pnpm: pnpm dlx @seed-design/cli@latest add ui:accordion
- yarn: yarn dlx @seed-design/cli@latest add ui:accordion
- bun: bun x @seed-design/cli@latest add ui:accordion

<ManualInstallation name="accordion" />

## Props \[#props]

### `Accordion` \[#accordion]

- `variant`
  - type: `"inline" | "separated" | undefined`
  - default: `"inline"`
  - description: - \`inline\`: Accordion Item들이 하나의 연속된 목록처럼 표현됩니다. 밀접하게 관련된 항목들을 컴팩트하게 나열할 때 사용합니다. - \`separated\`: 각 Accordion Item이 개별 카드 형태로 분리되어 표현됩니다. 항목 간 시각적 독립성이 필요하거나, 각 섹션의 중요도가 동등할 때 사용합니다.
- `size`
  - type: `"medium" | "large" | "responsive" | undefined`
  - default: `"medium"`
  - description: - \`responsive\`: 뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint \`md\` 미만에서는 \`medium\`, \`md\` 이상에서는 \`large\`로 적용됩니다.
- `values`
  - type: `string[] | undefined`
- `defaultValues`
  - type: `string[] | undefined`
- `onValuesChange`
  - type: `((values: string[]) => void) | undefined`
- `disabled`
  - type: `boolean | undefined`
- `multiple`
  - type: `boolean | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AccordionItem` \[#accordionitem]

- `value`
  - type: `string`
  - required: `true`
- `disabled`
  - type: `boolean | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AccordionTrigger` \[#accordiontrigger]

- `title`
  - type: `React.ReactNode`
  - required: `true`
- `description`
  - type: `React.ReactNode`
- `prefix`
  - type: `React.ReactNode`
- `suffixIcon`
  - type: `React.ReactNode`
- `headingLevel`
  - type: `1 | 2 | 3 | 4 | 5 | 6 | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AccordionContent` \[#accordioncontent]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Inline Variant \[#inline-variant]

기본 variant입니다. 아이템이 연속된 흐름으로 제공되며, 아이템 사이에 구분선이 표시됩니다.

```tsx
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionInline() {
  return (
    <Accordion variant="inline">
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" />
        <AccordionContent>
          <Box p="x4">
            <p>첫 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" />
        <AccordionContent>
          <Box p="x4">
            <p>두 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" />
        <AccordionContent>
          <Box p="x4">
            <p>세 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Separated \[#separated]

`variant="separated"` 를 사용하면 각 항목이 분리된 카드 형태로 표시됩니다.

```tsx
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionSeparated() {
  return (
    <Accordion variant="separated">
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" />
        <AccordionContent>
          <Box p="x4">
            <p>첫 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" />
        <AccordionContent>
          <Box p="x4">
            <p>두 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" />
        <AccordionContent>
          <Box p="x4">
            <p>세 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Multiple \[#multiple]

기본적으로 한 번에 하나의 항목만 펼칠 수 있습니다. `multiple` prop을 사용하면 여러 항목을 동시에 펼칠 수 있습니다.

```tsx
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionMultiple() {
  return (
    <Accordion multiple defaultValues={["item-1", "item-2"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" />
        <AccordionContent>
          <Box p="x4">
            <p>여러 항목을 동시에 펼칠 수 있습니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" />
        <AccordionContent>
          <Box p="x4">
            <p>각 항목은 다른 항목과 독립적으로 열고 닫힙니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" />
        <AccordionContent>
          <Box p="x4">
            <p>세 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Always one open \[#always-one-open]

`values`와 `onValuesChange`를 사용해 controlled 패턴으로 운영하면, 빈 배열이 들어올 때 setter를 호출하지 않는 가드만 추가하여 항상 하나의 항목이 열려 있도록 강제할 수 있습니다.

```tsx
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";
import { useState } from "react";

export default function AccordionControlledRequiredOpen() {
  const [values, setValues] = useState<string[]>(["item-1"]);

  return (
    <Accordion
      values={values}
      onValuesChange={(next) => {
        if (next.length === 0) return;
        setValues(next);
      }}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger title="주문 전 확인 사항" />
        <AccordionContent>
          <Box p="x4">
            <p>현재 항목은 다시 눌러도 닫히지 않고, 다른 항목을 선택할 때만 전환됩니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="배송 일정" />
        <AccordionContent>
          <Box p="x4">
            <p>평일 오후 2시 이전 주문은 당일 출고되며, 주말 주문은 다음 영업일에 출고됩니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="교환 및 반품" />
        <AccordionContent>
          <Box p="x4">
            <p>수령 후 7일 이내에 교환 또는 반품을 요청할 수 있습니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Size \[#size]

`size`로 Accordion의 크기를 정합니다. (default: `medium`)

`responsive`는 화면 너비에 따라 size가 자동으로 전환되는 값입니다. 여러 화면 너비를 함께 지원하는 제품에서 `size=responsive`를 사용하여 대응합니다.

```tsx
import { Box, VStack } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionSize() {
  return (
    <VStack width="full" gap="spacingY.componentDefault">
      <Accordion size="medium">
        <AccordionItem value="item-1">
          <AccordionTrigger title="아코디언 항목" description="size=medium (default)" />
          <AccordionContent>
            <Box p="x4">항목의 내용입니다.</Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion size="large">
        <AccordionItem value="item-1">
          <AccordionTrigger title="아코디언 항목" description="size=large" />
          <AccordionContent>
            <Box p="x4">항목의 내용입니다.</Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion size="responsive">
        <AccordionItem value="item-1">
          <AccordionTrigger title="아코디언 항목" description="size=responsive" />
          <AccordionContent>
            <Box p="x4">항목의 내용입니다.</Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}
```

### Prefix \[#prefix]

`prefix` prop에 아이콘 같은 앞쪽 요소를 전달할 수 있습니다.

```tsx
import { Box, Icon } from "@seed-design/react";
import {
  IconCardLine,
  IconQuestionmarkCircleLine,
  IconTruckLine,
} from "@karrotmarket/react-monochrome-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionWithPrefixIcon() {
  return (
    <Accordion>
      <AccordionItem value="shipping">
        <AccordionTrigger prefix={<Icon svg={<IconTruckLine />} />} title="배송 방법" />
        <AccordionContent>
          <Box p="x4">
            <p>일반 배송, 빠른 배송, 방문 수령 중 주문 상황에 맞는 방법을 선택할 수 있습니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="payment">
        <AccordionTrigger prefix={<Icon svg={<IconCardLine />} />} title="결제 및 쿠폰" />
        <AccordionContent>
          <Box p="x4">
            <p>카드, 간편결제, 보유 쿠폰을 한 번에 확인하고 결제에 적용할 수 있습니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger
          prefix={<Icon svg={<IconQuestionmarkCircleLine />} />}
          title="문의와 환불"
        />
        <AccordionContent>
          <Box p="x4">
            <p>주문 취소 가능 시간, 환불 소요 기간, 고객센터 문의 방법을 확인할 수 있습니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Description \[#description]

`description` prop으로 트리거에 부가 설명을 추가할 수 있습니다.

```tsx
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionWithDescription() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" description="항목에 대한 간략한 설명입니다." />
        <AccordionContent>
          <Box p="x4">
            <p>첫 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" description="항목에 대한 간략한 설명입니다." />
        <AccordionContent>
          <Box p="x4">
            <p>두 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" description="항목에 대한 간략한 설명입니다." />
        <AccordionContent>
          <Box p="x4">
            <p>세 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Disabled \[#disabled]

`disabled` prop으로 전체 또는 개별 항목을 비활성화할 수 있습니다.

- `Accordion`에 `disabled`를 설정하면 모든 항목이 비활성화됩니다.
- `AccordionItem`에 `disabled`를 설정하면 해당 항목만 비활성화됩니다.

```tsx
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionDisabled() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger title="활성화된 항목" />
        <AccordionContent>
          <Box p="x4">
            <p>이 항목은 활성화 상태입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger title="비활성화된 항목" />
        <AccordionContent>
          <Box p="x4">
            <p>이 항목은 비활성화 상태입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="활성화된 항목" />
        <AccordionContent>
          <Box p="x4">
            <p>이 항목은 활성화 상태입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Controlled \[#controlled]

`values`와 `onValuesChange`를 사용하여 열림 상태를 직접 제어할 수 있습니다.

```tsx
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";
import { useState } from "react";

export default function AccordionControlled() {
  const [values, setValues] = useState<string[]>(["item-1"]);

  return (
    <Accordion values={values} onValuesChange={setValues}>
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" />
        <AccordionContent>
          <Box p="x4">
            <p>첫 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" />
        <AccordionContent>
          <Box p="x4">
            <p>두 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" />
        <AccordionContent>
          <Box p="x4">
            <p>세 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Value Array Changes \[#value-array-changes]

controlled 모드에서는 현재 열려 있는 항목이 `values` 배열로 전달됩니다. 아래 예시는 트리거를 누를 때마다 최신 `values`와 최근 `onValuesChange` 결과를 함께 보여줍니다.

```tsx
import { Box, Text, VStack } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";
import { useState } from "react";

const DEFAULT_VALUES = ["shipping"];

export default function AccordionValueChanges() {
  const [values, setValues] = useState<string[]>(DEFAULT_VALUES);
  const [history, setHistory] = useState<string[][]>([DEFAULT_VALUES]);

  return (
    <Box
      width="full"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
        gap: "24px",
        alignItems: "start",
        minHeight: "320px",
      }}
    >
      <Accordion
        multiple
        values={values}
        onValuesChange={(nextValues) => {
          setValues(nextValues);
          setHistory((prev) => [nextValues, ...prev].slice(0, 5));
        }}
      >
        <AccordionItem value="shipping">
          <AccordionTrigger title="배송 옵션" />
          <AccordionContent>
            <Box p="x4">
              <p>빠른 배송, 새벽 배송, 방문 수령 옵션을 비교할 수 있습니다.</p>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="payment">
          <AccordionTrigger title="결제 수단" />
          <AccordionContent>
            <Box p="x4">
              <p>카드, 계좌이체, 간편결제 중에서 원하는 결제 수단을 선택할 수 있습니다.</p>
            </Box>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="refund">
          <AccordionTrigger title="환불 정책" />
          <AccordionContent>
            <Box p="x4">
              <p>주문 취소 가능 시간과 환불 소요 기간을 확인할 수 있습니다.</p>
            </Box>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Box
        p="x4"
        bg="bg.layerBasement"
        borderRadius="r2"
        borderWidth={1}
        borderColor="stroke.neutralWeak"
        style={{ alignSelf: "start" }}
      >
        <VStack gap="x2" align="stretch">
          <Text textStyle="t3Medium">
            <code>values</code>: {JSON.stringify(values)}
          </Text>
          <Text textStyle="t3Medium">
            <code>onValuesChange</code> history:
          </Text>
          {history.map((snapshot, index) => (
            <Text key={`${snapshot.join(",") || "empty"}-${index}`} textStyle="t4Regular">
              {index + 1}. {JSON.stringify(snapshot)}
            </Text>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
```

### Default Expanded \[#default-expanded]

`defaultValues`를 사용하여 초기 열림 상태를 지정할 수 있습니다.

```tsx
import { Box } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionDefaultExpanded() {
  return (
    <Accordion multiple defaultValues={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger title="아코디언 항목 1" />
        <AccordionContent>
          <Box p="x4">
            <p>첫 번째 항목은 기본으로 펼쳐진 상태입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="아코디언 항목 2" />
        <AccordionContent>
          <Box p="x4">
            <p>두 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger title="아코디언 항목 3" />
        <AccordionContent>
          <Box p="x4">
            <p>세 번째 항목의 내용입니다.</p>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Custom Content \[#custom-content]

`AccordionContent`는 열림/닫힘 애니메이션 컨테이너 역할만 합니다. 기본 패딩, 배경색, 테두리, 타이포그래피 스타일은 제공하지 않으므로 내부 콘텐츠에서 직접 구성해야 합니다. 아래 예시처럼 `Box`로 패딩과 배경을 명시적으로 주는 패턴을 권장합니다.

```tsx
import { Box, Text, VStack } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionCustomContent() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger title="배송 안내" description="배송 정책 및 예상 소요 시간" />
        <AccordionContent>
          <Box p="x4">
            <Box p="x4" borderRadius="r3" bg="bg.layerBasement">
              <VStack gap="x3" align="stretch">
                <VStack gap="x1" align="stretch">
                  <Text textStyle="t5Bold">일반 배송</Text>
                  <Text textStyle="t5Regular">주문 후 영업일 기준 2-3일 내에 배송됩니다.</Text>
                </VStack>
                <Box p="x3" borderRadius="r2" bg="bg.layerDefault">
                  <Text textStyle="t4Regular" color="fg.neutralSubtle">
                    제주 및 도서산간 지역은 1-2일이 추가 소요될 수 있습니다.
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Box>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger title="반품 및 교환" description="반품/교환 절차 안내" />
        <AccordionContent>
          <Box p="x4">
            <Box p="x4" borderRadius="r3" bg="bg.layerBasement">
              <VStack gap="x2" align="stretch">
                <Text textStyle="t5Regular">1. 고객센터로 반품/교환 요청</Text>
                <Text textStyle="t5Regular">2. 상품 수거 (택배 방문 수거)</Text>
                <Text textStyle="t5Regular">3. 검수 후 환불 또는 교환 처리</Text>
              </VStack>
            </Box>
          </Box>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

## Accessibility \[#accessibility]

[WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)을 따릅니다.

`AccordionTrigger`는 내부적으로 `heading > button` 구조를 구성합니다. 기본 heading level은 `h3`이며, 문서 구조에 맞춰 다른 level이 필요하면 `headingLevel` prop으로 조정할 수 있습니다. WAI-ARIA APG 예시에서도 상위 섹션 구조에 맞춰 `h3`를 사용합니다.

- Pattern: [WAI-ARIA APG Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- Example: [WAI-ARIA APG Accordion Example](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/)

### Heading Level Escape Hatch \[#heading-level-escape-hatch]

상위 섹션 heading이 이미 존재한다면 `headingLevel`로 accordion header의 level을 맞춰 주세요. 예를 들어 accordion이 `h3` 섹션 안에 들어간다면 각 항목 header는 `h4`로 내리는 식으로 문서 outline을 유지할 수 있습니다.

```tsx
import { Box, Text, VStack } from "@seed-design/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "seed-design/ui/accordion";

export default function AccordionHeadingLevel() {
  return (
    <Box width="full" height="full" p="x6">
      <VStack gap="x4" align="stretch" width="full">
        <Text as="h3" textStyle="t5Bold">
          주문 도움말
        </Text>
        <Accordion>
          <AccordionItem value="shipping">
            <AccordionTrigger
              headingLevel={4}
              title="배송 일정"
              description="상위 섹션이 이미 h3인 경우"
            />
            <AccordionContent>
              <Box p="x4">
                <p>
                  배송 관련 세부 내용은 h4 heading 아래의 accordion section으로 제공할 수 있습니다.
                </p>
              </Box>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
}
```

### 키보드 인터랙션 \[#키보드-인터랙션]

| 키                 | 동작                                      |
| ----------------- | --------------------------------------- |
| `Enter` / `Space` | 포커스된 트리거의 패널을 펼치거나 접습니다.                |
| `Tab`             | 다음 포커스 가능한 요소로 이동합니다.                   |
| `Shift + Tab`     | 이전 포커스 가능한 요소로 이동합니다.                   |
| `ArrowDown`       | 다음 트리거로 포커스를 이동합니다. 마지막이면 첫 번째로 순환합니다.  |
| `ArrowUp`         | 이전 트리거로 포커스를 이동합니다. 첫 번째이면 마지막으로 순환합니다. |
| `Home`            | 첫 번째 트리거로 포커스를 이동합니다.                   |
| `End`             | 마지막 트리거로 포커스를 이동합니다.                    |