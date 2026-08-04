file: components/reaction-button.mdx

# Reaction Button

사용자가 콘텐츠에 대한 반응을 표현할 수 있게 해주는 컴포넌트입니다. 좋아요, 관심있어요 등의 감정적 피드백을 간편하게 제공할 때 사용됩니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Count, PrefixIcon } from "@seed-design/react";
import { ReactionButton } from "seed-design/ui/reaction-button";

export default function ReactionButtonPreview() {
  return (
    <ReactionButton>
      <PrefixIcon svg={<IconFaceSmileCircleFill />} />
      도움돼요
      <Count>1</Count>
    </ReactionButton>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:reaction-button
- pnpm: pnpm dlx @seed-design/cli@latest add ui:reaction-button
- yarn: yarn dlx @seed-design/cli@latest add ui:reaction-button
- bun: bun x @seed-design/cli@latest add ui:reaction-button

<ManualInstallation name="reaction-button" />

## Props \[#props]

- `size`
  - type: `"xsmall" | "small" | undefined`
  - default: `"small"`
- `loading`
  - type: `boolean | undefined`
  - default: `false`
  - description: 버튼에 등록된 비동기 작업이 진행 중임을 사용자에게 알립니다.
- `disabled`
  - type: `boolean | undefined`
  - default: `false`
  - description: 버튼의 비활성화 여부를 나타냅니다.
- `pressed`
  - type: `boolean | undefined`
- `defaultPressed`
  - type: `boolean | undefined`
- `onPressedChange`
  - type: `((pressed: boolean) => void) | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

## Examples \[#examples]

### Small \[#small]

```tsx
import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Count, PrefixIcon } from "@seed-design/react";
import { ReactionButton } from "seed-design/ui/reaction-button";

export default function ReactionButtonSmall() {
  return (
    <ReactionButton size="small">
      <PrefixIcon svg={<IconFaceSmileCircleFill />} />
      도움돼요
      <Count>1</Count>
    </ReactionButton>
  );
}
```

### Xsmall \[#xsmall]

```tsx
import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { Count, PrefixIcon } from "@seed-design/react";
import { ReactionButton } from "seed-design/ui/reaction-button";

export default function ReactionButtonXsmall() {
  return (
    <ReactionButton size="xsmall">
      <PrefixIcon svg={<IconFaceSmileCircleFill />} />
      도움돼요
      <Count>1</Count>
    </ReactionButton>
  );
}
```

### Disabled \[#disabled]

```tsx
import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ReactionButton } from "seed-design/ui/reaction-button";

export default function ReactionButtonDisabled() {
  return (
    <ReactionButton disabled>
      <PrefixIcon svg={<IconFaceSmileCircleFill />} />
      비활성
    </ReactionButton>
  );
}
```

### Loading \[#loading]

```tsx
import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { useState } from "react";
import { ReactionButton } from "seed-design/ui/reaction-button";

export default function ReactionButtonLoading() {
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleToggle() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPressed((prev) => !prev);
    }, 2000);
  }

  // 이벤트 핸들링이 필요할 수 있으므로 loading은 disabled를 포함하지 않습니다. 이벤트 발생을 원하지 않는 경우, disabled 속성을 추가해주세요.
  return (
    <ReactionButton loading={loading} pressed={pressed} onPressedChange={handleToggle}>
      <PrefixIcon svg={<IconFaceSmileCircleFill />} />
      시간이 걸리는 토글
    </ReactionButton>
  );
}
```