# ScrollAutoHide Release Note Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ScrollAutoHide to the existing component release note and show a featured dot on its Breeze sidebar entry.

**Architecture:** Reuse the ScrollAutoHide documentation, example, and registry that already exist on `dev`. Protect the consumer-visible title, date, table of contents, and sidebar featured state through the real Fumadocs sources, then verify the MDX example and generated artifacts through the docs build pipeline.

**Tech Stack:** MDX, Fumadocs, Bun test, Next.js docs build

**Spec:** `docs/superpowers/specs/2026-08-13-scroll-auto-hide-release-note-design.md`

## Global Constraints

- Keep the existing `docs/updates-release-notes` branch and merge `origin/dev` without rewriting history.
- Use `ScrollAutoHide` in the release-note title and section heading.
- Set `publishedAt` to `2026-08-13T00:00:00+09:00`.
- Reuse `breeze/scroll-auto-hide/preview`, the existing `package-install` fence, and `/breeze/components/scroll-auto-hide`.
- Add no MDX component, dependency, public API, or frontmatter schema.
- Preserve all existing release-note sections, cards, and featured documents.

---

### Task 1: Synchronize the PR Branch with `dev`

**Files:**
- Merge from: `origin/dev`
- Preserve: `docs/superpowers/specs/2026-08-13-scroll-auto-hide-release-note-design.md`
- Preserve: `docs/superpowers/plans/2026-08-13-scroll-auto-hide-release-note.md`

**Interfaces:**
- Consumes: remote `origin/dev` and current `docs/updates-release-notes` branch head
- Produces: a merge commit whose second parent is the latest inspected `origin/dev`

- [ ] **Step 1: Verify the existing isolated worktree and clean branch state**

Run:

```bash
git rev-parse --git-dir
git rev-parse --git-common-dir
git branch --show-current
git status --short --branch
```

Expected: linked worktree, branch `docs/updates-release-notes`, no unstaged implementation changes.

- [ ] **Step 2: Refresh and inspect the remote heads**

Run:

```bash
git fetch origin dev docs/updates-release-notes
git log --oneline HEAD..origin/dev
git ls-remote --heads origin dev docs/updates-release-notes
```

Expected: `origin/dev` contains `feat(breeze): add scroll auto hide component (#1991)` and the PR remote still points to the previously inspected head.

- [ ] **Step 3: Merge `origin/dev` without rewriting history**

Run:

```bash
git merge --no-edit origin/dev
git commit --amend -m "chore(docs): merge latest dev into release notes branch"
```

Expected: merge succeeds without unresolved conflicts and the merge commit has both prior branch head and latest `origin/dev` as parents.

### Task 2: Protect and Implement the Release Note Contract

**Files:**
- Create: `docs/app/updates/scroll-auto-hide-release-note.test.ts`
- Modify: `docs/content/updates/pickers-dialog-select.mdx`
- Modify: `docs/content/breeze/components/scroll-auto-hide.mdx`

**Interfaces:**
- Consumes: `updatesSource`, `breezeSource`, `PageTree.Node`, and `isFeatured(PageTree.Item): boolean`
- Produces: release-note metadata/ToC that includes ScrollAutoHide and a Breeze page-tree item marked featured

- [ ] **Step 1: Write the failing consumer test**

Create `docs/app/updates/scroll-auto-hide-release-note.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import type * as PageTree from "fumadocs-core/page-tree";
import { isFeatured } from "@/lib/featured";
import { breezeSource, updatesSource } from "@/app/source";

function findItemByUrl(nodes: PageTree.Node[], url: string): PageTree.Item | undefined {
  for (const node of nodes) {
    if (node.type === "page" && node.url === url) return node;
    if (node.type === "folder") {
      if (node.index?.url === url) return node.index;
      const child = findItemByUrl(node.children, url);
      if (child) return child;
    }
  }
}

describe("ScrollAutoHide release note", () => {
  test("release metadata and table of contents expose ScrollAutoHide", async () => {
    const page = updatesSource.getPage(["pickers-dialog-select"]);
    expect(page).toBeDefined();
    expect(page?.data.title).toBe(
      "Quantity Picker, Time Picker, Date Picker, Select, Dialog, ScrollAutoHide",
    );
    expect(new Date(page?.data.publishedAt ?? 0).toISOString()).toBe(
      "2026-08-12T15:00:00.000Z",
    );

    const loaded = await page?.data.load();
    expect(loaded?.toc.some((item) => item.title === "ScrollAutoHide")).toBe(true);
  });

  test("Breeze page tree marks ScrollAutoHide as featured", () => {
    const item = findItemByUrl(
      breezeSource.pageTree.children,
      "/breeze/components/scroll-auto-hide",
    );
    expect(item).toBeDefined();
    expect(item && isFeatured(item)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
bun test docs/app/updates/scroll-auto-hide-release-note.test.ts
```

Expected: FAIL because the release title/ToC do not include ScrollAutoHide and the Breeze page-tree item is not featured.

- [ ] **Step 3: Add the minimal release-note content**

Update the frontmatter in `docs/content/updates/pickers-dialog-select.mdx`:

```yaml
title: Quantity Picker, Time Picker, Date Picker, Select, Dialog, ScrollAutoHide
publishedAt: 2026-08-13T00:00:00+09:00
```

Insert before the existing `<Cards>` block:

````mdx
## ScrollAutoHide

스크롤 방향에 따라 필터, 탭, 보조 헤더 같은 고정 영역을 자연스럽게 숨기고 드러냅니다. 아래로 스크롤하면 영역이 숨겨지고, 위로 올리면 이동한 거리만큼 다시 나타납니다. Breeze 스니펫으로 제공합니다.

<ComponentExample name="breeze/scroll-auto-hide/preview">
  ```json doc-gen:file
  {
    "file": "examples/breeze/scroll-auto-hide/preview.tsx",
    "codeblock": true
  }
  ```
</ComponentExample>

```package-install
npx @seed-design/cli@latest add breeze:scroll-auto-hide
```

[Breeze 문서](/breeze/components/scroll-auto-hide)
````

- [ ] **Step 4: Add the sidebar featured flag**

Update `docs/content/breeze/components/scroll-auto-hide.mdx` frontmatter:

```yaml
---
title: Scroll Auto Hide
description: 스크롤 방향에 따라 고정 영역을 숨기고 드러내는 컴포넌트
featured: true
---
```

- [ ] **Step 5: Run the test to verify GREEN**

Run:

```bash
bun test docs/app/updates/scroll-auto-hide-release-note.test.ts
```

Expected: 2 tests pass, 0 fail.

### Task 3: Generate and Validate the Docs Artifacts

**Files:**
- Regenerate as required: `docs/public/__docs__/index.json`
- Regenerate as required: `docs/public/__registry__/react/breeze/*`
- Inspect all other generated files and exclude unrelated changes

**Interfaces:**
- Consumes: updated MDX frontmatter/body and the existing Breeze example/registry
- Produces: generated docs/registry data and a successful Next.js docs build

- [ ] **Step 1: Run all generators**

Run:

```bash
bun generate:all
```

Expected: exit 0.

- [ ] **Step 2: Inspect generated changes**

Run:

```bash
git status --short
git diff --stat
git diff -- docs/public/__docs__/index.json docs/public/__registry__/react/breeze
git diff --check
```

Expected: only ScrollAutoHide release-note/featured metadata and previously committed source/plan/test changes are present; no unrelated generated drift.

- [ ] **Step 3: Build the docs package**

Run:

```bash
bun --filter @seed-design/docs build
```

Expected: exit 0, proving the live `ComponentExample`, `package-install` fence, internal link, and MDX compile in the docs site.

- [ ] **Step 4: Run the full repository test suite**

Run:

```bash
bun test:all
```

Expected: unit and Lynx suites exit 0.

- [ ] **Step 5: Commit the implementation**

Run:

```bash
git add docs/app/updates/scroll-auto-hide-release-note.test.ts \
  docs/content/updates/pickers-dialog-select.mdx \
  docs/content/breeze/components/scroll-auto-hide.mdx \
  docs/public/__docs__/index.json
git commit -m "docs(updates): add ScrollAutoHide to release notes"
```

Expected: one Conventional Commit containing only the intended implementation, test, and generated metadata.

### Task 4: Update PR #1893 and Inspect CI

**Files:**
- Remote branch: `origin/docs/updates-release-notes`
- Pull request: `daangn/seed-design#1893`

**Interfaces:**
- Consumes: verified local branch head
- Produces: matching remote PR head and a new GitHub Actions check suite

- [ ] **Step 1: Reconfirm remote head safety**

Run:

```bash
git status --short --branch
git ls-remote --heads origin docs/updates-release-notes dev
```

Expected: clean worktree; remote PR head has not advanced independently.

- [ ] **Step 2: Push without force**

Run:

```bash
git push origin HEAD
```

Expected: fast-forward update of `docs/updates-release-notes`.

- [ ] **Step 3: Confirm PR head, draft state, and checks**

Run:

```bash
gh pr view 1893 --repo daangn/seed-design --json headRefOid,isDraft,url
gh pr checks 1893 --repo daangn/seed-design \
  --json name,state,bucket,link,workflow,description,startedAt,completedAt
```

Expected: PR head matches local HEAD, draft state remains true, and fresh checks are queued or running. Follow meaningful failures to their job logs; report Chromatic baseline acceptance separately as a human gate.
