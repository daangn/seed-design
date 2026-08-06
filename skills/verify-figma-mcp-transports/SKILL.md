---
name: verify-figma-mcp-transports
description: Run a Figma MCP tool over both the REST and WebSocket transports and diff the two answers, so a change to one path cannot silently drift from the other. Use after editing `packages/mcp/src/tools.ts`, `src/tools-helpers.ts`, or `tools/figma-mcp/src/main/commands/*`. Also triggers on "verify both transports", "compare REST and WebSocket output", "check the plugin path still matches", "transport 검증", "REST랑 WebSocket 비교해줘", "플러그인이랑 REST 결과 같은지 확인".
---

# Verify Figma MCP Transports

A Figma MCP tool answers the same question over two paths: **REST** (personal access token) and **WebSocket** (the Figma plugin). Fixing one and not the other still typechecks, so the drift is silent. Run both and compare mechanically.

For where the two paths diverge in this package, read `packages/mcp/AGENTS.md`.

> [!IMPORTANT]
> Run this skill **on the main thread**. Phase 3 is a hard stop that waits on a person, and a subagent has nobody to ask — it will pass itself.

## Prerequisites

- `FIGMA_PERSONAL_ACCESS_TOKEN` is set. If not, stop at Phase 0 and ask for it.
- The Figma desktop app is installed.
- The tool under test is registered in `PROBES` in the probe script. If it isn't, register it first — see the header comment in that file.

## Phase 0: Decide what to inspect

Both transports need a target, so this comes before any probing — REST in Phase 1 already needs it.

**Derive the criteria yourself; do not ask the person to invent them.** Read the diff you just made and work out which edge cases it touches. Then ask for a layer that exercises those specific cases. You know what changed; the person only knows their files.

Concretely: name the shape you need, not the node. "A frame containing a layer with two or more annotations, and a text layer with none" is answerable. "Give me a layer URL" is not — it hands your job to someone who can't do it.

Start from this checklist and cut what your change doesn't touch:

| Cover | Why |
|---|---|
| The queried node itself carrying a value | Catches a traversal that skips its own root |
| A descendant carrying a value | The recursive collection path |
| A leaf (no `children`) | Whether a non-container node throws |
| A page (`CANVAS` / `PAGE`) | The plugin-only `loadAsync` path, plus the type-vocabulary difference |
| A node inside a component instance | IDs composed as `I<a>;<b>;<c>` |

The last two apply to every tool. The rest apply only when the tool walks a tree.

Ask with **AskUserQuestion**, and ask for a **layer URL** — `parseFigmaUrl` takes the file key and node id straight out of it, so nobody has to read ids off a canvas.

If the same file gets reused across runs, put its key in `SEED_MCP_PROBE_FILE_KEY` and pass only `--node-id` afterwards.

## Phase 1: REST alone (no person needed)

REST needs nothing but the token, so **finish it without asking anyone.**

```bash
bun packages/mcp/scripts/probe-transports.ts \
  --probe <tool> \
  --transport rest \
  --file-key <key> \
  --node-id <id>
```

- The script calls the same helper the tool handler calls. Never reach past it to the REST API directly — that tests Figma, not the tool.
- If this fails, do not move on to WebSocket prep. Calling a person in to help debug a broken REST path spends their time on your bug.

## Phase 2: Prepare WebSocket (up to the human boundary)

Build everything that does not need a person, so the person is interrupted exactly once.

1. Build the plugin. Editing the source without rebuilding leaves Figma reading the old `dist`.

   ```bash
   bun --filter figma-mcp build
   ```

2. Start the relay in the background (`Bash` with `run_in_background: true`).

   ```bash
   bun packages/mcp/bin/index.mjs socket
   ```

   Wait for `WebSocket server running on port 3055`. If the port is already held, ask whether to reuse that process — never kill something you did not start.

## Phase 3: Hand off (hard stop)

Only a person can drive the Figma desktop app. There is no way around this step.

**Before asking, confirm all of these.** If any is false, go back to Phase 2 — the person gets called once.

- [ ] `tools/figma-mcp/dist` was just rebuilt
- [ ] The relay is listening on 3055
- [ ] Phase 1 passed

Then ask with **AskUserQuestion**. Do not write the question into chat and continue — that is not a stop.

Spell out what to do and why each step matters; without the reason people skip the reload. Refer to the file by the key Phase 1 actually used. If they open a different file the two transports answer about different documents, and that difference gets reported as a code bug.

```text
WebSocket side is ready. Two things in Figma:

1. Quit the plugin and run it again — dist was just rebuilt, and a running
   instance keeps answering with the old code.
2. Open the file from Phase 1 (<key>) and hit Connect in the plugin.
   Port 3055, channel is fixed to local-default, so there is nothing to type.
```

Offer three options:

| Option | Next |
|---|---|
| `Ready` | Phase 4 |
| `Show me how to reload the plugin` | Explain, then ask again |
| `Stop` | Clean up the relay, report Phase 1 only |

## Phase 4: Probe and compare

1. **Do not take "ready" at face value.** Check the relay log for `New client connected` first. If it is missing, ask again rather than probing into a void — an unconnected run yields a 30-second timeout that reads like a plugin bug.

2. Run both and diff:

   ```bash
   bun packages/mcp/scripts/probe-transports.ts \
     --probe <tool> \
     --transport both \
     --file-key <key> \
     --node-id <id>
   ```

3. **The exit code decides whether anything differs — not whether it is a bug.** Do not read the output and conclude it "looks the same"; 0 means the transports agree on every compared field. A 1 prints the disagreement, which you then classify with the table below before calling it a bug.

4. Run every node you chose in Phase 0. One passing node is not a pass.

## Phase 5: Report and clean up

- Report pass/fail per node, and for any failure which field differed and how.
- Record which file and nodes you used. Without that nobody can reproduce the result.
- **Terminate only a relay you started in Phase 2.** If you reused one that was already running, leave it.

## Four ways the transports diverge

Comparing is not "the whole payload matches". Sort each field into one of four classes.

| Class | Handling |
|---|---|
| **Must match** | The default. A difference is a bug. |
| **Transport-only** | Only one side can produce it. Add it to the probe's `ignore`. |
| **Different vocabulary** | Both name the same thing differently — a page is `PAGE` to the Plugin API and `CANVAS` to REST. **Report it; never add it to `ignore`.** Ignoring the field buries real type bugs along with it. |
| **Same field, different rendering** | Both sides return the field, but the values differ because each is produced by different Figma machinery — whitespace, escaping, ordering, precision. Figma does not document these and they can turn up anywhere. **Report it and let a person judge.** |

The last class is the one to be careful with. It is tempting to make it go away by normalising the value before comparing, but a difference you have seen once is an observation, not a rule — you do not know what Figma actually does in the cases you have not hit. Encoding a guess turns the probe into something that confidently passes payloads that genuinely differ, which is worse than the red X it replaces. Leave the value alone, report the difference, and record what was decided wherever this tool's behaviour is tracked — not in this skill, which must stay tool-agnostic.

When you add a field, classify it first, and edit `ignore` only for the transport-only case. That list is the single source of truth for a tool's parity contract, so no values are copied into this document.

## Do not

- Guess a WebSocket result, reuse an earlier run, or backfill it from REST. A timeout is reported as a timeout.
- Treat "I read the code and it looks right" as verification. Executing is the entire point of this skill.
- Move to Phase 4 without an answer from the person.
- Call a failure "an environment problem" up front. Gather evidence in order: relay log, then whether the plugin connected, then probe output.

## Finding things

Paths move; exported names rarely do. Search for the symbol rather than opening a path:

| To find | Search for |
|---|---|
| The probe implementation and each tool's `ignore` list | `PROBES` |
| The relay protocol the probe imitates | `sendCommandToFigma` |
| The relay itself, including the echo-to-sender behaviour | `broadcastToChannel` |
| The channel the plugin joins | `local-default` |
