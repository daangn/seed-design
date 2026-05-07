---
name: snapshot-release
description: Drives the snapshot-release flow for the current branch's PR. Posts a `/snapshot` comment on the PR if one isn't already there (with confirmation), waits for the `Continuous Releases` workflow to finish, and reports the tarball URLs from the resulting `📦 Snapshot Release` comment. Use for both triggering and waiting — phrases like "trigger a snapshot", "ship a snapshot release", "post `/snapshot` for me", "let me know when snapshot is done", "wait for the snapshot and show me the tarballs", "did the snapshot finish?", "snapshot 해줘", "snapshot 완료되면 알려줘", "snapshot 결과 보여줘", "tarball 받아와".
---

# Snapshot Release

End-to-end orchestration of the snapshot-release flow for the PR connected to the current branch:

1. (optionally) post a `/snapshot` comment if none exists,
2. wait for the `Continuous Releases` workflow to finish,
3. report the tarball URLs from the resulting `📦 Snapshot Release` PR comment.

Supports kicking off a fresh snapshot *or* picking up one that's already in flight or already finished.

## Bundling principle

The skill runs in **two Bash invocations**: discover (Step 1) and orchestrate (Step 3). Inside each, bundle every `gh` call into one shell pipeline — do not split a step into multiple Bash tool calls. Use `gh ... --jq` to extract fields, and shell `for` / `if` to chain `gh pr view` → optional `gh pr comment` → `gh run list` → `gh run watch` → `gh pr view` within Step 3.

The skill is **re-entrant**: if Step 3 dies mid-way (network drop, terminal close, etc.) after the `/snapshot` comment was posted, simply invoking the skill again routes through the fast path — Step 1 finds the existing comment, Step 3 picks up the in-flight run via `gh run watch`, and the report catches up. No cleanup needed.

## Step 1: Discover

Run a single command that returns the PR info plus the local git state. Bundle the remote PR query with the local checks so it stays one Bash call:

```bash
gh pr view --json number,url,comments \
  --jq '{number, url, anchor: ([.comments[] | select(.body == "/snapshot")] | last | .createdAt // "")}'
echo "---DIRTY---"
git status --short
echo "---UNPUSHED---"
git log @{u}..HEAD --oneline 2>/dev/null || echo "(no upstream tracking)"
```

- `gh pr view` exits non-zero (no PR for current branch) → stop and tell the user.
- `anchor` non-empty → fast path. The local git state doesn't matter here (the run already exists and was built from whatever was on remote at that time). Skip Step 2 and run Step 3 with the anchor as-is.
- `anchor` empty → run Step 2. Carry the `DIRTY` and `UNPUSHED` sections into the next step so the user sees them before deciding.

## Step 2: Confirm trigger (only when no `/snapshot` exists)

Before opening the AskUserQuestion, re-read the user's original request:

- **Wait-only intent** (e.g. "snapshot 기다려줘", "snapshot 끝났어?", "결과 보여줘", "did the snapshot finish?", "let me know when it's done"): the user assumed a `/snapshot` comment already exists. Don't pivot to a trigger prompt. Just tell them no `/snapshot` comment was found on this PR and stop. Suggest they post `/snapshot` themselves (or re-invoke with a trigger phrasing) if they want to proceed.
- **Trigger or ambiguous intent** (e.g. "snapshot 해줘", "trigger a snapshot", "snapshot 결과 받아와", "post `/snapshot` for me"): proceed with the AskUserQuestion below.

Snapshot releases are built by GitHub Actions from the PR's *remote* HEAD, so any uncommitted change or unpushed commit will be silently absent from the resulting tarballs. Surface that before posting `/snapshot`.

Use **AskUserQuestion**. Tailor the question to whatever Step 1 found:

- **Clean tree, fully pushed**: "There's no `/snapshot` comment on this PR yet. Want me to post one for you?" — Options: `Yes, post it` / `No, I'll post it myself`.
- **Clean tree, but unpushed commits exist**: Spell out the unpushed commits (e.g. "2 unpushed commits") and offer to push them first. Options: `Push, then post /snapshot` (recommended default) / `Post anyway against remote HEAD` / `Stop, I'll handle it`.
- **Uncommitted changes (with or without unpushed commits)**: `git push` won't carry the uncommitted work, so do **not** offer the push option. Spell out what's local-only and warn that the snapshot will be built from the remote HEAD without those changes. Options: `Stop, I'll handle it` (recommended default) / `Post anyway against remote HEAD`.

On `Stop`, stop and tell the user to commit/push and re-invoke.
On `Push, then post /snapshot`, run Step 3 with `anchor` empty and `PUSH_FIRST=1` — the orchestrator will `git push` before posting.
On `Yes` / `Post anyway`, run Step 3 with `anchor` empty (and `PUSH_FIRST=0`) — the orchestrator will post immediately.

## Step 3: Orchestrate (single Bash call)

One command that conditionally pushes and posts, finds the matching workflow run, waits for it, and prints the resulting `📦 Snapshot Release` comment. Substitute `<NUM>`, `<ANCHOR>`, and `<PUSH_FIRST>` from Step 1 / Step 2 (pass `<ANCHOR>` empty when posting; `<PUSH_FIRST>` is `1` only when the user explicitly chose `Push, then post /snapshot`):

```bash
set -euo pipefail

NUM=<NUM>
ANCHOR='<ANCHOR>'
PUSH_FIRST='<PUSH_FIRST>'  # "1" or "0"

# Trigger path: optionally push, then post /snapshot
if [ -z "$ANCHOR" ]; then
  if [ "$PUSH_FIRST" = "1" ]; then
    git push
  fi
  gh pr comment "$NUM" --body "/snapshot"
  ANCHOR=$(date -u +%Y-%m-%dT%H:%M:%SZ)
fi

# Find the matching Continuous Releases run (handle the brief registration delay)
RUN_ID=""
for _ in $(seq 1 10); do
  RUN_ID=$(gh run list --workflow=continuous-releases.yml --limit 5 \
    --json databaseId,createdAt,event \
    --jq "[.[] | select(.event == \"issue_comment\" and .createdAt >= \"$ANCHOR\")] | .[0].databaseId // empty")
  [ -n "$RUN_ID" ] && break
  sleep 2
done

if [ -z "$RUN_ID" ]; then
  echo "no matching Continuous Releases run found after polling" >&2
  exit 1
fi

# Stream until the run finishes; preserve its exit code even on non-success
WATCH_EXIT=0
gh run watch "$RUN_ID" --exit-status || WATCH_EXIT=$?

# Always print the latest 📦 Snapshot Release body, even on failure (may not exist)
echo "---SNAPSHOT_RELEASE_COMMENT---"
gh pr view "$NUM" --json comments \
  --jq '[.comments[] | select(.body | contains("📦 Snapshot Release"))] | last | .body // ""' \
  || true

# On non-success, surface the failed / incomplete steps for diagnosis
if [ "$WATCH_EXIT" -ne 0 ]; then
  echo "---FAILED_STEPS---"
  gh run view "$RUN_ID" --json jobs \
    --jq '.jobs[].steps[] | select(.conclusion != "success" and .conclusion != "skipped") | {name, conclusion}' \
    || true
fi

exit $WATCH_EXIT
```

For a long-running watch, launch this command via `Bash` with `run_in_background: true` and react to the completion notification — do **not** poll.

## Step 4: Report to the user

Parse the orchestrator output:

- **On success** (exit 0): Show the `📦 Snapshot Release` body to the user as-is — the tarball URLs are the payload they're after. Include a one-line install hint:

  ```bash
  bun add https://pkg.pr.new/@seed-design/<package>@<sha>
  ```

- **On failure / cancellation** (exit ≠ 0): Show the failed steps and likely causes (dependency install failure, build failure, network reachability, etc.). If a `📦 Snapshot Release` comment from a prior run is present, mention it too so the user knows whether anything was published.

## Notes

- The comment body must be **exactly** `/snapshot` — no surrounding whitespace or extra text — or the workflow won't trigger.
- `Continuous Releases` runs on the `issue_comment` event in the default branch (`dev`) context, so the run's `headBranch` won't match the PR branch. Don't filter by `--branch`; match on workflow file + anchor time + `event == "issue_comment"`.
- If multiple PRs could be involved or the user means a different PR, ask for the PR number explicitly.
- For repeated `/snapshot` comments on the same SHA, always use the **most recent** workflow run and the **most recent** `📦 Snapshot Release` comment.
