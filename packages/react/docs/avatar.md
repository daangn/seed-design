file: components/avatar.mdx

# Avatar

사용자의 프로필 이미지를 표시하는 컴포넌트입니다.

사용 가능 버전: @seed-design/react@0.0.1, @seed-design/css@0.0.1

## Preview

```tsx
import { Box, Flex } from "@seed-design/react";
import { Avatar, AvatarBadge } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function AvatarPreview() {
  return (
    <Flex gap="x4">
      <Avatar
        size="80"
        badgeMask="circle"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      >
        <AvatarBadge>
          <Box borderRadius="full" bg="palette.green600" width="x6" height="x6" />
        </AvatarBadge>
      </Avatar>
      <Avatar size="80" src={undefined} fallback={<IdentityPlaceholder />} />
    </Flex>
  );
}
```

## Installation \[#installation]

- npm: npx @seed-design/cli@latest add ui:avatar
- pnpm: pnpm dlx @seed-design/cli@latest add ui:avatar
- yarn: yarn dlx @seed-design/cli@latest add ui:avatar
- bun: bun x @seed-design/cli@latest add ui:avatar

<ManualInstallation name="avatar" />

## Props \[#props]

### `Avatar` \[#avatar]

- `src`
  - type: `string | undefined`
- `alt`
  - type: `string | undefined`
- `fallback`
  - type: `React.ReactNode`
- `size`
  - type: `"20" | "24" | "36" | "42" | "48" | "56" | "64" | "80" | "96" | "108" | undefined`
  - default: `48`
  - description: - \`20\`: 대표 사용처: 댓글을 남긴 사용자 - \`24\`: 대표 사용처: 답글 프로필 - \`36\`: 대표 사용처: 댓글 프로필 - \`42\`: 대표 사용처: 게시글 상세 내 프로필 - \`48\`: 대표 사용처: 작은 리스트 - \`56\`: 대표 사용처: 큰 리스트 - \`64\`: 대표 사용처: 프로필 상세, 캐러셀 - \`108\`: 대표 사용처: 프로필 수정
- `badgeMask`
  - type: `"none" | "circle" | "flower" | "shield" | undefined`
  - default: `"none"`
- `onLoadingStatusChange`
  - type: `((status: ImageLoadingStatus) => void) | undefined`
- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AvatarBadge` \[#avatarbadge]

- `asChild`
  - type: `boolean | undefined`
  - default: `false`
  - description: Whether the element should be rendered as a child of a slot.

### `AvatarStack` \[#avatarstack]

- `size`
  - type: `"20" | "24" | "36" | "42" | "48" | "56" | "64" | "80" | "96" | "108" | undefined`
  - default: `48`

## Examples \[#examples]

### Size \[#size]

```tsx
import { Flex } from "@seed-design/react";
import { Avatar } from "seed-design/ui/avatar";

export default function AvatarSize() {
  return (
    <Flex gap="x4">
      <Avatar size="20" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="24" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="36" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="48" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="64" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="80" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="96" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
      <Avatar size="108" src="https://avatars.githubusercontent.com/u/54893898?v=4" fallback="L" />
    </Flex>
  );
}
```

### Badge & Badge Mask \[#badge--badge-mask]

```tsx
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";
import { Avatar, AvatarBadge } from "seed-design/ui/avatar";
import { Box, HStack } from "@seed-design/react";

export default function () {
  return (
    <HStack gap="x4">
      <Avatar
        size="64"
        badgeMask="circle"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      >
        <AvatarBadge asChild>
          <Box bg="palette.green600" borderRadius="full" />
        </AvatarBadge>
      </Avatar>
      <Avatar
        size="64"
        badgeMask="flower"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      >
        <AvatarBadge asChild>
          <img
            src="/flower_green_checkmark.svg"
            alt="뱃지를 설명하는 대체 텍스트를 제공해야 합니다."
          />
        </AvatarBadge>
      </Avatar>
      <Avatar
        size="64"
        badgeMask="shield"
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      >
        <AvatarBadge asChild>
          <img
            src="/shield_blue_checkmark.svg"
            alt="뱃지를 설명하는 대체 텍스트를 제공해야 합니다."
          />
        </AvatarBadge>
      </Avatar>
    </HStack>
  );
}
```

### Stack \[#stack]

```tsx
import { Avatar, AvatarStack } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function AvatarStackExample() {
  return (
    <AvatarStack size="64">
      <Avatar
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/54893898?v=4"
        fallback={<IdentityPlaceholder />}
      />
    </AvatarStack>
  );
}
```

### Fallback Image \[#fallback-image]

`fallback` prop으로 이미지가 로드되지 않았을 때 보여질 요소를 지정할 수 있습니다. 주로 [IdentityPlaceholder](/react/components/identity-placeholder)를 사용합니다.

```tsx
import { Flex } from "@seed-design/react";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function AvatarFallbackExample() {
  return (
    <Flex gap="x4" align="center">
      <Avatar size="80" fallback={<IdentityPlaceholder identity="person" />} />
      <Avatar size="80" fallback={<IdentityPlaceholder identity="business" />} />
    </Flex>
  );
}
```