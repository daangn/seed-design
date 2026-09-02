# Chromatic GraphQL API notes

Endpoint `https://www.chromatic.com/api`, authenticated with `Authorization: Bearer $CHROMATIC_TOKEN`. `scripts/api.ts` wraps it; reach for raw requests only when you need a field the scripts do not select.

The complete schema is published as SDL in [`chromaui/addon-visual-tests`](https://github.com/chromaui/addon-visual-tests) at `src/gql/public-schema.graphql`. That file is the reference when you need a field this page does not mention.

## Shape of the entry points

```graphql
type Query {
  account(id: ID!): Account
  build(id: ID!): Build
  project(id: ID!): Project
  storybook(url: URL!): Storybook
  viewer: User
}
```

Three consequences drive how `scripts/resolve.ts` works:

**A URL cannot be looked up directly.** A build page URL carries `number`, a test page URL carries a test id, and neither is what `build(id:)` accepts — `Build.id` and `Build.number` are different fields, and there is no root query for a test at all. Both ids accept the bare 24-character hex form as well as the `Build:`/`Project:` prefixed form, but the web UI never exposes the id.

**`Project.lastBuild` is the only way in.** It returns the single newest build matching its filters (`branches`, `statuses`, `results`, `slug`, `repositoryOwnerName`). There is no build list and no lookup by number, so a build that a newer build has superseded on the same branch *and* status is unreachable. Filtering by status is what rescues most of them:

```
dev, no filter        → build 3340 (PASSED)
dev, statuses:[PENDING]  → build 3319
dev, statuses:[ACCEPTED] → build 2824
dev, statuses:[BROKEN]   → build 1319
```

**Field aliases are rejected.** Two aliases of the same field in one selection set fail validation with `GRAPHQL_VALIDATION_FAILED`, whatever the field is. So nothing can be batched, and a branch-by-status sweep costs one request per combination. Around 40 branches over the statuses worth checking runs in about ten seconds at a concurrency of eight.

## Comparing builds

`Test.baseline` points at the test the snapshot was compared against, and `baseline.story.storybookUrl` is the published Storybook of the build that test belongs to. That is how `resolve.ts` finds the other side.

Which side to compare against is a workflow decision rather than an API one — see "Step 2 — Decide what you are comparing" in `SKILL.md`.

## Reproducing a capture

`Test.parameters.viewport.width` and `Test.mode` describe the conditions Chromatic captured under; step 4 of `SKILL.md` uses them to reproduce the capture.

Story-level `chromatic` parameters (`delay`, `pauseAnimationAtEnd`, `diffThreshold`) live in the story source rather than the API.

## Images

Available if the pixels are genuinely needed, as signed URLs that plain `curl` can fetch without a token. They supplement the render comparison and never replace it — a run that stopped at step 2 stops there:

```graphql
comparisons {
  captureDiff {
    diffImage(signed: true) { imageUrl imageWidth imageHeight }
    focusImage(signed: true) { imageUrl }
  }
  baseCapture { captureImage(signed: true) { imageUrl } }
  headCapture {
    captureImage(signed: true) { imageUrl }
    captureError { kind }
  }
}
```

`captureError.kind` is the one to reach for on a `BROKEN` test — it names the failure (interaction failure, JS error) instead of leaving you to read it off a screenshot.

## Published Storybooks

`Build.storybookUrl` and `Build.isolatorUrl` point at the Storybook that build published. Those hosts answer anonymous requests with `401 {"loginUrl": "..."}` and accept the same bearer token, which is what `scripts/proxy.ts` exploits. `iframe.html` there is only the loading shell; the story renders client-side, so a plain fetch shows nothing useful.
