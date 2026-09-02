---
name: chromatic-diff
description: Investigates why a Chromatic visual test shows a diff. Turns a chromatic.com build or test URL into the build behind it, the stories that changed, and both sides' published Storybooks, then compares the two renders as DOM, computed styles, and design tokens so the answer is a named cause instead of a picture. Use this whenever someone pastes a chromatic.com link or asks why a snapshot changed, what a build's diff is about, which stories a build flagged, or whether a visual regression is real or flaky — including "이 diff 왜 있어?", "Chromatic에서 뭐가 바뀐 거야?", "why did the visual test fail?", "what changed in this Chromatic build?". Also use it to compare a build against a specific other build rather than its automatic baseline.
---

# Chromatic Diff Investigation

Chromatic tells you *that* a snapshot changed. It does not tell you *why*. This skill closes that gap: it resolves a Chromatic URL into the two builds being compared, puts both published Storybooks on localhost, and renders the same story from each so the difference can be read as structure, computed style, and token values rather than pixels.

Working from the rendered page rather than the snapshot image matters, because the useful answers are named things — "the dark-theme surface token changed", "this element gained a wrapper", "both builds render identically, so the snapshot is flaky". A pixel diff cannot say any of those.

## How far you are allowed to go

Read this before the workflow. The steps below assume three things are present, and **which of them this session actually has decides how much of the workflow exists for you**:

| What is missing | How far this skill goes |
| --- | --- |
| `CHROMATIC_TOKEN` | Nowhere. Nothing else authenticates this API. Say it is missing, point at `references/token.md`, stop. |
| Bun | Nowhere. Say Bun is not installed, stop. |
| a chrome-devtools driver, meaning the MCP tools or the CLI | Steps 1 and 2. Report those, name the gap, stop. |
| nothing | Steps 1 through 5. |

Finishing the investigation is not the goal; a trustworthy answer is.

One row admits an exception. Bun installed but unreachable from `PATH` is an environment quirk rather than a missing capability, so finding the binary and calling it by absolute path is fine, **provided the answer says you did it**. Step 0 detects the situation and prints `OFF PATH` into the `env:` line for exactly that reason. Bun genuinely absent from the machine is the row above.

### Do not route around a missing piece

Two workarounds sit within reach, and neither is the fallback:

- **Playwright, Puppeteer, or headless Chrome launched from a shell** — step 4's checks are written against the chrome-devtools tool surface, and an improvised driver drops them without saying so.
- **Chromatic's own comparison images** — the one substitution that changes what the answer rests on, so it is refused whatever else is present. A run that stopped reports what it has instead of filling the gap with pixels.

The reason is not procedural. A substitute usually does produce an answer, and that is the problem: it reads exactly like one that took the checked path, so the reader has no way to weigh it. A sentence naming the gap is worth more, because they can close it.

### Stopping early is a deliverable, not a blank

A run that ends after step 2 still hands over most of what someone wants from a Chromatic link. Report, in this order:

1. Step 0's `env:` line.
2. The build — number, branch, commit, status.
3. Every story with unreviewed changes, with its viewport width and mode.
4. Both Storybook URLs, so the user can open them.
5. One sentence naming what you could not do and what would unblock it.

Then remove the `--out` directory step 1 wrote into, the same as a finished run would, and stop. Do not open a browser some other way to fill in the rest.

## Step 0 — Preflight

```sh
bun scripts/preflight.ts --devtools-mcp <yes|no>
```

The flag is your own answer to the one question the script cannot check for itself: does *this session* have tools named `mcp__chrome-devtools__*`? Read it off your tool list, not off the machine, and answer about those tools alone. Holding the `chrome-devtools` CLI instead is not a `yes`, and it does not need to be: the script looks for the CLI on `PATH` itself, and since the CLI drives the same server and exposes the same tools, either one carries steps 3 to 5.

Only one of the two is detectable, and the asymmetry is the point. The CLI is invoked through a shell, so finding it on `PATH` *is* the capability. The `chrome-devtools-mcp` binary sitting on the same `PATH` says nothing about whether this session received the tools, which is why the flag exists at all.

It prints one line naming the runtime, the token's remaining life, and which drivers are available:

```
env: bun 1.4.0 · token ok (29d left) · driver: chrome-devtools MCP tools
```

Keep that line. When the script exits non-zero it prints a `STOP` line naming where the workflow ends for this run, and that line governs the rest of the session.

If the command does not run at all, `bun` is not on `PATH`; see the exception under the table above before doing anything else.

## Step 1 — Resolve the URL

```sh
bun scripts/resolve.ts <chromatic-url> --out <workdir>
```

Accepts either URL form the Chromatic UI produces — `/build?appId=…&number=…` or `/test?appId=…&id=…`. It reports the build, its branch and commit, every test with unreviewed changes, and the published Storybook host for both sides. `context.json` in `--out` carries the same data with the story ids, viewport widths, and modes you need later.

If the build is out of reach, the script says why and what to do about it; see `references/api.md` for the `lastBuild` limitation behind it.

## Step 2 — Decide what you are comparing

By default the other side is `Test.baseline` — the exact build Chromatic compared against. **Check its branch before drawing conclusions.** Chromatic rebaselines within a branch, so the baseline is frequently an earlier build on the same branch, and "what changed versus this branch's previous commit" is a different question from "what changed versus `dev`".

When the user means the latter, name what to compare against. `--against` takes a branch name, a build number, a build id, or another Chromatic URL — the branch form covers the usual case, since nobody has the other build's number to hand:

```sh
bun scripts/resolve.ts <chromatic-url> --against dev --out <workdir>
```

## Step 3 — Put both Storybooks on localhost

> Steps 3 to 5 need a chrome-devtools driver. If step 0 found neither the MCP tools nor the CLI, this run ended at step 2 and none of what follows applies to it.

```sh
bun scripts/proxy.ts <base-storybook-host> <head-storybook-host>
```

Published Storybooks reject anonymous navigation. The proxy adds the token upstream and prints one `http://127.0.0.1:<port>` per host. Run it in the background; it serves until killed.

## Step 4 — Render both and compare

Open each side at the story from step 1, through whichever driver step 0 recorded. The tool names below are the same either way; the CLI takes them as subcommands with an explicit `pageId`:

```
http://127.0.0.1:<port>/iframe.html?id=<storyId>&viewMode=story
```

Three things decide whether the comparison means anything:

**Match the capture conditions.** Resize to `parameters.viewport.width` from `context.json`, and when `mode.globals` is not empty, pass it through the iframe's `globals` query parameter. Comparing under conditions Chromatic never captured produces differences that do not exist and hides ones that do.

**Confirm the viewport actually applied, in both tabs.** `resize_page` silently does nothing on a background tab, so select the page with `bringToFront: true` first, then read `window.innerWidth` and `window.innerHeight` inside the page to check. This is worth the extra call: a component sized against viewport units renders at a different height in a tab that never got resized, and the resulting "difference" is entirely your own doing. Height matters as much as width.

**Wait for the story, not the page.** Storybook serves a loading shell and renders client-side, so poll until `#storybook-root` has children before reading anything. Two blank pages compare equal.

Then pull the same data out of both pages with `evaluate_script`. Extract identical fields in an identical order from each side — two dumps of different shapes cannot be diffed. What earns its place depends on the question, but this set covers most of them:

- the story root's `outerHTML`, for structural changes
- per-element computed styles keyed by a stable structural path, plus `getBoundingClientRect`, for style and layout changes
- every custom property resolved on `:root`, which is where design token changes surface
- `documentElement` attributes (theme flags) and loaded stylesheet URLs, to confirm both sides really are in the state you think

`evaluate_script` takes a `filePath`, so write each dump straight to disk and diff the files rather than carrying them through the conversation. Under the MCP tools that path has to sit inside a workspace root, since a scratch directory elsewhere on the machine is refused, so write into the project under `.chromatic-diff/` and delete what you wrote when you are done. The CLI accepts any path it can write to, but use the same directory anyway so both drivers leave the same trail.

Give each run its own subdirectory — `.chromatic-diff/<something unique to this run>/` — and stamp each dump with which side it came from. Two investigations running at once otherwise write over each other's files, and the damage is quiet: the dumps still parse, so you end up diffing one session's base against another's head and reporting differences that belong to neither comparison. Remove your own subdirectory when you finish, and leave anyone else's alone — these dumps run to tens of megabytes.

## Step 5 — Answer the question

| What the comparison shows | What it means |
| --- | --- |
| DOM differs | Structural change. Point at the elements and relate them to the commit range. |
| Computed styles or boxes differ | A styling or layout change. Name the properties and the elements. |
| Everything identical at the captured viewport | The two builds render the same, so the snapshot is likely flaky rather than a regression. |

The flaky verdict deserves the most care, because it is the one that changes what someone does with the diff. Support it: confirm both sides really did render, confirm you matched the viewport and globals, and look at the story's own `chromatic` parameters.

The strongest evidence is to reproduce the instability directly: **screenshot one unchanged page twice and compare the two shots.** If two captures of the same page differ about as much as the two builds do, the story cannot render deterministically and the diff says nothing about the code. That turns "I found no difference" into "here is the page disagreeing with itself", which is what justifies approving the snapshot.

Then look for the mechanism, and keep it separate from the verdict. "This story cannot render deterministically" is something you demonstrated; "because of X" is usually a hypothesis, and a story that flakes tends to offer several plausible ones — an entry animation whose duration leaves no margin against the configured `delay`, a scroll lock or autofocus that captures a tall page from the wrong offset, compositing-layer promotion (`will-change`, transforms), lazy media. Prefer the explanation you can test over the one that merely fits, and label it as a hypothesis when you could not test it. Naming the line responsible gives the user something to fix; naming it with false confidence sends them to the wrong line.

Flaky also splits two ways, and the recommendation differs. When both captures look like the page and merely disagree, approving is fine. When one capture is *broken* — content clipped, elements overlapping, a page height nothing reproduces — approving it installs that damage as the new baseline, and every later build gets compared against a picture of a bug. Recommend rerunning the build instead, and say which of the two you are looking at.

Tie the finding to the code. `context.json` carries the build's branch and commit; the diff for that commit range is what turns "this token changed" into "this commit changed it".

**Open the answer with step 0's `env:` line**, carrying through whatever it said — an `OFF PATH` runtime included. It is the last check on yourself: if writing it honestly would mean admitting the comparison came from something other than the driver step 0 recorded, the run should have stopped at step 2, and saying so now is still better than filing the answer without it.

## References

- `references/token.md` — obtaining and renewing `CHROMATIC_TOKEN`
- `references/api.md` — schema entry points, search limits, capture metadata, and how to fetch comparison images when the pixels are genuinely needed
