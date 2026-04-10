# Accordion Component Design Spec

## Context

SEED Design needs an Accordion component for expand/collapse UI patterns with multiple related content sections. The existing `collapsible` headless package handles single-item expand/collapse, but Accordion requires multi-item state coordination (single vs multiple expand), keyboard navigation across items, and WAI-ARIA accordion pattern compliance. This is a new component spanning rootage spec, qvism-preset recipe, react styled component, docs, storybook, and examples.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Expansion mode API | `type="single" \| "multiple"` | Radix pattern. Type-safe value inference (string vs string[]) |
| Default expansion mode | `type="multiple"` | PRD default. FAQ-like use cases are more common |
| Prefix slots | PrefixIcon + PrefixAvatar separate | Chip pattern. Different padding/size per asset type |
| SuffixIcon (chevron) | Empty slot, snippet provides icon | Customizable. Rotation via CSS data-open |
| Title side slots | Free layout in Trigger | Trigger is flex container, children freely arranged |
| Headless layer | None. React package composes collapsible directly | Simpler architecture, no new headless package |
| State architecture | Context-based coordination (Approach A) | Root manages value, Items derive open state |
| Variants | inline, separated | PRD spec. inline=divider, separated=card-style |
| Size variant | medium, large | From Figma spec. Affects trigger padding, title font size |

## Component Hierarchy

```
Accordion.Root           // div - state management + context provider
  Accordion.Item         // div - individual item wrapper
    Accordion.Trigger    // button - clickable header area (flex container)
      Accordion.PrefixIcon     // div - optional left icon
      Accordion.PrefixAvatar   // div - optional left avatar
      Accordion.Title          // span - main title text
      Accordion.Description    // span - optional subtitle
      Accordion.SuffixIcon     // div - optional right icon (chevron rotation)
    Accordion.Content    // div - expandable content area (uses collapsible)
```

## API

### AccordionRoot

```typescript
// Discriminated union based on type
interface AccordionSingleRootProps extends PrimitiveProps, AccordionVariantProps,
    React.HTMLAttributes<HTMLDivElement> {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean; // default: true. When false, last open item can't be closed
  disabled?: boolean;
}

interface AccordionMultipleRootProps extends PrimitiveProps, AccordionVariantProps,
    React.HTMLAttributes<HTMLDivElement> {
  type?: "multiple"; // default
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
}

type AccordionRootProps = AccordionSingleRootProps | AccordionMultipleRootProps;
```

### AccordionItem

```typescript
interface AccordionItemProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  value: string;      // unique identifier (required)
  disabled?: boolean; // per-item disable
}
```

### Slot Components (Trigger, Content, PrefixIcon, PrefixAvatar, Title, Description, SuffixIcon)

All extend `PrimitiveProps` + appropriate `React.HTMLAttributes`. No special props beyond standard HTML attributes.

## State Management

```
AccordionRoot
  ├─ useControllableState(value / defaultValue / onValueChange)
  ├─ AccordionContext.Provider { type, value, toggle, disabled, collapsible }
  │
  └─ AccordionItem
       ├─ AccordionItemContext.Provider { value, open, disabled }
       ├─ open = derived from root context:
       │    single: rootValue === itemValue
       │    multiple: rootValue.includes(itemValue)
       │
       ├─ Collapsible (controlled: open={derived}, onOpenChange={toggle})
       │    ├─ stateProps → propagated to Trigger and Content
       │    └─ contentProps → height CSS variable for animation
       │
       └─ toggle(itemValue):
            single: collapsible ? (open ? "" : itemValue) : itemValue
            multiple: open ? value.filter(v => v !== itemValue) : [...value, itemValue]
```

### Context Structure

```typescript
// Root context
interface AccordionContext {
  type: "single" | "multiple";
  value: string | string[];
  toggle: (itemValue: string) => void;
  disabled: boolean;
  collapsible: boolean; // only meaningful for single
}

// Item context
interface AccordionItemContext {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}
```

## Accessibility (WAI-ARIA Accordion Pattern)

### ARIA Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| Trigger (button) | `aria-expanded` | `"true"` / `"false"` |
| Trigger (button) | `aria-controls` | Content element's id |
| Trigger (button) | `aria-disabled` | `"true"` when disabled |
| Content (div) | `role` | `"region"` |
| Content (div) | `aria-labelledby` | Trigger element's id |
| Content (div) | `hidden` | Set after close animation completes |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Toggle focused trigger |
| `ArrowDown` | Move focus to next trigger (skip disabled) |
| `ArrowUp` | Move focus to previous trigger (skip disabled) |
| `Home` | Move focus to first trigger |
| `End` | Move focus to last trigger |
| `Tab` | Standard tab order (trigger → content internals → next trigger) |

Implementation: Root captures `onKeyDown` for ArrowUp/Down/Home/End. Collects trigger elements via `[data-accordion-trigger]` selector. Disabled items are skipped in navigation.

## Animation

### Content expand/collapse

Uses existing collapsible's `--collapsible-content-height` CSS variable. Duration and timing function come from rootage tokens (`$duration.d6` = 300ms, `$timing-function.easing`):

```css
/* In recipe content slot — values from vars */
overflow: hidden;
height: var(--collapsible-content-height);
transition-property: height;
transition-duration: vars.base.enabled.content.expandHeightDuration;
transition-timing-function: vars.base.enabled.content.expandHeightTimingFunction;
```

### SuffixIcon chevron rotation

PRD spec: 180 degree rotation. Duration/timing from rootage tokens:

```css
/* In recipe suffixIcon slot — values from vars */
transition-property: transform;
transition-duration: vars.base.enabled.suffixIcon.rotateDuration;
transition-timing-function: vars.base.enabled.suffixIcon.rotateTimingFunction;

[data-open] & {
  transform: rotate(180deg);
}
```

### Rapid toggle handling

The collapsible's existing `onTransitionEnd` listener handles this — content stays visible until height transition completes, then `hidden` is set. Rapid toggles interrupt the transition naturally.

## Data Attributes

| Attribute | Applied to | Purpose |
|-----------|-----------|---------|
| `data-open` | Item, Trigger, SuffixIcon, Content | Open state styling |
| `data-disabled` | Item, Trigger | Disabled state styling |
| `data-accordion-trigger` | Trigger | Keyboard navigation selector |

## Recipe Structure (qvism-preset)

### File: `packages/qvism-preset/src/recipes/accordion.ts`

```typescript
const accordion = defineSlotRecipe({
  name: "accordion",
  slots: ["root", "item", "trigger", "prefixIcon", "prefixAvatar",
          "title", "description", "suffixIcon", "content"],
  base: {
    root: { /* container styles */ },
    item: { /* item wrapper */ },
    trigger: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      cursor: "pointer",
      border: "none",
      background: "transparent",
      textAlign: "start",
      // focus ring styles
      // disabled: cursor not-allowed
    },
    prefixIcon: { display: "inline-flex", alignItems: "center", flexShrink: 0 },
    prefixAvatar: { display: "inline-flex", alignItems: "center", flexShrink: 0 },
    title: { fontWeight, fontSize, lineHeight from tokens },
    description: { fontSize, color from tokens },
    suffixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      marginLeft: "auto",
      transition: "transform 300ms ease-in-out",
      [pseudo(expanded)]: { transform: "rotate(180deg)" },
    },
    content: {
      overflow: "hidden",
      height: "var(--collapsible-content-height)",
      transition: "height 300ms ease-in-out",
    },
  },
  variants: {
    variant: {
      inline: {
        // full-width items, dividers handled via border or pseudo-element
      },
      separated: {
        item: {
          border: `1px solid ${vars.variantSeparated.enabled.item.borderColor}`,
          borderRadius: vars.variantSeparated.enabled.item.cornerRadius,
        },
      },
    },
    size: {
      medium: {
        trigger: {
          paddingTop: vars.sizeMedium.enabled.trigger.paddingY,
          paddingBottom: vars.sizeMedium.enabled.trigger.paddingY,
        },
        title: {
          fontSize: vars.sizeMedium.enabled.title.fontSize,
          lineHeight: vars.sizeMedium.enabled.title.lineHeight,
        },
      },
      large: {
        trigger: {
          paddingTop: vars.sizeLarge.enabled.trigger.paddingY,
          paddingBottom: vars.sizeLarge.enabled.trigger.paddingY,
        },
        title: {
          fontSize: vars.sizeLarge.enabled.title.fontSize,
          lineHeight: vars.sizeLarge.enabled.title.lineHeight,
        },
      },
    },
  },
  compoundVariants: [
    {
      variant: "separated", size: "medium",
      css: { root: { gap: vars.variantSeparatedSizeMedium.enabled.root.gap } },
    },
    {
      variant: "separated", size: "large",
      css: { root: { gap: vars.variantSeparatedSizeLarge.enabled.root.gap } },
    },
  ],
  defaultVariants: {
    variant: "inline",
    size: "medium",
  },
});
```

Token values from Figma spec are defined in the rootage YAML below and referenced via `vars`.

## Rootage YAML Spec

### File: `packages/rootage/components/accordion.yaml`

```yaml
kind: ComponentSpec
metadata:
  id: accordion
  name: Accordion
data:
  schema:
    slots:
      root: {}
      item:
        properties:
          gap: { type: dimension }  # separated variant only
      trigger:
        properties:
          minHeight: { type: dimension }
          paddingX: { type: dimension }
          paddingY: { type: dimension }
      prefixIcon:
        properties:
          size: { type: dimension }
          paddingRight: { type: dimension }
      prefixAvatar:
        properties:
          size: { type: dimension }
          paddingRight: { type: dimension }
      title:
        properties:
          fontSize: { type: dimension }
          lineHeight: { type: dimension }
          fontWeight: { type: number }
          color: { type: color }
      description:
        properties:
          fontSize: { type: dimension }
          lineHeight: { type: dimension }
          color: { type: color }
      suffixIcon:
        properties:
          size: { type: dimension }
          color: { type: color }
          paddingLeft: { type: dimension }
          rotateDuration: { type: duration }
          rotateTimingFunction: { type: cubicBezier }
      content:
        properties:
          paddingX: { type: dimension }
          paddingTop: { type: dimension }
          paddingBottom: { type: dimension }
          expandHeightDuration: { type: duration }
          expandHeightTimingFunction: { type: cubicBezier }
          collapseHeightDuration: { type: duration }
          collapseHeightTimingFunction: { type: cubicBezier }
    variants:
      variant:
        values:
          inline: { description: "Full-width items with dividers" }
          separated: { description: "Card-style independent items with gap" }
      size:
        values:
          medium: {}
          large: {}
  definitions:
    base:
      enabled:
        trigger:
          paddingX: $dimension.spacing-x.global-gutter  # 16px
        title:
          color: $color.fg.neutral
          fontWeight: $font-weight.medium
        description:
          color: $color.fg.neutral-subtle
        suffixIcon:
          color: $color.fg.neutral-subtle
          rotateDuration: $duration.d6
          rotateTimingFunction: $timing-function.easing
        content:
          expandHeightDuration: $duration.d6
          expandHeightTimingFunction: $timing-function.easing
          collapseHeightDuration: $duration.d6
          collapseHeightTimingFunction: $timing-function.easing
      disabled:
        trigger:
          opacity: 0.4
    size=medium:
      enabled:
        trigger:
          paddingY: $dimension.x4  # 16px
        title:
          fontSize: $font-size.t5   # 16px
          lineHeight: $line-height.t5  # 22px
    size=large:
      enabled:
        trigger:
          paddingY: $dimension.x6  # 24px
        title:
          fontSize: $font-size.t7   # 20px
          lineHeight: $line-height.t7  # 27px
    variant=separated:
      enabled:
        item:
          borderColor: $color.stroke.neutral-muted
          cornerRadius: $radius.r3  # 12px
    variant=separated, size=medium:
      enabled:
        root:
          gap: $dimension.x3  # 12px
    variant=separated, size=large:
      enabled:
        root:
          gap: $dimension.x4  # 16px
```

Note: Exact token references will be finalized during implementation based on Figma design tokens.

## Implementation Plan Overview

### Files to Create/Modify

**New files:**
1. `packages/rootage/components/accordion.yaml` - Design token spec
2. `packages/qvism-preset/src/recipes/accordion.ts` - Style recipe
3. `packages/react/src/components/Accordion/Accordion.tsx` - React component
4. `packages/react/src/components/Accordion/Accordion.namespace.ts` - Namespace exports
5. `packages/react/src/components/Accordion/useAccordion.ts` - State management hook
6. `packages/react/src/components/Accordion/AccordionContext.tsx` - Context definitions
7. `packages/react/src/components/Accordion/index.ts` - Barrel exports
8. `docs/content/docs/components/(layout)/accordion.mdx` - Design documentation
9. `docs/content/react/components/accordion.mdx` - React implementation docs
10. `docs/examples/react/accordion/*.tsx` - Code examples (see Documentation Examples below)
11. `docs/stories/Accordion.stories.tsx` - Storybook stories with VariantTable
12. `examples/stackflow-spa/src/seed-design/ui/accordion.tsx` - Snippet/usage example
13. `examples/stackflow-spa/src/activities/ActivityAccordion.tsx` - Interactive demo

**Registry snippet:**
14. `docs/registry/ui/accordion.tsx` - Registry snippet with pre-configured defaults (chevron icon built into Trigger wrapper)

**Modified files:**
15. `packages/react/src/components/index.ts` - Add Accordion exports
16. `packages/qvism-preset/src/recipes/index.ts` - Add accordion recipe export
17. `docs/content/docs/components/(layout)/meta.json` - Add accordion to navigation

### Implementation Order

1. **Rootage YAML** → `bun rootage:generate` → generates token vars
2. **qvism-preset recipe** → `bun qvism:generate` → generates CSS
3. **React components** (useAccordion hook → Context → Components)
4. **Snippet** (examples/stackflow-spa)
5. **Docs** (design docs MDX + react docs MDX + code examples)
6. **Storybook** stories
7. **Tests** (accessibility, keyboard nav, single/multiple mode, animation)

### Verification

- `bun generate:all` passes
- `bun packages:build` passes
- `bun test:all` passes
- Storybook renders all variants correctly
- Keyboard navigation works per WAI-ARIA spec
- Animation is smooth (300ms height + chevron rotation)
- Screen reader announces expand/collapse states
- Single mode correctly closes other items
- Multiple mode allows independent toggle
- Disabled items are skipped in keyboard nav and non-interactive

## Usage Examples

### Basic (multiple mode, default)

```tsx
<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>
      <Accordion.Title>Section 1</Accordion.Title>
      <Accordion.SuffixIcon>
        <IconChevronDownSmallLine />
      </Accordion.SuffixIcon>
    </Accordion.Trigger>
    <Accordion.Content>
      <p>Content for section 1</p>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>
      <Accordion.Title>Section 2</Accordion.Title>
      <Accordion.SuffixIcon>
        <IconChevronDownSmallLine />
      </Accordion.SuffixIcon>
    </Accordion.Trigger>
    <Accordion.Content>
      <p>Content for section 2</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Single expand mode

```tsx
<Accordion.Root type="single" defaultValue="item-1">
  {/* items */}
</Accordion.Root>
```

### With prefix icon and description

```tsx
<Accordion.Item value="faq-1">
  <Accordion.Trigger>
    <Accordion.PrefixIcon>
      <IconHelpFill />
    </Accordion.PrefixIcon>
    <Accordion.Title>How do I reset my password?</Accordion.Title>
    <Accordion.Description>Account settings</Accordion.Description>
    <Accordion.SuffixIcon>
      <IconChevronDownSmallLine />
    </Accordion.SuffixIcon>
  </Accordion.Trigger>
  <Accordion.Content>
    <p>Go to Settings > Security > Reset Password</p>
  </Accordion.Content>
</Accordion.Item>
```

### Separated variant

```tsx
<Accordion.Root variant="separated">
  {/* items rendered as independent cards with border-radius and gap */}
</Accordion.Root>
```

### Controlled

```tsx
const [value, setValue] = useState<string[]>(["item-1"]);

<Accordion.Root value={value} onValueChange={setValue}>
  {/* items */}
</Accordion.Root>
```

## Registry Snippet (`docs/registry/ui/accordion.tsx`)

The snippet wraps `@seed-design/react` primitives with ergonomic defaults, similar to how shadcn/ui wraps Radix components. Key convenience: `AccordionTrigger` automatically includes the chevron SuffixIcon with rotation, so consumers don't need to add it manually.

```tsx
"use client";

import { Accordion as SeedAccordion } from "@seed-design/react";
import { IconChevronDownSmallLine } from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

// --- Root ---
export interface AccordionRootProps extends SeedAccordion.RootProps {}
export const AccordionRoot = SeedAccordion.Root;

// --- Item ---
export interface AccordionItemProps extends SeedAccordion.ItemProps {}
export const AccordionItem = SeedAccordion.Item;

// --- Trigger (with built-in chevron) ---
export interface AccordionTriggerProps extends SeedAccordion.TriggerProps {}
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, ...props }, ref) => (
    <SeedAccordion.Trigger ref={ref} {...props}>
      {children}
      <SeedAccordion.SuffixIcon>
        <IconChevronDownSmallLine />
      </SeedAccordion.SuffixIcon>
    </SeedAccordion.Trigger>
  ),
);
AccordionTrigger.displayName = "Accordion.Trigger";

// --- Content ---
export interface AccordionContentProps extends SeedAccordion.ContentProps {}
export const AccordionContent = SeedAccordion.Content;

// --- Optional slot re-exports ---
export const AccordionTitle = SeedAccordion.Title;
export const AccordionDescription = SeedAccordion.Description;
export const AccordionPrefixIcon = SeedAccordion.PrefixIcon;
export const AccordionPrefixAvatar = SeedAccordion.PrefixAvatar;
export const AccordionSuffixIcon = SeedAccordion.SuffixIcon; // for custom icon override

// --- Namespace ---
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
  Title: AccordionTitle,
  Description: AccordionDescription,
  PrefixIcon: AccordionPrefixIcon,
  PrefixAvatar: AccordionPrefixAvatar,
  SuffixIcon: AccordionSuffixIcon,
});
```

### Snippet Usage (consumer perspective)

```tsx
import { Accordion } from "seed-design/ui/accordion";

// Chevron is automatic — no need to add SuffixIcon manually
<Accordion type="single" defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>
      <Accordion.Title>FAQ Question</Accordion.Title>
    </Accordion.Trigger>
    <Accordion.Content>
      <p>Answer here</p>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>

// Custom icon override: use SeedAccordion.Trigger directly
// or pass children that include SuffixIcon manually
```

## Documentation Plan

### React Docs (`docs/content/react/components/accordion.mdx`)

Select-box 수준의 문서 품질을 목표로 합니다. 구조:

1. **Preview** — 기본 사용 예시 (ComponentExample)
2. **Installation** — `npx @seed-design/cli@latest add ui:accordion` + ManualInstallation
3. **Props** — react-type-table로 각 컴포넌트의 타입 문서화
   - `AccordionRoot` (type, value, defaultValue, onValueChange, collapsible, disabled, variant, size)
   - `AccordionItem` (value, disabled)
   - `AccordionTrigger`
   - `AccordionContent`
4. **Examples** — 각각 별도 TSX 파일 + ComponentExample 래퍼:

| Example | File | Description |
|---------|------|-------------|
| Preview | `preview.tsx` | 기본 multiple 모드, inline variant |
| Inline Variant | `inline.tsx` | inline variant 설명 및 예시 |
| Separated Variant | `separated.tsx` | separated variant, 카드 스타일 |
| Single Expand | `single.tsx` | `type="single"` 모드, 한 번에 하나만 열림 |
| Size Large | `size-large.tsx` | `size="large"` 예시 |
| With Prefix Icon | `with-prefix-icon.tsx` | PrefixIcon 사용 예시 |
| With Prefix Avatar | `with-prefix-avatar.tsx` | PrefixAvatar 사용 예시 |
| With Description | `with-description.tsx` | Title + Description 조합 |
| Disabled | `disabled.tsx` | 전체 disabled + 개별 item disabled |
| Controlled | `controlled.tsx` | value + onValueChange 제어 모드 |
| Default Expanded | `default-expanded.tsx` | defaultValue로 초기 열린 상태 설정 |
| Customizing Trigger | `customizing-trigger.tsx` | Badge, Count 등 Trigger 내부 커스텀 배치 |

### Design Docs (`docs/content/docs/components/(layout)/accordion.mdx`)

디자인 가이드라인 문서:

1. **Anatomy** — FigmaImage로 구조 다이어그램
2. **Variants** — inline vs separated 사용 가이드
   - inline: 연속된 흐름, FAQ 등
   - separated: 독립된 카드, 모달 내 사용
3. **Size** — medium vs large 사용 가이드
4. **Interaction** — 터치 영역, 스크롤 동작
5. **Accessibility** — 키보드 네비게이션, 스크린 리더
6. **Customization** — Trigger 내부 자유 배치, SuffixIcon 커스텀
7. **Collapsible과의 구분** — 단일 항목은 Collapsible, 2개 이상 관련 섹션은 Accordion

### Storybook Stories (`docs/stories/Accordion.stories.tsx`)

- VariantTable로 variant(inline/separated) x size(medium/large) 매트릭스 렌더링
- SeedThemeDecorator로 테마 적용
- conditionMap으로 open/closed 상태 표시
