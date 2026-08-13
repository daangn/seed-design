# Remove Credits from Docs

## Goal

Remove the standalone credits site experience from the SEED documentation site.

## Scope

- Remove the Credits link from the shared footer content.
- Delete the `/credits` route and its route-specific layout.
- Delete the credits-only contributor content module.
- Leave unrelated documentation routes, shared layout components, and existing generated-file changes untouched.

## Result

- `/credits` resolves through the normal Next.js not-found behavior.
- The shared docs and landing footers no longer expose a Credits link.
- No source references to the removed credits route or content remain.

## Verification

- Search the repository for remaining credits route/content references.
- Run `bun generate:all` and inspect generated changes.
- Run the docs package's relevant checks from the repository test guidance.
- Run `bun test:all` before completion.
