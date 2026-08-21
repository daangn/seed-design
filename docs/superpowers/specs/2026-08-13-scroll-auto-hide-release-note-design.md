# Add ScrollAutoHide to the Release Note

## Goal

Introduce the newly released Breeze `ScrollAutoHide` component in the existing component release note and highlight its Breeze documentation in the sidebar.

## Scope

- Merge the latest `origin/dev` into `docs/updates-release-notes` without rewriting branch history.
- Update `docs/content/updates/pickers-dialog-select.mdx`:
  - Append `ScrollAutoHide` to the title.
  - Change `publishedAt` to `2026-08-13T00:00:00+09:00`.
  - Add a final `## ScrollAutoHide` section before the changelog card.
  - Describe its scroll-direction behavior and common uses in concise Korean.
  - Include the existing live `breeze/scroll-auto-hide/preview` example, CLI installation command, and Breeze documentation link.
- Add `featured: true` to `docs/content/breeze/components/scroll-auto-hide.mdx`.
- Preserve the existing release-note sections, cards, schema, and other featured documents.

## Content Contract

- Use the public component name `ScrollAutoHide` in the release-note title and section heading.
- Use the existing `ComponentExample` and fenced `package-install` contracts; do not add an MDX component or dependency.
- Link to `/breeze/components/scroll-auto-hide`.
- Keep implementation details in the component documentation; the release note only summarizes the user-facing behavior and installation path.

## Verification

- Confirm the latest `origin/dev` commit is an ancestor of the branch head and the worktree contains only intended changes.
- Run the relevant content/schema and release-card tests.
- Run `bun generate:all` and inspect generated changes.
- Run `bun test:all` before completion.
- If the branch is pushed, inspect PR #1893 checks and distinguish automated failures from the Chromatic baseline approval gate.
