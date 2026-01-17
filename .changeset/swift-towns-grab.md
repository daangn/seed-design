---
"@seed-design/react": minor
"@seed-design/css": minor
---

[Tag Group](/react/components/tag-group) 관련 컴포넌트를 업데이트합니다.

- 인라인 레이아웃 및 말줄임 우선순위 옵션을 추가합니다.
  - `TagGroupRoot`에 `inline` prop을 추가하여 인라인 레이아웃을 사용할 수 있습니다. (기본값: `false`. 기본값 변경 없음)
  - `TagGroupItem`에 `flexShrink` prop을 추가하여 말줄임 우선순위를 조정할 수 있습니다.
- **1.1 → 1.2 업그레이드 시 변경 필요**: `TagGroupItem` 내부 레이블을 `TagGroupItemLabel`로 감싸거나, 신규로 제공되는 Snippet에서 제공하는 API로 교체해주세요.

  - `npx @seed-design/cli@latest add ui:tag-group` 명령어로 Snippet을 추가할 수 있습니다.

  ```tsx
  // 전
  import { TagGroupRoot, TagGroupItem } from "@seed-design/react";

  <TagGroupRoot>
    <TagGroupItem>
      <PrefixIcon svg={<IconLocationpinFill />} />
      서초4동
    </TagGroupItem>
    <TagGroupItem>
      광고
      <Icon svg={<IconMegaphoneFill />} color="fg.brand" />
    </TagGroupItem>
    {/* ... */}
  </TagGroupRoot>;
  ```

  ```tsx
  // 후 (Compound Component)
  import {
    TagGroupRoot,
    TagGroupItem,
    TagGroupItemLabel,
  } from "@seed-design/react";

  <TagGroupRoot>
    <TagGroupItem>
      <PrefixIcon svg={<IconLocationpinFill />} />
      {/* TagGroupItemLabel 사용 */}
      <TagGroupItemLabel>서초4동</TagGroupItemLabel>
    </TagGroupItem>
    <TagGroupItem>
      {/* TagGroupItemLabel 사용 */}
      <TagGroupItemLabel>광고</TagGroupItemLabel>
      <Icon svg={<IconMegaphoneFill />} color="fg.brand" />
    </TagGroupItem>
    {/* ... */}
  </TagGroupRoot>;
  ```

  ```tsx
  // 후 (snippet 사용)
  // snippet 없는 경우, `npx @seed-design/cli@latest add ui:tag-group`

  import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";
  import {
    TagGroupRoot as SeedTagGroupRoot,
    TagGroupItem as SeedTagGroupItem,
    TagGroupItemLabel as SeedTagGroupItemLabel,
  } from "@seed-design/react";

  <TagGroupRoot>
    <TagGroupItem label="서초4동" prefixIcon={<IconLocationpinFill />} />
    <SeedTagGroupItem>
      <SeedTagGroupItemLabel>광고</SeedTagGroupItemLabel>
      {/* 아이콘 커스터마이징이 필요한 경우 snippet 대신 Compound Component를 사용합니다. */}
      <Icon svg={<IconMegaphoneFill />} color="fg.brand" />
    </SeedTagGroupItem>
    {/* ... */}
  </TagGroupRoot>;
  ```
