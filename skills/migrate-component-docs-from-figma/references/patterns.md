# MDX Component Patterns

This reference covers every MDX component available in guideline docs, with usage examples drawn from real documents.

## Frontmatter

```markdown
---
title: { Component Name }
description: { Korean 1-2 sentence description of the component's purpose }
coverImageFigmaId: { Figma node ID for the cover image, if available }
---
```

## PlatformStatusTable

Shows implementation status across platforms. Always place at the very top of the document, right after frontmatter.

```tsx
<PlatformStatusTable componentId="{component-id}" />
```

## ComponentSpecBlock

Renders the technical specification from rootage. Always place at the bottom of the document under a "Specification" heading.

```tsx
## Specification

<ComponentSpecBlock id="{component-id}" />
```

When a component has multiple related rootage specs (e.g., Radio has radio-group, radio, radiomark), give each its own sub-section:

```tsx
## Specification

### Radio Group

<ComponentSpecBlock id="radio-group" headingComponent="h4" />

### Radio

<ComponentSpecBlock id="radio" headingComponent="h4" />
```

## FigmaImage

Embeds an image from Figma by node ID. Used for anatomy diagrams, property illustrations, guideline images, and comparison visuals.

```tsx
<FigmaImage id="{figma-node-id}" alt="{Descriptive Korean alt text}" />
```

**Image placement**: Place `FigmaImage` **after** the body text in each section, not directly under the heading. The standard order is: heading → body text → image. This lets the reader understand the context before seeing the visual.

```tsx
{/* Correct: text first, then image */}
### Type

기본 타입과 서비스나 카테고리 별 타입을 제공합니다.

<FigmaImage id="..." alt="..." />

{/* Wrong: image directly under heading */}
### Type

<FigmaImage id="..." alt="..." />

기본 타입과 서비스나 카테고리 별 타입을 제공합니다.
```

Always write descriptive alt text that explains what the image shows.

## DoImage / DontImage

Show correct and incorrect usage examples.

- **`figmaId`**: Figma node ID (not `id` — different prop name from `FigmaImage`).
- **`body`**: Short guidance text rendered below the image as a caption. This text typically comes from the Figma layer itself — look for text content near or inside the Do/Don't frame when extracting from Figma. It tells the reader what to do or avoid.
- **`alt`**: Describes what the image visually shows (for accessibility). Unlike `body`, this is not guidance — it's a literal description of the image content.

```tsx
<DoImage
  figmaId="{figma-node-id}"
  body="Neutral Weak 버튼을 나란히 사용할 수 있습니다."
  alt="Neutral Weak Action Button을 나란히 배치한 예시"
/>

<DontImage
  figmaId="{figma-node-id}"
  body="무분별하게 Brand 컬러를 사용하지 않습니다."
  alt="Action Button Brand 컬러 과다 사용 예시"
/>
```

Sometimes a `DontImage` appears without a corresponding `DoImage` — a standalone warning is fine:

```tsx
<DontImage
  figmaId="{figma-node-id}"
  body="버튼을 4개 이상 나란히 사용하지 않습니다."
  alt="Action Button을 4개 나란히 배치한 예시"
/>
```

Always provide meaningful `alt` text — never leave it empty. Infer `alt` from the `body` text: `body` states the guidance ("do this" / "don't do this"), while `alt` should describe the visual that illustrates it. For example, if `body` is "버튼을 4개 이상 나란히 사용하지 않습니다.", a good `alt` would be "Action Button을 4개 나란히 배치한 예시".

## Grid

Container for side-by-side images. Most commonly used to pair Do/Don't images, but also works for any two images that should be compared.

```tsx
{
  /* Do/Don't pair */
}
<Grid>
  <DoImage figmaId="" body="..." alt="..." />
  <DontImage figmaId="" body="..." alt="..." />
</Grid>;

{
  /* Two regular images side by side */
}
<Grid>
  <FigmaImage id="" alt="..." />
  <FigmaImage id="" alt="..." />
</Grid>;

{
  /* A regular image next to a Don't */
}
<Grid>
  <FigmaImage id="" alt="..." />
  <DontImage figmaId="" body="..." alt="..." />
</Grid>;
```

## Card

Links to a related component with a brief explanation. Place near the top of the document, below PlatformStatusTable.

```tsx
<Card href="/docs/components/{related-component}" title="{Related Component Name}">
  {Korean explanation of how the two components relate}
</Card>
```

Example from radio.mdx:

```tsx
<Card href="/docs/components/field" title="Field">
  Radio Group을 Field 내부에서 사용하여 Radio Group Field로 활용할 수 있습니다.
</Card>
```

## Design token references

There are two ways to reference design tokens:

### Inline link (preferred for mentioning specific tokens in body text)

Link individual tokens to their foundation page. The URL pattern is `/docs/foundation/design-token/%24{token-name}` (`%24` is URL-encoded `$`):

```markdown
[`$color.stroke.neutral-muted`](/docs/foundation/design-token/%24color.stroke.neutral-muted)
[`$radius.r2`](/docs/foundation/design-token/%24radius.r2)
[`$color.bg.layer-floating`](/docs/foundation/design-token/%24color.bg.layer-floating)
```

### TokenReference component (for rendering a token table)

Used when you want to display a group of tokens as a table, typically in foundation pages:

```tsx
{
  /* By group */
}
<TokenReference groups={["color", "fg"]} />;

{
  /* By regex pattern */
}
<TokenReference regex={/^\$color\..*-pressed$/} />;
```

## Cross-linking

When mentioning another component in body text, always link to it:

```markdown
[Bottom Sheet](/docs/components/bottom-sheet)
[Checkbox](/docs/components/checkbox)
[Alert Dialog](/docs/components/alert-dialog)
```

The link path is always `/docs/components/{component-id}` — no category subfolder in the URL.

## Standard heading order

Not every document needs all sections. Include only those that are relevant:

1. **Anatomy** — component structure diagram and part descriptions
2. **Properties** — sub-sections per property (Size, Variant, Layout, State, Width, Tone, Weight, etc.)
3. **Guidelines** — practical usage guidance with Do/Don't images
4. **{Component A} vs. {Component B}** — comparison with similar components (table format)
5. **{Component} V3 Changes** — migration notes from V2
6. **Specification** — ComponentSpecBlock(s)

## Writing style

- Professional and clear tone in Korean
- User-centric explanations (focus on usage context, not technical internals)
- Polite form ("~합니다", "~해주세요")
- Keep component names and technical terms in English
- Frontmatter description: 1-2 concise Korean sentences about the component's role
