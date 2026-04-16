# Kontext Dashboard Redesign

## Context

The Kontext dashboard (`kontext serve`) currently has two views — a cytoscape.js graph (697 nodes, 873 edges, poor readability) and a completeness matrix table. The graph visualization is too dense to be useful, and the matrix only shows component-level coverage.

The team needs a dashboard that clearly shows **which files affect which other files** based on kontext.yaml declarations, with both forward (source → targets) and reverse (target → sources) navigation. Additionally, the team wants the ability to **create and edit kontext.yaml files visually** instead of writing YAML by hand.

The visual redesign adopts a modern dark UI with dithering texture accents and pixel font headings, inspired by Vercel's Geist Pixel aesthetic — not retro game art, but contemporary design with textural depth.

## Scope

**In scope:**
- Replace existing Graph and Matrix views with a single Explorer view
- Add an Editor view for visual kontext.yaml creation/editing
- Full Tailwind CSS + shadcn/ui migration (remove all inline styles)
- Dithering background textures + Geist Pixel font accents
- Extend serve.ts API for file browsing and config read/write

**Out of scope:**
- Real-time file watching / hot reload of graph
- Drag-and-drop between Explorer view nodes
- Multi-user / collaboration features
- Mobile responsive layout (desktop-only tool)

## Architecture

### Pages

Two pages accessible via tab navigation in the header:

1. **Explorer** — Read-only visualization of kontext.yaml dependency relationships
2. **Editor** — Visual editor for creating and modifying kontext.yaml files

### API Endpoints (serve.ts)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/graph` | Existing — full dependency graph |
| GET | `/api/files?dir=<path>` | List directory contents (name, type, path) |
| GET | `/api/config/<packageDir>` | Read kontext.yaml for a package |
| POST | `/api/config/<packageDir>` | Write kontext.yaml for a package |
| POST | `/api/rebuild` | Rebuild graph from current kontext.yaml files |

Security: All file paths validated against repo root (existing `startsWith` guard pattern). `/api/files` only serves directories under the repo root. `/api/config` only reads/writes `kontext.yaml` files.

### Data Flow

```
kontext.yaml files → buildGraph() → /api/graph → Explorer view
                                                      ↕
Editor view → /api/config POST → kontext.yaml → /api/rebuild → updated graph
```

## Explorer View

### Layout: Sidebar + Detail Panel

**Left sidebar (240px fixed):**
- Package list showing only packages with kontext.yaml
- Each item: package name + relation count badge
- Selected package highlighted
- Packages without kontext.yaml shown dimmed at bottom (optional section)

**Right detail panel (remaining width):**
- Package header: name, kontext.yaml file path, total relation/edge count
- Relations grouped by `when` pattern, each in a collapsible card:
  - Card header: glob pattern in monospace font
  - Card body: list of affected files with:
    - Full relative path
    - Existence indicator: checkmark (exists), X (missing), warning (optional)
    - Generated badge with command tooltip
    - Reason text in muted color
  - Override sections shown inline with distinct styling
- Empty state when no package selected

### Search (Command+K)

Global search dialog (shadcn Command component):
- Input: file path substring
- Results split into two groups:
  - **"Affects" (forward)**: files this source affects (uses `findDeps` from core)
  - **"Affected by" (reverse)**: sources that affect this file (uses `findAffectedBy` from core)
- Clicking a result navigates to the relevant package and highlights the relation

### shadcn Components Used

- `Tabs` — page navigation (Explorer / Editor)
- `ScrollArea` — sidebar and detail panel scrolling
- `Collapsible` — when-group cards
- `Badge` — relation counts, status indicators
- `Command` — global search dialog (cmdk)
- `Tooltip` — reason text, command details
- `Button` — actions
- `Separator` — visual dividers

## Editor View

### Layout: 3-Panel

**Left panel — File Tree (240px):**
- Directory tree loaded via `/api/files` endpoint
- Lazy-loaded: expand directories on click
- Draggable items (files and folders) for dropping into affects zones
- Visual indicator on packages that have kontext.yaml

**Center panel — Relation Editor (flexible):**
- Package selector at top (dropdown of all packages)
- If kontext.yaml exists: loads current relations
- If not: starts with empty state + "Create kontext.yaml" prompt
- Each relation as an editable card:
  - `when` field: text input for glob pattern
  - `affects` area: drop zone for files from tree + manual path input
  - Per-affect options: reason (text), optional (toggle), generated (toggle + command input)
  - Delete relation button
- "Add Relation" button at bottom
- Package-level `ignore` patterns editor (collapsible section)

**Right panel — YAML Preview (320px):**
- Live-rendered YAML from current editor state
- Syntax highlighted with Geist Mono font
- Schema validation indicators (green = valid, red = errors)
- "Save" button: POST to `/api/config/:packageDir`
- After save: automatically calls `/api/rebuild` and shows success toast

### Drag & Drop

- Files/folders dragged from left tree into center "affects" drop zones
- On drop: auto-generates the relative path from package root
- Supports dropping folders (creates glob pattern like `dropped-folder/**`)
- Visual feedback: drop zone highlights on dragover

## Visual Design

### Design Philosophy

Modern, clean dark UI with dithering texture accents and pixel typography as decorative elements. NOT retro game art — think Vercel's design language with textural depth.

### Typography

| Role | Font | Usage |
|------|------|-------|
| Logo / Page titles | GeistPixelSquare | Header "KONTEXT", page titles |
| Code / File paths | Geist Mono | YAML preview, glob patterns, file paths |
| Body text | Geist Sans | Labels, descriptions, UI text |

Font installation via `geist` npm package.

### Color Palette (Dark Theme)

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0a` | Page background |
| Surface | `#111111` | Cards, panels |
| Border | `#222222` | Card borders, dividers |
| Text primary | `#e0e0e0` | Main text |
| Text secondary | `#888888` | Labels, descriptions |
| Text muted | `#555555` | Dimmed content |
| Accent blue | `#4a9eff` | Links, highlights |
| Success green | `#22c55e` | File exists indicator |
| Warning amber | `#f59e0b` | Optional indicator |
| Error red | `#ef4444` | Missing file indicator |

### Package Colors (carried from existing)

| Package | Color |
|---------|-------|
| packages/rootage | `#4a9eff` |
| packages/qvism-preset | `#22c55e` |
| packages/css | `#a78bfa` |
| packages/react | `#f472b6` |
| packages/react-headless | `#fb923c` |
| packages/cli | `#facc15` |
| docs | `#38bdf8` |
| ecosystem | `#6b7280` |

### Dithering Effects

- **Page background**: Subtle Bayer matrix dithering pattern as CSS repeating background (SVG tile or CSS gradient). Low contrast against base color.
- **Card hover**: Slight dithering intensity shift on hover transition
- **Section dividers**: Dithering gradient fade between sections
- **Implementation**: React Bits dither background component or Aceternity dither shader, evaluated during implementation for best fit

### Status Indicators

Pixel-styled but small and inline:
- Exists: `checkmark` icon in green
- Missing: `x` icon in red
- Optional: `minus` icon in amber
- Generated: `zap` icon in blue

## Tech Stack Changes

### Added Dependencies

- `tailwindcss` (latest via bun add)
- `@tailwindcss/vite` (Vite plugin)
- shadcn/ui components (installed via CLI)
- `geist` (font package)
- `react-bits` or `aceternity` dither component (evaluate during implementation)

### Removed Dependencies

- `cytoscape` — no longer needed (Graph view removed)

### File Changes

**Removed:**
- `src/views/GraphExplorer.tsx`
- `src/views/CompletenessMatrix.tsx`

**Added:**
- `src/views/Explorer.tsx` — main explorer view
- `src/views/Editor.tsx` — YAML editor view
- `src/components/PackageSidebar.tsx` — package list sidebar
- `src/components/RelationCard.tsx` — when→affects group card
- `src/components/FileTree.tsx` — draggable file tree
- `src/components/RelationEditor.tsx` — individual relation form
- `src/components/YamlPreview.tsx` — live YAML preview
- `src/components/SearchDialog.tsx` — Command+K search
- `src/components/DitherBackground.tsx` — background texture
- `src/hooks/useGraph.ts` — updated with rebuild capability
- `src/hooks/useFileTree.ts` — file tree data fetching
- `src/hooks/useConfig.ts` — kontext.yaml CRUD
- `src/lib/utils.ts` — shadcn utility (cn function)
- `components.json` — shadcn configuration
- `tailwind.config.ts` (or CSS-based Tailwind v4 config)
- `src/index.css` — global styles + Tailwind imports

**Modified:**
- `src/App.tsx` — new layout with Tabs, header redesign
- `src/types.ts` — add FileEntry, ConfigState types
- `../cli/src/commands/serve.ts` — new API endpoints

## Verification

### Manual Testing

1. `bun ecosystem/kontext/cli/bin/kontext.mjs build` — graph builds
2. `bun ecosystem/kontext/cli/bin/kontext.mjs serve` — dashboard opens
3. Explorer view:
   - Packages listed in sidebar with correct relation counts
   - Click package → relations display with correct when/affects mapping
   - File existence indicators match actual filesystem
   - Cmd+K search finds files in both directions
4. Editor view:
   - File tree loads repo structure
   - Existing kontext.yaml loads into editor
   - Drag file from tree → adds to affects list
   - YAML preview updates in real-time
   - Save → writes valid kontext.yaml to disk
   - After save → Explorer view reflects changes
5. Visual:
   - Dithering background visible
   - Geist Pixel font on headers
   - Geist Mono on code/paths
   - Dark theme consistent across views

### Automated

- Existing core tests pass: `cd ecosystem/kontext/core && bun test`
- Dashboard builds without errors: `cd ecosystem/kontext/dashboard && bun run build`
