# Next.js 16 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the docs site from Next.js 15.5.9 to Next.js 16.2.x, and fumadocs-ui from 15.8.5 to 16.x.

**Architecture:** Next.js 16 makes Turbopack the default bundler. However, Turbopack does **not yet support custom package export conditions** (`resolveConditions` is not a valid config option), and this project relies on the `seed-layered` condition for `@seed-design/css` recipe imports. Therefore we use `--webpack` flags for both dev and build, while still upgrading to Next.js 16 for fumadocs v16 compatibility, React 19.2 features, and staying on supported versions. The docs site uses `output: "export"` (SSG) and has 6 template-literal dynamic import patterns that need migration regardless of bundler choice (they were already fragile in webpack). Fumadocs v16 requires Next.js 16+ and changes provider imports.

**Tech Stack:** Next.js 16.2.x, fumadocs-ui 16.x, fumadocs-core 16.x, fumadocs-mdx 14.x, React 19.2, Webpack (with `--webpack` flag)

---

## Context & Prior Attempts

### Timeline
1. **PR #1150** (Jan 19, 2026): Merged — bumped Next.js to 16.1.2, fumadocs-ui to 16.x, added `--turbo` flags, converted layouts to async, split source files into lazy-loaded modules.
2. **PR #1168** (Jan 21, 2026): Merged — reverted #1150 due to page hangs during static build.
3. **PR #1172** (Jan 21, 2026): Still open (draft) — re-revert of #1168, sitting on `docs/bump-next` branch. Deploy was successful on Cloudflare Pages but likely still has the hang issue.

### Root Causes Identified
1. **Custom `webpack` config**: `config.resolve.conditionNames = ["seed-layered", "..."]` — Turbopack fails builds when `webpack` config exists (Next.js 16 breaking change). Turbopack does NOT support custom export conditions.
2. **Template-literal dynamic imports**: 6 usages of `import(\`../${variable}\`)` pattern — fragile in both webpack and Turbopack, and a likely cause of the page hangs.
3. **Page hangs during static export**: Some pages hung during `next build` with `output: "export"`. Likely caused by dynamic imports that couldn't resolve at build time, creating infinite suspense boundaries.

### Turbopack Limitation: `seed-layered` Condition
The `@seed-design/css` package uses a custom export condition `seed-layered` to resolve recipe imports to `@layer`-wrapped CSS variants:
```json
"./recipes/*": {
  "seed-layered": { "import": "./recipes/*.layered.mjs" },
  "default": { "import": "./recipes/*.mjs" }
}
```
Turbopack's `resolveAlias` only supports the `browser` condition, not custom conditions. There is an [open feature request](https://github.com/vercel/next.js/discussions/77721) for this. Until it's resolved, we must use `--webpack` for both dev and build.

### Dynamic Import Inventory (6 patterns)

| File | Pattern | Type |
|------|---------|------|
| `docs/components/component-preview.tsx:13` | `import(\`../examples/${name}.tsx\`)` | Client-side, React.lazy |
| `docs/components/stackflow-preview.tsx:17` | `import(\`../examples/${name}.tsx\`)` | Client-side, React.lazy (maps over `names[]`) |
| `docs/app/blocks/[name]/block-renderer.tsx:9` | `import(\`../../../registry/block/${name}\`)` | Client-side, React.lazy |
| `docs/components/rootage.ts:40` | `import(\`@/public/rootage${resource.path}\`)` | Server-side, build-time |
| `docs/components/manual-installation.tsx:21` | `import(\`@/public/__registry__/ui/${name}.json\`)` | Server component |
| `docs/components/breeze-manual-installation.tsx:23` | `import(\`@/public/__registry__/breeze/${name}.json\`)` | Server component |

---

## File Structure

### Files to Modify
- `docs/package.json` — version bumps, script changes
- `docs/next.config.mjs` — keep `webpack` config, add `--webpack` to dev/build scripts
- `docs/components/component-preview.tsx` — replace dynamic import with registry map
- `docs/components/stackflow-preview.tsx` — replace dynamic import with registry map (note: takes `names: string[]` not `name: string`)
- `docs/app/blocks/[name]/block-renderer.tsx` — replace dynamic import with registry map
- `docs/components/rootage.ts` — replace dynamic import with `fs.readFileSync`
- `docs/components/manual-installation.tsx` — replace dynamic import with `fs.readFileSync`
- `docs/components/breeze-manual-installation.tsx` — replace dynamic import with `fs.readFileSync`
- `docs/app/source.tsx` — verify fumadocs-core API compatibility, update if needed
- `docs/app/layout.config.tsx` — verify fumadocs imports
- `docs/app/docs/layout.tsx` — update `fumadocs-ui/provider` → `fumadocs-ui/provider/next`
- `docs/app/react/layout.tsx` — update provider import
- `docs/app/breeze/layout.tsx` — update provider import
- `docs/app/lynx/layout.tsx` — update provider import
- `docs/app/ai-integration/layout.tsx` — update provider import
- `docs/app/not-found.tsx` — update provider import (also uses `fumadocs-ui/provider`)

### Files to Create
- `docs/components/example-registry.ts` — static registry mapping names → lazy imports for examples
- `docs/components/block-registry.ts` — static registry mapping names → lazy imports for blocks
- `docs/scripts/generate-example-registry.ts` — script to auto-generate example-registry.ts
- `docs/scripts/generate-block-registry.ts` — script to auto-generate block-registry.ts

---

## Tasks

### Task 1: Create Feature Branch

**Files:**
- None (git operations only)

- [ ] **Step 1: Create branch from dev**

```bash
git checkout dev
git pull origin dev
git checkout -b feat/next-16-upgrade
```

- [ ] **Step 2: Verify clean state**

```bash
git status
```
Expected: clean working tree on `feat/next-16-upgrade`

---

### Task 2: Bump Package Versions

**Files:**
- Modify: `docs/package.json`
- Modify: `bun.lock` (at repo root, not docs/)

- [ ] **Step 1: Bump Next.js and fumadocs packages**

```bash
cd docs
bun add next@latest fumadocs-ui@latest fumadocs-core@latest fumadocs-mdx@latest
```

This should install Next.js ~16.2.x, fumadocs-ui ~16.x, fumadocs-core ~16.x, fumadocs-mdx ~14.x.

- [ ] **Step 2: Verify versions in package.json**

```bash
grep -E '"next"|"fumadocs' docs/package.json
```

Expected: next 16.2.x, fumadocs-ui 16.x, fumadocs-core 16.x

- [ ] **Step 3: Check `.source/` regeneration**

The `fumadocs-mdx` postinstall hook regenerates `.source/` files. After `bun add`, check if `.source/` files have changed:

```bash
git diff --stat docs/.source/
```

If changed, these should be committed together with the version bump.

- [ ] **Step 4: Update scripts in package.json**

Since Turbopack is the default in Next.js 16 but we need webpack (for `seed-layered` condition), explicitly opt into webpack:

```json
{
  "dev": "concurrently \"bun --filter @seed-design/stackflow-spa dev\" \"next dev --webpack\"",
  "build": "next build --webpack",
  "start": "concurrently \"bun --filter @seed-design/stackflow-spa dev\" \"next start\""
}
```

- [ ] **Step 5: Commit**

```bash
git add docs/package.json bun.lock docs/.source/
git commit -m "chore(docs): bump next to 16.x, fumadocs to 16.x"
```

---

### Task 3: Update next.config.mjs

**Files:**
- Modify: `docs/next.config.mjs`

The current `webpack` config sets `conditionNames = ["seed-layered", "..."]`. Since we're using `--webpack` flags, this config remains valid and will be used. No turbopack config section needed (it would be ignored with `--webpack` anyway).

- [ ] **Step 1: Verify next.config.mjs still works unchanged**

The existing config should be compatible with Next.js 16 when using `--webpack`. Verify by checking for any removed/renamed config options.

Check for deprecated config options that Next.js 16 removes:
- `eslint` config → removed in Next.js 16 (not present in current config, OK)
- `amp` config → removed (not present, OK)
- `experimental.turbopack` → promoted to top-level (not used, OK)

- [ ] **Step 2: Start dev server to verify**

```bash
cd docs && bun dev
```

Expected: Dev server starts with webpack (since we added `--webpack` to dev script), using `seed-layered` condition.

- [ ] **Step 3: Commit if any changes needed**

```bash
git add docs/next.config.mjs
git commit -m "chore(docs): update next.config.mjs for Next.js 16 compat"
```

---

### Task 4: Create Registry Generation Scripts

**Files:**
- Create: `docs/scripts/generate-example-registry.ts`
- Create: `docs/scripts/generate-block-registry.ts`
- Modify: `docs/package.json` (add script entries)

Before migrating the dynamic imports, create scripts to auto-generate the static registries. This ensures they stay in sync when examples/blocks are added.

- [ ] **Step 1: Create example registry generation script**

```typescript
// docs/scripts/generate-example-registry.ts
import fs from "node:fs";
import path from "node:path";

const examplesDir = path.join(import.meta.dir, "../examples");
const outputPath = path.join(import.meta.dir, "../components/example-registry.ts");

const examples = fs
  .readdirSync(examplesDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(".tsx", ""))
  .sort();

const lines = examples.map((name) => `  "${name}": () => import("../examples/${name}.tsx"),`);

const content = `// Auto-generated by scripts/generate-example-registry.ts
// Do not edit manually. Run: bun generate:example-registry
import type { ComponentType } from "react";

type LazyFactory = () => Promise<{ default: ComponentType }>;

const registry: Record<string, LazyFactory> = {
${lines.join("\n")}
};

export function getExampleComponent(name: string): LazyFactory | undefined {
  return registry[name];
}
`;

fs.writeFileSync(outputPath, content);
console.log(`Generated example registry with ${examples.length} entries`);
```

- [ ] **Step 2: Create block registry generation script**

```typescript
// docs/scripts/generate-block-registry.ts
import fs from "node:fs";
import path from "node:path";

const blocksDir = path.join(import.meta.dir, "../registry/block");
const outputPath = path.join(import.meta.dir, "../components/block-registry.ts");

const blocks = fs
  .readdirSync(blocksDir)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => f.replace(".tsx", ""))
  .sort();

const lines = blocks.map((name) => `  "${name}": () => import("../registry/block/${name}"),`);

const content = `// Auto-generated by scripts/generate-block-registry.ts
// Do not edit manually. Run: bun generate:block-registry
import type { ComponentType } from "react";

type LazyFactory = () => Promise<{ default: ComponentType }>;

const registry: Record<string, LazyFactory> = {
${lines.join("\n")}
};

export function getBlockComponent(name: string): LazyFactory | undefined {
  return registry[name];
}
`;

fs.writeFileSync(outputPath, content);
console.log(`Generated block registry with ${blocks.length} entries`);
```

- [ ] **Step 3: Add scripts to package.json**

```json
{
  "generate:example-registry": "bun scripts/generate-example-registry.ts",
  "generate:block-registry": "bun scripts/generate-block-registry.ts"
}
```

- [ ] **Step 4: Run both scripts**

```bash
cd docs && bun generate:example-registry && bun generate:block-registry
```

- [ ] **Step 5: Verify generated files**

```bash
head -20 docs/components/example-registry.ts
head -20 docs/components/block-registry.ts
```

Expected: Each file has static import entries with string literal paths.

- [ ] **Step 6: Commit**

```bash
git add docs/scripts/generate-example-registry.ts docs/scripts/generate-block-registry.ts docs/components/example-registry.ts docs/components/block-registry.ts docs/package.json
git commit -m "chore(docs): add registry generation scripts for static imports"
```

---

### Task 5: Migrate Client-Side Dynamic Imports (component-preview, stackflow-preview)

**Files:**
- Modify: `docs/components/component-preview.tsx`
- Modify: `docs/components/stackflow-preview.tsx`

- [ ] **Step 1: Update component-preview.tsx**

```typescript
"use client";

import * as React from "react";
import { getExampleComponent } from "./example-registry";

interface ComponentPreviewProps {
  name: string;
}

export function ComponentPreview(props: ComponentPreviewProps) {
  const { name } = props;

  const Preview = React.useMemo(() => {
    const factory = getExampleComponent(name);
    if (!factory) {
      return () => <div>컴포넌트가 존재하지 않습니다.</div>;
    }
    return React.lazy(factory);
  }, [name]);

  return (
    <React.Suspense fallback={null}>
      <div
        className="not-prose example-reset w-full flex flex-col justify-center items-center"
        style={{
          backgroundColor: "var(--seed-color-bg-layer-default)",
        }}
      >
        <Preview />
      </div>
    </React.Suspense>
  );
}
```

- [ ] **Step 2: Update stackflow-preview.tsx**

Note: This component takes `names: string[]` (plural) and maps over them, unlike component-preview which takes a single `name`:

```typescript
"use client";

import * as React from "react";

import type { RegisteredActivityName } from "@stackflow/config";
import { Stackflow } from "./stackflow/Stackflow";
import { getExampleComponent } from "./example-registry";

interface StackflowPreviewProps {
  names: string[];
}

export function StackflowPreview(props: StackflowPreviewProps) {
  const { names } = props;

  const activities = React.useMemo(() => {
    return names.map((name) => {
      const factory = getExampleComponent(name);
      if (!factory) {
        throw new Error(`Component not found: ${name}`);
      }
      const Component = React.lazy(factory);

      return {
        name: name as RegisteredActivityName,
        component: Component,
      };
    });
  }, [names]);

  return (
    <React.Suspense>
      <Stackflow activities={activities} />
    </React.Suspense>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add docs/components/component-preview.tsx docs/components/stackflow-preview.tsx
git commit -m "fix(docs): replace dynamic example imports with static registry"
```

---

### Task 6: Migrate Client-Side Dynamic Import (block-renderer)

**Files:**
- Modify: `docs/app/blocks/[name]/block-renderer.tsx`

- [ ] **Step 1: Update block-renderer.tsx**

```typescript
"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { getBlockComponent } from "@/components/block-registry";

export function BlockRenderer({ name }: { name: string }) {
  const Block = React.useMemo(() => {
    const factory = getBlockComponent(name);
    if (!factory) {
      return () => {
        notFound();
        return null;
      };
    }
    return React.lazy(() =>
      factory().catch(() => ({
        default: () => {
          notFound();
          return null;
        },
      })),
    );
  }, [name]);

  return (
    <React.Suspense fallback={null}>
      <Block />
    </React.Suspense>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add docs/app/blocks/[name]/block-renderer.tsx
git commit -m "fix(docs): replace dynamic block imports with static registry"
```

---

### Task 7: Migrate Server-Side Dynamic Imports (rootage.ts)

**Files:**
- Modify: `docs/components/rootage.ts`

The current code does `import(\`@/public/rootage${resource.path}\`)` to load rootage JSON files. Since this runs server-side during static generation, replace with `fs.readFileSync` which is reliable in all bundlers.

- [ ] **Step 1: Update getRootage() in rootage.ts**

Replace lines 32-47 with:

```typescript
import fs from "node:fs";
import path from "node:path";

export const getRootage = async () => {
  const publicDir = path.join(process.cwd(), "public");
  const indexRaw = fs.readFileSync(path.join(publicDir, "rootage/index.json"), "utf-8");
  const index: { resources: { path: string }[] } = JSON.parse(indexRaw);

  const sourceFiles = index.resources.map((resource) => {
    const raw = fs.readFileSync(path.join(publicDir, `rootage${resource.path}`), "utf-8");
    const res = JSON.parse(raw) as Exchange.Model;
    return {
      fileName: resource.path,
      ast: Exchange.fromObject(res),
    };
  });

  return buildContext(sourceFiles);
};
```

Keep the existing import for `AST, buildContext, css, Exchange` from `@seed-design/rootage-core`.

- [ ] **Step 2: Commit**

```bash
git add docs/components/rootage.ts
git commit -m "fix(docs): use fs.readFileSync for rootage instead of dynamic import"
```

---

### Task 8: Migrate Server-Side Dynamic Imports (manual-installation, breeze-manual-installation)

**Files:**
- Modify: `docs/components/manual-installation.tsx`
- Modify: `docs/components/breeze-manual-installation.tsx`

These are server components that do `import(\`@/public/__registry__/${type}/${name}.json\`)`. Replace with `fs.readFileSync`.

- [ ] **Step 1: Update manual-installation.tsx**

Add imports at top:
```typescript
import fs from "node:fs";
import path from "node:path";
```

Replace the dynamic import (~line 21):
```typescript
// Before
const json = (await import(`@/public/__registry__/ui/${name}.json`).then((module) => {
  return module.default;
})) as GeneratedRegistryItem;

// After
const registryPath = path.join(process.cwd(), "public", "__registry__", "ui", `${name}.json`);
const json = JSON.parse(fs.readFileSync(registryPath, "utf-8")) as GeneratedRegistryItem;
```

- [ ] **Step 2: Update breeze-manual-installation.tsx**

Same pattern but for `breeze` registry path:
```typescript
const registryPath = path.join(process.cwd(), "public", "__registry__", "breeze", `${name}.json`);
```

- [ ] **Step 3: Commit**

```bash
git add docs/components/manual-installation.tsx docs/components/breeze-manual-installation.tsx
git commit -m "fix(docs): use fs.readFileSync for registry JSON instead of dynamic import"
```

---

### Task 9: Update Fumadocs v16 API Changes

**Files:**
- Modify: `docs/app/docs/layout.tsx`
- Modify: `docs/app/react/layout.tsx`
- Modify: `docs/app/breeze/layout.tsx`
- Modify: `docs/app/lynx/layout.tsx`
- Modify: `docs/app/ai-integration/layout.tsx`
- Modify: `docs/app/not-found.tsx`
- Modify: `docs/app/source.tsx` (if needed)

Fumadocs v16 changes:
- `fumadocs-ui/provider` → `fumadocs-ui/provider/next` (provider entry removed)
- `loader()` no longer accepts `transformers` or `pageTree.attach*` (check source.tsx)
- `page.file` deprecated → use `page.path`
- `fumadocs-core/server` exports redistributed
- `<DocsCategory />` removed

- [ ] **Step 1: Update provider imports in all 6 files**

```bash
grep -rn "fumadocs-ui/provider" docs/app/ --include="*.tsx" | grep -v "provider/next"
```

For each file found, update:
```typescript
// Before
import { RootProvider } from "fumadocs-ui/provider";

// After
import { RootProvider } from "fumadocs-ui/provider/next";
```

Files to update:
- `docs/app/docs/layout.tsx`
- `docs/app/react/layout.tsx`
- `docs/app/breeze/layout.tsx`
- `docs/app/lynx/layout.tsx`
- `docs/app/ai-integration/layout.tsx`
- `docs/app/not-found.tsx`

- [ ] **Step 2: Check for removed fumadocs-core imports**

```bash
grep -rn "fumadocs-core/server" docs/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v ".source/"
```

If any imports from `fumadocs-core/server` are found, migrate to the new paths:
- `getGithubLastEdit` → `fumadocs-core/content/github`
- `getTableOfContents` → `fumadocs-core/content/toc`
- PageTree utilities → `fumadocs-core/page-tree`

- [ ] **Step 3: Check for deprecated `page.file` usage**

```bash
grep -rn "\.file" docs/app/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v ".source/" | grep -v "fileName"
```

Replace `page.file` with `page.path` if found.

- [ ] **Step 4: Verify source.tsx compatibility**

Check that the `loader()` call in `docs/app/source.tsx` doesn't use `transformers` or `pageTree.attach*` options. The current code uses `loader({ baseUrl, source, icon })` which should be fine.

- [ ] **Step 5: Start dev server and check for import errors**

```bash
cd docs && bun dev
```

Watch for errors like `Module not found: Can't resolve 'fumadocs-ui/provider'` or similar.

- [ ] **Step 6: Commit**

```bash
git add docs/app/
git commit -m "chore(docs): update fumadocs v16 API imports"
```

---

### Task 10: Verify Async Params (Next.js 16)

**Files:**
- Potentially modify page files in `docs/app/`

Next.js 16 removes synchronous access to `params` and `searchParams`. They must be awaited. The codebase likely already uses async params (from Next.js 15 migration), but verify.

- [ ] **Step 1: Check for synchronous params usage**

```bash
grep -rn "{ params }" docs/app/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v ".source/" | grep -v "generateStaticParams"
```

Look for destructuring without `await`. If all params are already typed as `Promise<...>` and awaited, this task can be skipped.

- [ ] **Step 2: Fix any remaining synchronous params**

```typescript
// Before (Next.js 15 compat)
export default function Page({ params }: { params: { slug: string[] } }) {

// After (Next.js 16 required)
export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params;
```

- [ ] **Step 3: Commit if changes were needed**

```bash
git add docs/app/
git commit -m "fix(docs): ensure all params are async (Next.js 16)"
```

---

### Task 11: Test Dev Server

**Files:** None (testing only)

- [ ] **Step 1: Start dev server**

```bash
cd docs && bun dev
```

Expected: Server starts with webpack (due to `--webpack` flag), no errors.

- [ ] **Step 2: Navigate to key pages and verify rendering**

Test these pages (they exercise different patterns):
1. `/docs` — basic docs page, sidebar navigation
2. `/react/components/action-button` — component preview (example-registry)
3. `/docs/foundation/design-token/color` — rootage data (fs.readFileSync)
4. Any page with ManualInstallation — registry JSON (fs.readFileSync)
5. `/blocks/` — block renderer (block-registry)
6. Search — verify search index works across all sections

- [ ] **Step 3: Check for console errors**

Open browser DevTools and check for JavaScript errors on each page type.

---

### Task 12: Test Production Build

**Files:** None (testing only)

- [ ] **Step 1: Run production build**

```bash
cd docs && bun run build
```

Since we set `"build": "next build --webpack"`, this uses webpack with `seed-layered` condition.

Expected: Build completes without hangs, all pages generate successfully.

- [ ] **Step 2: Watch for hanging pages**

Watch the build output. If any page takes > 30 seconds, it's likely hanging.

If hangs occur, investigate:
- Top-level `await` in `layout.config.tsx` (lines 121-146) — move `await getTransformed*PageTree()` calls into the layout components
- Circular imports in the source/layout chain
- `React.lazy` accidentally used outside `"use client"` files

- [ ] **Step 3: Test static output**

```bash
cd docs && bunx serve out
```

Navigate to pages and verify they render correctly.

- [ ] **Step 4: Commit any fixes**

If fixes were needed during testing, commit them with descriptive messages.

---

## Risk Mitigation

### Known Risk: Page Hangs During Static Build
The previous attempt (PR #1150) had pages hanging during `next build`. Potential causes:
1. **Top-level `await` in `layout.config.tsx`**: Lines 121-146 have `await docsSource.getTransformedPageTree()` at module scope. If hangs occur, move these calls into each layout component (the pattern PR #1150 used with async layouts).
2. **Circular dependency**: `source.tsx` → `rootage.ts` → dynamic imports could create cycles. The `fs.readFileSync` migration (Task 7) should fix this.
3. **Suspense boundary issues**: Client components using `React.lazy` must be in `"use client"` files. All preview/block-renderer files already have this directive.

### Turbopack Migration (Future Work)
Once Turbopack supports custom export conditions (tracked in [Next.js discussions #77721](https://github.com/vercel/next.js/discussions/77721)), a follow-up PR can:
1. Remove `--webpack` flags from dev/build scripts
2. Add `turbopack: { resolveConditions: ["seed-layered"] }` to next.config.mjs (or whatever API ships)
3. Remove the `webpack` callback from next.config.mjs
4. Alternatively, change `@seed-design/css` to make the layered variant the default export, removing the need for the custom condition entirely.

### Fallback Strategy
If the build still hangs after all dynamic import migrations:
1. Compare the git diff from PR #1150 for any changes we missed
2. Bisect by disabling page tree transformations (remove `getTransformedPageTree` calls, use raw `pageTree`)
3. As a last resort, stay on Next.js 15 and only upgrade fumadocs within its 15.x compatibility range

### Testing Checklist
- [ ] Dev server starts without errors
- [ ] All 5 doc sections render (docs, react, breeze, lynx, ai-integration)
- [ ] Component previews render
- [ ] Block pages render
- [ ] Design token pages load rootage data
- [ ] Manual installation accordions show code
- [ ] Search works across all sections
- [ ] 404 page renders
- [ ] Production build completes without hangs
- [ ] Static output serves correctly
