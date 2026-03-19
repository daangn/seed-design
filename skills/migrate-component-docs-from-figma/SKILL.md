---
name: migrate-component-docs-from-figma
description: Write or rewrite SEED Design component guideline docs (MDX) by extracting content and images from Figma documentation layers. Use this skill whenever the user wants to create, update, or migrate component documentation from Figma into docs/content/docs/components/, provides a Figma node URL for documentation, or asks to write/update a component guideline page. Also triggers for "write the docs for X component", "create guideline from Figma", "update the MDX for [component]", "가이드라인 문서 작성", or "피그마에서 문서 가져오기".
---

# Migrate Docs from Figma

Extract content from Figma documentation layers and produce SEED Design component guideline MDX files.

## Inputs

Two inputs are required:

1. **Figma node URL(s)**: The URL(s) of the Figma layer(s) to document. Ask the user if not provided.
2. **File name**: The MDX file name (e.g., `radio`, `action-button`).

Infer the category by listing the subdirectories under `docs/content/docs/components/` and checking which existing components live where. If the component doesn't clearly fit an existing category, ask the user.

Target file: `docs/content/docs/components/{category}/{file-name}.mdx`

## Step 1: Extract content from Figma

Call `get_node_info` on each provided Figma node URL to retrieve text content.

- Always use `get_node_info` (singular) — it accepts `figmaUrl` directly. Do **not** use `get_nodes_info` (plural), which requires a separate `fileKey` + `nodeIds` and does not accept URLs.
- If multiple URLs are given, dispatch subagents in parallel — each calls `get_node_info` and returns the structured result.
- Identify structure in the extracted text: headings, body paragraphs, tables, Do/Don't pairs, etc.

## Step 2: Write the MDX

Convert the extracted content into MDX. **Leave all image IDs empty for now.**

Read `references/patterns.md` before writing — it contains the MDX component patterns and formatting rules to follow.

Key principles:

- **Never add content that is not present in the Figma source in this phase.** All body text — descriptions, guidelines, table entries — must come directly from the extracted Figma content. Do not paraphrase, interpret, or add supplementary explanations.
- **Bold** text from Figma becomes `**bold**` in markdown.
- Use markdown tables where the content fits a tabular format.
- Always hyperlink other components when mentioned: `[Bottom Sheet](/docs/components/bottom-sheet)`
- Follow the standard heading order: Anatomy → Properties → Guidelines → Comparison → V3 Changes → Specification (include only applicable sections).
- Write in Korean. Use official English names for component names and technical terms.
- Use polite tone ("~합니다", "~해 주세요").

## Step 3: Map image IDs

Use the `find_nodes` tool to search for child nodes matching the `Document / Image` pattern:

```
find_nodes(name: "Document / Image", nodeId: "{parent layer ID}")
```

Insert the collected IDs sequentially into the empty `id=""` / `figmaId=""` fields from Step 2.

**If the number of found IDs does not match the number of empty placeholders, ask the user before proceeding.** The mapping may be ambiguous.

## Step 4: Review the document

Run through this checklist:

### Structure

- [ ] `PlatformStatusTable` is present at the top
- [ ] `ComponentSpecBlock` is present at the bottom for every related rootage spec in `/packages/rootage/components/`
- [ ] Markdown syntax is correct (table alignment, list nesting, etc.)

### Terminology

- [ ] Component names use official English names (e.g., "Bottom Sheet" not "바텀시트")
- [ ] No spelling errors or awkward sentences
- [ ] No logical errors (e.g., Component A's description appearing in Component B's doc, duplicate content)

### Cross-references

- [ ] Other components are hyperlinked when mentioned
- [ ] Design tokens are properly referenced (hyperlink to foundation page, or `TokenReference` component)
- [ ] All internal links are valid — verify that `href` targets in `Card`, component links (`/docs/components/...`), and token links (`/docs/foundation/design-token/...`) point to pages that actually exist by checking the corresponding MDX files under `docs/content/`

### Platform references

- [ ] If platform-specific references (Figma, Web/React, iOS, Android) are found, **flag them to the user**

## Reference docs

Use these as examples of well-written docs:

- `docs/content/docs/components/(controls)/radio.mdx` — Do/Don't, Grid, Card patterns
- `docs/content/docs/components/(buttons)/action-button.mdx` — Properties, Guidelines, Comparison patterns
